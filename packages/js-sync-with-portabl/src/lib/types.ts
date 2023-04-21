export interface Options {
  providerName?: string;
  envOverride?: {
    domain: string;
    audience: string;
    passportUrl: string;
    syncAcceptUrl: string;
  };
  clientId: string;
  rootSelector?: string;
  getPrereqs: () => Promise<{
    isSyncOn: boolean;
    datapoints: Datapoints[];
  }>;
  onUserConsent: () => Promise<void>;
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
