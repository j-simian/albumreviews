import { getAuth } from "firebase/auth";

const Navbar = () => {
  const auth = getAuth();
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
      <input type="text" />
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
