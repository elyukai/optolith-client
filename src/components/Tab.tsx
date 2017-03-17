import classNames from 'classnames';
import * as React from 'react';
import Text from './Text';

interface Props {
	active: boolean;
	className?: string;
	disabled?: boolean;
	label: string;
	onClick(): void;
}

export default class Tab extends React.Component<Props, undefined> {
	render() {
		const { active, children, disabled, label, onClick } = this.props;
		const className = classNames(this.props.className, {
			'active': active,
			'disabled': disabled,
			'tab': true,
		});

		return (
			<div className={className} onClick={disabled ? undefined : onClick}>
				<Text>{label || children}</Text>
			</div>
		);
	}
}
