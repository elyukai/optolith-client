import * as React from 'react';
import { Scroll } from '../../components/Scroll';
import { AttributeInstance, ExperienceLevel } from '../../types/data.d';
import { AttributeCalc } from './AttributeCalc';
import { AttributeList } from './AttributeList';
import { AttributesPermanentList } from './AttributesPermanentList';

export interface AttributesProps {
	attributes: AttributeInstance[];
	el: ExperienceLevel;
	phase: number;
}

export function Attributes(props: AttributesProps) {
	const { attributes, el, phase } = props;

	const sum = attributes.reduce((a, b) => a + b.value, 0);
	const sumMax = sum >= el.maxTotalAttributeValues;
	const max = el.maxAttributeValue;

	return (
		<section id="attribute">
			<div className="page">
				<Scroll>
					<div className="counter">Punkte in Eigenschaften: {sum}</div>
					<AttributeList
						attributes={attributes}
						max={max}
						phase={phase}
						sumMax={sumMax}
						/>
					<AttributeCalc phase={phase} />
					<AttributesPermanentList phase={phase} />
				</Scroll>
			</div>
		</section>
	);
}
