import { Album } from "./types";

const apiRoot = "https://musicbrainz.org/ws/2/";
const coverRoot = "https://coverartarchive.org/";

type MbReleaseGroup = {
  "artist-credit": MbArtist[];
  disambiguation: string;
  "first-release-date": string;
  id: string;
  "primary-type": string;
  "primary-type-id": string;
  releases: MbRelease[];
  "secondary-type-ids": string[];
  "secondary-types": string[];
  title: string;
};

type MbRelease = {
  asin: string;
  barcode: string;
  country: string;
  "cover-art-archive": {
    artwork: boolean;
    back: boolean;
    front: boolean;
    count: number;
    darkened: boolean;
  };
  date: string;
  disambiguation: string;
  id: string;
  media: MbMedia[];
  packaging: string;
  quality: string;
  "release-events": any[];
  status: string;
  "status-id": string;
  "text-representation": {
    language: string;
    script: string;
  };
  title: string;
};

type MbMedia = {
  discs: any[];
  format: string;
  "format-id": string;
  position: number;
  title: string;
  "track-count": number;
  "track-offset": number;
  tracks: MbTrack[];
};

type MbTrack = {
  id: string;
  length: number;
  number: string;
  position: number;
  title: string;
  recording: any;
};

type MbArtist = {
  name: string;
  joinphrase: string;
  artist: any;
};

export async function searchAlbums(query: string): Promise<Album[]> {
  const apiRequest =
    apiRoot +
    `release-group/?query=release-group:${encodeURI(query)}ORartist:${encodeURI(
      query
    )}&fmt=json`;
  const response = await fetch(apiRequest);
  const data = await response.json();

  const objs = data["release-groups"].map(async (data: MbReleaseGroup) => {
    const cover_img_req = await fetch(
      `${coverRoot}release-group/${data.id}/front-250`
    );
    const imgUrl = URL.createObjectURL(await cover_img_req.blob());
    return {
      name: data.title,
      artist: data["artist-credit"].map((artist) => artist.name).join(", "),
      album_id: data.id,
      cover_img: imgUrl || "",
    };
  });
  console.log(Promise.all(objs));
  return await Promise.all(objs);
}

export async function getAlbum(mbid: string): Promise<Album> {
  // Get Release-Group Data
  const groupRequest =
    apiRoot +
    `release-group/${encodeURI(
      mbid
    )}?inc=releases%20artists%20discids&fmt=json`;
  console.clear();
  const groupData: MbReleaseGroup = await makeRequest(groupRequest);
  console.log(groupData);

  // Get Release data, and track info
  const primaryRelease = groupData.releases.sort((a, b) => {
    let score_a = 0;
    let score_b = 0;
    if (a.country == "GB") score_a += 3;
    if (b.country == "GB") score_b += 3;
    if (a.country == "US") score_a += 1;
    if (b.country == "US") score_b += 1;
    if (a.media[0].format == "CD") score_a += 2;
    if (b.media[0].format == "CD") score_b += 2;
    return score_b - score_a;
  })[0];
  const releaseRequest =
    apiRoot +
    `release/${encodeURI(
      primaryRelease.id
    )}?inc=recordings%20media%20discids&fmt=json`;
  const releaseData: MbRelease = await makeRequest(releaseRequest);

  // // Get Tracklist
  const tracks = releaseData.media[0].tracks;

  // Get cover image
  const cover_img_req = await fetch(
    `${coverRoot}release-group/${groupData.id}/front-500`
  );
  const imgUrl = URL.createObjectURL(await cover_img_req.blob());

  const album: Album = {
    album_id: mbid,
    name: groupData.title,
    artist: groupData["artist-credit"]
      ? groupData["artist-credit"]
          .map((artist) => artist.name)
          .join(groupData["artist-credit"][0].joinphrase)
      : "",
    cover_img: imgUrl || "",
    tracks: tracks.map((track: MbTrack) => ({
      name: track.title,
      length: track.length / 1000,
    })),
  };
  return album;
}

export const getAlbumArt = async (mbid: string) => {
  const cover_img_req = await fetch(
    `${coverRoot}release-group/${mbid}/front-500`
  );
  const imgUrl = URL.createObjectURL(await cover_img_req.blob());
  return imgUrl;
};

const makeRequest = async (request: string) => {
  const response = await fetch(request);
  const data = await response.json();
  return data;
};
