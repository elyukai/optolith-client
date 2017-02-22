import { get, getPrimaryAttr } from '../../stores/ListStore';
import * as React from 'react';

export default () => {
	const SA_88 = get('SA_88') as SpecialAbilityInstance;
	const activeProperties = SA_88.active.map(e => e.sid);
	const activePropertyNames = activeProperties.map(sid => SA_88.sel.find(e => e.id === sid)!.name).join(', ');

	const SA_86 = get('SA_86') as SpecialAbilityInstance;
	const activeTraditions = SA_86.active.map(e => e.sid);
	const activeTraditionNames = activeTraditions.map(sid => SA_86.sel.find(e => e.id === sid)!.name).join(', ');

	const primary = getPrimaryAttr(1) as AttributeInstance;

	return (
	<div className="tradition-properties">
		<div className="primary">
			<span className="label">Leiteigenschaft</span>
			<span className="value">{primary && primary.short}</span>
		</div>
		<div className="properties">
			<span className="label">Merkmal(e)</span>
			<span className="value">{activePropertyNames}</span>
		</div>
		<div className="tradition">
			<span className="label">Tradition</span>
			<span className="value">{activeTraditionNames}</span>
		</div>
	</div>
)};
