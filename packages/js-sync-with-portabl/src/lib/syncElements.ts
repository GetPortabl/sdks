import PortablLogo from '../assets/images/portabl-logo.svg';

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
  tooltip: HTMLElement,
): HTMLElement {
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.appendChild(portablTitle);
  header.appendChild(tooltip);
  return header;
}

export function createPortablLogo(): HTMLElement {
  const portablLogo = document.createElement('img');
  portablLogo.src = PortablLogo;

  return portablLogo;
}

export function createTooltip(): HTMLElement {
  const tooltip = document.createElement('span');
  tooltip.textContent = "What's this?";
  tooltip.style.position = 'relative';
  tooltip.style.cursor = 'pointer';
  tooltip.style.fontSize = '10px';
  tooltip.style.padding = '10px 17px 11px';
  tooltip.style.borderRadius = '18px';
  tooltip.style.backgroundColor = '#F3F3F4';
  tooltip.style.fontWeight = '600';

  const tooltipText = document.createElement('span');
  tooltipText.textContent = 'Lorem Ipsum lorem ipsum lorem ipsum';
  tooltipText.style.visibility = 'hidden';
  tooltipText.style.width = '200px';
  tooltipText.style.textAlign = 'center';
  tooltipText.style.padding = '8px 0';
  tooltipText.style.position = 'absolute';
  tooltipText.style.zIndex = '1';
  tooltipText.style.bottom = '35px';
  tooltipText.style.left = '-50px';
  tooltipText.style.transition = 'opacity 0.3s';

  tooltip.appendChild(tooltipText);

  tooltip.addEventListener('mouseenter', () => {
    tooltipText.style.visibility = 'visible';
    tooltipText.style.opacity = '1';
  });

  tooltip.addEventListener('mouseleave', () => {
    tooltipText.style.visibility = 'hidden';
    tooltipText.style.opacity = '0';
  });

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

  syncButton.textContent = 'Sync with Portabl';
  return syncButton;
}

export function createViewDataButton(): HTMLButtonElement {
  const viewDataButton = document.createElement('button');
  viewDataButton.style.boxSizing = 'border-box';
  viewDataButton.style.background = '#000';
  viewDataButton.style.padding = '13px 17px';
  viewDataButton.style.borderRadius = '18px';
  viewDataButton.style.border = 'none';
  viewDataButton.style.color = '#fff';
  viewDataButton.style.fontWeight = '600';
  viewDataButton.style.cursor = 'pointer';

  viewDataButton.textContent = 'View your data';
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
  return modal;
}

export function createIframe(url: string): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.style.border = 'none';
  iframe.style.width = '500px';
  iframe.style.height = '600px';
  return iframe;
}
