import { useState } from "react";
import { api } from "../lib/api";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [q, setQ] = useState("");
  const [movies, setMovies] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSearch(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await api(`/api/movies/search?q=${encodeURIComponent(q)}`);
      setMovies(data.results || []);
    } catch (e2) {
      setErr(String(e2.message || e2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: "0 12px" }}>
      <h2>Search Movies</h2>
      <form onSubmit={onSearch} style={{ display: "flex", gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. Interstellar"
          style={{ flex: 1 }}
        />
        <button disabled={!q || loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {err && (
        <div style={{ color: "tomato", marginTop: 10, whiteSpace: "pre-wrap" }}>
          {err}
        </div>
      )}

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {movies.map((m) => (
          <MovieCard movie={m} key={m.id} />
        ))}
      </div>
    </div>
  );
}
