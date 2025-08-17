// lib/api.js
export const fetchCurrentUser = async () => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
      method: "GET",
      credentials: "include", 
    });

    if (!res.ok) {
      console.log('No user logged in');
    }

    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error(err);
    return null; 
  }
};