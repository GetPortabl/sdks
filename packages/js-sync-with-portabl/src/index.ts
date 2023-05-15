import {
  IframeWidgetClientMesssageType,
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
import { createPostMessageSenderClient } from './lib/createPostMessageSendClient';

// Define message handler outside of create function
// so that it can be referenced for removal of the previously
// attached event listener when reinitializing
let messageHandler: ({
  data,
}: {
  data: IncomingMessageDataType;
}) => Promise<void>;

export async function createSyncWithPortabl(options: Options): Promise<void> {
  const {
    widgetBaseUrl = 'https://widgets.getportabl.com',
    getSyncContext,
    prepareSync,
    rootSelector = DEFAULT_ROOT_SELECTOR,
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

  messageHandler = async ({ data }: { data: IncomingMessageDataType }) => {
    const { action } = data;
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

  modal.appendChild(iframeModal);
  const el = document.createElement('div');
  el.appendChild(container);
  el.appendChild(modal);

  const handleReset = (rootNode: Element) => {
    if (rootNode) {
      window.removeEventListener('message', messageHandler);
      if (rootNode.hasChildNodes()) {
        // eslint-disable-next-line no-param-reassign
        rootNode.innerHTML = '';
      }
    }
  };

  const initialize = () => {
    const rootNode = document.querySelector(rootSelector);
    if (rootNode) {
      handleReset(rootNode);
      rootNode.appendChild(el);
      window.addEventListener('message', messageHandler);
    } else {
      console.error('Root element not found. Appending to body.');
    }
  };

  initialize();

  return undefined;
}

export * from './lib/types';
