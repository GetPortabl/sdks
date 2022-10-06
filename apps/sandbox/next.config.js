const withTM = require('next-transpile-modules')([
  '@portabl/js-connect-with-portabl',
  '@portabl/react-connect-with-portabl',
]);

module.exports = withTM({
  reactStrictMode: true,
});
