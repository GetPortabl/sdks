export interface IEvidence {
  readonly id: string;
  readonly type: string | Array<string>;
  readonly 'mime-type': string;
  readonly evidencedClaim?: string | Array<string>;
}
