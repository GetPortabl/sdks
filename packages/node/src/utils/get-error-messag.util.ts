import {
  ERROR_MSG_TEMPLATE_MAP,
  ERROR_MSG_SUBJECT_ENTITY_LABEL_MAP,
  ERROR_MSG_SUBJECT_ENTITY_PLACEHOLDER,
  ERROR_MSG_MAP,
  ERROR_MSG_DEFAULT,
} from '../constants/error-message.constants';
import { ErrorMsgTemplateEnum } from '../enums/error-message-type.enum';
import {
  ErrorMsgSubjectEntityEnum,
  ErrorMsgSubjectScenarioEnum,
} from '../enums/error-message-entity.enum';

interface ITemplatedErrorMsgOpts {
  readonly template: ErrorMsgTemplateEnum;
  readonly entity: ErrorMsgSubjectEntityEnum;
}

interface ICustomErrorMsgOpts {
  readonly scenario: ErrorMsgSubjectScenarioEnum;
}

type ErrorMsgOptsType = ITemplatedErrorMsgOpts | ICustomErrorMsgOpts;

export function getErrMsg(opts: ErrorMsgOptsType): string {
  const { template: templateType, entity: subjectEntityType } =
    opts as ITemplatedErrorMsgOpts;
  const { scenario: subjectScenarioType } = opts as ICustomErrorMsgOpts;

  let errorMsg: string | undefined;

  if (subjectScenarioType) {
    errorMsg = ERROR_MSG_MAP.get(subjectScenarioType);
  }

  if (Boolean(templateType) && Boolean(subjectEntityType)) {
    const errorMsgTemplate = ERROR_MSG_TEMPLATE_MAP.get(templateType);

    const errorMsgSubjectLabel =
      ERROR_MSG_SUBJECT_ENTITY_LABEL_MAP.get(subjectEntityType);

    errorMsg = errorMsgTemplate?.replace(
      ERROR_MSG_SUBJECT_ENTITY_PLACEHOLDER,
      errorMsgSubjectLabel || '',
    );
  }

  return errorMsg || ERROR_MSG_DEFAULT;
}
