// Housing Service - Room finding and housing APIs
// Functions from housing.service.js
export {
  fetchRooms,
  fetchRooms as fetchHousingListings,
  fetchhousedata,
  fetchRoom,
  fetchMyRooms,
  fetchMyRooms as getMyHousingListings,
  createRoom,
  createRoom as createHousingListing,
  postRoom
} from './housing.service.js';

// Functions from rooms.service.js
export {
  deleteRoom
} from './rooms.service.js';
