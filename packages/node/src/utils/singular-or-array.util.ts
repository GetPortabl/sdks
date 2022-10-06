export const singularOrArray = <T>(args: {
  defaultValue: T | Array<T>;
  inputValue: T | Array<T>;
}): T | Array<T> => {
  const { defaultValue, inputValue } = args;

  if (!!defaultValue && !inputValue) {
    return !Array.isArray(defaultValue) || defaultValue.length > 1
      ? defaultValue
      : defaultValue[0];
  }

  if (!defaultValue && !!inputValue) {
    return !Array.isArray(inputValue) || inputValue.length > 1
      ? inputValue
      : inputValue[0];
  }

  return [
    ...new Set([
      ...(Array.isArray(defaultValue) ? defaultValue : [defaultValue]),
      ...(Array.isArray(inputValue) ? inputValue : [inputValue]),
    ]),
  ];
};
