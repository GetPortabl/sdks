export interface Options {
  env: 'local' | 'dev' | 'production';
  name?: string;
  clientId: string;
  getPrereqs: () => Promise<{
    isSyncOn: boolean;
    datapoints: Array<Record<string, any>>;
  }>;
  onUserConsent: () => Promise<void>;
}
