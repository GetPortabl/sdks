import { ROOT_ELEMENT_SELECTOR, Options, styles } from '@portabl/backup-common';
import createButton from './lib/createButton';

export function init(options: Options) {
  const root = document.querySelector<HTMLDivElement>(ROOT_ELEMENT_SELECTOR);
  root?.setAttribute('class', styles['portabl-backup-root']);

  const head = document.querySelector('head');

  if (!root || !head) {
    throw new Error('A <head> tag is missing or cannot find "Portabl Root');
  }
  const button = createButton(options);

  root.style.width = '100%';

  root.append(button);
}
