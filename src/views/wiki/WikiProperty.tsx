import * as React from 'react';
import { _translate, UIMessages } from '../../utils/I18n';

export interface WikiPropertyProps {
	children?: React.ReactNode;
	locale: UIMessages;
	title: keyof UIMessages;
}

export function WikiProperty(props: WikiPropertyProps) {
	const { children, locale, title } = props;

	return <p>
		<span>{_translate(locale, title)}</span>
		{children && <span>{children}</span>}
	</p>;
}
