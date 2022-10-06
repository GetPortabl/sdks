export interface IImageDescriptor {
  readonly uri: string;
  readonly alt: string;
}

export interface IStyleObject {
  readonly color: string;
}

// https://identity.foundation/wallet-rendering/#entity-styles
export interface IEntityStyleDescriptor {
  readonly thumbnail?: IImageDescriptor;
  readonly hero?: IImageDescriptor;
  readonly background?: IStyleObject;
  readonly text?: IStyleObject;
}
