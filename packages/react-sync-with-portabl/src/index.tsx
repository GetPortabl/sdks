import React, { useEffect, useRef } from 'react';
import { createSyncWithPortabl, Options } from '@portabl/js-sync-with-portabl';

const SyncWithPortabl = ({
  widgetBaseUrl,
  providerName,
  getPrereqs,
  onUserConsent,
}: Options) => {
  const syncWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (syncWrapperRef.current) {
      createSyncWithPortabl({
        widgetBaseUrl,
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
  }, [widgetBaseUrl, providerName, getPrereqs, onUserConsent]);

  return <div ref={syncWrapperRef} />;
};

export default SyncWithPortabl;
