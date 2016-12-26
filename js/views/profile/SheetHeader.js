import AttributeStore from '../../stores/AttributeStore';
import React, { Component, PropTypes } from 'react';
import SheetHeaderAttribute from './SheetHeaderAttribute';

export default class SheetHeader extends Component {

	static defaultProps = {
		add: []
	};

	static propTypes = {
		add: PropTypes.array,
		title: PropTypes.string
	};

	render() {

		const { add, title } = this.props;

		const array = AttributeStore.getAll().concat(add);

		return (
			<div className="sheet-header">
				<div className="sheet-title">
					<h1>Heldendokument</h1>
					<p>{title}</p>
				</div>
				<div className="sheet-attributes">
					{
						array.map(attr => <SheetHeaderAttribute key={attr.id} id={attr.id} label={attr.short} value={attr.value} />)
					}
				</div>
			</div>
		);
	}
}
