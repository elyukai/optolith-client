import AttributeActions from '../../../actions/AttributeActions';
import AttributeBorder from './AttributeBorder';
import IconButton from '../../layout/IconButton';
import React, { Component, PropTypes } from 'react';

class AttributeCalcItem extends Component {

	static propTypes = {
		attribute: PropTypes.object.isRequired,
		phase: PropTypes.number.isRequired
	};

	addMaxEnergyPoint = () => AttributeActions.addMaxEnergyPoint(this.props.attribute.label);

	render() {

		const { attribute : { disabledIncrease, disabledPermanent, ...other }, phase } = this.props;

		const increaseElement = this.props.attribute.hasOwnProperty('disabledIncrease') && other.value !== '-' && phase > 2 ? (
			<IconButton className="add" icon="&#xE145;" onClick={this.addMaxEnergyPoint} disabled={disabledIncrease} />
		) : null;

		const rebuyElement = this.props.attribute.hasOwnProperty('disabledPermanent') && other.value !== '-' && phase > 2 ? (
			<IconButton className="rebuy" icon="&#xE923;" disabled={disabledPermanent} />
		) : null;

		const rebuyUndoElement = this.props.attribute.hasOwnProperty('disabledPermanent') && other.value !== '-' && phase > 2 ? (
			<IconButton className="rebuy-undo" icon="&#xE8B3;" disabled={disabledPermanent} />
		) : null;

		return (
			<AttributeBorder {...other}>
				{increaseElement}
				{rebuyElement}
				{rebuyUndoElement}
			</AttributeBorder>
		);
	}
}

export default AttributeCalcItem;
