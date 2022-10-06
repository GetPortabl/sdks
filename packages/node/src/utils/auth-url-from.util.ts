import { API_VERSION_ROUTE, AUTH_ROUTE } from '../constants';

export const authUrlFrom = (audience: string) =>
  `${audience}${API_VERSION_ROUTE}${AUTH_ROUTE}`;
