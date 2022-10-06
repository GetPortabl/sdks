export interface IDIDCommThreadModel {
  readonly id: string;
  readonly [x: string]: any;
}

export interface IUpdateDIDCommThreadResponseBodyDto {
  readonly thread: IDIDCommThreadModel;
}
