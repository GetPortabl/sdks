import React, { useEffect, useMemo, useState } from 'react';
import {
  Options,
  ATTRIBUTES,
  createOnboardingUrl,
} from '@portabl/backup-common';
import { Pressable, Image, View, Linking } from 'react-native';
import { styles } from './styles';

const BackupWithPortabl = ({
  redirectUri,
  prepareBackup,
  loadBackupData,
  local = null,
}: Options) => {
  const [accessToken, setAccessToken] = useState<string | null>();

  useEffect(() => {
    if (!accessToken) {
      (async () => {
        const data = await prepareBackup();
        setAccessToken(data.accessToken);
      })();
    }
  }, [accessToken]);

  const url = useMemo(
    () =>
      accessToken
        ? createOnboardingUrl({ accessToken, redirectUri, local })
        : '',
    [accessToken, redirectUri, local],
  );

  const handleButtonClick = async () => {
    if (accessToken) {
      loadBackupData({ accessToken });
      await Linking.openURL(url);
    }
  };

  if (url) {
    return (
      <Pressable
        onPress={handleButtonClick}
        style={({ pressed }) => [
          pressed ? styles.buttonPressed : styles.button,
        ]}
      >
        {({ pressed }) => (
          <View style={styles.buttonContentWrapper}>
            <Image
              style={styles.connectImage}
              source={{
                uri: pressed
                  ? ATTRIBUTES.imagePressed
                  : ATTRIBUTES.imageDefault,
              }}
            />
          </View>
        )}
      </Pressable>
    );
  }

  return null;
};

export default BackupWithPortabl;
