import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import { Options } from './lib/types';
import { environments } from './lib/environments';
import {
  createContainer,
  createHeader,
  createPortablLogo,
  createTooltip,
  createDescription,
  createSyncButton,
  createViewDataButton,
  createModal,
  createIframe,
  updateHeader,
} from './lib/syncElements';

export async function createSyncWithPortabl(
  options: Options,
): Promise<HTMLElement> {
  const { env, clientId, getPrereqs, onUserConsent, name } = options;
  const { domain, audience, passportUrl, syncAcceptUrl } = environments[env];

  let auth0Client: Auth0Client | null = null;
  let isPassportReady = false;

  try {
    auth0Client = await createAuth0Client({
      cacheLocation: 'localstorage',
      domain,
      clientId,
      authorizationParams: {
        audience,
      },
    });
  } catch (error) {
    console.error('Error creating Auth0 client:', error);
    return Promise.reject(error);
  }

  const syncButton = createSyncButton();
  const viewDataButton = createViewDataButton(passportUrl);
  const modal = createModal();
  const iframe = createIframe(`${passportUrl}/sync`);
  const description = createDescription();
  const tooltip = createTooltip();
  const portablLogo = createPortablLogo();
  const header = createHeader(portablLogo, tooltip);
  const container = createContainer(
    header,
    description,
    syncButton,
    viewDataButton,
  );

  syncButton.style.display = 'block';
  viewDataButton.style.display = 'none';

  syncButton.addEventListener('click', async () => {
    const isAuthenticated = await auth0Client?.isAuthenticated();
    const { isSyncOn, datapoints } = await getPrereqs();

    if (isAuthenticated && isSyncOn) {
      syncButton.style.display = 'none';
      viewDataButton.style.display = 'block';
      updateHeader(header, isSyncOn);
    } else {
      modal.style.display = 'flex';

      if (!isAuthenticated) {
        await auth0Client?.loginWithPopup();
      }

      if (isPassportReady) {
        iframe.contentWindow?.postMessage(
          {
            action: 'sync:request-ack',
            payload: datapoints.map((x: any) => x.kind),
          },
          '*',
        );
      }
    }
  });

  window.addEventListener('message', async event => {
    switch (event.data.action) {
      case 'sync:acked': {
        if (event.origin !== passportUrl) return;
        const invitationUrl = await onUserConsent();
        const syncAcceptUrlEndpoint =
          typeof syncAcceptUrl === 'function'
            ? syncAcceptUrl(name || '')
            : syncAcceptUrl;

        await fetch(syncAcceptUrlEndpoint, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${await auth0Client?.getTokenSilently()}`,
          },
          method: 'POST',
          body: JSON.stringify({ invitationUrl }),
        });

        modal.style.display = 'none';
        syncButton.style.display = 'none';
        viewDataButton.style.display = 'block';
        updateHeader(header, true);
        break;
      }

      case 'sync:passport-ready': {
        isPassportReady = true;
        break;
      }

      case 'sync:passport-closed': {
        isPassportReady = false;
        break;
      }

      default:
        break;
    }
  });

  modal.appendChild(iframe);
  const el = document.createElement('div');
  el.appendChild(container);
  el.appendChild(modal);
  return el;
}
