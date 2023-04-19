import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import { Datapoints, Options } from './lib/types';
import { environments as defaultEnv } from './lib/environments';
import { fetchRetries, MAX_RETRIES } from './lib/fetchRetries';
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
  updateDescription,
  createErrorContainer,
} from './lib/syncElements';

export async function createSyncWithPortabl(options: Options): Promise<void> {
  const {
    env,
    envOverride,
    clientId,
    getPrereqs,
    onUserConsent,
    rootSelector,
  } = options;
  const environments = { ...defaultEnv, ...envOverride };
  const { domain, audience, passportUrl, syncAcceptUrl } = environments[env];

  let auth0Client: Auth0Client | null = null;
  let isPassportReady = false;
  let isSyncOn = false;
  let datapoints: Datapoints[] = [];

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

  const isAuthenticated = await auth0Client?.isAuthenticated();

  try {
    const prereqs = await fetchRetries(getPrereqs, MAX_RETRIES);
    isSyncOn = prereqs.isSyncOn;
    datapoints = prereqs.datapoints;
  } catch (error) {
    console.error('Error getting prerequisites:', error);
    const errorContainer = createErrorContainer();
    const rootNode = rootSelector
      ? document.querySelector(rootSelector)
      : document.body.appendChild(errorContainer);
    rootNode?.appendChild(errorContainer);
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

  if (isAuthenticated && isSyncOn) {
    syncButton.style.display = 'none';
    viewDataButton.style.display = 'block';
    updateHeader(header, true);
    updateDescription(description, true);
  } else {
    syncButton.style.display = 'block';
    viewDataButton.style.display = 'none';
  }

  syncButton.addEventListener('click', async () => {
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
  });

  window.addEventListener('message', async event => {
    switch (event.data.action) {
      case 'sync:acked': {
        if (event.origin !== passportUrl) return;
        const invitationUrl = await onUserConsent();
        await fetch(syncAcceptUrl, {
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
        updateDescription(description, true);
        break;
      }

      case 'sync:passport-ready': {
        isPassportReady = true;
        break;
      }

      case 'sync:passport-closed': {
        isPassportReady = false;
        modal.style.display = 'none';
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

  if (rootSelector) {
    const rootNode = document.querySelector(rootSelector);
    if (rootNode) {
      rootNode.appendChild(el);
    } else {
      console.warn('Root element not found. Appending to body.');
      document.body.appendChild(el);
    }
  } else {
    document.body.appendChild(el);
  }

  return undefined;
}
