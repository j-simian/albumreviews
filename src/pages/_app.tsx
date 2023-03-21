import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { getApps, initializeApp } from "firebase/app";
import { Roboto_Condensed } from "@next/font/google";

const firebaseConfig = {
  apiKey: "AIzaSyDM-cMxd2ikRyLECJzVTbCsgKnyiRNdevA",
  authDomain: "goodreads-2cee5.firebaseapp.com",
  projectId: "goodreads-2cee5",
  storageBucket: "goodreads-2cee5.appspot.com",
  messagingSenderId: "667979197420",
  appId: "1:667979197420:web:84cd5b16d5a3926eff6ec9",
  measurementId: "G-Y9CMMJ6YN7",
  databaseURL:
    "https://goodreads-2cee5-default-rtdb.europe-west1.firebasedatabase.app/",
};

const roboto = Roboto_Condensed({ subsets: ["latin"], weight: "400" });

export default function App({ Component, pageProps }: AppProps) {
  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  return (
    <main className={roboto.className}>
      <Component {...{ app, ...pageProps }} />
    </main>
  );
}
