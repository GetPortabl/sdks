import { Options, REDIRECT_ORIGIN, ATTRIBUTES } from '@portabl/connect-common';

export default function createButton(options: Options) {
  const button = document.createElement('button');
  button.onclick = () => {
    const qsParams = [
      `apiKey=${options.apiKey}`,
      `credManifestId=${options.credManifestId}`,
      `externalOnboardingId=${options.externalOnboardingId}`,
    ];
    const qs = `?${qsParams.join('&')}`;

    const url = `${REDIRECT_ORIGIN}${qs}`;
    window.open(url, '_blank');
  };

  const portablLogoPngWrapper = document.createElement('div');
  portablLogoPngWrapper.className = ATTRIBUTES.imageWrapperClassName;
  portablLogoPngWrapper.ariaLabel = ATTRIBUTES.ariaLabel;
  portablLogoPngWrapper.setAttribute('role', 'image');
  button.append(portablLogoPngWrapper);

  return button;
}
