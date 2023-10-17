import React, { useEffect, useRef } from 'react';
import { createSyncWithPortabl, Options } from '@portabl/js-sync-with-portabl';

const SyncWithPortabl = ({
  accountId,
  dataProfileVersion,
  getSyncContext,
  prepareSync,
  providerName,
  widgetBaseUrl,
}: Options) => {
  const portablSyncRootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (portablSyncRootRef.current) {
      createSyncWithPortabl({
        root: portablSyncRootRef.current,
        accountId,
        dataProfileVersion,
        getSyncContext,
        prepareSync,
        widgetBaseUrl,
      });
    }
  }, [
    accountId,
    dataProfileVersion,
    getSyncContext,
    prepareSync,
    providerName,
    widgetBaseUrl,
  ]);

  return <div ref={portablSyncRootRef} />;
};

export default SyncWithPortabl;
