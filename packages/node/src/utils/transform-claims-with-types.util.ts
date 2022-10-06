import { VKYC_VOCAB_TERM } from '../constants';
import { IKYCClaims, IKYCClaimsInput } from '../interfaces';

export const transformClaimsWithTypes = (
  claims: IKYCClaimsInput,
): IKYCClaims => {
  const transformedClaims = {
    ...claims,
    type: VKYC_VOCAB_TERM,
  } as IKYCClaims;

  if (transformedClaims.registrationAddressDetails) {
    transformedClaims.registrationAddressDetails = {
      ...claims.registrationAddressDetails,
      type: 'RegistrationAddressDetails',
    };
  }

  return transformedClaims;
};
