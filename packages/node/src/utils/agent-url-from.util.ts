import { AGENT_ROUTE, API_VERSION_ROUTE } from '../constants';

export const agentUrlFrom = (audience: string, tenantId: string) =>
  `${audience}${API_VERSION_ROUTE}${AGENT_ROUTE}/${tenantId}`;
