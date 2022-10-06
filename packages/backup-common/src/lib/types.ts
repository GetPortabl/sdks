export interface Options {
  prepareBackup: () => Promise<{ accessToken: string }>;
  loadBackupData: ({ accessToken }: { accessToken: string }) => void;
  redirectUri: string;
  local?: string | null;
}
