import * as React from 'react';
import ReactMarkdown = require('react-markdown');
import breaks = require('remark-breaks');

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

	const root = isListElement ? 'ul' : 'div';

	return (
		<ReactMarkdown
			className={className}
			source={source}
			skipHtml
			renderers={{
				root
			}}
			plugins={[breaks]}
			/>
	);
}
