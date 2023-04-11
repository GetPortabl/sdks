export const environments = {
  local: {
    domain: 'https://dev-auth.getportabl.com',
    audience: 'https://dev-api.getportabl.com',
    passportUrl: 'https://local-my.getportabl.com:3004',
    syncAcceptUrl: (name: string) =>
      `https://portabl-${name}-api.ngrok.io/api/v1/consumer/sync/accept`,
  },
  dev: {
    domain: 'https://dev-auth.getportabl.com',
    audience: 'https://dev-api.getportabl.com',
    passportUrl: 'https://dev-my.getportabl.com',
    syncAcceptUrl: 'https://dev-api.getportabl.com/api/v1/consumer/sync/accept',
  },
  production: {
    domain: 'https://auth.getportabl.com',
    audience: 'https://api.getportabl.com',
    passportUrl: 'https://my.getportabl.com',
    syncAcceptUrl: 'https://api.getportabl.com/api/v1/consumer/sync/accept',
  },
};
