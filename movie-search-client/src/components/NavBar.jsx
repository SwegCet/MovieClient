import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  //Grabbing login infos to display in nav bar
  const { token, username, logout } = useAuth();

  return (
    <nav
      style={{
        display: "flex",
        gap: 12,
        padding: 12,
        borderBottom: "1px solid #333",
      }}
    >
      <Link to="/">MovieSearch</Link>
      <Link to="/favorites">Favorites</Link>

      <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
        {/* If valid token exists, display username and change login button to logout else we display login button*/}
        {token ? (
          <>
            <span>Hi, {username}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
