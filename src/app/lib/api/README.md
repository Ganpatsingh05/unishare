# UniShare API Structure

Organized, scalable API layer for UniShare frontend.

## 📁 Directory Structure

```
api/
├── core/                       # Core HTTP client & configuration
│   ├── client.js              # HTTP client (apiCall function)
│   ├── config.js              # API endpoints configuration
│   └── index.js               # Core exports
│
├── services/                   # Feature-specific API services
│   ├── auth/                  # Authentication
│   │   ├── auth.service.js
│   │   └── index.js
│   │
│   ├── rides/                 # Ride Sharing / Carpooling
│   │   ├── rides.service.js   # API calls
│   │   ├── rides.mapper.js    # Data transformation
│   │   └── index.js
│   │
│   ├── housing/               # Housing & Rooms
│   │   ├── housing.service.js
│   │   ├── rooms.service.js
│   │   └── index.js
│   │
│   ├── marketplace/           # Buy/Sell Items
│   │   ├── marketplace.service.js
│   │   └── index.js
│   │
│   ├── community/             # Community Features
│   │   ├── announcements.service.js
│   │   ├── lostFound.service.js
│   │   ├── tickets.service.js
│   │   ├── notice.service.js
│   │   └── index.js
│   │
│   ├── user/                  # User Profile & Contacts
│   │   ├── profile.service.js
│   │   ├── contacts.service.js
│   │   ├── userProfile.service.js
│   │   └── index.js
│   │
│   └── admin/                 # Admin Panel
│       ├── admin.service.js
│       └── index.js
│
├── shared/                     # Shared utilities
│   ├── utils.js               # Common utilities
│   ├── notifications.js       # Notifications API
│   ├── resources.js           # Resources API
│   ├── requests.js            # Universal request system
│   └── index.js
│
├── index.js                    # Main API exports
└── README.md                   # This file
```

## 🚀 Usage

### Import from main entry point (Recommended)

```javascript
import { 
  // Auth
  loginWithEmail,
  fetchCurrentUser,
  logout,
  
  // Rides
  fetchRides,
  createRide,
  getMyRides,
  
  // Housing
  fetchRooms,
  createRoom,
  
  // Marketplace
  fetchMarketplaceItems,
  createMarketplaceItem,
  
  // Utilities
  apiCall,
  getUserActivity
} from '@/app/lib/api';
```

### Import from specific service (For better tree-shaking)

```javascript
// Import only what you need
import { fetchRides, createRide } from '@/app/lib/api/services/rides';
import { loginWithEmail } from '@/app/lib/api/services/auth';
import { apiCall } from '@/app/lib/api/core';
```

### Import from legacy api.js (Backward compatibility)

```javascript
// Still works for existing code
import { fetchRides, createRide } from '@/app/lib/api.js';
```

## 📚 Service Categories

### 🔐 Auth Service (`services/auth/`)
User authentication and session management
- Login (Email, Google, GitHub)
- Logout
- Current user status
- Registration

### 🚗 Rides Service (`services/rides/`)
Ride sharing and carpooling features
- List available rides
- Create ride offers
- Manage my rides
- Join ride requests
- **Includes data mapper** for backend compatibility

### 🏠 Housing Service (`services/housing/`)
Housing and room finding
- Browse housing listings
- Room postings
- Search rooms
- Manage my listings

### 🛒 Marketplace Service (`services/marketplace/`)
Buy and sell items
- List items for sale
- Browse marketplace
- Manage my items
- Item search

### 🎪 Community Service (`services/community/`)
Community features
- **Announcements**: Campus announcements
- **Lost & Found**: Lost/found item reports
- **Tickets**: Event/concert ticket trading
- **Notices**: Important notices

### 👤 User Service (`services/user/`)
User profile and contacts
- View/update profile
- Upload profile picture
- Manage contacts
- User statistics
- View other user profiles

### 🛡️ Admin Service (`services/admin/`)
Admin panel functionality
- User management
- System statistics
- Audit logs
- Content moderation

### 🔧 Shared (`shared/`)
Cross-cutting utilities
- **utils.js**: Common helper functions
- **notifications.js**: Notification system
- **resources.js**: File/resource management
- **requests.js**: Universal request system for join/interest requests

## 🎯 Design Principles

### 1. **Separation of Concerns**
Each service handles one domain (auth, rides, housing, etc.)

### 2. **Single Responsibility**
Each file has one clear purpose:
- `.service.js` = API calls
- `.mapper.js` = Data transformation
- `index.js` = Public exports

### 3. **Consistent Naming**
- Services: `*.service.js`
- Mappers: `*.mapper.js`
- Functions: `fetchX`, `createX`, `updateX`, `deleteX`, `getMyX`

### 4. **Encapsulation**
Internal implementation details stay in service files. Only necessary functions are exported through `index.js`.

### 5. **Backward Compatibility**
Main `api.js` re-exports everything, so existing imports still work.

## 📦 Adding a New Service

### Step 1: Create service folder
```bash
mkdir src/app/lib/api/services/my-feature
```

### Step 2: Create service file
```javascript
// my-feature.service.js
import { apiCall } from '../../core/client.js';

export const fetchItems = async () => {
  return await apiCall('/my-feature/items');
};

export const createItem = async (data) => {
  return await apiCall('/my-feature/items', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
```

### Step 3: Create index.js
```javascript
// index.js
export {
  fetchItems,
  createItem
} from './my-feature.service.js';
```

### Step 4: Export from main index
```javascript
// api/index.js
export {
  fetchItems,
  createItem
} from './services/my-feature/index.js';
```

### Step 5: Add to api.js (optional, for backward compat)
```javascript
// api.js
export {
  fetchItems,
  createItem
} from './api/services/my-feature/index.js';
```

## 🔍 Finding Things

### "Where is the authentication API?"
→ `services/auth/auth.service.js`

### "Where is ride-related code?"
→ `services/rides/` (service + mapper)

### "Where is the HTTP client?"
→ `core/client.js`

### "Where are API endpoints defined?"
→ `core/config.js`

### "Where are shared utilities?"
→ `shared/` folder

### "How do I import something?"
→ From `api/index.js` or `api.js` or directly from service

## 🧪 Testing

Each service can be tested independently:

```javascript
// Test rides service
import { fetchRides } from '@/app/lib/api/services/rides';

test('fetchRides returns data', async () => {
  const result = await fetchRides({ page: 0, size: 10 });
  expect(result.success).toBe(true);
  expect(Array.isArray(result.data)).toBe(true);
});
```

## 🔄 Migration Guide

### Old Import
```javascript
import { fetchRides } from './api/rideSharing.js';
```

### New Import (both work)
```javascript
// Option 1: Main entry point
import { fetchRides } from '@/app/lib/api';

// Option 2: Direct from service (better tree-shaking)
import { fetchRides } from '@/app/lib/api/services/rides';

// Option 3: Legacy api.js (still works)
import { fetchRides } from '@/app/lib/api.js';
```

## 📊 Benefits

✅ **Organized**: Easy to find what you need  
✅ **Scalable**: Add new services without cluttering  
✅ **Maintainable**: Changes are isolated to specific services  
✅ **Testable**: Test services independently  
✅ **Tree-shakeable**: Import only what you use  
✅ **Type-safe**: Clear function signatures  
✅ **Documented**: Each service has clear purpose  
✅ **Backward Compatible**: Existing code still works  

## 🤝 Contributing

When adding new APIs:
1. Put them in the appropriate service folder
2. Follow naming conventions
3. Export through service's `index.js`
4. Add to main `api/index.js`
5. Update this README

## 📝 Notes

- All API calls go through `core/client.js`
- Data transformation happens in `*.mapper.js` files
- Shared code goes in `shared/`
- Each service is self-contained
- Use relative imports within services
- Use `@/app/lib/api` for external imports
