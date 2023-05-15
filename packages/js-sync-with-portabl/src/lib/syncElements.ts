export function createContainer(iframeWidget: HTMLIFrameElement): HTMLElement {
  const container = document.createElement('div');
  container.style.width = '350px';
  container.style.height = '200px';
  container.style.display = 'none';
  container.style.flexDirection = 'column';
  container.style.justifyContent = 'space-around';
  container.style.borderRadius = '18px';
  container.style.boxShadow = '0px 3px 14px rgba(0, 0, 0, 0.11)';
  container.appendChild(iframeWidget);
  return container;
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

export function createIframeWidget(url: string): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.name = 'portabl-sync-widget';
  iframe.style.height = '200px';
  iframe.style.width = '350px';
  iframe.style.border = '0';
  iframe.style.overflow = 'auto';

  // mobile breakpoint
  const mobileSize = '(max-width: 490px)';
  if (window.matchMedia(mobileSize).matches) {
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    iframe.style.borderRadius = '0';
  }

  return iframe;
}

export function createIframeModal(url: string): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.name = 'portabl-sync-modal';
  iframe.style.border = 'none';
  iframe.style.width = '390px';
  iframe.style.height = '600px';
  iframe.style.borderRadius = '18px';
  iframe.style.boxShadow = '0px 3px 14px rgba(0, 0, 0, 0.11)';

  // mobile breakpoint
  const mobileSize = '(max-width: 490px)';
  if (window.matchMedia(mobileSize).matches) {
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    iframe.style.borderRadius = '0';
  }

  return iframe;
}
