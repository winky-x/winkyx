# **App Name**: WinkyX

## Core Features:

- Enhanced Encryption: Ensure AES-256 encryption uses CBC mode with IVs per message.
- Message Integrity: Messages should be signed with SHA-256 HMAC for integrity validation.
- Key Rotation: Include session key auto-rotation after every 20 messages.
- Secure Access: PIN & biometrics must gate app access and also encrypt local storage.
- Message Queue: Include a fallback message queue system in case a peer disconnects mid-transfer.
- Auto-Reconnect: Add broadcast ping every 30s to discover reconnectable peers automatically.
- Group Chat: Include peer-to-peer group chat support for 3+ devices using Wi-Fi Direct.
- QR Pairing: Add QR-code pairing mode for initial trusted device setup (optional).
- Unit Tests: Add unit tests for encryption and BLE connection logic using Jest.
- Mock Services: Create mock services to emulate BLE/Wi-Fi during development on unsupported hardware.
- TS Interfaces: Add detailed TypeScript interfaces for messages, peers, and connection status.
- Theme Auto-Detect: Include support for auto-detecting system dark/light mode.
- Haptic Feedback: Add vibration feedback on send/fail events (use Expo Haptics).
- Message Animation: Add subtle message send animation (slide-in or fade) for clean UX.
- Profile Avatar: Include a profile avatar icon for the sender (use initials fallback).
- Background Scanning: Run all scanning logic in background threads (if using bare React Native).
- Scan Throttling: Throttle BLE scans to save battery when idle or screen off.
- SQLite WAL: Use SQLite WAL (Write-Ahead Logging) for faster and safe writes.
- Optimize Bundling: Bundle assets statically, minimize runtime dependencies, enable Hermes engine.
- Dev Logging: Include a dev toggle in settings to log all message transfers and connection attempts.
- Debug Screen: Add a debug screen to test BLE scan, connect, send, and receive manually.

## Style Guidelines:

- Primary color: HSL(210, 60%, 50%) – a vibrant, deep blue (#3385FF) suggesting trust and security.
- Background color: HSL(210, 20%, 95%) – a light, desaturated blue (#F0F5FF) creating a clean and unobtrusive background.
- Accent color: HSL(180, 70%, 40%) – a teal-leaning cyan (#26B8B8) providing a contrasting highlight for interactive elements.
- Body and headline font: 'Inter', a grotesque-style sans-serif offering a modern and neutral aesthetic suitable for both headlines and body text.
- Code font: 'Source Code Pro' for displaying code snippets clearly.
- Use minimal and clear icons to represent actions and settings. Consider using icons from a library like Feather or Material Icons.
- Subtle animations for transitions between screens and actions like message sending/receiving to enhance the user experience.