# Mental Health Tracker 🧠

A React Native mobile app to help you track your mental health factors over time. Monitor stress, mental darkness, sociality, and affection levels daily to better understand your emotional patterns and well-being.

## Features ✨

- **Daily Check-In**: Rate yourself on 4 key mental health factors (0-10 scale)
  - Stress levels
  - Mental darkness (heavy/dark thoughts)
  - Sociality (social connection)
  - Affection (love and care)

- **Data Visualization**: View your trends over time with interactive charts
- **Pattern Detection**: Automatically detect patterns like spiraling, recovery, or stability
- **Insights & Analytics**: Get trends, averages, and meaningful insights
- **Daily Reminders**: Customizable push notifications to remind you to check in
- **Streak Tracking**: Track your check-in streak to stay motivated
- **Local Storage**: All data stays on your device - privacy first

## Screenshots

(Coming soon - once you run the app, you'll see beautiful screens!)

## Prerequisites 📋

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn**
- **Android Studio** (for Android development)
  - Android SDK
  - Android Emulator or physical device
- **Java Development Kit (JDK)** 11 or higher

### For macOS users (iOS development):
- **Xcode** (latest version from App Store)
- **CocoaPods** (`sudo gem install cocoapods`)

## Installation 🚀

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Mental-Factor-Tracker.git
   cd Mental-Factor-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **For iOS (macOS only)**
   ```bash
   cd ios
   pod install
   cd ..
   ```

## Running the App 📱

### Android

1. **Start Metro bundler**
   ```bash
   npm start
   ```

2. **In a new terminal, run the Android app**
   ```bash
   npm run android
   ```

   Or use Android Studio:
   - Open `android` folder in Android Studio
   - Click "Run" (green play button)

### iOS (macOS only)

1. **Start Metro bundler**
   ```bash
   npm start
   ```

2. **In a new terminal, run the iOS app**
   ```bash
   npm run ios
   ```

   Or use Xcode:
   - Open `ios/MentalFactorTracker.xcworkspace` in Xcode
   - Select a simulator or device
   - Click "Run" (play button)

## Building for Production 🏗️

### Automated Builds (Recommended) 🤖

The easiest way to get release builds is through GitHub Actions:

1. **Quick Start (Debug Signing):**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
   GitHub Actions will automatically build and release the APK!

2. **Production Setup (Proper Signing):**
   - See [CI/CD Setup Guide](docs/CICD_SETUP.md) for complete instructions
   - One-time setup: Generate keystore and add to GitHub Secrets
   - Every release: Just push a tag and get signed APK + AAB

**Benefits:**
- Consistent builds every time
- No local setup needed
- Automatic releases on GitHub
- Both APK (for direct install) and AAB (for Play Store)

### Manual Builds (Local)

If you prefer to build locally:

#### Android APK

1. **Generate a release keystore** (first time only)
   ```bash
   cd android/app
   keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias release-key -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Build the APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

   The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

#### Android App Bundle (for Play Store)

```bash
cd android
./gradlew bundleRelease
```

The bundle will be at: `android/app/build/outputs/bundle/release/app-release.aab`

## Project Structure 📁

```
Mental-Factor-Tracker/
├── android/                 # Android native code
├── ios/                     # iOS native code (macOS only)
├── src/
│   ├── components/         # Reusable UI components
│   │   └── FactorSlider.tsx
│   ├── screens/           # Main app screens
│   │   ├── CheckInScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── InsightsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/          # Business logic & utilities
│   │   ├── storage.ts     # AsyncStorage wrapper
│   │   ├── analytics.ts   # Pattern detection & trends
│   │   └── notifications.ts
│   └── types/             # TypeScript type definitions
│       └── index.ts
├── App.tsx                # Root component with navigation
├── index.js              # App entry point
└── package.json          # Dependencies & scripts
```

## Troubleshooting 🔧

### Common Issues

**Metro bundler won't start**
```bash
npm start -- --reset-cache
```

**Android build fails**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**Notifications not working**
- Make sure you've granted notification permissions in device settings
- On Android 13+, notification permissions must be explicitly granted

**Charts not displaying**
- Make sure you have at least 2 check-in entries
- Try restarting the app

### Clear app data (development)
```bash
# Android
adb uninstall com.mentalfactortracker

# Then reinstall
npm run android
```

## Technologies Used 🛠️

- **React Native** - Mobile framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation library
- **AsyncStorage** - Local data persistence
- **react-native-chart-kit** - Data visualization
- **react-native-push-notification** - Local notifications
- **@react-native-community/slider** - Custom sliders

## Privacy 🔒

All your data is stored locally on your device. Nothing is sent to external servers. Your mental health data is completely private and under your control.

## Documentation 📚

- **[Quick Start Guide](QUICKSTART.md)** - Get up and running in minutes
- **[CI/CD Setup](docs/CICD_SETUP.md)** - Automated builds with GitHub Actions
- **[Release Guide](docs/RELEASING.md)** - How to create new releases

## Contributing 🤝

This is a personal mental health tracking tool, but if you have suggestions or improvements:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

All PRs automatically trigger build checks via GitHub Actions!

## License 📄

This project is open source and available under the MIT License.

## Support 💬

If you find this app helpful, please consider:
- Giving it a star ⭐ on GitHub
- Sharing it with others who might benefit
- Reporting bugs or suggesting features

## Disclaimer ⚠️

This app is a self-tracking tool and is not a substitute for professional mental health care. If you're experiencing severe mental health issues, please reach out to a mental health professional or crisis helpline.

**Crisis Resources:**
- National Suicide Prevention Lifeline (US): 988
- Crisis Text Line (US): Text HOME to 741741
- International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/

---

Built with ❤️ for mental health awareness
