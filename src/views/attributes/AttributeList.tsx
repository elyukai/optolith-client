import * as React from 'react';
import { AttributeInstance, ExperienceLevel } from '../../types/data.d';
import { AttributeListItem } from './AttributeListItem';

export interface AttributeListProps {
	attributes: AttributeInstance[];
	el: ExperienceLevel;
	phase: number;
	addPoint(id: string): void;
	removePoint(id: string): void;
}

export function AttributeList(props: AttributeListProps) {
	const { attributes, ...other } = props;
	return (
		<div className="main">
			{
				attributes.map(attribute => <AttributeListItem {...other} key={attribute.id} attribute={attribute} />)
			}
		</div>
	);
}
