import { API_VERSION_ROUTE } from '../constants';

export const agentUrlFrom = ({ audience }: { audience: string }) => `${audience}${API_VERSION_ROUTE}`;
