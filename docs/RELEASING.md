# Release Checklist 📋

Follow this checklist every time you want to release a new version of the Mental Health Tracker app.

## Pre-Release

- [ ] All features tested and working
- [ ] No critical bugs
- [ ] Updated dependencies (if needed)
- [ ] Reviewed recent commits

## Version Update

1. **Update version in `android/app/build.gradle`:**

   ```gradle
   defaultConfig {
       versionCode 2        // ← Increment this (must increase)
       versionName "1.0.1"  // ← Update this (semantic versioning)
   }
   ```

2. **Update version in `package.json`:**

   ```json
   {
     "version": "1.0.1"
   }
   ```

3. **Update CHANGELOG.md** (create if it doesn't exist):

   ```markdown
   ## [1.0.1] - 2024-01-15

   ### Added
   - New feature X

   ### Fixed
   - Bug Y
   - Issue Z

   ### Changed
   - Improved performance of ABC
   ```

## Create Release

1. **Commit version changes:**

   ```bash
   git add .
   git commit -m "Bump version to 1.0.1"
   git push origin main
   ```

2. **Create and push tag:**

   ```bash
   git tag -a v1.0.1 -m "Release version 1.0.1"
   git push origin v1.0.1
   ```

3. **Wait for GitHub Actions:**
   - Go to **Actions** tab on GitHub
   - Watch the **Android Release** workflow
   - Usually takes 5-10 minutes

4. **Verify Release:**
   - Go to **Releases** page
   - Check that v1.0.1 appears
   - Download the APK
   - Test install on a device

## Post-Release

- [ ] Test the released APK on a real device
- [ ] Verify all core features work
- [ ] Share release with testers/users
- [ ] Monitor for any crash reports

## Hotfix Release

If you need to quickly fix a critical bug:

1. Create a hotfix branch:
   ```bash
   git checkout -b hotfix/1.0.2
   ```

2. Make the fix and commit

3. Update version to 1.0.2

4. Merge to main:
   ```bash
   git checkout main
   git merge hotfix/1.0.2
   ```

5. Tag and release:
   ```bash
   git tag v1.0.2
   git push origin v1.0.2
   ```

## Version Numbering Guide

Follow Semantic Versioning (semver.org):

**Format:** MAJOR.MINOR.PATCH (e.g., 1.2.3)

- **MAJOR (1.x.x)** - Breaking changes, major rewrites
  - Example: Complete UI redesign, data format changes

- **MINOR (x.1.x)** - New features, no breaking changes
  - Example: Add export to PDF, new visualization chart

- **PATCH (x.x.1)** - Bug fixes, small improvements
  - Example: Fix crash, improve notification timing

**Examples:**
- `1.0.0` - Initial release
- `1.0.1` - Fixed notification bug
- `1.1.0` - Added mood journal feature
- `2.0.0` - Redesigned app with new database

## Emergency Rollback

If a release has critical issues:

1. **Unpublish the release:**
   - Go to Releases on GitHub
   - Edit the problematic release
   - Check "Set as a pre-release"
   - Or delete it entirely

2. **Notify users:**
   - If people downloaded it, post an update
   - Recommend rolling back to previous version

3. **Fix and re-release:**
   - Create hotfix branch
   - Fix the issue
   - Release as new patch version

## Tips

- **Test before releasing:** Always test the APK before sharing widely
- **Keep changelog updated:** Users appreciate knowing what changed
- **Batch changes:** Don't release for every tiny change
- **Communicate:** Let users know about important updates
- **Backup keystores:** Keep your release keystore safe!

## Automated vs Manual

| Aspect | Automated (GitHub Actions) | Manual (Local Build) |
|--------|---------------------------|---------------------|
| Speed | 5-10 minutes | 1-2 minutes |
| Setup | Initial setup required | No setup |
| Consistency | Always same environment | Depends on your machine |
| Signing | Uses GitHub secrets | Uses local keystore |
| Best for | Official releases | Quick testing |

Use GitHub Actions for official releases, local builds for testing.

---

Happy releasing! 🚀
