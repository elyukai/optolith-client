import createDialogNode from './createDialogNode';
import Dialog from '../components/layout/Dialog';
import React from 'react';
import ReactDOM from 'react-dom';

export default function(title, content) {
	var node = createDialogNode();
	
	ReactDOM.render( <Dialog title={title} node={node}>{content}</Dialog>, node );
}