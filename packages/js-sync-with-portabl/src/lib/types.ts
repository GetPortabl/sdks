export interface Options {
  env: 'dev' | 'production';
  envOverride?: {
    local: {
      domain: string;
      audience: string;
      passportUrl: string;
      syncAcceptUrl: string;
    };
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
