import AlbumArt from "@/components/AlbumArt";
import { getSupabase } from "@/lib/db";
import { getAlbum } from "@/lib/musicbrainz";
import { Album, Track } from "@/lib/types";
import { formatLength } from "@/lib/util";
import { uuidv4 } from "@firebase/util";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Write = () => {
  const router = useRouter();
  const [album, setAlbum] = useState<Album | undefined>(undefined);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [trackRatings, setTrackRatings] = useState<number[]>([]);

  const auth = getAuth();

  const attemptSubmit = () => {
    console.log(trackRatings);
    if (!auth.currentUser) router.push("/register");
    getSupabase()
      .from("reviews")
      .insert({
        review_id: uuidv4(),
        album_id: album?.album_id,
        user_id: auth.currentUser?.uid,
        rating: rating,
        full_text: description,
        track_ratings: trackRatings,
        timestamp: new Date(),
      })
      .then(({ data, error }) => {
        console.error(error);
        router.push("/");
      });
  };

  useEffect(() => {
    const { query } = router.query
      ? router.query.length
        ? router.query[0]
        : router.query
      : "";

    const { a: mbid } = router.query;
    getAlbum(mbid as string).then((album) => {
      setAlbum(album);
      setTrackRatings(album.tracks!.map((_) => 0));
    });
  }, [router.query]);

  return album ? (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          flex: "1",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AlbumArt size="large" src={album?.cover_img!} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: "1.2rem",
                  marginBottom: "0.8rem",
                }}
              >
                {album.name}
              </p>
              <p style={{ fontStyle: "italic", margin: 0 }}>{album.artist}</p>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            style={{ width: "300px" }}
          />
          <Stars rating={rating} setRating={setRating} />
        </div>
        <button onClick={(_) => attemptSubmit()}>Submit</button>
      </div>
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          flex: "2",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {album.tracks &&
          (album.tracks.length <= 6 ? (
            album.tracks.map((track, index) => (
              <TrackListing
                key={track.name}
                name={track.name}
                length={track.length!}
                index={index + 1}
                setTrackRatings={setTrackRatings}
              />
            ))
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "8rem",
                width: "100%",
              }}
            >
              <div style={{ width: "50%" }}>
                {album.tracks
                  .slice(0, Math.ceil(album.tracks.length / 2))
                  .map((track, index) => (
                    <TrackListing
                      key={track.name}
                      name={track.name}
                      length={track.length!}
                      index={index + 1}
                      setTrackRatings={setTrackRatings}
                    />
                  ))}
              </div>
              <div style={{ width: "50%" }}>
                {album.tracks
                  .slice(
                    Math.ceil(album.tracks.length / 2),
                    album.tracks.length
                  )
                  .map((track, index) => (
                    <TrackListing
                      key={track.name}
                      name={track.name}
                      length={track.length!}
                      index={index + Math.ceil(album.tracks!.length / 2) + 1}
                      setTrackRatings={setTrackRatings}
                    />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  ) : (
    <></>
  );
};

const TrackListing = ({
  name,
  length,
  index,
  setTrackRatings,
}: Track & {
  index: number;
  setTrackRatings: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const [rating, setRating] = useState(0);
  useEffect(() => {
    setTrackRatings((trackRatings) =>
      trackRatings.map((t, i) => (i + 1 == index ? rating : t))
    );
  }, [rating, index, setTrackRatings]);
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <p>
          {index}. {name}
        </p>
        <p>{formatLength(length)}</p>
      </div>
      <Stars rating={rating} setRating={setRating} />
    </div>
  );
};

const Stars = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      gap: "0.2rem",
    }}
  >
    {new Array(2, 4, 6, 8, 10).map((i) => (
      <Star key={i} threshhold={i} rating={rating} setRating={setRating} />
    ))}
  </div>
);

const Star = ({
  threshhold,
  rating,
  setRating,
}: {
  threshhold: number;
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
}) => (
  <p onClick={(_) => setRating(threshhold)} style={{ cursor: "pointer" }}>
    {rating >= threshhold ? "★" : "☆"}
  </p>
);

export default Write;
