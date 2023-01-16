export interface IKYCRegistrationAddressDetailsInput {
  readonly country?: string;
  readonly postalCode?: string;
  readonly region?: string;
  readonly locality?: string;
  readonly streetAddress?: string;
}

export interface IKYCRegistrationAddressDetails
  extends IKYCRegistrationAddressDetailsInput {
  readonly type: 'RegistrationAddressDetails';
}

export interface IKYCClaimsInput {
  readonly emailAddress?: string;
  readonly phoneNumber?: string;

  readonly firstName?: string;
  readonly middleName?: string;
  readonly lastName?: string;
  readonly honorificPrefix?: string;
  readonly honorificSuffix?: string;

  readonly birthDate?: string;
  readonly birthPlace?: string;

  readonly nationality?: string;

  readonly passportNumber?: string;

  readonly driverLicenseId?: string;

  readonly socialSecurityNumber?: string;

  readonly registrationAddressDetails?: IKYCRegistrationAddressDetailsInput;
}

export interface IKYCClaims extends IKYCClaimsInput {
  readonly type: 'vKYCCredential';
  readonly registrationAddressDetails?: IKYCRegistrationAddressDetails;
}
