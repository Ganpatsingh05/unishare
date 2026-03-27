# 📚 UniShare

**UniShare** – A community platform for university students to connect, share, and collaborate.  
From selling old stuff to finding a roommate or sharing rides, UniShare makes campus life easier and more connected.

---

## 🚀 Features

- 🛒 **Sell or Buy Used Items** – Post and browse listings for books, gadgets, furniture, and more.  
- 🚗 **Ride Sharing** – Share rides with fellow students to save costs and go green.  
- 🏠 **Find Roommates** – Connect with students looking for shared accommodations.  
- 📢 **Campus Announcements** – Stay updated with university-related events and notices.  
- 💬 **Student Networking** – Chat and collaborate with peers.  

---

## 🎯 Our Mission

To create a one-stop digital hub for all campus needs — making it easier for students to connect, trade, and support each other.

---

## 🛠️ Tech Stack (Planned)

- **Frontend:** Next.js, Tailwind CSS  
- **Backend:** Node.js, Express / Strapi  
- **Database:** PostgreSQL / MongoDB  
- **Authentication:** Custom Auth / OAuth  
- **Hosting:** Vercel / Render  

---

## 👨‍💻 Contributors

- [GanpatSingh05](https://github.com/GanpatSingh05)  
- [PravinChoudhary11](https://github.com/PravinChoudhary11)  

---

## 📌 License

This project is licensed under the [MIT License](LICENSE).

---

## 💡 Feedback & Contributions

We welcome contributions, feature suggestions, and feedback.  
Feel free to **fork** the repo, **open an issue**, or **submit a pull request**.

---

> **Note:** UniShare is in its early development phase — exciting features are coming soon!

---

## � Admin Announcements (New)

An admin interface is available at `/admin/announcements` (requires admin authentication) that lets you:

- Create, edit, activate/deactivate, and delete system-wide announcements
- Set priority (high/normal/low), optional expiry date, and comma‑separated tags
- Instantly surface the latest active announcement in the global top bar (`AnnouncementBar`)
- Allow users to dismiss the banner (per-browser stored in `localStorage`)

Backend integration: the UI calls helper functions (`getSystemAnnouncements`, `createSystemAnnouncement`, `updateSystemAnnouncement`, `deleteSystemAnnouncement`). If your backend is not ready yet, the page falls back to mock data so styling and flows can be validated now.

Expected API shapes:
GET /admin/announcements  -> { success: true, announcements: [{ id, title, body, active, priority, tags, createdAt, updatedAt, expiresAt }] }
POST /admin/announcements -> { success: true, announcement: { ... } }
PATCH /admin/announcements/:id -> { success: true, announcement: { ...updated } }
DELETE /admin/announcements/:id -> { success: true }

If fields like `expiresAt` are present and in the past, the bar ignores that announcement automatically.

---

## � Admin Notification Broadcast (New)

Route: `/admin/notifications` (admin only) allows sending platform notifications to specific users or all users.

Current UI Capabilities:
- Audience input: `ALL` (or left blank) broadcasts to everyone; otherwise provide comma‑separated emails.
- Message types: `info`, `success`, `warning`, `error` (mapped to colored badges in the history list).
- Optimistic send: Newly submitted notification appears immediately with `sending` status; updates to `sent` or `failed` based on API result.
- Basic in‑memory history (will switch to backend once an endpoint exists).

Backend Expectations (planned):
- `POST /admin/notifications/send` body: `{ users: ["ALL"] | ["email1","email2"], message: string, type?: "info"|"success"|"warning"|"error" }`
- Response: `{ success: true, notification: { id, users, message, type, status: 'queued'|'sent', createdAt } }`
- (Future) `GET /admin/notifications?type=&limit=` to retrieve past broadcasts
- (Future) `POST /admin/notifications/:id/retry` to retry failed ones

Frontend Helper Used: `sendAdminNotification(usersArray, message, type)` from `src/app/lib/api.js`.

Extending Soon:
- Role or segment targeting (e.g., by `role: 'moderator'`)
- Scheduled notifications (add `sendAt` timestamp)
- Pagination + server persisted history
- Retry action button for failed sends

---

## ⚙️ Backend Configuration

### Important Notice

The UniShare backend is a **restricted internal service** and is not publicly accessible for security reasons.

### For Team Members

If you're part of the development team and need backend access:

1. **Contact the internal dev team** for temporary access or testing credentials
2. You'll receive a backend API URL to use in your development environment
3. Configure it in your local environment (see setup instructions below)

### For External Contributors

The frontend can run in **standalone mode** without a backend connection:

- Most UI components and layouts will work
- Features requiring backend data will show appropriate fallback states
- You can contribute to frontend development, UI/UX improvements, and documentation

### Environment Setup

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure backend URL (if you have access):**
   Edit `.env.local` and add your backend URL:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
   ```

3. **Without backend access:**
   Leave `NEXT_PUBLIC_BACKEND_URL` empty in `.env.local`. The app will run with limited functionality.

### Graceful Degradation

When the backend is not configured or unavailable, the application:
- ✅ Continues to run without crashing
- ✅ Shows appropriate loading states and messages
- ✅ Falls back to mock data where applicable (e.g., admin panels)
- ✅ Displays helpful error messages to guide users

---

## ��🖥 Getting Started (Development)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables** (see Backend Configuration section above)

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
