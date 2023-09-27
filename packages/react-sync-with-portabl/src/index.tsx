import React, { useEffect, useRef } from 'react';
import { createSyncWithPortabl, Options } from '@portabl/js-sync-with-portabl';

const SyncWithPortabl = ({
  widgetBaseUrl,
  providerName,
  getSyncContext,
  prepareSync,
  accountId,
}: Options) => {
  const portablSyncRootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (portablSyncRootRef.current) {
      createSyncWithPortabl({
        root: portablSyncRootRef.current,
        widgetBaseUrl,
        getSyncContext,
        prepareSync,
        accountId,
      });
    }
  }, [widgetBaseUrl, providerName, getSyncContext, prepareSync]);

  return <div ref={portablSyncRootRef} />;
};

export default SyncWithPortabl;
