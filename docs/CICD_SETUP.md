# CI/CD Setup Guide 🚀

This guide will help you set up automated APK builds and releases using GitHub Actions.

## Overview

We have two GitHub Actions workflows:

1. **android-release.yml** - Builds and releases APK when you create a version tag
2. **android-build-pr.yml** - Builds debug APK on every push/PR to verify the build works

## Quick Start (Use Debug Signing)

The easiest way to get started is to use debug signing. This will work immediately without any setup:

1. Push a tag to GitHub:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. GitHub Actions will automatically build and create a release with the APK!

**Note:** Debug-signed APKs work perfectly for personal use and sharing with friends. However, you'll need proper release signing if you want to publish to the Google Play Store.

## Production Setup (Proper Release Signing)

For production releases or Play Store publishing, follow these steps:

### Step 1: Generate a Release Keystore

Run this command on your local machine:

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore \
  -alias release-key -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=Your Name, OU=Your Organization, O=Your Company, L=Your City, S=Your State, C=US"
```

You'll be prompted to create a password. **Remember this password!**

Example prompts:
- **Keystore password:** (choose a strong password, e.g., `MySecurePassword123`)
- **Re-enter:** (same password)
- **Key password:** (can be same as keystore password, or different)

### Step 2: Convert Keystore to Base64

```bash
# Linux/Mac
base64 release.keystore | tr -d '\n' > keystore.txt

# Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.keystore")) > keystore.txt
```

This creates a `keystore.txt` file with the base64-encoded keystore.

### Step 3: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these 4 secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `KEYSTORE_BASE64` | Contents of `keystore.txt` | (long base64 string) |
| `KEYSTORE_PASSWORD` | Your keystore password | `MySecurePassword123` |
| `KEY_ALIAS` | Key alias (from step 1) | `release-key` |
| `KEY_PASSWORD` | Key password (from step 1) | `MySecurePassword123` |

**IMPORTANT:** Never commit your keystore file or passwords to git!

### Step 4: Update .gitignore

Make sure these lines are in your `.gitignore` (already included):

```
*.keystore
!debug.keystore
keystore.properties
keystore.txt
```

### Step 5: Test the Setup

Create and push a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions will:
1. Build the app
2. Sign it with your release keystore
3. Create a GitHub Release
4. Attach the APK and AAB files

## Creating Releases

### Automatic Release (Recommended)

Just tag your commits with version numbers:

```bash
# Tag the current commit
git tag v1.0.1

# Push the tag
git push origin v1.0.1
```

GitHub Actions automatically builds and releases!

### Manual Release

1. Go to **Actions** tab in GitHub
2. Select **Android Release** workflow
3. Click **Run workflow**
4. Choose your branch
5. Click **Run**

## Version Numbering

Follow semantic versioning:
- `v1.0.0` - Major release
- `v1.0.1` - Bug fix
- `v1.1.0` - New features
- `v2.0.0` - Breaking changes

### Updating Version Code

Don't forget to update the version in `android/app/build.gradle`:

```gradle
defaultConfig {
    applicationId "com.mentalfactortracker"
    versionCode 2        // Increment this for each release
    versionName "1.0.1"  // Human-readable version
}
```

**Important:** Google Play requires `versionCode` to increase with each upload.

## Local Release Signing (Optional)

If you want to build signed APKs locally without GitHub Actions:

### Create keystore.properties

Create `android/keystore.properties`:

```properties
storeFile=app/release.keystore
storePassword=YourKeystorePassword
keyAlias=release-key
keyPassword=YourKeyPassword
```

**Don't commit this file!** (It's already in .gitignore)

### Build Locally

```bash
cd android
./gradlew assembleRelease
```

Your signed APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Workflow Triggers

### android-release.yml
- **Triggers on:** Tags matching `v*` (e.g., v1.0.0)
- **Also:** Can be manually triggered from GitHub Actions tab
- **Outputs:** Signed APK + AAB in GitHub Releases

### android-build-pr.yml
- **Triggers on:** Push to main/master, or PRs targeting these branches
- **Outputs:** Debug APK in workflow artifacts
- **Purpose:** Verify builds don't break

## Troubleshooting

### Build fails with "signing config not found"

Make sure you've added all 4 GitHub secrets correctly.

### "Keystore was tampered with" error

Your `KEYSTORE_PASSWORD` secret is incorrect.

### Build succeeds but APK won't install

This usually means the signing certificate changed. Uninstall the old version first:

```bash
adb uninstall com.mentalfactortracker
```

### How to update my signing key?

1. Generate a new keystore (Step 1)
2. Convert to base64 (Step 2)
3. Update the `KEYSTORE_BASE64` secret in GitHub
4. Increment the `versionCode` in build.gradle

### Workflow doesn't trigger on tag

Make sure you're pushing the tag:
```bash
git push origin v1.0.0
```

Not just creating it locally.

## Security Best Practices

✅ **DO:**
- Store keystore in GitHub Secrets
- Use strong passwords
- Keep a backup of your keystore in a secure location (password manager, encrypted drive)
- Use different passwords for keystore and key (optional but recommended)

❌ **DON'T:**
- Commit keystore files to git
- Share your keystore passwords
- Lose your keystore (you won't be able to update your Play Store app!)

## Publishing to Google Play Store

Once your workflow is set up:

1. Create a release tag (e.g., `v1.0.0`)
2. Download the `.aab` file from GitHub Releases
3. Go to Google Play Console
4. Upload the `.aab` file
5. Fill in store listing details
6. Submit for review

The `.aab` (Android App Bundle) is required for Play Store. The `.apk` is for direct installation.

## Advanced: Increment Version Automatically

Want to auto-increment version numbers? Add this to your workflow:

```yaml
- name: Bump version
  run: |
    VERSION_CODE=$(grep 'versionCode' android/app/build.gradle | awk '{print $2}')
    NEW_VERSION=$((VERSION_CODE + 1))
    sed -i "s/versionCode $VERSION_CODE/versionCode $NEW_VERSION/" android/app/build.gradle
    git config user.name "GitHub Actions"
    git config user.email "actions@github.com"
    git add android/app/build.gradle
    git commit -m "Bump version code to $NEW_VERSION"
    git push
```

---

## Summary

**For quick testing:**
- Just push a tag, get a debug-signed APK

**For production:**
1. Generate keystore
2. Add to GitHub Secrets
3. Push tags to trigger builds
4. Download from Releases

That's it! Your app will now build automatically on every release. 🎉
