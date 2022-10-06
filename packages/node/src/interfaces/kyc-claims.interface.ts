export interface IKYCRegistrationAddressDetailsInput {
  country?: string;
  postalCode?: string;
  region?: string;
  locality?: string;
  streetAddress?: string;
}

export interface IKYCRegistrationAddressDetails
  extends IKYCRegistrationAddressDetailsInput {
  type: 'RegistrationAddressDetails';
}

export interface IKYCClaimsInput {
  emailAddress?: string;
  phoneNumber?: string;

  firstName?: string;
  middleName?: string;
  lastName?: string;
  honorificPrefix?: string;
  honorificSuffix?: string;

  birthDate?: string;
  birthPlace?: string;

  nationality?: string;

  socialSecurityNumber?: string;

  registrationAddressDetails?: IKYCRegistrationAddressDetailsInput;
}

export interface IKYCClaims extends IKYCClaimsInput {
  type: 'vKYC';
  registrationAddressDetails?: IKYCRegistrationAddressDetails;
}
