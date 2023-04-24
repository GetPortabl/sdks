import React, { useState } from 'react';
import ConnectWithPortabl from '@portabl/react-connect-with-portabl';

const ReactPage = () => {
  const options = {
    externalOnboardingId: 'onboardingId',
    apiKey: 'apiKey',
    credManifestId: 'credManifestId',
  };
  const [providerAccessToken, setProviderAccessToken] = useState<string>('');

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        flexDirection: 'column',
        height: '100vh',
        width: 390,
        margin: '0 auto',
      }}
    >
      <input
        style={{ padding: 5, margin: 20 }}
        value={providerAccessToken}
        onChange={e => {
          setProviderAccessToken(e.target.value);
        }}
      />
      <ConnectWithPortabl {...options} />
    </div>
  );
};

export default ReactPage;
