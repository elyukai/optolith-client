import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';

export interface MarkdownProps {
	className?: string;
	isListElement?: boolean;
	source: string;
}

export function Markdown(props: MarkdownProps) {
	const { className = '', source = '...', isListElement } = props;
	return (
		<ReactMarkdown source={source} skipHtml className={className} softBreak="br" containerTagName={isListElement ? 'li' : 'div'} />
	);
}
