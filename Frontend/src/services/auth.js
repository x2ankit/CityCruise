import axios from 'axios';

export async function googleSignIn(idToken, role = 'user') {
  try {
    console.log('Attempting Google sign-in...', { 
      baseUrl: import.meta.env.VITE_BASE_URL,
      idTokenLength: idToken?.length 
    });
    
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/auth/google`,
      { idToken, role },
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Google sign-in success');
    return res.data;
  } catch (error) {
    console.error('Google sign-in error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
}

export async function login(email, password) {
  const res = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/users/login`,
    { email, password },
    { withCredentials: true }
  );
  return res.data;
}
