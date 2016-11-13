import AttributeBorder from '../attributes/AttributeBorder';
import AttributeStore from '../../stores/AttributeStore';
import React, { Component, PropTypes } from 'react';

class SheetHeader extends Component {

	static defaultProps = {
		add: []
	};

	static propTypes = {
		add: PropTypes.array,
		title: PropTypes.string
	};

	render() {

		const array = AttributeStore.getAllForView();

		array.push(...this.props.add);

		return (
			<div className="header">
				<div className="title">
					<h1>Heldendokument</h1>
					<h2>{this.props.title}</h2>
				</div>
				<div className="attributes">
					{
						array.map((attr,i) => <AttributeBorder key={`ATTR_${i}`} className={attr.id} label={attr.short} value={attr.value} />)
					}
				</div>
			</div>
		);
	}
}

export default SheetHeader;
