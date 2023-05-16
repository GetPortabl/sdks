import { OutgoingPostMessageEvent } from './constants';

export interface IPostMessage {
  action: OutgoingPostMessageEvent;
  payload?: Record<string, any>;
}

interface IMessageQueueItem<TMessageType> {
  message: TMessageType;
  targetOrigin: string;
}

interface IPostMessageClientOptions {
  targetOrigin?: string;
}

export function createPostMessageClient<TMessageType extends IPostMessage>(
  iframeEl: HTMLIFrameElement,
  options: IPostMessageClientOptions,
) {
  const messageQueue: IMessageQueueItem<TMessageType>[] = [];

  const { targetOrigin: clientTargetOrigin = '*' } = options || {};
  let isIframeLoaded = false;

  const sendMessage = (message: TMessageType, targetOrigin?: string) => {
    if (isIframeLoaded && iframeEl && iframeEl.contentWindow?.postMessage) {
      iframeEl.contentWindow.postMessage(
        message,
        targetOrigin || clientTargetOrigin,
      );
    } else {
      messageQueue.push({
        message,
        targetOrigin: targetOrigin || clientTargetOrigin,
      });
    }
  };

  const setIframeToLoaded = () => {
    if (!isIframeLoaded) {
      isIframeLoaded = true;
      while (messageQueue.length > 0) {
        const messageQueueItem = messageQueue.shift();
        if (messageQueueItem) {
          const { message, targetOrigin } = messageQueueItem;
          sendMessage(message, targetOrigin);
        }
      }
    }
  };

  return { setIframeToLoaded, sendMessage };
}
