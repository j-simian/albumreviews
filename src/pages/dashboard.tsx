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
        return renderReviews(rev.data as Review[]);
      })
      .then((data) => setReviewCarousel(data));
  }, []);

  const albums: Album[] = [];

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
