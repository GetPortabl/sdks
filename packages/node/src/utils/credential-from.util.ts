import { v4 as uuid4 } from 'uuid';

import {
  URN_UUID_PREFIX,
  VC_VOCAB_URL,
  VERIFIABLE_CREDENTIAL_VOCAB_TERM,
} from '../constants';
import { IVerifiableCredential } from '../interfaces';
import { singularOrArray } from './singular-or-array.util';
import { toRFC3339 } from './to-rfc3999.util';

export const credentialFrom = (
  data: Partial<IVerifiableCredential>,
): IVerifiableCredential => {
  const {
    '@context': context,
    type,
    id,
    issuanceDate,
    evidence,
    ...restData
  } = data || {};

  return {
    '@context': singularOrArray({
      defaultValue: VC_VOCAB_URL,
      inputValue: context,
    }),
    type: singularOrArray({
      defaultValue: VERIFIABLE_CREDENTIAL_VOCAB_TERM,
      inputValue: type,
    }),
    id: id || URN_UUID_PREFIX + uuid4(),
    issuanceDate: issuanceDate || toRFC3339(new Date()),
    ...(Array.isArray(evidence) && evidence.length ? { evidence } : {}),
    ...restData,
  } as IVerifiableCredential;
};
