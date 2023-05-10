export interface Options {
  providerName?: string;
  rootSelector?: string;
  widgetBaseUrl?: string;
  getPrereqs: () => Promise<{
    isSyncOn: boolean;
    datapoints: Datapoints[];
  }>;
  onUserConsent: () => Promise<{
    isConnected: boolean;
    invitationUrl?: string;
  }>;
}

export interface Datapoints {
  id: string;
  kind: string;
  group: string;
  label: string;
  jsonPathArray: string[];
  jsonSchema: {
    type: string;
  };
  evidenceOptionality?: string;
}
