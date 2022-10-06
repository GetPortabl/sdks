import {
  Options,
  ATTRIBUTES,
  createOnboardingUrl,
} from '@portabl/backup-common';

export default function createButton(options: Options) {
  const { loadBackupData, prepareBackup, redirectUri, local } = options;
  const linkButton = document.createElement('a');
  let accessToken: string = '';

  const portablLogoPngWrapper = document.createElement('div');
  portablLogoPngWrapper.className = ATTRIBUTES.imageWrapperClassName;
  portablLogoPngWrapper.ariaLabel = ATTRIBUTES.ariaLabel;
  portablLogoPngWrapper.setAttribute('role', 'image');
  linkButton.append(portablLogoPngWrapper);
  linkButton.setAttribute('target', '_blank');
  linkButton.setAttribute('rel', 'noreferrer');

  linkButton.onclick = () => {
    if (accessToken) {
      loadBackupData({ accessToken });
    }
  };

  prepareBackup().then(data => {
    if (data?.accessToken) {
      accessToken = data?.accessToken;
      const onboardingUrl = createOnboardingUrl({
        accessToken,
        redirectUri,
        local,
      });
      linkButton.setAttribute('href', onboardingUrl);
    }
  });

  return linkButton;
}
