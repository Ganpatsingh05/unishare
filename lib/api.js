// lib/api.js
export const fetchCurrentUser = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
      method: "GET",
      credentials: "include", 
    });

    if (!res.ok) {
      console.log('No user logged in');
      return null;
    }

    const data = await res.json();
    return data.user || null;  // return null if user not found
  } catch (err) {
    console.error("fetchCurrentUser error:", err);
    return null; 
  }
};


// API functions
export const fetchhousedata = async (searchParams = {}) => {
  try {
    const queryString = new URLSearchParams(searchParams).toString();
    const url = queryString 
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms?${queryString}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms`;
    
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    
    if (!res.ok) {
      console.warn("fetchhousedata response not ok", res.status);
      return { data: [] };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching house data:", err);
    return { data: [] };
  }
};

// Post a new room listing
export const postRoom = async (formData) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms`, {
      method: 'POST',
      credentials: 'include',
      body: formData, // FormData object with files and other fields
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.details || result.error || 'Failed to post room');
    }

    return result;
  } catch (error) {
    console.error('Error posting room:', error);
    throw error;
  }
};
