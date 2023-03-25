import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";

const Navbar = () => {
  const auth = getAuth();
  const [search, setSearch] = useState("");
  const router = useRouter();
  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "2rem",
        marginBottom: "2rem",
        marginRight: "2rem",
      }}
    >
      <div>
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <button
          style={{ marginLeft: "1rem" }}
          onClick={() => {
            router.push(`/search?query=${search}`);
          }}
        >
          Search
        </button>
      </div>

      <button
        onClick={() => {
          auth.signOut();
        }}
      >
        Sign out
      </button>
    </nav>
  );
};

export default Navbar;
