import {
  IncomingPostMessageEvent,
  OutgoingPostMessageEvent,
} from './constants';

export interface Options {
  providerName?: string;
  rootSelector?: string;
  widgetBaseUrl?: string;
  getSyncContext: () => Promise<{
    isSyncOn: boolean;
    isSessionEstablished: boolean;
    datapoints: string[];
    issuerDIDs: string[];
  }>;
  prepareSync: () => Promise<{
    isLinked: boolean;
    invitationUrl?: string;
  }>;
}

export type IframeWidgetClientMesssageType =
  | {
      action: OutgoingPostMessageEvent.SYNC_WIDGET_CONTEXT_LOADED;
      payload: {
        isSyncOn: boolean;
        isSessionEstablished: boolean;
        datapoints: string[];
        issuerDIDs: string[];
      };
    }
  | {
      action: OutgoingPostMessageEvent.SYNC_WIDGET_ERROR;
    }
  | {
      action: OutgoingPostMessageEvent.SYNC_INVITATION_CREATED;
      payload: { invitationUrl: string };
    }
  | {
      action: OutgoingPostMessageEvent.SYNC_INVITATION_ERROR;
    };

export type IncomingMessageDataType =
  | {
      action: IncomingPostMessageEvent.SYNC_CONSENTED;
    }
  | { action: IncomingPostMessageEvent.SYNC_WIDGET_READY }
  | { action: IncomingPostMessageEvent.SYNC_MODAL_OPEN }
  | { action: IncomingPostMessageEvent.SYNC_MODAL_CLOSED };
