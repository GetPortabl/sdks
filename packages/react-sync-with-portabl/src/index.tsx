import { useEffect } from 'react';
import { createSyncWithPortabl, Options } from '@portabl/js-sync-with-portabl';

const SyncWithPortabl = ({
  providerName,
  envOverride,
  clientId,
  rootSelector,
  getPrereqs,
  onUserConsent,
}: Options) => {
  useEffect(() => {
    (async () => {
      await createSyncWithPortabl({
        providerName,
        envOverride,
        clientId,
        rootSelector,
        getPrereqs,
        onUserConsent,
      });
    })();

    return () => {
      const rootNode = document.getElementById(rootSelector || '');
      if (rootNode) {
        rootNode.remove();
      }
    };
  }, [rootSelector, clientId]);

  return null;
};

export default SyncWithPortabl;
