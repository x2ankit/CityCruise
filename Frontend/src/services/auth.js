import axios from 'axios';

export async function googleSignIn(idToken, role = 'user') {
  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/auth/google`,
    { idToken, role },
    { withCredentials: true }
  );
  return res.data;
}

export async function login(email, password) {
  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/users/login`,
    { email, password },
    { withCredentials: true }
  );
  return res.data;
}
