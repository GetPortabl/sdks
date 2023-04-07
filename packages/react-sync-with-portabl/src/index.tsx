import React, { useRef, useEffect } from 'react';
import { createSyncWithPortabl } from '@portabl/js-sync-with-portabl';

interface SyncWithPortablProps {
  domain: string;
  audience: string;
  clientId: string;
  passportUrl: string;
  getPrereqs: () => Promise<{
    isSynced: boolean;
    datapoints: Array<Record<string, any>>;
  }>;
  onUserConsent: () => Promise<void>;
}

const SyncWithPortabl = ({
  domain,
  audience,
  clientId,
  passportUrl,
  getPrereqs,
  onUserConsent,
}: SyncWithPortablProps) => {
  const syncWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      if (syncWrapperRef.current) {
        const syncWithPortablElement = await createSyncWithPortabl({
          domain,
          audience,
          clientId,
          passportUrl,
          getPrereqs,
          onUserConsent,
        });

        syncWrapperRef.current.appendChild(syncWithPortablElement);
      }
    })();

    return () => {
      if (syncWrapperRef.current) {
        syncWrapperRef.current.innerHTML = '';
      }
    };
  }, [domain, audience, clientId, passportUrl]);

  return <div ref={syncWrapperRef} />;
};

export default SyncWithPortabl;
