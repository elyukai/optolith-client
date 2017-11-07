import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { NumberBox } from '../../components/NumberBox';
import { SecondaryAttribute } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { _translate } from '../../utils/I18n';
import { AttributeBorder } from './AttributeBorder';

export interface AttributeCalcItemProps {
	attribute: SecondaryAttribute;
	locale: UIMessages;
	isInCharacterCreation: boolean;
	isRemovingEnabled: boolean;
	addLifePoint(): void;
	addArcaneEnergyPoint(): void;
	addKarmaPoint(): void;
	removeLifePoint(): void;
	removeArcaneEnergyPoint(): void;
	removeKarmaPoint(): void;
}

export class AttributeCalcItem extends React.Component<AttributeCalcItemProps, {}> {
	addMaxEnergyPoint = () => {
		if (this.props.attribute.id === 'LP') {
			this.props.addLifePoint();
		}
		else if (this.props.attribute.id === 'AE') {
			this.props.addArcaneEnergyPoint();
		}
		else if (this.props.attribute.id === 'KP') {
			this.props.addKarmaPoint();
		}
	}
	removeMaxEnergyPoint = () => {
		if (this.props.attribute.id === 'LP') {
			this.props.removeLifePoint();
		}
		else if (this.props.attribute.id === 'AE') {
			this.props.removeArcaneEnergyPoint();
		}
		else if (this.props.attribute.id === 'KP') {
			this.props.removeKarmaPoint();
		}
	}

	render() {
		const { attribute : { base, calc, currentAdd, maxAdd, mod, name, short, value = '-', permanentLost, permanentRedeemed }, locale, isInCharacterCreation, isRemovingEnabled } = this.props;

		return (
			<AttributeBorder
				label={short}
				value={value}
				tooltip={(
					<div className="calc-attr-overlay">
						<h4><span>{name}</span><span>{value}</span></h4>
						<p className="calc-text">{calc} = {base || '-'}</p>
						{mod || mod === 0 || ((currentAdd || currentAdd === 0) && !isInCharacterCreation) && (
							<p>
								{(mod || mod === 0) && (
									<span className="mod">
										{_translate(locale, 'attributes.tooltips.modifier')}: {mod}<br/>
									</span>
								)}
								{(currentAdd || currentAdd === 0) && !isInCharacterCreation && (
									<span className="add">
										{_translate(locale, 'attributes.tooltips.bought')}: {currentAdd} / {maxAdd || '-'}
									</span>
								)}
							</p>
						)}
					</div>
				)}
				tooltipMargin={7}>
				{!isInCharacterCreation && maxAdd && <NumberBox current={currentAdd} max={maxAdd} />}
				{typeof currentAdd === 'number' && typeof maxAdd === 'number' && value !== '-' && !isInCharacterCreation && (
					<IconButton
						className="add"
						icon="&#xE908;"
						onClick={this.addMaxEnergyPoint}
						disabled={currentAdd >= maxAdd || typeof permanentLost === 'number' && typeof permanentRedeemed === 'number' && permanentLost - permanentRedeemed > 0}/>
				)}
				{typeof currentAdd === 'number' && typeof maxAdd === 'number' && value !== '-' && !isInCharacterCreation && isRemovingEnabled && (
					<IconButton
						className="remove"
						icon="&#xE909;"
						onClick={this.removeMaxEnergyPoint}
						disabled={currentAdd <= 0 || typeof permanentLost === 'number' && typeof permanentRedeemed === 'number' && permanentLost - permanentRedeemed > 0}/>
				)}
			</AttributeBorder>
		);
	}
}
