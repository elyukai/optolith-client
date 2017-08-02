import * as React from 'react';
import { SecondaryAttribute } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { AttributeCalcItem } from './AttributeCalcItem';

export interface AttributesCalcProps {
	derived: SecondaryAttribute[];
	locale: UIMessages;
	phase: number;
	addLifePoint(): void;
	addArcaneEnergyPoint(): void;
	addKarmaPoint(): void;
}

export function AttributeCalc(props: AttributesCalcProps) {
	return (
		<div className="calculated">
			{
				props.derived.map(attribute => (
					<AttributeCalcItem
						{...props}
						key={attribute.id}
						attribute={attribute}
						/>
				))
			}
		</div>
	);
}
