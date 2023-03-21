import { getSupabase } from "@/lib/db";
import { getAuth } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const db = getSupabase();
  const auth = getAuth();
  const router = useRouter();

  const takenNames = useMemo(
    async function getUsers() {
      const users = await db.from("users").select("user_name");
      const names = users.data?.map((user) => user.user_name);
      return names;
    },
    [db]
  );

  async function register() {
    const date = new Date();
    if (auth.currentUser && !(username in takenNames)) {
      let user = {
        user_id: auth.currentUser?.uid,
        user_name: username,
        join_date: `${date.getUTCFullYear()}-${date
          .getUTCMonth()
          .toString()
          .padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`,
      };
      const error = await db.from("users").insert(user);
      console.log(error);
      router.push("/dashboard");
    } else {
    }
  }

  return (
    <>
      <Head>
        <title>GoodAlbums</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div style={{ height: "50vh", marginTop: "4rem" }}>
          <h1 style={{ fontSize: "4rem" }}>Welcome to GoodAlbums</h1>
        </div>
        <div>
          <div>
            <label htmlFor="username">username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {username in takenNames ? (
              <label style={{ color: "red", marginLeft: "2rem" }}>
                Name taken
              </label>
            ) : (
              <label style={{ color: "green", marginLeft: "2rem" }}>
                Name available
              </label>
            )}
          </div>
          <button style={{ marginTop: "2rem" }} onClick={() => register()}>
            Go!
          </button>
        </div>
      </main>
    </>
  );
};

export default Register;
