import AlbumArt from "@/components/AlbumArt";
import Carousel from "@/components/Carousel";
import Navbar from "@/components/Navbar";
import { getSupabase } from "@/lib/db";
import { getAlbum } from "@/lib/musicbrainz";
import { Album, Review } from "@/lib/types";
import { getAuth } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const auth = getAuth();
  const router = useRouter();

  const [reviewsCarousel, setReviewCarousel] = useState(<></>);

  auth.onAuthStateChanged(() => {
    if (!auth.currentUser) {
      router.push("/");
    }
  });

  useEffect(() => {
    const db = getSupabase();
    const reviews = db
      .from("reviews")
      .select("*")
      .order("timestamp", { ascending: false });

    async function renderReviews(reviews: Review[]) {
      let tiles = reviews.map(async (review) => {
        let album = await getAlbum(review.album_id);
        return album ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "2rem",
            }}
          >
            <AlbumArt src={album.cover_img} size="" />
            <p>{album.name}</p>
          </div>
        ) : (
          <></>
        );
      });
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
          }}
        >
          {await Promise.all(tiles)}
        </div>
      );
    }

    reviews
      .then((rev) => {
        console.log(rev.data);
        return renderReviews(rev.data as Review);
      })
      .then((data) => setReviewCarousel(data));
  }, []);

  const albums: Album[] = [
    {
      album_id: "9c4fa061-3e6a-48b5-a23e-e4a8942b94e9",
      name: "Dreamland",
      artist: "Glass Animals",
      cover_img:
        "https://ia902307.us.archive.org/20/items/mbid-e3fc1cd4-d180-4f3a-bc95-e89d33d8a7b2/mbid-e3fc1cd4-d180-4f3a-bc95-e89d33d8a7b2-26924614391_thumb500.jpg",
      release: "2020-08-07",
    },
    {
      album_id: "9ea10987-df41-4691-b431-d4bb09d5506c",
      name: "Is This It",
      artist: "The Strokes",
      cover_img:
        "https://coverartarchive.org/release-group/efea26d1-a016-30f6-b8e2-bc8c02336b0a/front",
      release: "2020-08-07",
    },
    {
      album_id: "e775b7e1-8d3c-49e0-869f-3835bb2a3632",
      name: "10,000 gecs",
      artist: "100 gecs",
      cover_img:
        "https://coverartarchive.org/release-group/d73daa13-b571-41dd-8dfd-740fde3fda7d/front",
      release: "2020-08-07",
    },
  ];
  return (
    <main>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "4rem",
        }}
      >
        <Carousel label="Your friends are listening to:">
          {albums.map((album) => (
            <div
              key={album.album_id}
              style={{
                marginRight: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                alt="album cover"
                src={album.cover_img}
                width={150}
                style={{
                  borderRadius: "1rem",
                }}
              />
              <p
                style={{
                  margin: "0rem",
                  marginTop: "1rem",
                  fontStyle: "italic",
                }}
              >
                {album.artist}
              </p>
              <p style={{ margin: "0rem" }}>{album.name}</p>
            </div>
          ))}
        </Carousel>
        <Carousel label="Recent Releases:">
          {albums.map((album) => (
            <div
              key={album.album_id}
              style={{
                marginRight: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                alt="album cover"
                src={album.cover_img}
                width={150}
                style={{
                  borderRadius: "1rem",
                }}
              />
              <p
                style={{
                  margin: "0rem",
                  marginTop: "1rem",
                  fontStyle: "italic",
                }}
              >
                {album.artist}
              </p>
              <p style={{ margin: "0rem" }}>{album.name}</p>
            </div>
          ))}
        </Carousel>
      </div>
      <div>
        <h2>Top Reviews:</h2>
        <>{reviewsCarousel}</>
      </div>
    </main>
  );
};

export default Dashboard;
