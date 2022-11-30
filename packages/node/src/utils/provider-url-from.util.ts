import { API_VERSION_ROUTE, PROVIDER_ROUTE } from '../constants';

export const providerUrlFrom = (audience: string) =>
  `${audience}${API_VERSION_ROUTE}${PROVIDER_ROUTE}`;
