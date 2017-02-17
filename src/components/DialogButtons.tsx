import * as React from 'react';
import BorderButton from './BorderButton';

interface Button {
	label: string;
	onClick?: () => void;
}

interface Props {
	list: Button[];
	onClickDefault?: (func?: () => void) => void;
}

export default class DialogButtons extends React.Component<Props, undefined> {
	render() {

		const { list, onClickDefault } = this.props;

		const buttons = Array.isArray(list) && list.length > 0 ? list.map(e => {
			e.onClick = onClickDefault && onClickDefault.bind(null, e.onClick);
			return <BorderButton {...e} key={e.label} />;
		}) : [];

		return (
			<div className="dialog-buttons">
				<div className="dialog-buttons-inner">
					{buttons}
				</div>
			</div>
		);
	}
}
