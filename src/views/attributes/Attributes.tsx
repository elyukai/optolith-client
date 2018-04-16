import * as React from 'react';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { SecondaryAttribute } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { AttributeWithRequirements } from '../../types/view.d';
import { _translate } from '../../utils/I18n';
import { AttributeCalc } from './AttributeCalc';
import { AttributeList } from './AttributeList';
import { AttributesAdjustment } from './AttributesAdjustment';
import { AttributesPermanentList } from './AttributesPermanentList';

export interface AttributesOwnProps {
	locale: UIMessages;
}

export interface AttributesStateProps {
	attributes: AttributeWithRequirements[];
	derived: SecondaryAttribute[];
	isInCharacterCreation: boolean;
	isRemovingEnabled: boolean;
	maxTotalAttributeValues: number;
	sum: number;
	adjustmentValue: number | undefined;
	availableAttributeIds: string[] | undefined;
	currentAttributeId: string | undefined;
	getEditPermanentEnergy: 'LP' | 'AE' | 'KP' | undefined;
	getAddPermanentEnergy: 'LP' | 'AE' | 'KP' | undefined;
}

export interface AttributesDispatchProps {
	addPoint(id: string): void;
	removePoint(id: string): void;
	addLifePoint(): void;
	addArcaneEnergyPoint(): void;
	addKarmaPoint(): void;
	removeLifePoint(): void;
	removeArcaneEnergyPoint(): void;
	removeKarmaPoint(): void;
	addLostLPPoint(): void;
	removeLostLPPoint(): void;
	addLostLPPoints(value: number): void;
	addBoughtBackAEPoint(): void;
	removeBoughtBackAEPoint(): void;
	addLostAEPoint(): void;
	removeLostAEPoint(): void;
	addLostAEPoints(value: number): void;
	addBoughtBackKPPoint(): void;
	removeBoughtBackKPPoint(): void;
	addLostKPPoint(): void;
	removeLostKPPoint(): void;
	addLostKPPoints(value: number): void;
	setAdjustmentId(id: string): void;
	openAddPermanentEnergyLoss(energy: 'LP' | 'AE' | 'KP'): void;
	closeAddPermanentEnergyLoss(): void;
	openEditPermanentEnergy(energy: 'LP' | 'AE' | 'KP'): void;
	closeEditPermanentEnergy(): void;
}

export type AttributesProps = AttributesStateProps & AttributesDispatchProps & AttributesOwnProps;

export function Attributes(props: AttributesProps) {
	const { locale, isInCharacterCreation, maxTotalAttributeValues, sum } = props;

	return (
		<Page id="attribute">
			<Scroll>
				<div className="counter">{_translate(locale, 'attributes.view.attributetotal')}: {sum}{isInCharacterCreation && ` / ${maxTotalAttributeValues}`}</div>
				<AttributeList {...props} />
				<div className="secondary">
					{isInCharacterCreation && <AttributesAdjustment {...props} />}
					<AttributeCalc {...props} locale={locale} />
					<AttributesPermanentList {...props} locale={locale} />
				</div>
			</Scroll>
		</Page>
	);
}
