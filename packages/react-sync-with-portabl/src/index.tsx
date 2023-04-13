import React, { useRef, useEffect } from 'react';
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
  clientId,
  getPrereqs,
  onUserConsent,
}: SyncWithPortablProps) => {
  const syncWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      if (syncWrapperRef.current) {
        await createSyncWithPortabl({
          env,
          envOverride,
          clientId,
          getPrereqs,
          onUserConsent,
        });
      }
    })();

    return () => {
      if (syncWrapperRef.current) {
        syncWrapperRef.current.innerHTML = '';
      }
    };
  }, [env, clientId]);

  return <div ref={syncWrapperRef} />;
};

export default SyncWithPortabl;
