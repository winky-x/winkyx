# WinkyX - Operations Runbook

**Version: 1.0.0**

This document provides all necessary instructions for setting up, developing, building, and running the WinkyX monorepo, which includes the web app, mobile app, and local relay server.

## 1. Project Overview

WinkyX is an offline-first, peer-to-peer encrypted messenger. The monorepo contains:
- `apps/web`: The Next.js web application (serves as a feature-rich client or prototype).
- `apps/mobile`: The React Native (Expo) mobile application for iOS and Android.
- `apps/server`: An optional, local-only Fastify server that acts as a peer discovery relay on a LAN.
- `packages/*`: Shared libraries for core logic, UI tokens, types, etc. (future use).

## 2. Prerequisites

Before starting, ensure you have the following installed:
- **Node.js**: `v18.0.0` or higher.
- **pnpm**: A performant package manager. Install with `npm install -g pnpm`.
- **Docker & Docker Compose**: For running the local relay server in a container.
- **Expo Go App**: On your mobile device for running the mobile app in development.
- **Android Studio / Xcode**: For building the native mobile apps and running simulators/emulators.

## 3. Monorepo Setup (Fresh Clone)

To set up the project from a fresh clone:

1.  **Clone the repository:**
    ```sh
    git clone <your-repo-url>
    cd winkyx
    ```

2.  **Install dependencies:**
    Use `pnpm` to install all dependencies for all apps and packages in the workspace.
    ```sh
    pnpm install
    ```
    This command reads the `pnpm-workspace.yaml` and installs all packages efficiently.

## 4. Development Commands

Run these commands from the **root** of the monorepo.

### 4.1. Run All Apps Simultaneously
```sh
# This will start web, mobile, and server in development mode.
pnpm dev
```

### 4.2. Run Individual Apps

- **Web App (Next.js):**
  ```sh
  pnpm --filter web dev
  ```
  The web app will be available at `http://localhost:9002`.

- **Mobile App (Expo):**
  ```sh
  # Start the Expo development server
  pnpm --filter mobile start
  ```
  Scan the QR code with the Expo Go app on your phone. To run on a simulator:
  ```sh
  # Run on Android Emulator
  pnpm --filter mobile android

  # Run on iOS Simulator
  pnpm --filter mobile ios
  ```

- **Local Relay Server (Fastify):**
  ```sh
  # Run with hot-reloading
  pnpm --filter server dev
  ```
  The server will be available at `http://localhost:3001`.

## 5. Testing

To run all tests across the monorepo:
```sh
pnpm test
```

To test a specific application:
```sh
pnpm --filter server test
```

## 6. Production Builds & Deployment

### 6.1. Build All Applications
```sh
pnpm build
```

### 6.2. Web App
```sh
# Build the web app
pnpm --filter web build

# Run the production server
pnpm --filter web start
```

### 6.3. Local Relay Server

**Option A: Using Node.js**
```sh
# Build the server
pnpm --filter server build

# Run the production server
pnpm --filter server start
```

**Option B: Using Docker (Recommended)**
```sh
# Build and run the server in a container
docker compose up --build -d
```
To stop the server: `docker compose down`.

### 6.4. Mobile App (Android & iOS)

Production builds are handled by Expo Application Services (EAS).

1.  **Login to your Expo account:**
    ```sh
    npx eas login
    ```

2.  **Configure the project:**
    ```sh
    npx eas configure
    ```
    This will generate an `eas.json` file.

3.  **Build for Android (AAB):**
    ```sh
    cd apps/mobile
    npx eas build -p android --profile production
    ```

4.  **Build for iOS (Archive):**
    ```sh
    cd apps/mobile
    npx eas build -p ios --profile production
    ```
    The build artifacts can be downloaded from your Expo account and submitted to the Google Play Store and Apple App Store.

## 7. Common Pitfalls & Troubleshooting

- **pnpm install fails**: Ensure you have the correct Node.js version and that `pnpm` is installed globally. Try clearing the pnpm cache with `pnpm store prune`.
- **Mobile app fails to start**: Make sure you have the correct development tools (Android Studio/Xcode) installed and configured. Ensure your mobile device is on the same Wi-Fi network as your computer when using Expo Go.
- **Docker server fails**: Check that Docker Desktop is running. View logs with `docker compose logs -f`.

## 8. Mobile Device Permissions Matrix

The mobile app will require the following permissions. The app is designed to request these permissions as they are needed.

| Feature                 | Permission Required           | Platform      | Why it's needed                                     |
| ----------------------- | ----------------------------- | ------------- | --------------------------------------------------- |
| **Peer Discovery**      | Bluetooth (`BLUETOOTH_SCAN`)  | Android/iOS   | To discover and connect to nearby peers via BLE.    |
| **Peer Discovery**      | Wi-Fi State / Nearby Devices  | Android/iOS   | To discover and connect to peers on the same LAN.   |
| **Notifications**       | Post Notifications            | Android 13+   | To alert the user of new messages in the background.|
| **Background Sync**     | Background App Refresh        | iOS           | To allow periodic data sync when the app is closed. |

## 9. Rollback Guide

If a phase introduces a breaking change, you can revert the commit for that phase.

1.  **Find the commit hash**: Use `git log` to find the commit hash associated with the problematic phase (e.g., `feat(mobile): add background sync...`).
2.  **Revert the commit**:
    ```sh
    git revert <commit-hash>
    ```
    This will create a new commit that undoes the changes.
3.  **Reinstall dependencies**: After reverting, it's crucial to reinstall dependencies to match the previous state.
    ```sh
    pnpm install
    ```
4.  **For Mobile App**: If native modules were changed, you might need to clean the build folders:
    ```sh
    cd apps/mobile
    rm -rf .expo android ios
    pnpm install
    ```
