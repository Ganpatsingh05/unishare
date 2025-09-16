// Room API functions
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://unishare-backend-a86e.onrender.com';

export async function fetchRooms() {
  try {
    const response = await fetch(`${API_BASE}/api/rooms`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    throw error;
  }
}

export async function deleteRoom(roomId) {
  try {
    const response = await fetch(`${API_BASE}/api/rooms/${roomId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete room: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to delete room:', error);
    throw error;
  }
}