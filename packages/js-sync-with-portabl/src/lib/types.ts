export interface Options {
  env: 'local' | 'dev' | 'production';
  envOverride: {
    local: {
      domain: string;
      audience: string;
      passportUrl: string;
      syncAcceptUrl: string;
    };
  };
  clientId: string;
  rootSelector: string;
  getPrereqs: () => Promise<{
    isSyncOn: boolean;
    datapoints: Array<Record<string, any>>;
  }>;
  onUserConsent: () => Promise<void>;
}
