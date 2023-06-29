export const createRandomString = () => {
  const charset =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.';
  let random = '';
  const randomValues = Array.from(
    window.crypto.getRandomValues(new Uint8Array(43)),
  );

  randomValues.forEach(v => {
    random += charset[v % charset.length];
  });

  return random;
};
