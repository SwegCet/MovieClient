# Movie Search – Frontend (React)

This is the **frontend** for the Movie Search & Favorites application. It is built with **React**, uses **React Router**, and communicates with a C# ASP.NET backend API to fetch movie data and manage user favorites.

---

## Tech Stack

* **React** (Vite)
* **React Router**
* **Context API** (Auth & Favorites)
* **TMDB API** (via backend)
* **CSS** for styling

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components (MovieCard, NavBar, etc.)
│   ├── contexts/          # AuthContext, Movie/Favorites context
│   ├── lib/               # API helper (fetch wrapper)
│   ├── pages/             # Route-level pages (Home, Favorites, MovieDetails)
│   ├── App.jsx            # App routes
│   └── main.jsx           # App entry point
└── index.html
```

---

## Authentication Flow

* Authentication is handled via an **AuthContext**
* A JWT token is stored in `localStorage` after login/signup
* The token is sent to the backend via the `Authorization` header

```js
Authorization: Bearer <token>
```

> Auth logic is currently simple/demo-style and can be replaced with Supabase Auth or another provider.

---

## Favorites Flow

1. User clicks **Add to Favorites**
2. Frontend sends POST request to backend
3. Backend stores movie data (TMDB ID, title, poster)
4. Favorites page fetches data from `/api/favorites`

---

## Environment Variables

Create a `.env` file in the frontend root:

```
VITE_API_BASE_URL=http://localhost:8080
```

This should point to your deployed or local backend.

---

## ▶️ Running Locally

```bash
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

## Common Issues

* **Favorites not showing** → Check backend + database
* **401 errors** → Token missing or expired
* **CORS errors** → Ensure backend allows frontend origin

---
