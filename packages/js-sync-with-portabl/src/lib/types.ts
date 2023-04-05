export interface Options {
  domain: string;
  audience: string;
  clientId: string;
  passportUrl: string;
  getPrereqs: () => Promise<{
    isSynced: boolean;
    datapoints: Array<Record<string, any>>;
  }>;

  onUserConsent: () => Promise<void>;
}
