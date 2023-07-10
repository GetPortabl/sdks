import { TRANSACTION_STORAGE_KEY_PREFIX } from './constants';
import { ClientStorage } from './storage';

export interface Transaction {
  nonce: string;
  state: string;
  transactionId: string;
  clientId: string;
}

export class TransactionManager {
  private transaction: Transaction | undefined;

  private storageKey: string;

  constructor(
    private storage: ClientStorage,
    private clientId: string,
    private cookieDomain?: string,
  ) {
    this.storageKey = `${TRANSACTION_STORAGE_KEY_PREFIX}.${this.clientId}`;
    this.transaction = this.storage.get(this.storageKey);
  }

  public create(transaction: Transaction) {
    this.transaction = transaction;

    this.storage.save(this.storageKey, transaction, {
      daysUntilExpire: 1,
      cookieDomain: this.cookieDomain,
    });
  }

  public get(): Transaction | undefined {
    return this.transaction;
  }

  public remove() {
    delete this.transaction;
    this.storage.remove(this.storageKey, {
      cookieDomain: this.cookieDomain,
    });
  }
}
