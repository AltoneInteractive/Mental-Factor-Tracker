# Changelog

All notable changes to the Mental Health Tracker app will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-12-09

### Added
- Initial release of Mental Health Tracker
- Daily check-in with 4 mental health factors:
  - Stress level tracking
  - Mental darkness tracking
  - Sociality level tracking
  - Affection level tracking
- Interactive sliders for rating factors (0-10 scale)
- History screen with line charts showing trends
- Ability to view 7-day or 30-day trend charts
- Insights screen with automatic pattern detection:
  - Spiral detection (declining mental health)
  - Recovery detection (improving mental health)
  - Stable pattern recognition
  - Fluctuating pattern detection
- Streak counter to encourage daily check-ins
- Daily push notification reminders
- Customizable notification time in Settings
- Optional notes for each check-in entry
- Local data storage (AsyncStorage) - privacy first
- Bottom tab navigation with 4 main screens
- Clean, modern UI with color-coded factors
- Recent entries list showing last 10 check-ins
- Trend analytics with 7-day and 30-day averages
- GitHub Actions for automated APK builds
- CI/CD pipeline for releases

### Technical
- Built with React Native 0.73
- TypeScript for type safety
- React Navigation for tab navigation
- AsyncStorage for data persistence
- react-native-chart-kit for visualizations
- react-native-push-notification for reminders
- Android SDK 23-34 support
- Hermes JavaScript engine enabled

[Unreleased]: https://github.com/yourusername/Mental-Factor-Tracker/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/Mental-Factor-Tracker/releases/tag/v1.0.0
