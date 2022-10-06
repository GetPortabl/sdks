export function buildApiHeaders(args: {
  headers?: Record<string, any>;
  accessToken?: string;
}): Record<string, any> {
  const { headers, accessToken } = args;
  return {
    ...(headers || {}),
    ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
  };
}
