import { IKYCClaimsInput, IOutputDescriptor } from '../interfaces';
import { filterClaims } from './filter-claims.util';

const MOCK_CLAIMS: IKYCClaimsInput = {
  emailAddress: 'liz.lemon@30rock.com',
  phoneNumber: '+1',
  firstName: 'Liz',
  lastName: 'Lemon',
  birthDate: '1970-11-27',
  birthPlace: 'PENNSYLVANIA, USA',
  nationality: 'UNITED STATES OF AMERICA',
  socialSecurityNumber: '123-45-6789',
  registrationAddressDetails: {
    country: 'USA',
    region: 'New York',
    postalCode: '10024',
    locality: 'New York',
    streetAddress: '168 Riverside Drive, APT 2F',
  },
};

describe('filterClaims', () => {
  it('should return exact copy of passed claims', () => {
    const mockOutputDescriptors: Array<IOutputDescriptor> = [
      {
        display: {
          properties: [
            {
              path: [
                '$.credentialSubject.someOtherField',
                '$.credentialSubject.emailAddress',
              ],
              label: 'Email Address',
              schema: {
                type: 'string',
              },
            },
            {
              path: ['$.credentialSubject.phoneNumber'],
              label: 'Phone Number',
              schema: {
                type: 'string',
              },
            },
            {
              path: ['$.credentialSubject.firstName'],
              label: 'First Name',
              schema: {
                type: 'string',
              },
            },
            {
              path: ['$.credentialSubject.lastName'],
              label: 'Last Name',
              schema: {
                type: 'string',
              },
            },
            {
              path: ['$.credentialSubject.birthDate'],
              label: 'Birth Date',
              schema: {
                type: 'string',
              },
            },
            {
              path: ['$.credentialSubject.birthPlace'],
              label: 'Birth Place',
              schema: {
                type: 'string',
              },
            },
            {
              path: ['$.credentialSubject.nationality'],
              label: 'Nationality',
              schema: {
                type: 'string',
              },
            },
            {
              path: ['$.credentialSubject.socialSecurityNumber'],
              label: 'Social Security Number',
              schema: {
                type: 'string',
              },
            },
            {
              path: ['$.credentialSubject.registrationAddressDetails.country'],
              label: 'Country',
              schema: {
                type: 'string',
              },
            },
            {
              path: ['$.credentialSubject.registrationAddressDetails.region'],
              label: 'Region',
              schema: {
                type: 'string',
              },
            },
            {
              path: [
                '$.credentialSubject.registrationAddressDetails.postalCode',
              ],
              label: 'Postal Code',
              schema: {
                type: 'string',
              },
            },
            {
              path: ['$.credentialSubject.registrationAddressDetails.locality'],
              label: 'Locality',
              schema: {
                type: 'string',
              },
            },
            {
              path: [
                '$.credentialSubject.registrationAddressDetails.streetAddress',
              ],
              label: 'Street Address',
              schema: {
                type: 'string',
              },
            },
          ],
        },
      },
    ];

    const expected = MOCK_CLAIMS;
    const actual = filterClaims({
      claims: MOCK_CLAIMS,
      outputDescriptors: mockOutputDescriptors,
    });

    expect(actual).toEqual(expected);
  });

  it('should return only filtered claims', () => {
    const mockOutputDescriptors: Array<IOutputDescriptor> = [
      {
        display: {
          properties: [
            {
              path: ['$.credentialSubject.emailAddress'],
              label: 'Email Address',
              schema: {
                type: 'string',
              },
            },
            {
              path: ['$.credentialSubject.registrationAddressDetails.country'],
              label: 'Country',
              schema: {
                type: 'string',
              },
            },
          ],
        },
      },
    ];

    const expected = {
      emailAddress: MOCK_CLAIMS.emailAddress,
      registrationAddressDetails: {
        country: MOCK_CLAIMS.registrationAddressDetails?.country,
      },
    };

    const actual = filterClaims({
      claims: MOCK_CLAIMS,
      outputDescriptors: mockOutputDescriptors,
    });

    expect(actual).toEqual(expected);
  });
});
