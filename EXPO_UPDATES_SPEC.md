# Expo Updates Implementation Spec for APK Distribution

## Overview
This spec outlines how to implement Expo Updates for live updates in a React Native Expo app that distributes APK files directly to customers, bypassing app stores.

## Current Setup Analysis
- **App**: manjacazianoBarbershop v1.1.4
- **Distribution**: APK files (not AAB)
- **Target**: Direct customer distribution
- **Build Config**: EAS Build with APK output
- **Current EAS Config**: Preview and Production builds configured for APK

## Implementation Strategy

### 1. Expo Updates Configuration

#### 1.1 Update app.json
Add Expo Updates configuration to enable over-the-air updates:

```json
{
  "expo": {
    "name": "manjacazianoBarbershop",
    "slug": "manjacazianoBarbershop",
    "version": "1.1.4",
    "runtimeVersion": "1.1.4",
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 5000,
      "url": "https://u.expo.dev/b5468461-a4cc-4e58-b8cd-1a678f1427c3"
    },
    // ... rest of config
  }
}
```

#### 1.2 Update eas.json
Modify build configuration to support updates:

```json
{
  "cli": {
    "version": ">= 2.6.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "distribution": "store",
      "channel": "production",
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 2. Update Workflow

#### 2.1 Binary Updates (Requires New APK)
When you need to update:
- Native dependencies
- App version
- Expo SDK version
- App permissions
- App icons/splash screens

**Process:**
1. Update version in app.json
2. Update runtimeVersion in app.json
3. Build new APK: `eas build --platform android --profile production`
4. Distribute new APK to customers

#### 2.2 Over-the-Air Updates (No APK needed)
When you need to update:
- JavaScript code
- React components
- Business logic
- Styling changes
- API endpoints

**Process:**
1. Make your changes
2. Publish update: `eas update --branch production --message "Fix bonus refresh issue"`
3. Updates automatically delivered to existing app installations

### 3. Implementation Steps

#### Step 1: Install Dependencies
```bash
npx expo install expo-updates
```

#### Step 2: Configure Updates in Code
Create update management utility:

```typescript
// src/utils/UpdateManager.ts
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

export class UpdateManager {
  static async checkForUpdates(): Promise<void> {
    try {
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();
        
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            'Atualização Disponível',
            'Uma nova versão foi baixada. Reinicie o app para aplicar.',
            [
              { text: 'Mais tarde', style: 'cancel' },
              { text: 'Reiniciar', onPress: () => Updates.reloadAsync() }
            ]
          );
        }
      }
    } catch (error) {
      console.log('Update check failed:', error);
    }
  }

  static async forceUpdate(): Promise<void> {
    try {
      if (!__DEV__) {
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.log('Force update failed:', error);
    }
  }
}
```

#### Step 3: Integrate Update Checks
Add to App.tsx or main component:

```typescript
// In App.tsx
import { UpdateManager } from './src/utils/UpdateManager';

export default function App() {
  useEffect(() => {
    // Check for updates on app start
    UpdateManager.checkForUpdates();
  }, []);

  // ... rest of app
}
```

#### Step 4: Update Build Configuration
Modify app.json and eas.json as specified above.

### 4. Distribution Strategy

#### 4.1 Initial APK Distribution
1. Build production APK: `eas build --platform android --profile production`
2. Download APK from EAS Build dashboard
3. Distribute APK to customers via your preferred method (WhatsApp, email, etc.)

#### 4.2 Subsequent Updates
For JavaScript-only changes:
1. Make changes to code
2. Test locally
3. Publish update: `eas update --branch production --message "Description of changes"`
4. Updates automatically delivered to all app installations

#### 4.3 Version Management
- **runtimeVersion**: Change when native code changes (requires new APK)
- **version**: App version shown to users
- **Update message**: Descriptive message for tracking changes

### 5. Testing Strategy

#### 5.1 Development Testing
```bash
# Test updates in development
eas update --branch development --message "Test update"
```

#### 5.2 Preview Testing
```bash
# Test with preview build
eas build --platform android --profile preview
eas update --branch preview --message "Preview test"
```

#### 5.3 Production Rollout
```bash
# Production update
eas update --branch production --message "Production update"
```

### 6. Monitoring and Rollback

#### 6.1 Update Monitoring
- Monitor update adoption in Expo dashboard
- Track crash reports after updates
- Monitor user feedback

#### 6.2 Rollback Strategy
If an update causes issues:
```bash
# Rollback to previous update
eas update --branch production --message "Rollback to stable version" --republish
```

### 7. Customer Communication

#### 7.1 Initial Setup Communication
Inform customers that:
- App will automatically receive updates
- No need to download new APK for most updates
- App may prompt to restart for updates

#### 7.2 Update Notifications
Consider adding in-app update notifications:
- Show update available message
- Allow users to choose when to apply updates
- Provide update changelog

### 8. Best Practices

#### 8.1 Update Frequency
- Critical fixes: Immediate updates
- Feature updates: Weekly/bi-weekly
- Major changes: Monthly with new APK

#### 8.2 Testing Before Updates
- Always test updates thoroughly
- Use preview channel for testing
- Have rollback plan ready

#### 8.3 Update Size Optimization
- Keep updates small and focused
- Avoid large asset changes in OTA updates
- Use code splitting for large features

### 9. Implementation Timeline

#### Week 1: Setup
- Configure app.json and eas.json
- Install expo-updates
- Create UpdateManager utility

#### Week 2: Testing
- Test update flow in development
- Build preview APK with updates enabled
- Test OTA updates with preview build

#### Week 3: Production
- Build production APK with updates
- Distribute to select customers for testing
- Monitor update adoption

#### Week 4: Full Rollout
- Distribute to all customers
- Implement regular update schedule
- Monitor and optimize

### 10. Troubleshooting

#### Common Issues:
1. **Updates not downloading**: Check network connectivity and update URL
2. **App crashes after update**: Rollback and investigate compatibility
3. **Updates not applying**: Ensure app restart after download

#### Debug Commands:
```bash
# Check update status
eas update:list --branch production

# View update details
eas update:view [UPDATE_ID]

# Check build status
eas build:list --platform android
```

## Conclusion

This implementation will allow you to:
- Push quick fixes and feature updates without redistributing APK
- Maintain control over update timing and rollout
- Reduce customer friction for updates
- Keep the flexibility of APK distribution

The key advantage is that customers only need to install the APK once, and most subsequent updates will be delivered automatically over-the-air.