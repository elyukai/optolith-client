import { remote } from 'electron';
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

export function close(node: HTMLElement): boolean {
  unmountComponentAtNode(node);
  document.body.removeChild(node);
  remote.globalShortcut.unregister('Enter');

  return true;
}

export function createDialogNode(): HTMLElement {
  const node = document.createElement('div');
  document.body.appendChild(node);

  return node;
}

export function createOverlay(element: JSX.Element): HTMLElement {
  const node = createDialogNode();
  render(React.cloneElement(element, { node }), node);

  return node;
}
