# Quick Start Guide 🚀

Get your Mental Health Tracker app running in minutes!

## For Beginners 👋

If you're new to React Native, follow these steps:

### Step 1: Install Node.js
1. Go to https://nodejs.org/
2. Download and install the LTS version
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Android Studio
1. Download from https://developer.android.com/studio
2. During installation, make sure to install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)
3. Open Android Studio and go to:
   - Tools → SDK Manager → Install Android 13.0 (API 33)

### Step 3: Set up Environment Variables

**Windows:**
```powershell
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
```

**macOS/Linux:**
Add to `~/.bash_profile` or `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Step 4: Clone and Run

```bash
# Clone the repository
git clone https://github.com/yourusername/Mental-Factor-Tracker.git
cd Mental-Factor-Tracker

# Install dependencies
npm install

# Start the app on Android
npm run android
```

That's it! The app should open on your emulator or connected device.

## Using the App 📱

### First Time Setup

1. **Allow Notifications**: When prompted, allow notifications so you get daily reminders
2. **Do Your First Check-In**:
   - Rate each factor from 0-10
   - Higher stress/darkness = feeling worse
   - Higher sociality/affection = feeling better
3. **Set Your Reminder Time**: Go to Settings → Set your preferred reminder time

### Daily Usage

1. Open the app when you get your daily reminder
2. Take a moment to reflect on your day
3. Rate each factor honestly
4. Add notes if something significant happened
5. Check your History and Insights to spot patterns

### Understanding Your Data

- **History Tab**: See charts of your trends over time
- **Insights Tab**: Get automatic pattern detection
  - 🔥 Streak counter shows consistency
  - 📈 Trends show if things are improving
  - ⚠️ Alerts if you're spiraling
  - 🌟 Celebrates your recovery

## Tips for Best Results 💡

1. **Be Consistent**: Check in at the same time daily
2. **Be Honest**: The app is for you - accurate data helps you more
3. **Add Notes**: Jot down what might have influenced your ratings
4. **Review Weekly**: Look at your History tab once a week
5. **Share Insights**: Discuss patterns with a therapist or trusted friend

## Troubleshooting Common Issues 🔧

### "Command not found: npm"
You need to install Node.js (Step 1 above)

### "SDK location not found"
You need to set ANDROID_HOME environment variable (Step 3)

### "Unable to load script"
```bash
npm start -- --reset-cache
```

### App crashes on startup
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Notifications not showing
- Check Settings → Allow notifications
- On Android 13+, you must grant permission explicitly

## Building Your Own APK 📦

Want to share the app with friends?

```bash
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

Send this file to friends - they can install it directly!

## Need Help? 🆘

- Check the full [README.md](README.md) for detailed instructions
- Open an issue on GitHub
- Remember: This is a tracking tool, not medical advice

---

Happy tracking! Take care of your mental health 💙
