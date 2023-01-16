import { VKYC_CREDENTIAL_VOCAB_TERM, REGISTRATION_ADDRESS_DETAILS_VOCAB_TERM } from '../constants';
import { IKYCClaims, IKYCClaimsInput } from '../interfaces';

export const setJsonldTypesForCredentialSubject = (
  claims: IKYCClaimsInput,
): IKYCClaims => {
  const { registrationAddressDetails, ...restClaims } = claims;

  return {
    ...restClaims,
    type: VKYC_CREDENTIAL_VOCAB_TERM,
    ...(registrationAddressDetails ? {
      registrationAddressDetails: {
        ...claims.registrationAddressDetails,
        type: REGISTRATION_ADDRESS_DETAILS_VOCAB_TERM,
      }
    } : {}),

  };
};
