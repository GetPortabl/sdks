import { EnvType } from '../types/env.type';
import {
  HTTPS,
  PORTABL_API_DOMAIN,
  PORTABL_API_SUBDOMAIN_BASE,
} from '../constants/api.constants';
import { getErrMsg } from './get-error-messag.util';
import { ErrorMsgSubjectScenarioEnum } from '../enums/error-message-entity.enum';

export function audienceFromEnv(env: EnvType) {
  const envAudiences = {
    dev: `${HTTPS}://${env}-${PORTABL_API_SUBDOMAIN_BASE}.${PORTABL_API_DOMAIN}`,
    sandbox: `${HTTPS}://${env}-${PORTABL_API_SUBDOMAIN_BASE}.${PORTABL_API_DOMAIN}`,
    production: `${HTTPS}://${PORTABL_API_SUBDOMAIN_BASE}.${PORTABL_API_DOMAIN}`,
  };

  const audience = envAudiences[env];

  if (!audience) {
    const invalidEnvTypeErrMsg: string = getErrMsg({
      scenario: ErrorMsgSubjectScenarioEnum.InvalidEnvType,
    });
    console.error(invalidEnvTypeErrMsg, { env });
    throw new Error(invalidEnvTypeErrMsg);
  }

  return audience;
}
