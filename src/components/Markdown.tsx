import * as React from 'react';
import ReactMarkdown from 'react-markdown';

export interface MarkdownProps {
	source: string;
}

export function Markdown(props: MarkdownProps) {
	const { source = '...' } = props;
	return (
		<ReactMarkdown source={source} skipHtml />
	);
}
