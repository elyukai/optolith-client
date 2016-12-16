import BorderButton from './BorderButton';
import React, { Component, PropTypes } from 'react';

export default class DialogButtons extends Component {

	static propTypes = {
		list: PropTypes.array.isRequired,
		onClickDefault: PropTypes.func.isRequired
	}

	render() {

		const { list, onClickDefault } = this.props;

		let buttons = Array.isArray(list) && list.length > 0 ? list : [];

		buttons = buttons.map((e,i) => {
			e.onClick = onClickDefault.bind(null, e.onClick);
			return <BorderButton {...e} key={'popup-button-' + i} />;
		});

		return (
			<div className="dialog-buttons">
				<div className="dialog-buttons-inner">
					{buttons}
				</div>
			</div>
		);
	}
}
