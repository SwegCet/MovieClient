import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { token, login, signup } = useAuth();
  const nav = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  //If user has valid token, send to home page
  if (token) return <Navigate to="/" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      //If user is signing up, call into backend via Auth
      if (isSignup) await signup({ email, username, password });
      //Otherwise call login into backend via Auth
      else await login({ username, password });
      nav("/", { replace: true }); // Replace url to redirect to Home route
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "24px auto" }}>
      <h2>{isSignup ? "Create account" : "Login"}</h2>
      {/* Basic Form, checking use states to update between Sign-Up and Login forms */}
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        {isSignup && (
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">{isSignup ? "Sign up" : "Login"}</button>

        {err && (
          <div style={{ color: "tomato", whiteSpace: "pre-wrap" }}>{err}</div>
        )}
      </form>
      {/* Update Text to be reactive between Login and Sign Ups */}
      <button onClick={() => setIsSignup((v) => !v)} style={{ marginTop: 10 }}>
        {isSignup ? "Have an account? Login" : "Need an account? Sign up"}
      </button>
    </div>
  );
}
