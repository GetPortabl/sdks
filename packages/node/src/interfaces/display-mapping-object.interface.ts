export type StringFormat =
  | 'date-time'
  | 'time'
  | 'date'
  | 'email'
  | 'idn-email'
  | 'hostname'
  | 'idn-hostname'
  | 'ipv4'
  | 'ipv6'
  | 'uri'
  | 'uri-reference'
  | 'iri'
  | 'iri-reference';

export type SchemaType =
  | {
      type: 'boolean' | 'number' | 'integer';
    }
  | {
      type: 'string';
      format?: StringFormat;
    };

export interface IDisplayMappingObjectWithPath {
  readonly path: Array<string>;
  readonly schema: SchemaType;
  readonly fallback?: string;
}

export interface IDisplayMappingObjectWithText {
  readonly text: string;
}

// https://identity.foundation/wallet-rendering/#display-mapping-object
export type DisplayMappingObjectType =
  | IDisplayMappingObjectWithPath
  | IDisplayMappingObjectWithText;

export interface ILabeledDisplayMappingObjectWithPath
  extends IDisplayMappingObjectWithPath {
  readonly label: string;
}

export interface ILabeledDisplayMappingObjectWithText
  extends IDisplayMappingObjectWithText {
  readonly label: string;
}

// https://identity.foundation/wallet-rendering/#labeled-display-mapping-object
export type LabeledDisplayMappingObjectType =
  | ILabeledDisplayMappingObjectWithPath
  | ILabeledDisplayMappingObjectWithText;
