import * as React from 'react';
import { Icon } from './Icon';
import { Text } from './Text';

export interface LoaderProps {
	text?: string;
}

export function Loader(props: LoaderProps) {
	const { text } = props;
	return <div id="loader"><Icon/><Text>{text}</Text></div>;
}
