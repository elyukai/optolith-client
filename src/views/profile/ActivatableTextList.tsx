/// <reference path="../../data.d.ts" />

import { get } from '../../stores/ListStore';
import * as React from 'react';

interface Props {
	list: ActiveViewObject[];
}

export default (props: Props) => {
	const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

	const list = props.list.filter(obj => !['SA_28', 'SA_30'].includes(obj.id)).map(obj => {
		const { id, active: activeObject, index } = obj;
		const { sid, sid2, tier } = activeObject;
		const a = get(id) as AdvantageInstance | DisadvantageInstance;
		const { cost, category, sel, dependencies, active, input, getSelectionItem } = a;
		let { tiers } = a;
		let add = '';
		let addSpecial = '';

		switch (id) {
			case 'ADV_4':
			case 'ADV_47':
			case 'DISADV_48': {
				const { name } = (get(sid as string)) as CombatTechniqueInstance | LiturgyInstance | SpellInstance | TalentInstance;
				add = name;
				break;
			}
			case 'ADV_16': {
				const { name, ic, value } = (get(sid as string)) as LiturgyInstance | SpellInstance | TalentInstance;
				const counter = a.active.reduce((e, obj) => obj.sid === sid ? e + 1 : e, 0);
				add = name;
				break;
			}
			case 'ADV_17': {
				const { name, ic, value } = (get(sid as string)) as CombatTechniqueInstance;
				add = name;
				break;
			}
			case 'ADV_28':
			case 'ADV_29':
				add = (getSelectionItem(sid as string | number) as SelectionObject).name;
				break;
			case 'ADV_32':
			case 'DISADV_1':
			case 'DISADV_24':
			case 'DISADV_45':
				add = typeof sid === 'number' ? sel[sid - 1].name : sid as string;
				break;
			case 'DISADV_34':
			case 'DISADV_50': {
				const maxCurrentTier = active.reduce((a,b) => (b.tier as number) > a ? b.tier as number : a, 0);
				const subMaxCurrentTier = active.reduce((a,b) => (b.tier as number) > a && (b.tier as number) < maxCurrentTier ? b.tier as number : a, 0);
				add = typeof sid === 'number' ? sel[sid - 1].name : sid as string;
				break;
			}
			case 'DISADV_33': {
				if ([7,8].includes(sid as number)) {
					add = `${(getSelectionItem(sid as string | number) as SelectionObject).name}: ${sid2}`;
				} else {
					add = (getSelectionItem(sid as string | number) as SelectionObject).name;
				}
				break;
			}
			case 'DISADV_36':
				add = typeof sid === 'number' ? sel[sid - 1].name : sid as string;
				break;
			case 'DISADV_37':
			case 'DISADV_51':
				add = (getSelectionItem(sid as string | number) as SelectionObject).name;
				break;
			case 'SA_10': {
				const counter = (get(id) as SpecialAbilityInstance).active.reduce((c, obj) => obj.sid === sid ? c + 1 : c, 0);
				const skill = get(sid as string) as TalentInstance;
				add = `${skill.name}: ${typeof sid2 === 'number' ? skill.specialisation[sid2 - 1] : sid2}`;
				break;
			}
			case 'SA_30':
				tiers = 3;
				add = (getSelectionItem(sid as string | number) as SelectionObject).name;
				break;
			case 'SA_86':
				add = (getSelectionItem(sid as string | number) as SelectionObject).name;
				break;
			case 'SA_102':
				add = (getSelectionItem(sid as string | number) as SelectionObject).name;
				break;

			default:
				if (input) {
					add = sid as string;
				}
				else if (sel.length > 0 && cost === 'sel') {
					add = (getSelectionItem(sid as string | number) as SelectionObject).name;
				}
				else if (sel.length > 0 && typeof cost === 'number') {
					add = (getSelectionItem(sid as string | number) as SelectionObject).name;
				}
				break;
		}

		let { name } = a;
		const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
		if (tiers && !['DISADV_34','DISADV_50'].includes(id)) {
			if (id === 'SA_30' && tier === 4) {
				name += ` MS`;
			}
			else {
				name += ` ${roman[(tier as number) - 1]}`;
			}
		}
		if (['ADV_28','ADV_29'].includes(id)) {
			name = `Immunität gegen ${add}`;
		}
		else if (id === 'DISADV_1') {
			name = `Angst vor ${add}`;
		}
		else if (['DISADV_34','DISADV_50'].includes(id)) {
			name  += ` ${roman[(tier as number) - 1]} (${add})`;
		}
		else if (add) {
			name += ` (${add})`;
		}
		if (addSpecial) {
			name += addSpecial;
		}

		return name;
	}).sort().join(', ');

	return (
		<div className="list">{list}</div>
	);
}
