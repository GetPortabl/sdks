import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import ConnectWithPortabl from '@portabl/react-native-connect-with-portabl';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    margin: '0 auto',
  },
});

export default function App() {
  const connectWithPortablOptions = {
    externalOnboardingId: 'onboardingId',
    apiKey: 'apiKey',
    credManifestId: 'credManifestId',
  };

  const backupWithPortablOptions = {
    prepareBackup: async () => {
      return {
        accessToken: 'testAccessToken',
      };
    },
    loadBackupData: () => {},
    redirectUri: 'https://some-url.com',
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={{ width: 390 }}>
        <Text>Connect with Portabl:</Text>
        <ConnectWithPortabl {...connectWithPortablOptions} />
        <Text>Backup with Portabl:</Text>
        <BackupWithPortabl {...backupWithPortablOptions} />
      </View>
    </View>
  );
}
