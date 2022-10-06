import React, { useCallback } from 'react';
import { init as initConnect } from '@portabl/js-connect-with-portabl';
import { init as initBackup } from '@portabl/js-backup-with-portabl';

const VanillaPage = () => {
  const portablClientRootRef = useCallback(node => {
    if (node !== null) {
      const isAlreadyLoaded = !node.innerHTML;
      if (isAlreadyLoaded) {
        initConnect({
          externalOnboardingId: 'onboardingId',
          apiKey: 'apiKey',
          credManifestId: 'credManifestId',
        });
      }
    }
  }, []);

  const portablBackupRootRef = useCallback(node => {
    if (node !== null) {
      const isAlreadyLoaded = !node.innerHTML;
      if (isAlreadyLoaded) {
        initBackup({
          prepareBackup: async () => ({ accessToken: 'testAccessToken' }),
          loadBackupData: () => {},
          redirectUri: 'https://some-url.com',
        });
      }
    }
  }, []);

  return (
    <div>
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
        <b>Connect with Portabl:</b>
        <div ref={portablClientRootRef} id="portabl-connect-root" />
        <br />
        <b>Backup with Portabl:</b>
        <div ref={portablBackupRootRef} id="portabl-backup-root" />
      </div>
    </div>
  );
};

export default VanillaPage;
