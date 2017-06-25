import * as React from 'react';
import { Scroll } from '../../components/Scroll';
import { AttributeInstance, ExperienceLevel, SecondaryAttribute } from '../../types/data.d';
import { getSum } from '../../utils/AttributeUtils';
import { translate } from '../../utils/I18n';
import { AttributeCalc } from './AttributeCalc';
import { AttributeList } from './AttributeList';
import { AttributesPermanentList } from './AttributesPermanentList';

export interface AttributesProps {
	attributes: AttributeInstance[];
	derived: SecondaryAttribute[];
	el: ExperienceLevel;
	phase: number;
	addPoint(id: string): void;
	removePoint(id: string): void;
	addLifePoint(): void;
	addArcaneEnergyPoint(): void;
	addKarmaPoint(): void;
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
}

export function Attributes(props: AttributesProps) {
	const { attributes, el, phase } = props;

	const sum = getSum(attributes);

	return (
		<section id="attribute">
			<div className="page">
				<Scroll>
					<div className="counter">{translate('attributes.view.attributetotal')}: {sum}{phase === 2 && ` / ${el.maxTotalAttributeValues}`}</div>
					<AttributeList {...props} />
					<div className="secondary">
						<AttributeCalc {...props} />
						<AttributesPermanentList {...props} />
					</div>
				</Scroll>
			</div>
		</section>
	);
}
