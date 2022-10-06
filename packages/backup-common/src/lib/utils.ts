import jwtDecode from 'jwt-decode';
import backupError from './backupError';

import {
  REQUEST_OTP_ROUTE,
  API_SUBDOMAIN_BASE,
  ONBOARDING_SUBDOMAIN_BASE,
} from './constants';

export function createOnboardingUrl({
  accessToken,
  redirectUri,
  local: customOnboardingAppDomainUrl = null,
}: {
  accessToken: string;
  redirectUri: string;
  local?: string | null;
}) {
  const qsParams = [
    `providerAccessToken=${accessToken}`,
    `redirectUri=${redirectUri}`,
  ];
  const relativeUrl: string = `${REQUEST_OTP_ROUTE}?${qsParams.join('&')}`;

  if (customOnboardingAppDomainUrl) {
    return `${customOnboardingAppDomainUrl}${relativeUrl}`;
  }

  try {
    const { aud = '' } = jwtDecode<{ aud: string }>(accessToken);
    const onboardingAppDomainUrl = aud.replace(
      API_SUBDOMAIN_BASE,
      ONBOARDING_SUBDOMAIN_BASE,
    );
    return `${onboardingAppDomainUrl}${relativeUrl}`;
  } catch (e) {
    backupError('Invalid provider access token provided', e);
  }

  return '';
}
