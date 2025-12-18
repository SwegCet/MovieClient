import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);

  //Set use states to token if valid credentials
  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("username");
    if (t) setToken(t);
    if (u) setUsername(u);
  }, []);

  //Search into backend and set into local storage & states if exist
  async function login({ username, password }) {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    setToken(data.token);
    setUsername(data.username);
  }

  //Add credentials into backend and set token to remember if user is still logged in
  async function signup({ email, username, password }) {
    const data = await api("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, username, password }),
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    setToken(data.token);
    setUsername(data.username);
  }

  //Remove credentials from local storage and update states
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
  }

  return (
    <AuthCtx.Provider value={{ token, username, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
