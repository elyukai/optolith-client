import classNames from 'classnames';
import * as React from 'react';

interface Props {
	children?: React.ReactNode;
	disabled?: boolean;
	important?: boolean;
	noIncrease?: boolean;
	recommended?: boolean;
	unrecommended?: boolean;
}

export default class ListItem extends React.Component<Props, undefined> {
	render() {
		const { children, disabled, important, noIncrease, recommended, unrecommended, ...other } = this.props;
		return (
			<li {...other} className={classNames({
				'imp': important,
				'typ': recommended,
				'untyp': unrecommended,
				'no-increase': noIncrease,
				disabled,
			})}>
				{children}
			</li>
		);
	}
}
