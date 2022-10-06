import { ProofType } from '@sphereon/pex';

export type ILDPClaimFormatType = 'ldp' | 'ldp_vc' | 'ldp_vp';
export type IJWTClaimFormatType = 'jwt' | 'jwt_vc' | 'jwt_vp';

// legacy proof type for interop with mattr (see ProofType from @sphereon/pex@1.0.2)
export enum LegacyProofType {
  BbsBlsSignature2020 = 'BbsBlsSignature2020',
}

export interface ILDPFormatOptions {
  readonly proof_type: Array<LegacyProofType | ProofType | string>;
}

export type ClaimFormatType = ILDPClaimFormatType | IJWTClaimFormatType;

export type LDPClaimFormatObjectType = {
  [x in ILDPClaimFormatType]?: ILDPFormatOptions;
};

export type JWTClaimFormatObjectType = {
  [x in IJWTClaimFormatType]?: ILDPFormatOptions;
};

// https://identity.foundation/presentation-exchange/#claim-format-designations
export type ClaimFormatObjectType =
  | LDPClaimFormatObjectType
  | JWTClaimFormatObjectType;
