import * as React from 'react';
import { AttributeStore } from '../../stores/AttributeStore';
import { translate } from '../../utils/I18n';
import { SheetHeaderAttribute } from './SheetHeaderAttribute';

export interface HeaderValue {
	id: string;
	short: string;
	value?: number | string;
}

export interface SheetHeaderProps {
	add?: HeaderValue[];
	title: string;
}

export function SheetHeader(props: SheetHeaderProps) {
	const { add = [], title } = props;
	const array: HeaderValue[] = [ ...AttributeStore.getAll(), ...add ];

	return (
		<div className="sheet-header">
			<div className="sheet-title">
				<h1>{translate('charactersheet.title')}</h1>
				<p>{title}</p>
				<img src="images/logo.svg" alt="" />
			</div>
			<div className="sheet-attributes">
				{
					array.map(attr => <SheetHeaderAttribute key={attr.id} id={attr.id} label={attr.short} value={attr.value} />)
				}
			</div>
		</div>
	);
}
