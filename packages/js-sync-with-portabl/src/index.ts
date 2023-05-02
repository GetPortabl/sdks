import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import { Datapoints, Options } from './lib/types';
import { environments as defaultEnv } from './lib/environments';
import { withRetries, MAX_RETRIES } from './lib/withRetries';
import {
  SYNC_ACK,
  SYNC_PASSPORT_CLOSED,
  SYNC_PASSPORT_READY,
  SYNC_REQUEST_ACK,
  SYNC_REQUEST_ERROR,
} from './lib/constants';
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
    envOverride,
    clientId,
    getPrereqs,
    onUserConsent,
    rootSelector,
    providerName,
  } = options;
  const environments = {
    ...defaultEnv,
    ...envOverride,
  };
  const { domain, audience, passportUrl, syncAcceptUrl } = environments;

  let auth0Client: Auth0Client | null = null;
  let isPassportReady = false;
  let isSyncOn = false;
  let datapoints: Datapoints[] = [];

  try {
    auth0Client = await createAuth0Client({
      domain,
      clientId,
      authorizationParams: {
        audience,
        scope: 'sync:data openid',
        max_age: 0,
      },
    });
  } catch (error) {
    console.error('Error creating Auth0 client:', error);
    return Promise.reject(error);
  }

  const isAuthenticated = await auth0Client?.isAuthenticated();

  try {
    const prereqs = await withRetries(getPrereqs, MAX_RETRIES);
    isSyncOn = prereqs.isSyncOn;
    datapoints = prereqs.datapoints;
  } catch (error) {
    console.error('Error getting prerequisites:', error);
    const errorContainer = createErrorContainer(providerName);
    const rootNode = rootSelector ? document.querySelector(rootSelector) : null;

    if (rootNode) {
      rootNode.appendChild(errorContainer);
    } else {
      document.body.appendChild(errorContainer);
    }

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

  if (isSyncOn) {
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
          action: SYNC_REQUEST_ACK,
          payload: datapoints.map((x: any) => x.kind),
        },
        '*',
      );
    }
  });

  window.addEventListener('message', async event => {
    switch (event.data.action) {
      case SYNC_ACK: {
        if (event.origin !== passportUrl) return;

        try {
          const invitationUrl = await withRetries(onUserConsent, MAX_RETRIES);

          const onSyncAccept = async () => {
            await fetch(syncAcceptUrl, {
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${await auth0Client?.getTokenSilently()}`,
              },
              method: 'POST',
              body: JSON.stringify({
                invitationUrl,
              }),
            });
          };

          await withRetries(onSyncAccept, MAX_RETRIES);

          modal.style.display = 'none';
          syncButton.style.display = 'none';
          viewDataButton.style.display = 'block';
          updateHeader(header, true);
          updateDescription(description, true);
          break;
        } catch (err) {
          iframe.contentWindow?.postMessage(
            {
              action: SYNC_REQUEST_ERROR,
              payload: true,
            },
            '*',
          );
          break;
        }
      }

      case SYNC_PASSPORT_READY: {
        isPassportReady = true;
        break;
      }

      case SYNC_PASSPORT_CLOSED: {
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
      if (rootNode.hasChildNodes()) rootNode.innerHTML = '';
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

export * from './lib/types';
