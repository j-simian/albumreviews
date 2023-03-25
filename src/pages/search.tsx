import AlbumArt from "@/components/AlbumArt";
import Navbar from "@/components/Navbar";
import { searchAlbums } from "@/lib/musicbrainz";
import { Album } from "@/lib/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Search = () => {
  const router = useRouter();
  console.log(router.query);
	const urlQuery: any = router.query
    ? router.query.length
      ? router.query[0]
      : router.query
    : "";

  const query: string = urlQuery["query"];

  let [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    searchAlbums(query).then((data) => setAlbums(data));
  }, [query]);

  return (
    <>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {albums
          .filter((x) => x.cover_img)
          .map((album: Album) => (
            <div
              key={album.album_id}
              onClick={() => router.push(`/write?a=${album.album_id}`)}
              style={{ display: "flex", flexDirection: "row", padding: "1rem" }}
            >
              <AlbumArt src={album.cover_img!} />
              <div
                style={{
                  paddingLeft: "2rem",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <p style={{ fontSize: "1.2rem", marginBottom: "0.8rem" }}>
                    {album.name}
                  </p>
                  <p style={{ fontStyle: "italic", margin: 0 }}>
                    {album.artist}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Search;
