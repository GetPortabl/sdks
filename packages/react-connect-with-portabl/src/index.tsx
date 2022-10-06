import React from 'react';
import {
  Options,
  REDIRECT_ORIGIN,
  ATTRIBUTES,
  ROOT_ELEMENT_ID,
  styles,
} from '@portabl/connect-common';

const ConnectWithPortabl = ({
  apiKey,
  credManifestId,
  externalOnboardingId,
}: Options) => {
  const handleButtonClick = () => {
    const qsParams = [
      `apiKey=${apiKey}`,
      `credManifestId=${credManifestId}`,
      `externalOnboardingId=${externalOnboardingId}`,
    ];
    const qs = `?${qsParams.join('&')}`;

    const url = `${REDIRECT_ORIGIN}${qs}`;
    window.open(url, '_blank');
  };

  return (
    <div className={styles['portabl-connect-root']} id={ROOT_ELEMENT_ID}>
      <button onClick={handleButtonClick} type="button">
        <div
          className={ATTRIBUTES.imageWrapperClassName}
          role="img"
          aria-label={ATTRIBUTES.ariaLabel}
        />
      </button>
    </div>
  );
};

export default ConnectWithPortabl;
