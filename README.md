# MercyHome App 🏡

React Native mobile app for [Mercy Home Essentials](https://mercy-hub.vercel.app) — built with Expo.

Shop premium home goods, buy data bundles, airtime, cable TV subscriptions and exam PINs — all from your phone.

---

## Tech Stack

- **Expo** (React Native) — cross-platform iOS & Android
- **Expo Router** — file-based navigation
- **Zustand** — state management (auth, cart)
- **TanStack Query** — server data fetching & caching
- **Axios** — API client with JWT interceptor
- **Expo SecureStore** — encrypted token storage

---

## Features

- 🏠 **Home** — featured products, digital services, category browsing
- 🛍️ **Shop** — full product catalogue with search and category filters
- ⚡ **Digital Services** — data bundles, airtime, Cable TV, exam PINs
- 🛒 **Cart** — add items, adjust quantities, proceed to checkout
- 👤 **Account** — profile, wallet balance, order history, sign out
- 🔐 **Auth** — email/password login, register, forgot password

---

## Project Structure

```
mercy-hub-app/
├── app/
│   ├── _layout.tsx           # Root layout (QueryClient, StatusBar)
│   ├── (tabs)/
│   │   ├── index.tsx         # Home screen
│   │   ├── shop.tsx          # Shop screen
│   │   ├── digital.tsx       # Digital services screen
│   │   ├── cart.tsx          # Cart screen
│   │   └── account.tsx       # Account screen
│   └── (auth)/
│       ├── login.tsx
│       ├── register.tsx
│       └── forgot-password.tsx
├── components/
│   ├── ui/                   # Button, Input, Card, Badge
│   ├── shop/ProductCard.tsx
│   └── digital/PlanCard.tsx
├── lib/
│   ├── api.ts                # Axios instance + JWT interceptor
│   └── colors.ts             # Brand color tokens
├── store/
│   ├── authStore.ts          # Auth state + SecureStore persistence
│   └── cartStore.ts          # Cart state
└── types/index.ts            # Shared TypeScript types
```

---

## Backend

This app connects to the existing **mercy-hub Next.js backend** at `https://mercy-hub.vercel.app`.

The mobile app uses a dedicated JWT login endpoint:
```
POST /api/auth/mobile/login
```
Returns a 30-day JWT stored securely on the device. All subsequent requests send it as `Authorization: Bearer <token>`.

---

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI — `npm install -g expo-cli`
- Expo Go app on your phone (for testing)

### Run locally

```bash
git clone https://github.com/sescodtech/mercy-hub-app.git
cd mercy-hub-app
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your Android or iOS device.

---

## Building the APK (Android)

No Android Studio needed — EAS Build compiles on Expo's cloud servers.

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to Expo account (expo.dev)
eas login

# Build APK for testing
eas build --platform android --profile preview
```

EAS sends you a download link when the build is complete. Install the APK directly on your Android device.

---

## Environment

No `.env` file needed in the app — the backend URL is set in `lib/api.ts`:

```ts
export const BASE_URL = "https://mercy-hub.vercel.app";
```

Change this to `http://localhost:3000` for local backend development.

---

## Related

- **Web app** → [mercy-hub.vercel.app](https://mercy-hub.vercel.app)
- **Web repo** → [github.com/sescodtech/mercy-hub](https://github.com/sescodtech/mercy-hub)

---

## Author

**Sesco** ([@sescodtech](https://github.com/sescodtech))
