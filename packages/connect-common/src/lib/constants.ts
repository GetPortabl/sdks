import ConnectWithPortablImgWhiteText from '../assets/images/connect-with-portabl-white-text.svg';
import ConnectWithPortablImgBlackText from '../assets/images/connect-with-portabl-black-text.svg';
import styles from '../assets/styles.css';

export const ROOT_ELEMENT_ID = 'portabl-connect-root';
export const ROOT_ELEMENT_SELECTOR = `#${ROOT_ELEMENT_ID}`;

export const REDIRECT_ORIGIN =
  'https://sandbox.getportabl.com/onboarding/login-passwordless';
export const CONNECT_WRAPPER_CLASS_NAME = 'connect-portabl-logo-svg-wrapper';

export const ATTRIBUTES: {
  ariaLabel: string;
  imageWrapperClassName: string;
  imageDefault: string;
  imagePressed: string;
} = {
  ariaLabel: 'Connect with Portabl',
  imageWrapperClassName: styles['connect-portabl-logo-svg-wrapper'],
  imageDefault: ConnectWithPortablImgBlackText,
  imagePressed: ConnectWithPortablImgWhiteText,
};
