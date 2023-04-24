import React, { useCallback } from 'react';
import { init as initConnect } from '@portabl/js-connect-with-portabl';

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
      </div>
    </div>
  );
};

export default VanillaPage;
