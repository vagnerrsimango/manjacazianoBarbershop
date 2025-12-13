import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

export class UpdateManager {
  /**
   * Check for available updates and prompt user to apply them
   */
  static async checkForUpdates(): Promise<void> {
    try {
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();
        
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            'Atualização Disponível',
            'Uma nova versão foi baixada. Reinicie o app para aplicar as melhorias.',
            [
              { text: 'Mais tarde', style: 'cancel' },
              { text: 'Reiniciar Agora', onPress: () => Updates.reloadAsync() }
            ]
          );
        }
      }
    } catch (error) {
      console.log('Update check failed:', error);
    }
  }

  /**
   * Force reload the app to apply updates
   */
  static async forceUpdate(): Promise<void> {
    try {
      if (!__DEV__) {
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.log('Force update failed:', error);
    }
  }

  /**
   * Check for updates silently (no user prompt)
   */
  static async checkForUpdatesSilently(): Promise<boolean> {
    try {
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();
        
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          return true;
        }
      }
      return false;
    } catch (error) {
      console.log('Silent update check failed:', error);
      return false;
    }
  }

  /**
   * Get current update information
   */
  static async getCurrentUpdateInfo(): Promise<any> {
    try {
      if (!__DEV__) {
        const manifest = Updates.manifest;
        return manifest;
      }
      return null;
    } catch (error) {
      console.log('Failed to get update info:', error);
      return null;
    }
  }
}