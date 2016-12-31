import React, { Component, PropTypes } from 'react';

export interface ActiveAbility {
    id: string;
    name: string;
    sid?: string | number;
    add?: any;
    cost: number;
    tier?: number;
    tiers?: number;
    gr: number;
    disabled: boolean;
}

export interface AbilitiesTextListProps {
	list: ActiveAbility[];
}

export default (props: AbilitiesTextListProps) => {
	const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

	const list = props.list.filter(obj => !['SA_28', 'SA_30'].includes(obj.id)).map(obj => {
		let { id, name, add, tiers, tier } = obj;

		if (['ADV_28','ADV_29'].includes(id)) {
			name = `Immunität gegen ${add}`;
		}
		else if (id === 'DISADV_1') {
			name = `Angst vor ${add}`;
		}
		else if (['DISADV_34','DISADV_50'].includes(id)) {
			name += ` ${roman[tier - 1]} (${add})`;
		}
		else if (add) {
			name += ` (${add})`;
		}
		
		if (tiers !== undefined && tiers !== null && !['DISADV_34','DISADV_50'].includes(id)) {
			if (id === 'SA_30' && tier === 4) {
				name += ` MS`;
			}
			else {
				name += ` ${roman[tier - 1]}`;
			}
		}
		
		return name;
	}).sort().join(', ');

	return (
		<div className="list">{list}</div>
	);
}
