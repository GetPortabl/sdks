import React, { useState } from 'react';
import ConnectWithPortabl from '@portabl/react-connect-with-portabl';
import BackupWithPortabl from '@portabl/react-backup-with-portabl';

const ReactPage = () => {
  const options = {
    externalOnboardingId: 'onboardingId',
    apiKey: 'apiKey',
    credManifestId: 'credManifestId',
  };
  const [providerAccessToken, setProviderAccessToken] = useState<string>('');

  const loadBackupData = () => {};
  const prepareBackup = async () => ({ accessToken: providerAccessToken });

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
      <BackupWithPortabl
        key={`provider:${providerAccessToken}`}
        prepareBackup={prepareBackup}
        loadBackupData={loadBackupData}
        redirectUri="bank.trust"
      />
      <ConnectWithPortabl {...options} />
    </div>
  );
};

export default ReactPage;
