import * as React from 'react';
import { getAll } from '../../utils/secondaryAttributes';
import { AttributeCalcItem } from './AttributeCalcItem';

export interface AttributesCalcProps {
	phase: number;
}

export function AttributeCalc(props: AttributesCalcProps) {
	const { phase } = props;

	const calculated = getAll();

	return (
		<div className="calculated">
			{
				calculated.map(attribute => (
					<AttributeCalcItem
						key={attribute.id}
						attribute={attribute}
						phase={phase}
						/>
				))
			}
		</div>
	);
}
