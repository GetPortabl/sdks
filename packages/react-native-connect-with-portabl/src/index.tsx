import React from 'react';
import { Options, ATTRIBUTES, REDIRECT_ORIGIN } from '@portabl/connect-common';
import { Pressable, StyleSheet, Image, View } from 'react-native';

const buttonStyles = {
  display: 'flex' as const,
  width: '100%',
  padding: 13,
  backgroundColor: '#FFFFFF',
  boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.2)',
  border: '1px solid transparent',
  borderRadius: 5,
};

const textStyles = {
  textDecoration: 'none',
  color: 'black',
  fontFamily: 'Poppins',
  fontWeight: '600' as const,
  lineHeight: 13,
  fontSize: 13,
};

const connectImage = {
  width: 166,
  height: 20,
};

const syncImage = {
  width: 141,
  height: 20,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: buttonStyles,
  buttonPressed: {
    ...buttonStyles,
    backgroundColor: 'black',
  },
  text: textStyles,
  textPressed: {
    ...textStyles,
    color: 'white',
  },
  buttonContentWrapper: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row',
  },
  connectImage,
  syncImage,
});

const ConnectWithPortabl = ({
  apiKey,
  credManifestId,
  externalOnboardingId,
}: Options) => {
  const handleButtonPress = () => {
    const qsParams = [
      `apiKey=${apiKey}`,
      `credManifestId=${credManifestId}`,
      `externalOnboardingId=${externalOnboardingId}`,
    ];
    const qs = `?${qsParams.join('&')}`;

    const url = `${REDIRECT_ORIGIN}${qs}`;
    window.open(url, '_blank');
  };

  return (
    <Pressable
      onPress={handleButtonPress}
      style={({ pressed }) => [pressed ? styles.buttonPressed : styles.button]}
    >
      {({ pressed }) => (
        <View style={styles.buttonContentWrapper}>
          <Image
            style={styles.connectImage}
            source={{
              uri: pressed ? ATTRIBUTES.imagePressed : ATTRIBUTES.imageDefault,
            }}
          />
        </View>
      )}
    </Pressable>
  );
};

export default ConnectWithPortabl;
