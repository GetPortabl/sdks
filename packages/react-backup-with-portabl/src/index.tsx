import React, { useEffect, useMemo, useState } from 'react';
import {
  ATTRIBUTES,
  createOnboardingUrl,
  ROOT_ELEMENT_ID,
  styles,
} from '@portabl/backup-common';

const BackupWithPortabl = ({
  redirectUri,
  prepareBackup,
  loadBackupData,
  local = null,
}: {
  prepareBackup: () => Promise<{ accessToken: string }>;
  loadBackupData: ({ accessToken }: { accessToken: string }) => void;
  redirectUri: string;
  local?: string | null;
}) => {
  const [accessToken, setAccessToken] = useState<string | null>();

  useEffect(() => {
    if (!accessToken) {
      (async () => {
        const data = await prepareBackup();
        setAccessToken(data.accessToken);
      })();
    }
  }, [accessToken]);

  const handleButtonClick = async () => {
    if (accessToken) {
      loadBackupData({ accessToken });
    }
  };

  const url = useMemo(
    () =>
      accessToken
        ? createOnboardingUrl({ accessToken, redirectUri, local })
        : '',
    [accessToken, redirectUri, local],
  );

  return (
    <div className={styles['portabl-backup-root']} id={ROOT_ELEMENT_ID}>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          role="button"
          onClick={handleButtonClick}
        >
          <div
            className={ATTRIBUTES.imageWrapperClassName}
            role="img"
            aria-label={ATTRIBUTES.ariaLabel}
          />
        </a>
      )}
    </div>
  );
};

export default BackupWithPortabl;
