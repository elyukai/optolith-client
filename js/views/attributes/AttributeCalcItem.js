import AttributeActions from '../../actions/AttributeActions';
import AttributeBorder from './AttributeBorder';
import IconButton from '../../components/IconButton';
import NumberBox from '../../components/NumberBox';
import React, { Component, PropTypes } from 'react';

export default class AttributeCalcItem extends Component {

	static propTypes = {
		attribute: PropTypes.object.isRequired,
		phase: PropTypes.number.isRequired
	};

	addMaxEnergyPoint = () => AttributeActions.addMaxEnergyPoint(this.props.attribute.id);

	render() {

		const { attribute : { currentAdd, maxAdd, ...other }, phase } = this.props;

		const increaseElement = maxAdd && other.value !== '-' && phase > 2 ? (
			<IconButton className="add" icon="&#xE145;" onClick={this.addMaxEnergyPoint} disabled={!maxAdd || currentAdd >= maxAdd.value} />
		) : null;

		// const rebuyElement = this.props.attribute.hasOwnProperty('disabledPermanent') && other.value !== '-' && phase > 2 ? (
		// 	<IconButton className="rebuy" icon="&#xE923;" disabled={disabledPermanent} />
		// ) : null;

		// const rebuyUndoElement = this.props.attribute.hasOwnProperty('disabledPermanent') && other.value !== '-' && phase > 2 ? (
		// 	<IconButton className="rebuy-undo" icon="&#xE8B3;" disabled={disabledPermanent} />
		// ) : null;

		return (
			<AttributeBorder {...other}>
				{ phase > 2 && maxAdd ? <NumberBox current={currentAdd} max={maxAdd.value} /> : null }
				{increaseElement}
			</AttributeBorder>
		);
	}
}
				// {rebuyElement}
				// {rebuyUndoElement}
