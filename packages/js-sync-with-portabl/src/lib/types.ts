import {
  IncomingPostMessageEvent,
  OutgoingPostMessageEvent,
} from './constants';

export interface Options {
  providerName?: string;
  root?: string | HTMLDivElement;
  widgetBaseUrl?: string;
  accountId: string;
  dataProfileVersion?: string;
  getSyncContext: () => Promise<{
    isSyncOn: boolean;
    isSessionEstablished: boolean;
  }>;
  prepareSync: () => Promise<{
    isLinked: boolean;
    invitationUrl?: string;
  }>;
}

export type IframeModalClientMessageType =
  | {
      action: OutgoingPostMessageEvent.SYNC_MODAL_CONTEXT_LOADED;
      payload: {
        isSyncOn: boolean;
        isSessionEstablished: boolean;
      };
    }
  | {
      action: OutgoingPostMessageEvent.SYNC_MODAL_ERROR;
      payload: {
        providerName?: string;
      };
    }
  | {
      action: OutgoingPostMessageEvent.SYNC_INVITATION_CREATED;
      payload: { invitationUrl: string };
    }
  | {
      action: OutgoingPostMessageEvent.SYNC_INVITATION_ERROR;
    };

export type IframeWidgetClientMessageType =
  | {
      action: OutgoingPostMessageEvent.SYNC_WIDGET_CONTEXT_LOADED;
      payload: {
        isSyncOn: boolean;
        isSessionEstablished: boolean;
      };
    }
  | {
      action: OutgoingPostMessageEvent.SYNC_WIDGET_ERROR;
      payload: {
        providerName?: string;
      };
    };

export type IncomingMessageDataType =
  | {
      action: IncomingPostMessageEvent.SYNC_CONSENTED;
    }
  | { action: IncomingPostMessageEvent.SYNC_WIDGET_READY }
  | { action: IncomingPostMessageEvent.SYNC_MODAL_READY }
  | { action: IncomingPostMessageEvent.SYNC_MODAL_OPEN }
  | { action: IncomingPostMessageEvent.SYNC_MODAL_CLOSED };
