import { Datapoints, Options } from './lib/types';
import { withRetries, MAX_RETRIES } from './lib/withRetries';
import {
  PREREQS_FAILED,
  PREREQS_SUCCESS,
  SYNC_ACCEPT_SUCCESS,
  SYNC_ACK,
  SYNC_PASSPORT_CLOSED,
  SYNC_PASSPORT_READY,
  SYNC_READY,
  SYNC_REQUEST_ACK,
  SYNC_REQUEST_ERROR,
  USER_AUTHENTICATED,
  WIDGET_READY,
} from './lib/constants';
import {
  createContainer,
  createModal,
  createIframe,
  createIframeWidget,
} from './lib/syncElements';

export async function createSyncWithPortabl(options: Options): Promise<void> {
  const {
    widgetBaseUrl = 'https://widgets.getportabl.com',
    getPrereqs,
    onUserConsent,
    rootSelector,
    providerName,
  } = options;

  let isWidgetReady = false;
  let isSyncOn = false;
  let datapoints: Datapoints[] = [];

  const iframeWidget = createIframeWidget(`${widgetBaseUrl}/sync-widget`);
  const modal = createModal();
  const iframe = createIframe(`${widgetBaseUrl}/sync-modal`);
  const container = createContainer(iframeWidget);

  try {
    const prereqs = await withRetries(getPrereqs, MAX_RETRIES);

    isSyncOn = prereqs.isSyncOn;
    datapoints = prereqs.datapoints;
    if (isWidgetReady) {
      iframeWidget.contentWindow?.postMessage(
        {
          action: PREREQS_SUCCESS,
          payload: {
            isSyncOn,
          },
        },
        '*',
      );
      container.style.display = 'flex';
    }
  } catch (error) {
    console.error('Error getting prerequisites:', error);

    iframeWidget.contentWindow?.postMessage(
      {
        action: PREREQS_FAILED,
      },
      '*',
    );
  }

  window.addEventListener('message', async event => {
    switch (event.data.action) {
      case WIDGET_READY: {
        isWidgetReady = true;
        if (datapoints.length) {
          iframeWidget.contentWindow?.postMessage(
            {
              action: PREREQS_SUCCESS,
              payload: {
                isSyncOn,
              },
            },
            '*',
          );
        } else {
          iframeWidget.contentWindow?.postMessage(
            {
              action: PREREQS_FAILED,
            },
            '*',
          );
        }
        container.style.display = 'flex';

        break;
      }
      case SYNC_READY: {
        modal.style.display = 'flex';

        break;
      }
      case SYNC_ACK: {
        if (event.origin !== widgetBaseUrl) return;

        try {
          const { invitationUrl, isConnected } = await withRetries(
            onUserConsent,
            MAX_RETRIES,
          );

          // if (isConnected === false) {
          iframeWidget.contentWindow?.postMessage(
            {
              action: SYNC_ACK,
              payload: {
                invitationUrl,
              },
            },
            '*',
          );
          // } else {
          //   modal.style.display = 'none';
          // }

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
      case SYNC_ACCEPT_SUCCESS: {
        modal.style.display = 'none';
        break;
      }

      case SYNC_PASSPORT_READY: {
        break;
      }
      case USER_AUTHENTICATED: {
        iframe.contentWindow?.postMessage(
          {
            action: SYNC_REQUEST_ACK,
            payload: datapoints.map((x: any) => x.kind),
          },
          '*',
        );
        break;
      }
      case SYNC_PASSPORT_CLOSED: {
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

export * from './lib/types';
