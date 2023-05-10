import React, { useEffect, useRef } from 'react';
import { createSyncWithPortabl, Options } from '@portabl/js-sync-with-portabl';

const SyncWithPortabl = ({
  providerName,
  getPrereqs,
  onUserConsent,
}: Options) => {
  const syncWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (syncWrapperRef.current) {
      createSyncWithPortabl({
        providerName,
        getPrereqs,
        onUserConsent,
      });
    }

    return () => {
      if (syncWrapperRef.current) {
        syncWrapperRef.current.remove();
      }
    };
  }, [providerName, getPrereqs, onUserConsent]);

  return <div ref={syncWrapperRef} />;
};

export default SyncWithPortabl;
