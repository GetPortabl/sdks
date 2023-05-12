import React, { useEffect, useRef } from 'react';
import { createSyncWithPortabl, Options } from '@portabl/js-sync-with-portabl';

const SyncWithPortabl = ({
  widgetBaseUrl,
  providerName,
  getSyncContext,
  prepareSync,
}: Options) => {
  const syncWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (syncWrapperRef.current) {
      createSyncWithPortabl({
        widgetBaseUrl,
        providerName,
        getSyncContext,
        prepareSync,
      });
    }

    return () => {
      if (syncWrapperRef.current) {
        syncWrapperRef.current.remove();
      }
    };
  }, [widgetBaseUrl, providerName, getSelection, prepareSync]);

  return <div ref={syncWrapperRef} />;
};

export default SyncWithPortabl;
