import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';

export interface MarkdownProps {
	className?: string;
	isListElement?: boolean;
	source: string;
}

export interface MarkdownRootProps {
	children?: React.ReactNode;
}

export function Markdown(props: MarkdownProps) {
	const { className, source = '...', isListElement } = props;
	const root = (props: MarkdownRootProps) => isListElement ? (
		<ul className={className}>{props.children}</ul>
	) : (
		<div className={className}>{props.children}</div>
	);
	return (
		<ReactMarkdown
			source={source}
			skipHtml
			renderers={{
				root
			}}
			/>
	);
}
