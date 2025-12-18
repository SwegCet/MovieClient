import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

export default function MovieDetails() {
  const { id } = useParams(); // Grab id from URL
  const { token } = useAuth(); // check auth token
  const [movie, setMovie] = useState(null);
  const [favIds, setFavIds] = useState(new Set()); // Store Favorites in a local set for fast look up
  const [err, setErr] = useState("");

  //Check if current movie ID is in the favorites list
  const isFav = useMemo(() => favIds.has(Number(id)), [favIds, id]);

  //Fetch movie details when ID changes
  useEffect(() => {
    (async () => {
      setErr("");
      try {
        const data = await api(`/api/movies/${id}`);
        setMovie(data);
      } catch (e) {
        setErr(String(e.message || e));
      }
    })();
  }, [id]);

  //Fetch users favorites when logged in
  useEffect(() => {
    if (!token) return; //Return nothing if not logged in
    (async () => {
      try {
        const favs = await api("/api/favorites", { token });
        setFavIds(new Set((favs || []).map((f) => f.tmdbMovieId)));
      } catch {
        // ignore
      }
    })();
  }, [token]);

  //Add or Remove movie from favorite list
  async function toggleFav() {
    if (!token) {
      //If not logged in, can't favorite
      setErr("Login required to favorite.");
      return;
    }
    setErr("");
    try {
      if (!movie) return;

      // If movie is already favorited, that means remove it from database
      if (isFav) {
        await api(`/api/favorites/${movie.id}`, { token, method: "DELETE" });
        //Remove Id from local set
        setFavIds((s) => {
          const n = new Set(s);
          n.delete(movie.id);
          return n;
        });
      } else {
        // Otherwise we just add it to favorites list
        await api(`/api/favorites`, {
          token,
          method: "POST",
          body: JSON.stringify({
            tmdbMovieId: movie.id,
            title: movie.title,
            posterPath: movie.poster_path,
          }),
        });
        setFavIds((s) => new Set([...s, movie.id])); // Add movie to local set
      }
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  //Show error if movie failed to load
  if (err && !movie) {
    return (
      <div style={{ maxWidth: 900, margin: "20px auto", padding: "0 12px" }}>
        <Link to="/">← Back</Link>
        <div style={{ color: "tomato", marginTop: 12 }}>{err}</div>
      </div>
    );
  }

  //Show loading state for movie
  if (!movie) return <div style={{ padding: 20 }}>Loading...</div>;

  //Build poster image if it exists
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: "0 12px" }}>
      <Link to="/">← Back</Link>

      <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
        {/* Display Movie Poster */}
        {poster && (
          <img
            src={poster}
            alt={movie.title}
            style={{ width: 220, borderRadius: 12 }}
          />
        )}
        {/* Display Basic Movie Details */}
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0 }}>{movie.title}</h2>
          <div style={{ opacity: 0.8 }}>{movie.release_date}</div>
          <p style={{ marginTop: 12, lineHeight: 1.5 }}>{movie.overview}</p>

          {/* Display Remove button if movie already is favorited */}
          <button onClick={toggleFav}>
            {isFav ? "Remove from Favorites" : "Add to Favorites"}
          </button>

          {/* Display Error message for favorite actions */}
          {err && <div style={{ color: "tomato", marginTop: 10 }}>{err}</div>}
        </div>
      </div>
    </div>
  );
}
