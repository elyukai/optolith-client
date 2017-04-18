import * as React from 'react';
import * as AttributeActions from '../../actions/AttributesActions';
import IconButton from '../../components/IconButton';
import NumberBox from '../../components/NumberBox';
import AttributeBorder from './AttributeBorder';

interface Props {
	attribute: SecondaryAttribute;
	phase: number;
}

export default class AttributeCalcItem extends React.Component<Props, undefined> {
	addMaxEnergyPoint = () => {
		if (this.props.attribute.id === 'LP') {
			AttributeActions.addLifePoint();
		}
		else if (this.props.attribute.id === 'AE') {
			AttributeActions.addArcaneEnergyPoint();
		}
		else if (this.props.attribute.id === 'KP') {
			AttributeActions.addKarmaPoint();
		}
	}

	render() {

		const { attribute : { base, calc, currentAdd, maxAdd, mod, name, short, value }, phase } = this.props;

		const increaseElement = typeof currentAdd === 'number' && typeof maxAdd === 'number' && value !== '-' && phase > 2 ? (
			<IconButton
				className="add"
				icon="&#xE145;"
				onClick={this.addMaxEnergyPoint}
				disabled={currentAdd >= maxAdd}/>
		) : null;

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
