export enum OutOfBandProtocolMsgType {
  invitation = 'invitation',
}

export enum IssueCredentialProtocolMsgType {
  propose_credential = 'propose-credential',
  offer_credential = 'offer-credential',
  request_credential = 'request-credential',
  issue_credential = 'issue-credential',
}

export enum PresentProofMsgType {
  propose_presentation = 'propose-presentation',
  request_presentation = 'request-presentation',
  presentation = 'presentation',
}

export enum NotificationMsgType {
  ack = 'ack',
}

export enum ReportProblemMsgType {
  problem_report = 'problem-report',
}
