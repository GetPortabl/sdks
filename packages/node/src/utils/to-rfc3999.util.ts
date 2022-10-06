import {
  ISO_8601_DATE_REGEX,
  ISO_8601_DATE_TIME_REGEX,
} from '../constants/dates.constants';
import { ErrorMsgSubjectEntityEnum } from '../enums/error-message-entity.enum';
import { ErrorMsgTemplateEnum } from '../enums/error-message-type.enum';
import { getErrMsg } from './get-error-messag.util';

export const toRFC3339 = (date: Date | string): string => {
  if (date instanceof Date) {
    return `${(date as Date).toISOString().slice(0, 19)}Z`;
  }

  const isDateTimeString: boolean = ISO_8601_DATE_TIME_REGEX.test(
    date as string,
  );
  const isDateString: boolean = ISO_8601_DATE_REGEX.test(date as string);

  if (typeof date === 'string' && (isDateTimeString || isDateString)) {
    return `${new Date(date).toISOString().slice(0, 19)}Z`;
  }

  const argErrorMsg = getErrMsg({
    template: ErrorMsgTemplateEnum.ArgError,
    entity: ErrorMsgSubjectEntityEnum.Date,
  });
  console.error(argErrorMsg, { value: date, type: typeof date });
  throw new Error(argErrorMsg);
};
