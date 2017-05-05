import * as React from 'react';
import { AttributeInstance } from '../../types/data.d';
import { AttributeListItem } from './AttributeListItem';

export interface AttributeListProps {
	attributes: AttributeInstance[];
	phase: number;
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
