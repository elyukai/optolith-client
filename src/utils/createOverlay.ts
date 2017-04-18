import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

export function close(node: HTMLDivElement): boolean {
	unmountComponentAtNode(node);
	document.body.removeChild(node);
	return true;
}

export function createDialogNode(): HTMLDivElement {
	const node = document.createElement('div');
	document.body.appendChild(node);
	return node;
}

export default function createOverlay(element: JSX.Element): HTMLDivElement {
	const node = createDialogNode();
	render( React.cloneElement(element, { node }), node );
	return node;
}
