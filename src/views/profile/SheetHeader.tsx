import { SecondaryAttribute } from '../../utils/secondaryAttributes';
import AttributeStore from '../../stores/AttributeStore';
import React, { Component, PropTypes } from 'react';
import SheetHeaderAttribute from './SheetHeaderAttribute';

interface SheetHeaderProps {
	add?: SecondaryAttribute[];
	title: string;
}

export default (props: SheetHeaderProps) => {
	const { add = [], title } = props;
	const array = AttributeStore.getAll().concat(add);

	return (
		<div className="sheet-header">
			<div className="sheet-title">
				<h1>Heldendokument</h1>
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
