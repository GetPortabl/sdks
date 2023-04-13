import { useEffect } from 'react';
import { createSyncWithPortabl } from '@portabl/js-sync-with-portabl';

interface SyncWithPortablProps {
  env: 'dev' | 'production';
  envOverride?: {
    local: {
      domain: string;
      audience: string;
      passportUrl: string;
      syncAcceptUrl: string;
    };
  };
  rootSelector?: string;
  clientId: string;
  getPrereqs: () => Promise<{
    isSyncOn: boolean;
    datapoints: Array<Record<string, any>>;
  }>;
  onUserConsent: () => Promise<void>;
}

const SyncWithPortabl = ({
  env,
  envOverride,
  rootSelector,
  clientId,
  getPrereqs,
  onUserConsent,
}: SyncWithPortablProps) => {
  useEffect(() => {
    (async () => {
      await createSyncWithPortabl({
        env,
        envOverride,
        rootSelector,
        clientId,
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
  }, [env, rootSelector, clientId]);

  return null;
};

export default SyncWithPortabl;
