import * as React from 'react';
import ReactMarkdown = require('react-markdown');
import breaks = require('remark-breaks');

export interface MarkdownProps {
	className?: string;
	isListElement?: boolean;
	oneLine?: 'span' | 'fragment';
	source: string;
}

export interface MarkdownRootProps {
	children?: React.ReactNode;
}

export function Markdown(props: MarkdownProps) {
	const { className, source = '...', isListElement, oneLine } = props;

	const root = oneLine === 'fragment' ? (props: { children?: React.ReactNode}) => <React.Fragment>{props.children}</React.Fragment> : oneLine === 'span' ? 'span' : isListElement ? 'ul' : 'div';

	return (
		<ReactMarkdown
			className={className}
			source={source}
			unwrapDisallowed={typeof oneLine === 'string'}
			skipHtml
			renderers={{
				root
			}}
			plugins={[breaks]}
			disallowedTypes={oneLine ? ['paragraph'] : undefined}
			/>
	);
}
