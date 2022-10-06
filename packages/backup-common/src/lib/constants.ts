import BackupWithPortablImgWhiteText from '../assets/images/backup-with-portabl-white-text.svg';
import BackupWithPortablImgBlackText from '../assets/images/backup-with-portabl-black-text.svg';
import styles from '../assets/styles.css';

export const ROOT_ELEMENT_ID = 'portabl-backup-root';
export const ROOT_ELEMENT_SELECTOR = `#${ROOT_ELEMENT_ID}`;

export const REQUEST_OTP_ROUTE = '/request-otp';

export const BACKUP_WRAPPER_CLASS_NAME = 'backup-portabl-logo-img-wrapper';

export const ATTRIBUTES: {
  ariaLabel: string;
  imageWrapperClassName: string;
  imageDefault: string;
  imagePressed: string;
} = {
  ariaLabel: 'Backup with Portabl',
  imageWrapperClassName: styles['backup-portabl-logo-img-wrapper'],
  imageDefault: BackupWithPortablImgBlackText,
  imagePressed: BackupWithPortablImgWhiteText,
};

export const API_SUBDOMAIN_BASE = 'api';
export const ONBOARDING_SUBDOMAIN_BASE = 'onboarding';
