import * as React from 'react';
import { AttributeWithRequirements } from '../../types/view.d';
import { AttributeListItem } from './AttributeListItem';

export interface AttributeListProps {
	attributes: AttributeWithRequirements[];
	isInCharacterCreation: boolean;
	isRemovingEnabled: boolean;
	maxTotalAttributeValues: number;
	sum: number;
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
