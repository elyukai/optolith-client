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

		const { attribute : { base, calc, currentAdd, maxAdd, mod, name, short, value }, phase } = this.props;

		const increaseElement = maxAdd && value !== '-' && phase > 2 ? (
			<IconButton className="add" icon="&#xE145;" onClick={this.addMaxEnergyPoint} disabled={!maxAdd || currentAdd >= maxAdd} />
		) : null;

		// const rebuyElement = this.props.attribute.hasOwnProperty('disabledPermanent') && value !== '-' && phase > 2 ? (
		// 	<IconButton className="rebuy" icon="&#xE923;" disabled={disabledPermanent} />
		// ) : null;

		// const rebuyUndoElement = this.props.attribute.hasOwnProperty('disabledPermanent') && value !== '-' && phase > 2 ? (
		// 	<IconButton className="rebuy-undo" icon="&#xE8B3;" disabled={disabledPermanent} />
		// ) : null;

		return (
			<AttributeBorder label={short} value={value} tooltip={<div className="calc-attr-overlay">
					<h4><span>{name}</span><span>{value}</span></h4>
					<p className="calc-text">{calc} = {base || '-'}</p>
					{ mod || mod === 0 || ((currentAdd || currentAdd === 0) && phase > 2) ? <p>
						{ mod || mod === 0 ? <span className="mod">Modifikator: {mod}<br/></span> : null}
						{ (currentAdd || currentAdd === 0) && phase > 2 ? <span className="add">Gekauft: {currentAdd} / {maxAdd || '-'}</span> : null}
					</p> : null}
				</div>} tooltipMargin={7}>
				{ phase > 2 && maxAdd ? <NumberBox current={currentAdd} max={maxAdd} /> : null }
				{increaseElement}
			</AttributeBorder>
		);
	}
}
				// {rebuyElement}
				// {rebuyUndoElement}
