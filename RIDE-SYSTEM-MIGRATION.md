# Ride System - Spring Boot Migration Guide

## ✅ What Was Fixed

### Frontend API Layer (`src/app/lib/api/rideSharing.js`)

**Changed:**
- ❌ Old: `/api/shareride/*` 
- ✅ New: `/rides/*`

**Key Updates:**

1. **Pagination**: Changed from `limit/offset` to Spring Boot's `page/size`
   ```javascript
   // Old
   ?limit=10&offset=0
   
   // New
   ?page=0&size=10
   ```

2. **Response Format**: Now handles Spring Boot's `PageResponse`
   ```javascript
   // Old Node.js format
   { data: [...], total: 100 }
   
   // New Spring Boot format
   { content: [...], totalElements: 100, number: 0, size: 10, totalPages: 10 }
   ```

3. **Field Mapping**: Frontend ↔ Backend
   ```javascript
   Frontend          →  Backend (Spring Boot DTO)
   ------------------------------------------------
   from              →  fromLocation
   to                →  toLocation
   date              →  rideDate
   time              →  rideTime
   seats             →  totalSeats
   vehicle           →  vehicleInfo
   contacts[]        →  contactInfo{}
   ```

### New Files Created

1. **`rideMapper.js`** - Data transformation utilities
   - `mapToBackendRide()` - Convert frontend → backend
   - `mapToFrontendRide()` - Convert backend → frontend
   - `mapPaginationResponse()` - Handle PageResponse
   - `validateRideForBackend()` - Validate before sending
   - Helper functions for formatting and display

### Updated Files

1. **`src/app/lib/api/rideSharing.js`**
   - ✅ `fetchRides()` - Get all available rides
   - ✅ `createRide()` - Post new ride
   - ✅ `getMyRides()` - Get user's posted rides
   - ✅ `updateRide()` - Update existing ride
   - ✅ `deleteRide()` - Cancel/delete ride
   - ⚠️ `requestRideJoin()` - Marked as NOT IMPLEMENTED (backend pending)
   - ⚠️ `getRideRequests()` - Marked as NOT IMPLEMENTED
   - ⚠️ `getUserSentRequests()` - Marked as NOT IMPLEMENTED
   - ⚠️ Other advanced features - Marked as NOT IMPLEMENTED

2. **`src/app/lib/api/utils.js`**
   - Fixed `getUserActivity()` to use `/rides/my-rides`
   - Updated to handle Spring Boot PageResponse

## 🔄 Field Mapping Reference

### Create/Update Ride

**Frontend Form → Backend DTO**
```javascript
{
  from: "New York",           // → fromLocation
  to: "Boston",               // → toLocation
  date: "2026-09-15",        // → rideDate
  time: "10:00",             // → rideTime
  seats: 3,                  // → totalSeats
  price: 25.00,              // → price (BigDecimal)
  vehicle: "Honda Civic",    // → vehicleInfo
  description: "...",        // → description
  contacts: [                // → contactInfo (Object)
    { type: "mobile", value: "123-456-7890" },
    { type: "email", value: "user@email.com" }
  ]
}

// Becomes
{
  fromLocation: "New York",
  toLocation: "Boston",
  rideDate: "2026-09-15",
  rideTime: "10:00",
  totalSeats: 3,
  price: 25.00,
  vehicleInfo: "Honda Civic",
  description: "...",
  contactInfo: {
    mobile: "123-456-7890",
    email: "user@email.com"
  }
}
```

### Backend Response → Frontend Display

**Spring Boot Ride Entity → Frontend**
```javascript
// Backend
{
  id: "uuid",
  organizerId: 31,
  fromLocation: "New York",
  toLocation: "Boston",
  rideDate: "2026-09-15",
  rideTime: "10:00:00",
  totalSeats: 3,
  availableSeats: 2,
  price: 25.00,
  vehicleInfo: "Honda Civic",
  description: "...",
  status: "ACTIVE",
  contactInfo: { mobile: "123-456-7890" },
  createdAt: "2026-09-06T10:00:00",
  updatedAt: "2026-09-06T10:00:00"
}

// Mapped to Frontend
{
  id: "uuid",
  from: "New York",
  to: "Boston",
  date: "2026-09-15",
  time: "10:00:00",
  seats: 3,
  availableSeats: 2,
  price: 25.00,
  vehicle: "Honda Civic",
  description: "...",
  status: "ACTIVE",
  organizerId: 31,
  contacts: [{ type: "mobile", value: "123-456-7890" }],
  contactInfo: { mobile: "123-456-7890" },
  createdAt: "2026-09-06T10:00:00",
  // ... includes both formats for compatibility
}
```

## 📊 API Endpoints

### Working Endpoints ✅

| Method | Frontend Call | Backend Endpoint | Description |
|--------|--------------|------------------|-------------|
| GET | `fetchRides({ page, size })` | `/api/rides?page=0&size=10` | Get all available rides (paginated) |
| POST | `createRide(rideData)` | `/api/rides` | Create new ride |
| GET | `getMyRides({ page, size })` | `/api/rides/my-rides?page=0&size=10` | Get user's posted rides |
| PATCH | `updateRide(id, data)` | `/api/rides/{id}` | Update ride |
| DELETE | `deleteRide(id)` | `/api/rides/{id}` | Delete ride |

### Not Yet Implemented ⚠️

These functions exist in frontend but backend endpoints are pending:
- `requestRideJoin()` - Join ride requests
- `getRideRequests()` - Get received requests
- `getUserSentRequests()` - Get sent requests
- `respondToRideRequest()` - Accept/decline requests
- `getRideById()` - Get single ride details
- `getRideStats()` - User statistics

## 🔧 Usage Examples

### Creating a Ride

```javascript
import { createRide } from '@/app/lib/api';

const rideData = {
  from: "New York",
  to: "Boston",
  date: "2026-09-15",
  time: "10:00",
  seats: 3,
  price: 25.00,
  vehicle: "Honda Civic 2022",
  description: "Comfortable ride, AC available",
  contacts: [
    { type: "mobile", value: "123-456-7890" },
    { type: "whatsapp", value: "123-456-7890" }
  ]
};

const result = await createRide(rideData);
if (result.success) {
  console.log('Ride created:', result.data);
  // result.data is already mapped to frontend format
} else {
  console.error('Error:', result.error);
}
```

### Fetching Rides

```javascript
import { fetchRides } from '@/app/lib/api';

const result = await fetchRides({ page: 0, size: 10 });
if (result.success) {
  console.log('Rides:', result.data); // Array of rides (mapped)
  console.log('Pagination:', result.pagination);
  // {
  //   page: 0,
  //   size: 10,
  //   totalPages: 5,
  //   totalElements: 45
  // }
}
```

### Using the Mapper Directly

```javascript
import { mapToFrontendRide, formatRideDateTime, getRideStatusInfo } from '@/app/lib/api/rideMapper';

// Convert backend ride to frontend format
const frontendRide = mapToFrontendRide(backendRide);

// Format date/time for display
const displayDateTime = formatRideDateTime(ride.date, ride.time);
// "Mon, Sep 15, 2026, 10:00 AM"

// Get status styling
const statusInfo = getRideStatusInfo(ride.status);
// {
//   label: "Active",
//   color: "green",
//   bgColor: "bg-green-100",
//   textColor: "text-green-800",
//   icon: "✓"
// }
```

## 🚨 Breaking Changes

### For Existing Code

If you have code using the old ride API, update as follows:

**Old:**
```javascript
const rides = await apiCall('/api/shareride?limit=10&offset=0');
const myRides = await apiCall('/api/shareride/my');
```

**New:**
```javascript
const rides = await fetchRides({ page: 0, size: 10 });
const myRides = await getMyRides({ page: 0, size: 10 });
```

**Response handling:**
```javascript
// Old
rides.data.forEach(ride => {
  console.log(ride.from, ride.to); // Direct access
});

// New (automatic mapping)
rides.data.forEach(ride => {
  console.log(ride.from, ride.to); // Still works!
  console.log(ride.fromLocation, ride.toLocation); // Also available
});
```

## ✨ Benefits of New System

1. **Type Safety**: Proper field names that match backend
2. **Automatic Mapping**: Data is converted automatically
3. **Backward Compatibility**: Both old and new field names available
4. **Better Validation**: Validates before sending to backend
5. **Consistent Format**: All responses use same structure
6. **Spring Boot Standards**: Follows Spring Boot best practices

## 📝 TODO - Backend Endpoints to Implement

The following features need backend implementation:

1. **Ride Requests System**
   - `POST /api/rides/{id}/requests` - Request to join ride
   - `GET /api/rides/my-rides/requests` - Get received requests
   - `GET /api/rides/requests/sent` - Get sent requests
   - `PUT /api/rides/requests/{id}/respond` - Accept/decline request

2. **Single Ride Details**
   - `GET /api/rides/{id}` - Get ride by ID

3. **Statistics**
   - `GET /api/rides/stats` - User ride statistics

4. **Advanced Filtering**
   - Add query parameters to `GET /api/rides`:
     - `fromLocation`, `toLocation`
     - `date`, `minDate`, `maxDate`
     - `minSeats`, `maxPrice`
     - `sort`, `direction`

## 🧪 Testing

To test the ride system:

1. **Create a ride:**
   ```bash
   POST http://localhost:7500/api/rides
   Content-Type: application/json
   Cookie: token=your-jwt-token
   
   {
     "fromLocation": "New York",
     "toLocation": "Boston",
     "rideDate": "2026-09-15",
     "rideTime": "10:00",
     "totalSeats": 3,
     "price": 25.00,
     "vehicleInfo": "Honda Civic",
     "description": "Test ride",
     "contactInfo": {
       "mobile": "123-456-7890"
     }
   }
   ```

2. **Get all rides:**
   ```bash
   GET http://localhost:7500/api/rides?page=0&size=10
   ```

3. **Get my rides:**
   ```bash
   GET http://localhost:7500/api/rides/my-rides?page=0&size=10
   Cookie: token=your-jwt-token
   ```

## 📚 Additional Resources

- Spring Boot PageResponse: Backend uses standard Spring Data pagination
- Ride Entity: `src/main/java/com/unishare/entity/ride/Ride.java`
- Ride DTO: `src/main/java/com/unishare/dto/ride/RideCreateRequest.java`
- Ride Controller: `src/main/java/com/unishare/controller/ride/RideController.java`

## 🆘 Troubleshooting

### "Invalid field" errors
- Make sure you're using the correct field names (use mapper)
- Check validation in `validateRideForBackend()`

### Pagination not working
- Use `page` and `size`, not `limit` and `offset`
- Page numbers start at 0

### Contact info not saving
- Must be an object `{ mobile: "...", email: "..." }`
- Not an array

### Ride not appearing
- Check ride status (must be ACTIVE)
- Verify authentication (need JWT token)
- Check ride date is in future
