import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import { Options } from './lib/types';
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
} from './lib/syncElements';

export async function createSyncWithPortabl(
  options: Options,
): Promise<HTMLElement> {
  const { domain, audience, clientId, passportUrl, getPrereqs, onUserConsent } =
    options;

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

  const isAuthenticated = await auth0Client.isAuthenticated();
  const { isSynced, datapoints } = await getPrereqs();

  const syncButton = createSyncButton();
  const viewDataButton = createViewDataButton();
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

  if (isAuthenticated && isSynced) {
    syncButton.style.display = 'none';
    viewDataButton.style.display = 'block';
  } else {
    syncButton.style.display = 'block';
    viewDataButton.style.display = 'none';
  }

  syncButton.addEventListener('click', async () => {
    if (!isAuthenticated) {
      await auth0Client?.loginWithPopup();
    }

    syncButton.style.display = 'none';
    modal.style.display = 'flex';

    if (isPassportReady) {
      iframe.contentWindow?.postMessage(
        {
          action: 'sync:request-ack',
          payload: datapoints.map((x: any) => x.kind),
        },
        '*',
      );
    }
  });

  window.addEventListener('message', async event => {
    switch (event.data.action) {
      case 'sync:acked': {
        if (event.origin !== passportUrl) return;
        await onUserConsent();
        modal.style.display = 'none';
        syncButton.style.display = 'none';
        viewDataButton.style.display = 'block';
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
