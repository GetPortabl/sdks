import React, { useEffect, useRef } from 'react';
import { createSyncWithPortabl, Options } from '@portabl/js-sync-with-portabl';

const SyncWithPortabl = ({
  providerName,
  envOverride,
  clientId,
  getPrereqs,
  onUserConsent,
}: Options) => {
  const syncWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      if (syncWrapperRef.current) {
        await createSyncWithPortabl({
          providerName,
          envOverride,
          clientId,
          getPrereqs,
          onUserConsent,
        });
      }
    })();

    return () => {
      if (syncWrapperRef.current) {
        syncWrapperRef.current.remove();
      }
    };
  }, [clientId]);

  return <div ref={syncWrapperRef} />;
};

export default SyncWithPortabl;