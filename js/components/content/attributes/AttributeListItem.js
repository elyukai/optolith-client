import AttributeActions from '../../../actions/AttributeActions';
import AttributeBorder from './AttributeBorder';
import IconButton from '../../layout/IconButton';
import React, { Component, PropTypes } from 'react';

class AttributeListItem extends Component {

	static propTypes = {
		attribute: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);
	}

	addPoint = () => AttributeActions.addPoint(this.props.attribute.id);
	removePoint = () => AttributeActions.removePoint(this.props.attribute.id);

	render() {

		const { id, short, value, disabledIncrease, disabledDecrease } = this.props.attribute;

		return (
			<AttributeBorder className={id} label={short} value={value}>
				<IconButton className="add" icon="&#xE145;" onClick={this.addPoint} disabled={disabledIncrease} />
				<IconButton className="remove" icon="&#xE15B;" onClick={this.removePoint} disabled={disabledDecrease} />
			</AttributeBorder>
		);
	}
}

export default AttributeListItem;
