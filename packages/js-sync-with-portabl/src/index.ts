import { IframeWidgetClientMesssageType, Options } from './lib/types';
import { withRetries, MAX_RETRIES } from './lib/withRetries';
import {
  OutgoingPostMessageEvent,
  IncomingPostMessageEvent,
} from './lib/constants';
import {
  createContainer,
  createModal,
  createIframeModal,
  createIframeWidget,
} from './lib/syncElements';
import { createPostMessageSenderClient } from './lib/createPostMessageSendClient';

export async function createSyncWithPortabl(options: Options): Promise<void> {
  const {
    widgetBaseUrl = 'https://widgets.getportabl.com',
    getSyncContext,
    prepareSync,
    rootSelector,
    // providerName,
  } = options;

  const iframeWidget = createIframeWidget(`${widgetBaseUrl}/sync-widget`);
  const modal = createModal();
  const iframeModal = createIframeModal(`${widgetBaseUrl}/sync-modal`);
  const container = createContainer(iframeWidget);

  const iframeWidgetClient =
    createPostMessageSenderClient<IframeWidgetClientMesssageType>(
      iframeWidget,
      { targetOrigin: widgetBaseUrl },
    );

  try {
    const syncContext = await withRetries(getSyncContext, MAX_RETRIES);
    const { isSessionEstablished, isSyncOn, datapoints, issuerDIDs } =
      syncContext || {};

    iframeWidgetClient.sendMessage({
      action: OutgoingPostMessageEvent.SYNC_WIDGET_CONTEXT_LOADED,
      payload: {
        isSyncOn,
        isSessionEstablished,
        datapoints,
        issuerDIDs,
      },
    });
  } catch (error) {
    console.error('Error getting sync context:', error);
    iframeWidgetClient.sendMessage({
      action: OutgoingPostMessageEvent.SYNC_WIDGET_ERROR,
    });
  }

  const handleIncomingMessage = async ({
    action,
  }:
    | {
        action: IncomingPostMessageEvent.SYNC_CONSENTED;
      }
    | { action: IncomingPostMessageEvent.SYNC_WIDGET_READY }
    | { action: IncomingPostMessageEvent.SYNC_MODAL_OPEN }
    | { action: IncomingPostMessageEvent.SYNC_MODAL_CLOSED }) => {
    switch (action) {
      case IncomingPostMessageEvent.SYNC_CONSENTED: {
        try {
          const { invitationUrl, isLinked } = await withRetries(
            prepareSync,
            MAX_RETRIES,
          );

          if (isLinked === false && invitationUrl) {
            iframeWidgetClient.sendMessage({
              action: OutgoingPostMessageEvent.SYNC_INVITATION_CREATED,
              payload: {
                invitationUrl,
              },
            });
          } else {
            modal.style.display = 'none';
          }
        } catch (err) {
          iframeWidgetClient.sendMessage({
            action: OutgoingPostMessageEvent.SYNC_INVITATION_ERROR,
          });
        }
        break;
      }
      case IncomingPostMessageEvent.SYNC_WIDGET_READY: {
        iframeWidgetClient.setIframeToLoaded();
        container.style.display = 'flex';

        break;
      }
      case IncomingPostMessageEvent.SYNC_MODAL_OPEN: {
        modal.style.display = 'flex';

        break;
      }
      case IncomingPostMessageEvent.SYNC_MODAL_CLOSED: {
        modal.style.display = 'none';

        break;
      }

      default:
        break;
    }
  };

  window.addEventListener('message', async event => {
    handleIncomingMessage(event.data);
  });

  modal.appendChild(iframeModal);
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
