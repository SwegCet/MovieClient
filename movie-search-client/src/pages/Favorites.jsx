import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

export default function Favorites() {
  const { token } = useAuth();
  const [favs, setFavs] = useState([]);
  const [err, setErr] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  //Base Movie Poster URL
  const TMDB_IMG = "https://image.tmdb.org/t/p/w342";

  useEffect(() => {
    if (!token) return;

    //Fetch user's favorite movies
    (async () => {
      setErr("");
      try {
        const data = await api("/api/favorites", { token });
        setFavs(data || []);
      } catch (e) {
        setErr(String(e.message || e));
      }
    })();
  }, [token]);

  //Unfavoriting a movie
  async function unfavorite(tmdbMovieId) {
    setErr("");
    setLoadingId(tmdbMovieId);

    try {
      await api(`/api/favorites/${tmdbMovieId}`, {
        method: "DELETE",
        token,
      });
      //Filter out the deleted movie from the favorites list and update the list
      setFavs((prev) => prev.filter((f) => f.tmdbMovieId !== tmdbMovieId));
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoadingId(null);
    }
  }

  if (!token) return <div style={{ padding: 20 }}>Login to see favorites.</div>;

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: "0 12px" }}>
      <h2>Your Favorites</h2>

      {err && <div style={{ color: "tomato" }}>{err}</div>}
      {/*If favorites list is empty, no movies to display : otherwise display movies */}
      {favs.length === 0 ? (
        <div>No favorites yet.</div>
      ) : (
        <div>
          {favs.map((f) => (
            <div key={f.id}>
              <img src={`${TMDB_IMG}${f.posterPath}`} />
              <div>{f.title}</div>
              <div>TMDB ID: {f.tmdbMovieId}</div>

              <button
                onClick={() => unfavorite(f.tmdbMovieId)}
                disabled={loadingId === f.tmdbMovieId}
              >
                {loadingId === f.tmdbMovieId ? "Removing..." : "Unfavorite"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
