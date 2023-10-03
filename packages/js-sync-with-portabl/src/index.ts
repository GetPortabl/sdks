import {
  IframeModalClientMessageType,
  IframeWidgetClientMessageType,
  IncomingMessageDataType,
  Options,
} from './lib/types';
import { withRetries, MAX_RETRIES } from './lib/withRetries';
import {
  OutgoingPostMessageEvent,
  IncomingPostMessageEvent,
  DEFAULT_ROOT_SELECTOR,
} from './lib/constants';
import {
  createContainer,
  createModal,
  createIframeModal,
  createIframeWidget,
} from './lib/syncElements';
import { createPostMessageClient } from './lib/createPostMessageClient';

// Define message handler and rootNode outside of create function
// so that it can be referenced for removal when reinitializing
let messageHandler: (e: MessageEvent<IncomingMessageDataType>) => Promise<void>;
let rootNode: HTMLElement | null;

const handleReset = (
  previousRootNode: HTMLElement | null,
  previousMessageHandler: typeof messageHandler,
) => {
  // clean up any previously defined messageHandlers
  window.removeEventListener('message', previousMessageHandler);
  if (previousRootNode) {
    if (previousRootNode.hasChildNodes()) {
      // eslint-disable-next-line no-param-reassign
      while (previousRootNode.firstChild) {
        previousRootNode.firstChild.remove();
      }
    }
  }
};
export async function createSyncWithPortabl(options: Options): Promise<void> {
  const {
    widgetBaseUrl = 'https://widgets.getportabl.com',
    getSyncContext,
    prepareSync,
    root = DEFAULT_ROOT_SELECTOR,
    providerName,
    accountId,
  } = options;
  // Pass in previously defined rootNode and messageHandler if they exist and perform cleanup.
  handleReset(rootNode, messageHandler);
  rootNode = typeof root === 'string' ? document.querySelector(root) : root;

  const iframeWidget = createIframeWidget(
    `${widgetBaseUrl}/sync/${accountId}/widget`,
  );
  const iframeModal = createIframeModal(
    `${widgetBaseUrl}/sync/${accountId}/modal`,
  );
  const modal = createModal();
  const container = createContainer(iframeWidget);

  const iframeWidgetClient =
    createPostMessageClient<IframeWidgetClientMessageType>(iframeWidget, {
      targetOrigin: widgetBaseUrl,
    });

  const iframeModalClient =
    createPostMessageClient<IframeModalClientMessageType>(iframeModal, {
      targetOrigin: widgetBaseUrl,
    });

  const handleGetSyncContext = async () => {
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
      iframeModalClient.sendMessage({
        action: OutgoingPostMessageEvent.SYNC_MODAL_CONTEXT_LOADED,
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
        payload: {
          providerName,
        },
      });
    }
  };

  // Fire and forget fetching sync context in the main thread
  handleGetSyncContext();

  messageHandler = async ({ data }: MessageEvent<IncomingMessageDataType>) => {
    const { action } = data;
    switch (action) {
      case IncomingPostMessageEvent.SYNC_CONSENTED: {
        try {
          const { invitationUrl, isLinked } = await withRetries(
            prepareSync,
            MAX_RETRIES,
          );

          if (isLinked === false && invitationUrl) {
            iframeModalClient.sendMessage({
              action: OutgoingPostMessageEvent.SYNC_INVITATION_CREATED,
              payload: {
                invitationUrl,
              },
            });
          } else {
            modal.style.display = 'none';
          }
        } catch (err) {
          iframeModalClient.sendMessage({
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
      case IncomingPostMessageEvent.SYNC_MODAL_READY: {
        iframeModalClient.setIframeToLoaded();

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

  modal.appendChild(iframeModal);
  const el = document.createElement('div');
  el.appendChild(container);
  el.appendChild(modal);

  if (rootNode) {
    rootNode.appendChild(el);
    window.addEventListener('message', messageHandler);
  } else {
    console.error('Root element not found. Appending to body.');
  }

  return undefined;
}

export * from './lib/types';
