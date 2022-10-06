import { DIDCommProtocolEnum } from '../enums/did-comm-protocol.enum';
import { DIDCommProtocolMsgType } from '../enums/did-comm-message-type.type';
import { DIDCommGoalCodeEnum } from '../enums/did-comm-goal-code.enum';
import { DIDCommGoalEnum } from '../enums/did-comm-goal.enum';
import { DIDCommEvelopePackingMethodEnum } from '../enums/did-comm-evelope-packing-method.enum';

export interface IProtocolContext {
  readonly protocol: DIDCommProtocolEnum;
  readonly protocolMsgType: DIDCommProtocolMsgType;
}

export interface IGoalContext {
  readonly goal_code: DIDCommGoalCodeEnum;
  readonly goal?: DIDCommGoalEnum;
}

export interface IMessageContext {
  readonly messageId: string;
}

export interface IEnvelopeContext {
  readonly envelopePackingMethod: DIDCommEvelopePackingMethodEnum;
}

export interface ICreateDIDCommMessageRequestBodyDto {
  readonly protocol: IProtocolContext;
  readonly goal: IGoalContext;
  readonly message: IMessageContext;
  readonly envelope: IEnvelopeContext;
}
