import { Link } from "react-router-dom";

export default function MovieCard({ movie, right }) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : null;

  return (
    <div
      style={{
        border: "1px solid #333",
        padding: 10,
        borderRadius: 10,
        display: "flex",
        gap: 12,
      }}
    >
      {poster && (
        <img
          src={poster}
          alt={movie.title}
          style={{ width: 90, borderRadius: 8 }}
        />
      )}
      <div style={{ flex: 1 }}>
        <Link to={`/movie/${movie.id}`} style={{ fontWeight: 700 }}>
          {movie.title}
        </Link>
        <div style={{ opacity: 0.8, fontSize: 13 }}>{movie.release_date}</div>
        <div style={{ marginTop: 6, fontSize: 14, opacity: 0.9 }}>
          {movie.overview?.slice(0, 140)}
          {movie.overview?.length > 140 ? "..." : ""}
        </div>
      </div>
      {right}
    </div>
  );
}
