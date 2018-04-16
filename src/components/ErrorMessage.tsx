import * as React from 'react';
import { Scroll } from './Scroll';

export interface ErrorMessageProps {
	stack: string;
	componentStack: string;
}

export function ErrorMessage(props: ErrorMessageProps): JSX.Element {
	return <Scroll className="error-message">
		<h4>Error</h4>
		<p>{props.stack}</p>
		<h4>Component Stack</h4>
		<p>{props.componentStack}</p>
	</Scroll>;
}
