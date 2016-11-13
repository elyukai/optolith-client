import AttributeActions from '../../actions/AttributeActions';
import AttributeBorder from './AttributeBorder';
import IconButton from '../../components/IconButton';
import React, { Component, PropTypes } from 'react';

class AttributeListItem extends Component {

	static propTypes = {
		attribute: PropTypes.object.isRequired,
		phase: PropTypes.number.isRequired
	};

	addPoint = () => AttributeActions.addPoint(this.props.attribute.id);
	removePoint = () => AttributeActions.removePoint(this.props.attribute.id);

	render() {

		const { attribute: { id, short, value, isIncreasable, isDecreasable }, phase } = this.props;

		return (
			<AttributeBorder className={id} label={short} value={value}>
				<IconButton className="add" icon="&#xE145;" onClick={this.addPoint} disabled={!isIncreasable} />
				{ phase < 3 ? (
					<IconButton className="remove" icon="&#xE15B;" onClick={this.removePoint} disabled={!isDecreasable} />
				) : null }
			</AttributeBorder>
		);
	}
}

export default AttributeListItem;
