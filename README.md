# Spend Tracker — Frontend

A modern React single-page application built with **React 19**, **Vite**, **Axios**, and vanilla CSS design system for expense management.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment
Check `.env` to make sure the backend API URL is pointing to your FastAPI server:
```ini
VITE_API_URL=http://localhost:8000
```

### 3. Start Development Server
```bash
npm run dev
```

The app will start at: [http://localhost:5173](http://localhost:5173)

### 4. Build for Production
```bash
npm run build
```

---

## 🌟 Features

- **JWT Authentication Flow**: Seamless sign-in, token persistence in `localStorage`, and auto-logout on token expiration.
- **⚡ Demo Credentials Auto-Fill**: One-click button to directly fill `demo@example.com` and `password123`.
- **👁️ Show / Hide Password**: Inline toggle button inside the password field with dynamic SVG icons.
- **Expense Creation & Filter**: Real-time logging and category/date filtering.
- **Metrics & MoM Trends**: Interactive summary cards and >20% spending spike anomaly alerts.
