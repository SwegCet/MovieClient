const API = import.meta.env.VITE_API_BASE;

export async function api(path, { token, ...opts } = {}) {
  // calling api to the backend
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      //If Authorization went through, return token, else return empty
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });

  //Throw error if something wen't wrong during API call
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  //If there was no error, we return nothing. Else return a json stating error
  if (res.status === 204) return null;
  return res.json();
}
