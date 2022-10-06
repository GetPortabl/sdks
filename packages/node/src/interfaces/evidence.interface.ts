export interface IEvidence {
  readonly id: string;
  readonly type: string | Array<string>;
  readonly evidencedClaim?: string | Array<string>;
}
