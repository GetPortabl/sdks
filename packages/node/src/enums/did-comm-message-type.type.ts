import {
  IssueCredentialProtocolMsgType,
  NotificationMsgType,
  OutOfBandProtocolMsgType,
  PresentProofMsgType,
  ReportProblemMsgType,
} from './did-comm-message-type.enum';

export type DIDCommProtocolMsgType =
  | OutOfBandProtocolMsgType
  | IssueCredentialProtocolMsgType
  | PresentProofMsgType
  | NotificationMsgType
  | ReportProblemMsgType;
