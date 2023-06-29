export interface IConnectClientOptions {
  accountId: string;
  connectDomain: string;
  walletDomain: string;
}

export interface IVPToken {
  proof: {
    challenge: string;
  };
}

export type GetResponseDataResponse = {
  id_token: string;
  vp_token: IVPToken;
};

export type GetAccessTokenResponse = {
  access_token: string;
};

export type CreateTransactionResponse = {
  authRequestUri: string;
  transactionId: string;
  nonce: string;
  state: string;
};
