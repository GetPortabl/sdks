import PortablLogo from '../assets/images/portabl-logo.svg';
import SyncCheckedIcon from '../assets/images/sync-checked-icon.svg';

export function createContainer(
  header: HTMLElement,
  description: HTMLElement,
  syncButton: HTMLElement,
  viewDataButton: HTMLElement,
): HTMLElement {
  const container = document.createElement('div');
  container.style.width = '350px';
  container.style.height = '200px';
  container.style.padding = '16px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.justifyContent = 'space-around';
  container.style.borderRadius = '18px';
  container.style.boxShadow = '0px 3px 14px rgba(0, 0, 0, 0.11)';
  container.appendChild(header);
  container.appendChild(description);
  container.appendChild(syncButton);
  container.appendChild(viewDataButton);
  return container;
}

export function createHeader(
  portablTitle: HTMLElement,
  tooltip: HTMLAnchorElement,
): HTMLElement {
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.appendChild(portablTitle);
  header.appendChild(tooltip);
  return header;
}

export function createSyncCheckedIcon(): HTMLElement {
  const syncCheckedIcon = document.createElement('img');
  syncCheckedIcon.src = SyncCheckedIcon;
  return syncCheckedIcon;
}

export function updateHeader(header: HTMLElement, isSyncOn: boolean): void {
  const tooltip = header.querySelector('a');

  if (isSyncOn) {
    if (tooltip) {
      tooltip.style.display = 'none';
    }
    const newSyncCheckedIcon = createSyncCheckedIcon();
    header.appendChild(newSyncCheckedIcon);
  } else if (tooltip) {
    tooltip.style.display = 'block';
  }
}

export function createPortablLogo(): HTMLImageElement {
  const portablLogo = document.createElement('img');
  portablLogo.src = PortablLogo;
  return portablLogo;
}

export function createTooltip(): HTMLAnchorElement {
  const tooltip = document.createElement('a');
  tooltip.textContent = "What's this?";
  tooltip.style.position = 'relative';
  tooltip.style.cursor = 'pointer';
  tooltip.style.fontSize = '10px';
  tooltip.style.padding = '10px 17px 11px';
  tooltip.style.borderRadius = '18px';
  tooltip.style.backgroundColor = '#F3F3F4';
  tooltip.style.fontWeight = '600';
  tooltip.style.textDecoration = 'none';
  tooltip.style.outline = 'none';
  tooltip.style.color = '#000';
  tooltip.target = '_blank';
  tooltip.href = 'https://getportabl.com';
  return tooltip;
}

export function createDescription(): HTMLElement {
  const description = document.createElement('p');
  description.textContent =
    'Manage all your financial identity data in one place with Portabl.';
  description.style.textAlign = 'left';
  return description;
}

export function createSyncButton(): HTMLButtonElement {
  const syncButton = document.createElement('button');
  syncButton.style.boxSizing = 'border-box';
  syncButton.style.background =
    'linear-gradient(90deg, #f4266b 0, #c602e5 50%, #8600fa)';
  syncButton.style.padding = '13px 17px';
  syncButton.style.borderRadius = '18px';
  syncButton.style.border = 'none';
  syncButton.style.color = '#fff';
  syncButton.style.fontWeight = '600';
  syncButton.style.cursor = 'pointer';
  syncButton.style.fontSize = '13px';
  syncButton.style.transition = 'transform 0.2s ease-in-out';

  syncButton.textContent = 'Sync with Portabl';

  syncButton.addEventListener('mouseover', () => {
    syncButton.style.transform = 'scale(1.02)';
  });

  syncButton.addEventListener('mouseout', () => {
    syncButton.style.transform = 'scale(1)';
  });

  syncButton.addEventListener('mousedown', () => {
    syncButton.style.transform = 'scale(.98)';
  });

  syncButton.addEventListener('mouseup', () => {
    syncButton.style.transform = 'scale(1)';
  });

  syncButton.addEventListener('focus', () => {
    syncButton.style.outline = '#F1E7FE';
  });

  return syncButton;
}

export function createViewDataButton(passportUrl: string): HTMLAnchorElement {
  const viewDataButton = document.createElement('a');
  viewDataButton.style.boxSizing = 'border-box';
  viewDataButton.style.background = '#000';
  viewDataButton.style.padding = '13px 17px';
  viewDataButton.style.borderRadius = '18px';
  viewDataButton.style.border = 'none';
  viewDataButton.style.color = '#fff';
  viewDataButton.style.fontWeight = '600';
  viewDataButton.style.cursor = 'pointer';
  viewDataButton.style.textDecoration = 'none';
  viewDataButton.style.outline = 'none';
  viewDataButton.style.fontSize = '13px';

  viewDataButton.textContent = 'View your data';
  viewDataButton.href = passportUrl;

  viewDataButton.addEventListener('mouseover', () => {
    viewDataButton.style.transform = 'scale(1.02)';
  });

  viewDataButton.addEventListener('mouseout', () => {
    viewDataButton.style.transform = 'scale(1)';
  });

  viewDataButton.addEventListener('mousedown', () => {
    viewDataButton.style.transform = 'scale(.98)';
  });

  viewDataButton.addEventListener('mouseup', () => {
    viewDataButton.style.transform = 'scale(1)';
  });

  viewDataButton.addEventListener('focus', () => {
    viewDataButton.style.outline = '#F1E7FE';
  });

  return viewDataButton;
}

export function createModal(): HTMLElement {
  const modal = document.createElement('div');
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  modal.style.zIndex = '1000';
  modal.style.overflow = 'auto';

  modal.addEventListener('click', event => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  return modal;
}

export function createIframe(url: string): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.style.border = 'none';
  iframe.style.width = '550px';
  iframe.style.height = '600px';
  iframe.style.padding = '20px';
  return iframe;
}
