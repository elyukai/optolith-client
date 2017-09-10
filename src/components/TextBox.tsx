import * as classNames from 'classnames';
import * as React from 'react';
import { Textfit } from 'react-textfit';

export interface TextBoxProps {
	children?: React.ReactNode;
	className?: string;
	label: string;
	value?: string | number;
}

export function TextBox(props: TextBoxProps) {
		const { children, className, label, value } = props;
		return (
			<div className={classNames('textbox', className)}>
				<h3>{label}</h3>
				{value ? <div>
					<Textfit max={16} min={8}>
						{value}
					</Textfit>
				</div> : children}
			</div>
		);
}
