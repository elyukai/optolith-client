import React from 'react';
import ReactDOM from 'react-dom';

export function close(node) {
	ReactDOM.unmountComponentAtNode(node);
	document.body.removeChild(node);
	return true;
}

export function createDialogNode() {
	let node = document.createElement('div');
	document.body.appendChild(node);
	return node;
}

export default function(element) {
	let node = createDialogNode();
	ReactDOM.render( React.cloneElement(element, { node }), node );
	return true;
}
