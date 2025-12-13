# Expo Updates Commands Quick Reference

## Initial Setup (One Time)
```bash
# Build production APK with updates enabled
eas build --platform android --profile production

# Build preview APK for testing
eas build --platform android --profile preview
```

## Publishing Updates (JavaScript Changes Only)

### Development Updates
```bash
eas update --branch development --message "Development update description"
```

### Preview Updates (for testing)
```bash
eas update --branch preview --message "Preview update for testing"
```

### Production Updates (for customers)
```bash
eas update --branch production --message "Fix bonus refresh and performance improvements"
```

## Monitoring Updates

### List all updates
```bash
eas update:list --branch production
```

### View specific update details
```bash
eas update:view [UPDATE_ID]
```

### Check build status
```bash
eas build:list --platform android
```

## Rollback (if needed)
```bash
# Rollback to previous stable version
eas update --branch production --message "Rollback to stable version" --republish
```

## Typical Workflow

1. **Make your code changes** (like the ProfileScreen bonus refresh fix)
2. **Test locally** with `npm start`
3. **Publish update**: `eas update --branch production --message "Auto-refresh bonus on profile screen"`
4. **Monitor adoption** in Expo dashboard
5. **All customers get the update automatically** within minutes

## When You Need New APK vs OTA Update

### OTA Update (No new APK needed):
- JavaScript/TypeScript code changes
- React component updates
- Styling changes
- API endpoint changes
- Business logic fixes

### New APK Required:
- Version number changes
- New native dependencies
- Permission changes
- App icon/splash screen changes
- Expo SDK upgrades

## Current Configuration
- **Production Channel**: `production`
- **Preview Channel**: `preview` 
- **Development Channel**: `development`
- **Runtime Version**: `1.1.4`
- **Update URL**: Configured automatically via EAS