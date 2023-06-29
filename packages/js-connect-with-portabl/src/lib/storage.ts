interface ClientStorageOptions {
  daysUntilExpire?: number;
  cookieDomain?: string;
}

export type ClientStorage = {
  get<T extends Object>(key: string): T | undefined;
  save(key: string, value: any, options?: ClientStorageOptions): void;
  remove(key: string, options?: ClientStorageOptions): void;
};

export const SessionStorage = {
  get<T extends Object>(key: string): T | undefined {
    if (typeof sessionStorage === 'undefined') {
      return undefined;
    }

    const value = sessionStorage.getItem(key);

    if (value == null) {
      return undefined;
    }

    return <T>JSON.parse(value);
  },

  save(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  },

  remove(key: string) {
    sessionStorage.removeItem(key);
  },
} as ClientStorage;
