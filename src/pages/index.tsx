import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { FirebaseApp } from "firebase/app";
import {
  Auth,
  AuthError,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/router";

import { getSupabase } from "@/lib/db";

function attemptSignin(auth: Auth, provider: GoogleAuthProvider) {
  signInWithPopup(auth, provider)
    .then(() => {})
    .catch((error: AuthError) => {
      console.log(error.name);
      console.log(error.message);
    });
}

export default function Home({ app }: { app: FirebaseApp }) {
  let auth = getAuth(app);
  auth.onAuthStateChanged(() => {
    if (auth.currentUser) {
      onSignin(auth.currentUser.uid);
    }
  });
  auth.useDeviceLanguage();
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const db = getSupabase();

  async function onSignin(id: string) {
    console.log(id);
    const userExists = await db
      .from("users")
      .select("user_id, user_name")
      .eq("user_id", id);
    if (userExists.data?.length == 0) {
      router.push("/register");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <>
      <Head>
        <title>GoodAlbums</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <nav style={{ height: "6rem", width: "100%" }}>
          {auth.currentUser == null ? (
            <button
              className={styles.rightSideButton}
              onClick={() => {
                attemptSignin(auth, provider);
              }}
            >
              Sign in
            </button>
          ) : (
            <button
              className={styles.rightSideButton}
              onClick={() => {
                auth.signOut();
              }}
            >
              Log out
            </button>
          )}
        </nav>
        <div
          style={{
            flexGrow: "1",
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h1 style={{ color: "white" }}>GoodAlbums</h1>
        </div>
      </main>
    </>
  );
}
