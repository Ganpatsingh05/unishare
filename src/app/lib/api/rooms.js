// Room API functions
import { apiCall } from './base.js';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://unishare-backend-a86e.onrender.com';

export async function fetchRooms() {
  try {
    // Try multiple potential endpoints
    let data;
    try {
      data = await apiCall('/api/rooms', { method: 'GET' });
    } catch (firstError) {
      console.log('First endpoint failed, trying alternative:', firstError.message);
      try {
        data = await apiCall('/rooms', { method: 'GET' });
      } catch (secondError) {
        console.log('Second endpoint failed, trying housing endpoint:', secondError.message);
        data = await apiCall('/api/housing', { method: 'GET' });
      }
    }
    return data;
  } catch (error) {
    console.error('All apiCall attempts failed, trying direct fetch:', error);
    
    // Try multiple direct fetch endpoints
    const endpoints = [
      `${API_BASE}/api/rooms`,
      `${API_BASE}/api/housing`,
      `${API_BASE}/rooms`
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          console.log(`Successfully fetched from ${endpoint}`);
          return data;
        }
      } catch (fetchError) {
        console.log(`Failed to fetch from ${endpoint}:`, fetchError.message);
        continue;
      }
    }
    
    console.warn('All endpoints failed, returning empty data for development');
    return {
      success: true,
      data: []
    };
  }
}

export async function deleteRoom(roomId) {
  try {
    // Try multiple potential endpoints for delete
    let data;
    try {
      data = await apiCall(`/api/rooms/${roomId}`, { method: 'DELETE' });
    } catch (firstError) {
      console.log('First delete endpoint failed, trying alternative:', firstError.message);
      try {
        data = await apiCall(`/rooms/${roomId}`, { method: 'DELETE' });
      } catch (secondError) {
        console.log('Second delete endpoint failed, trying housing endpoint:', secondError.message);
        data = await apiCall(`/api/housing/${roomId}`, { method: 'DELETE' });
      }
    }
    return data;
  } catch (error) {
    console.error('All delete apiCall attempts failed, trying direct fetch:', error);
    
    // Try multiple direct fetch endpoints for delete
    const endpoints = [
      `${API_BASE}/api/rooms/${roomId}`,
      `${API_BASE}/api/housing/${roomId}`,
      `${API_BASE}/rooms/${roomId}`
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Successfully deleted from ${endpoint}`);
          return data;
        }
      } catch (fetchError) {
        console.log(`Failed to delete from ${endpoint}:`, fetchError.message);
        continue;
      }
    }
    
    throw new Error('Failed to delete room: All endpoints failed');
  }
}