import { IJsonWebMessage } from '../interfaces/json-web-message.interface';

export interface IJsonWebMessageModel {
  readonly jwm: IJsonWebMessage;
}

export interface ICreateDIDCommInvitationUrlResponseBodyDto {
  readonly invitationUrl: string;
}
