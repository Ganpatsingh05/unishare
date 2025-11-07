# UniShare Internal File System (IFS) Documentation

> **Last Updated:** November 7, 2025  
> **Version:** 2.0.0  
> **Project:** UniShare Frontend

## 📋 Table of Contents

1. [Overview](#overview)
2. [Root Structure](#root-structure)
3. [Source Code Organization](#source-code-organization)
4. [Public Assets Structure](#public-assets-structure)
5. [System Files](#system-files)
6. [File Naming Conventions](#file-naming-conventions)
7. [Import Path Rules](#import-path-rules)
8. [Migration Notes](#migration-notes)

---

## Overview

The UniShare Internal File System (IFS) is organized following Next.js 13+ App Router best practices with a focus on scalability, maintainability, and clear separation of concerns.

### Key Principles

- **Route Groups**: Pages organized by feature using `(routes)` and `(auth)` groups
- **Component Organization**: Components categorized by purpose (UI, Layout, Forms)
- **Asset Management**: All public assets centralized in organized subdirectories
- **Configuration Separation**: Config files separated from application code

---

## Root Structure

```
unishare-frontend/
├── .next/                      # Next.js build output (auto-generated)
├── node_modules/               # Dependencies (auto-generated)
├── public/                     # Public static assets
├── src/                        # Source code
├── docs/                       # Project documentation
├── .env                        # Environment variables (not in git)
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── eslint.config.mjs           # ESLint configuration
├── jsconfig.json               # JavaScript configuration
├── next.config.mjs             # Next.js configuration
├── package.json                # Node dependencies and scripts
├── package-lock.json           # Locked dependency versions
├── postcss.config.mjs          # PostCSS configuration
├── README.md                   # Project readme
├── tailwind.config.mjs         # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

---

## Source Code Organization

### Complete `src/` Structure

```
src/
└── app/                        # Next.js App Router directory
    ├── (routes)/               # 🔵 Main application routes (grouped)
    ├── (auth)/                 # 🔵 Authentication routes (grouped)
    ├── _components/            # 🟢 Reusable components
    ├── api/                    # 🟡 API routes
    ├── lib/                    # 🟣 Utilities and libraries
    ├── config/                 # 🟠 Configuration files
    ├── favicon.ico             # Site favicon
    ├── globals.css             # Global styles
    ├── layout.js               # Root layout
    ├── loading.js              # Root loading state
    └── page.js                 # Homepage
```

---

### 1. Route Groups Structure

#### `(routes)/` - Main Application Pages

```
app/(routes)/
├── admin/                      # Admin dashboard
│   ├── page.jsx
│   ├── _components/
│   ├── analytics/
│   ├── announcements/
│   ├── contacts/
│   ├── moderation/
│   ├── notice/
│   ├── notifications/
│   ├── resources/
│   └── users/
│
├── announcements/              # Public announcements
│   ├── page.jsx
│   ├── show/
│   └── submit/
│
├── contacts/                   # Contact management
│   └── page.jsx
│
├── housing/                    # Room listings & housing
│   ├── page.jsx
│   ├── [roomId]/               # Dynamic room details
│   ├── post/                   # Post new room
│   └── search/                 # Search rooms
│
├── info/                       # 📄 Footer & informational pages
│   ├── about/
│   ├── buy-coffee/
│   ├── careers/
│   ├── cookies/
│   ├── data-protection/
│   ├── faqs/
│   ├── feedback/
│   ├── guidelines/
│   ├── help/
│   ├── mission/
│   ├── privacy/
│   ├── report/
│   ├── support-guidelines/
│   └── terms/
│
├── lost-found/                 # Lost & Found items
│   ├── loading.js
│   ├── page.jsx
│   ├── found/                  # Report found items
│   ├── report/                 # Report lost items
│   ├── view-found/             # Browse found items
│   └── view-lost/              # Browse lost items
│
├── marketplace/                # Buy & Sell marketplace
│   ├── buy/
│   │   ├── loading.js
│   │   ├── page.jsx
│   │   └── [itemId]/           # Item details
│   └── sell/
│       ├── loading.js
│       └── page.jsx
│
├── my-activity/                # User activity & requests
│   ├── page.jsx
│   └── requests/
│       ├── announcmentREQ/
│       ├── buysellREQ/
│       ├── lostfoundREQ/
│       ├── roomsREQ/
│       ├── sharerideREQ/
│       └── ticketsREQ/
│
├── profile/                    # User profile pages
│   ├── page.jsx
│   ├── my-found-items/
│   ├── my-items/               # Marketplace items
│   ├── my-lost-items/
│   ├── my-rides/               # Ride sharing history
│   ├── my-rooms/               # Housing listings
│   └── my-tickets/             # Ticket listings
│
├── resources/                  # Educational resources
│   ├── loading.js
│   └── page.jsx
│
├── settings/                   # User settings
│   └── page.jsx
│
├── share-ride/                 # Ride sharing
│   ├── page.jsx
│   ├── findride/               # Find available rides
│   └── postride/               # Post new ride
│
└── ticket/                     # Ticket exchange
    ├── page.jsx
    ├── TicketCreateForm.jsx
    ├── buy/                    # Browse tickets
    └── sell/                   # Sell tickets
```

**Import Path Rule for (routes):**
- Files 1 level deep: `../../` to reach `app/`
- Files 2 levels deep: `../../../` to reach `app/`
- Files 3+ levels deep: `../../../../` to reach `app/`

---

#### `(auth)/` - Authentication Pages

```
app/(auth)/
├── login/
│   └── page.jsx                # Login page
└── register/
    └── page.jsx                # Registration page
```

**Import Path Rule for (auth):**
- Always use `../../` to reach `app/` (1 level deep)

---

### 2. Components Organization

#### `_components/` Structure

```
app/_components/
├── ui/                         # 🎨 UI Components
│   ├── CookieConsent.jsx
│   ├── DynamicIsland.jsx
│   ├── DynamicIslandWrapper.jsx
│   ├── FloatingActionButton.jsx
│   ├── MessageNotification.jsx
│   ├── NavigationLoader.jsx
│   ├── NoticeBar.jsx
│   ├── NotificationPanel.jsx
│   ├── PageNavigationNotifier.jsx
│   ├── Reveal.jsx
│   ├── RouteChangeOverlay.jsx
│   ├── RouteLoader.jsx
│   ├── ScrollToTop.jsx
│   ├── ThemeWrapper.jsx
│   └── useIsMobile.js
│
├── layout/                     # 📐 Layout Components
│   ├── ClientHeader.jsx
│   ├── Footer.jsx
│   ├── GalaxyDesktop.jsx
│   ├── GalaxyMobile.jsx
│   ├── Header.jsx
│   ├── HeaderMobile.jsx
│   ├── HeroSlider.jsx
│   ├── Main.jsx
│   ├── MobileBottomNav.jsx
│   ├── mobilemain.jsx
│   ├── MobileQuickNav.jsx
│   ├── SiteChrome.jsx
│   ├── SmallFooter.jsx
│   └── SmallFooter.module.css
│
├── forms/                      # 📝 Form Components
│   ├── ProfileDisplay.jsx
│   ├── ProfileEditModal.jsx
│   ├── RequestButton.jsx
│   └── RequestManager.jsx
│
└── ServicesTheme/              # 🎭 Theme Components
    ├── EarthTheme.jsx          # ShareRide theme
    ├── JupiterTheme.jsx        # Ticket theme
    ├── MarsTheme.jsx           # Marketplace Sell theme
    └── VenusTheme.jsx          # Marketplace Buy theme
```

**Import Path Rules for Components:**
- From `_components/`: Use `../lib/` or `../assets/`
- From `_components/ui/`: Use `../../lib/` or `../../assets/`
- From `_components/layout/`: Use `../../lib/` or `../../assets/`
- From `_components/forms/`: Use `../../lib/` or `../../assets/`

---

### 3. Library & Utilities

#### `lib/` Structure

```
app/lib/
├── api/                        # API client functions
│   ├── housing.js
│   ├── lostFound.js
│   ├── marketplace.js
│   ├── notifications.js
│   ├── resources.js
│   ├── rideSharing.js
│   ├── tickets.js
│   └── userProfile.js
│
├── contexts/                   # React Context providers
│   └── UniShareContext.jsx
│
├── hooks/                      # Custom React hooks
│   └── useDynamicIslandNotification.js
│
└── utils/                      # Utility functions
    ├── actionNotifications.js  # Notification system
    └── profileUtils.js         # Profile utilities
```

---

### 4. Configuration

#### `config/` Structure

```
app/config/
└── app.config.js               # Application configuration
```

**Purpose:** Centralized configuration for app-wide settings

---

### 5. API Routes

```
app/api/
└── loadnav/
    └── route.js                # Navigation data API
```

---

## Public Assets Structure

### Complete `public/` Organization

```
public/
├── favicon.ico                 # Site favicon
│
└── images/                     # 🎨 All image assets
    ├── logos/                  # Brand logos
    │   ├── login.png
    │   ├── logounishare1.png
    │   └── rideunishare.png
    │
    ├── icons/                  # SVG icons
    │   ├── cookie.svg
    │   ├── default-avatar.svg
    │   ├── globe.svg
    │   ├── login.svg
    │   ├── next.svg
    │   ├── rideunishare.svg
    │   ├── vercel.svg
    │   └── window.svg
    │
    ├── services/               # Service category images
    │   ├── announcement.jpeg
    │   ├── announcement.png
    │   ├── buysell.jpeg
    │   ├── buysell.png
    │   ├── cookie.png
    │   ├── house.jpeg
    │   ├── house.png
    │   ├── Lost.jpeg
    │   ├── Lost.png
    │   ├── rideshare.jpeg
    │   ├── rideshare.png
    │   ├── ticket.jpeg
    │   └── ticket.png
    │
    ├── sliders/                # Hero slider images
    │   ├── housingslider.jpeg
    │   ├── ridesharing.jpeg
    │   └── sellslider.png
    │
    ├── 3d-models/              # 3D model renders
    │   ├── ModelBack.png
    │   ├── ModelLeft.png
    │   ├── ModelRight.png
    │   └── UnishareModel.png
    │
    ├── animations/             # GIF animations
    │   ├── buy.gif
    │   ├── navigator.gif
    │   └── rideshare.gif
    │
    └── backgrounds/            # Background images
        └── (currently empty)
```

**Usage in Code:**
```jsx
// Images in public folder are accessed with /images/...
<img src="/images/logos/logounishare1.png" alt="UniShare Logo" />
<img src="/images/services/rideshare.jpeg" alt="Ride Sharing" />
<img src="/images/icons/globe.svg" alt="Globe" />
```

---

## System Files

### Configuration Files

| File | Purpose | Location |
|------|---------|----------|
| `next.config.mjs` | Next.js configuration | Root |
| `tailwind.config.mjs` | Tailwind CSS configuration | Root |
| `postcss.config.mjs` | PostCSS configuration | Root |
| `eslint.config.mjs` | ESLint rules | Root |
| `jsconfig.json` | JavaScript compiler options | Root |
| `tsconfig.json` | TypeScript configuration | Root |
| `package.json` | Dependencies & scripts | Root |
| `app.config.js` | Application settings | `src/app/config/` |

### Environment Files

| File | Purpose | In Git? |
|------|---------|---------|
| `.env` | Environment variables (local) | ❌ No |
| `.env.example` | Environment template | ✅ Yes |

### Build & Cache Files (Auto-generated)

| Directory | Purpose | In Git? |
|-----------|---------|---------|
| `.next/` | Next.js build output | ❌ No |
| `node_modules/` | NPM dependencies | ❌ No |

### Documentation Files

| File | Purpose | Location |
|------|---------|----------|
| `README.md` | Project overview | Root |
| `PROJECT-STRUCTURE.md` | Structure guide | `docs/` |
| `COMPONENT-LIBRARY.md` | Component documentation | `docs/` |
| `ROUTING-GUIDE.md` | Routing documentation | `docs/` |
| `INTERNAL-FILE-SYSTEM.md` | This file | `docs/` |

---

## File Naming Conventions

### React Components

```
✅ PascalCase for component files
   - Header.jsx
   - UserProfile.jsx
   - NotificationPanel.jsx

✅ camelCase for utility files
   - useIsMobile.js
   - actionNotifications.js
   - profileUtils.js
```

### Next.js Special Files

```
✅ Lowercase for Next.js convention
   - page.jsx          (Route page)
   - layout.jsx        (Layout wrapper)
   - loading.jsx       (Loading state)
   - error.jsx         (Error boundary)
   - not-found.jsx     (404 page)
```

### Styles

```
✅ Component.module.css for CSS Modules
   - SmallFooter.module.css
   - Header.module.css

✅ globals.css for global styles
```

### Folders

```
✅ kebab-case for route folders
   - share-ride/
   - lost-found/
   - my-activity/

✅ (parentheses) for route groups
   - (routes)/
   - (auth)/

✅ _underscore for non-route folders
   - _components/

✅ [brackets] for dynamic routes
   - [roomId]/
   - [itemId]/
```

---

## Import Path Rules

### Understanding Relative Paths

**Key Rule:** Count the folder levels from current file to `app/` directory

```
Example 1: File at app/_components/ui/Header.jsx
- Need to go up 2 levels: ../../
- Import: import { useUI } from '../../lib/contexts/UniShareContext'

Example 2: File at app/(routes)/share-ride/postride/page.jsx
- Need to go up 3 levels: ../../../
- Import: import SmallFooter from '../../../_components/layout/SmallFooter'

Example 3: File at app/(routes)/profile/page.jsx
- Need to go up 2 levels: ../../
- Import: import { useAuth } from '../../lib/contexts/UniShareContext'
```

### Import Path Reference Table

| Current Location | Depth | Path to `app/` | Example |
|------------------|-------|----------------|---------|
| `app/page.jsx` | 0 | `./` | `import from './lib/api'` |
| `app/(routes)/profile/` | 2 | `../../` | `import from '../../lib/api'` |
| `app/(routes)/share-ride/postride/` | 3 | `../../../` | `import from '../../../lib/api'` |
| `app/_components/ui/` | 2 | `../../` | `import from '../../lib/api'` |
| `app/_components/layout/` | 2 | `../../` | `import from '../../lib/api'` |
| `app/_components/forms/` | 2 | `../../` | `import from '../../lib/api'` |
| `app/(auth)/login/` | 2 | `../../` | `import from '../../lib/api'` |

### Public Assets (Images)

```jsx
// ✅ Correct - Direct path from public folder
<img src="/images/logos/logounishare1.png" />
<Image src="/images/services/rideshare.jpeg" />

// ❌ Wrong - Don't use relative imports for public assets
import logo from '../../assets/images/logo.png'  // Old way
```

---

## Migration Notes

### Changes from Old Structure to New IFS

#### 1. Routes Organization

**Before:**
```
app/
├── share-ride/
├── ticket/
├── marketplace/
├── profile/
└── ... (mixed with components)
```

**After:**
```
app/
├── (routes)/
│   ├── share-ride/
│   ├── ticket/
│   ├── marketplace/
│   └── profile/
└── _components/
```

#### 2. Components Organization

**Before:**
```
app/_components/
├── Header.jsx
├── Footer.jsx
├── DynamicIsland.jsx
├── RequestButton.jsx
└── ... (all mixed together)
```

**After:**
```
app/_components/
├── ui/
│   └── DynamicIsland.jsx
├── layout/
│   ├── Header.jsx
│   └── Footer.jsx
└── forms/
    └── RequestButton.jsx
```

#### 3. Public Assets

**Before:**
```
public/
├── announcement.png
├── buysell.png
├── assets/
│   └── images/
│       └── logounishare1.png
└── images/
    └── rideshare.jpeg

src/app/assets/
└── images/
    └── logounishare1.png
```

**After:**
```
public/
└── images/
    ├── logos/
    ├── icons/
    ├── services/
    ├── sliders/
    ├── 3d-models/
    └── animations/
```

#### 4. Info Pages

**Before:**
```
app/info/
├── help/
├── privacy/
└── terms/
```

**After:**
```
app/(routes)/info/
├── help/
├── privacy/
├── terms/
└── ... (14 pages total)
```

All footer-related informational pages are now properly grouped in `(routes)/info/`.

---

## Quick Reference

### Common File Locations

```bash
# Homepage
src/app/page.js

# Root Layout
src/app/layout.js

# Global Styles
src/app/globals.css

# Login Page
src/app/(auth)/login/page.jsx

# Profile Page
src/app/(routes)/profile/page.jsx

# Header Component
src/app/_components/layout/Header.jsx

# UI Components
src/app/_components/ui/

# API Functions
src/app/lib/api/

# Context Providers
src/app/lib/contexts/UniShareContext.jsx

# Configuration
src/app/config/app.config.js

# Logo Image
public/images/logos/logounishare1.png

# Service Images
public/images/services/

# Documentation
docs/
```

---

## Best Practices

### 1. **Route Organization**
- ✅ Keep related routes in logical groups
- ✅ Use route groups `(name)` for organization without affecting URLs
- ✅ Keep dynamic routes `[param]` clearly named

### 2. **Component Organization**
- ✅ Categorize by purpose (ui, layout, forms)
- ✅ Keep components DRY (Don't Repeat Yourself)
- ✅ Use meaningful component names

### 3. **Asset Management**
- ✅ All images in `public/images/` subdirectories
- ✅ Use descriptive folder names
- ✅ Reference with `/images/...` paths

### 4. **Import Paths**
- ✅ Use relative paths for local imports
- ✅ Count folder depth carefully
- ✅ Be consistent across similar files

### 5. **File Naming**
- ✅ Follow Next.js conventions (`page.jsx`, `layout.jsx`)
- ✅ Use PascalCase for components
- ✅ Use kebab-case for route folders

---

## Troubleshooting

### Common Issues

**Issue: Module not found errors**
```
Solution: Check import path depth
- Count levels from file to app/
- Adjust ../ accordingly
```

**Issue: Image not loading**
```
Solution: Check public path
- Use /images/... not ./images/...
- Verify file exists in public/images/
```

**Issue: Route not working**
```
Solution: Check folder structure
- Verify page.jsx exists
- Check for typos in folder names
- Ensure proper nesting
```

---

## Maintenance

### When Adding New Features

1. **New Route:**
   - Add to `(routes)/` if public
   - Add to `(auth)/` if authentication-related
   - Create `page.jsx` in new folder
   - Use correct import depth

2. **New Component:**
   - Categorize: ui, layout, or forms
   - Place in appropriate subfolder
   - Use `../../` for imports from component folders

3. **New Image:**
   - Determine category (logos, icons, services, etc.)
   - Add to correct `public/images/` subfolder
   - Reference with `/images/category/filename.ext`

4. **New Library Function:**
   - Add to `lib/api/` for API calls
   - Add to `lib/utils/` for utilities
   - Add to `lib/hooks/` for custom hooks

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | Nov 7, 2025 | Complete IFS restructuring |
| 1.0.0 | Prior | Initial structure |

---

**Document Maintained By:** UniShare Development Team  
**Last Review:** November 7, 2025

