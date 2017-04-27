import classNames from 'classnames';
import * as React from 'react';

export interface ListItemProps {
	children?: React.ReactNode;
	disabled?: boolean;
	important?: boolean;
	insertTopMargin?: boolean;
	noIncrease?: boolean;
	recommended?: boolean;
	unrecommended?: boolean;
}

export class ListItem extends React.Component<ListItemProps, {}> {
	render() {
		const { children, disabled, important, insertTopMargin, noIncrease, recommended, unrecommended, ...other } = this.props;
		return (
			<li {...other} className={classNames({
				'imp': important,
				'typ': recommended,
				'untyp': unrecommended,
				'no-increase': noIncrease,
				'top-margin': insertTopMargin,
				disabled,
			})}>
				{children}
			</li>
		);
	}
}
