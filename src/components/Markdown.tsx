import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';

export interface MarkdownProps {
	className?: string;
	source: string;
}

export function Markdown(props: MarkdownProps) {
	const { className = '', source = '...' } = props;
	return (
		<ReactMarkdown source={source} skipHtml className={className} softBreak="br" />
	);
}
