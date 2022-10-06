// https://stackoverflow.com/questions/56079929/regex-for-validating-correct-iso8601-date-string
export const ISO_8601_DATE_TIME_REGEX =
  /(\d{4}-\d{2}-\d{2})[A-Z]+(\d{2}:\d{2}:\d{2}).([0-9+-:]+)/;
export const ISO_8601_TIME_REGEX = /(\d{2}:\d{2}:\d{2}).([0-9+-:]+)/;
export const ISO_8601_DATE_REGEX = /(\d{4}-\d{2}-\d{2})/;
