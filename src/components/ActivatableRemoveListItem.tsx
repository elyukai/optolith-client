import { get } from '../stores/ListStore';
import * as Categories from '../constants/Categories';
import * as React from 'react';
import Dropdown from './Dropdown';
import IconButton from './IconButton';
import ELStore from '../stores/ELStore';

interface Active {
	id: string;
	active: ActiveObject;
	index: number;
}

interface RemoveObject {
	id: string;
	cost: number;
	index: number;
}

interface Props {
	item: Active;
	phase: number;
	setTier: (id: string, tier: number, cost: number, sid: string | number) => void;
	removeFromList: (args: DeactivateArgs) => void;
}

export default class ActivatableRemoveListItem extends React.Component<Props, undefined> {
	handleSelectTier = (selectedTier: number) => {
		const { id, active: { sid, tier } } = this.props.item;
		const { cost, category } = get(id) as AdvantageInstance | DisadvantageInstance;
		const finalCost = (selectedTier - tier) * (cost as number) * (category === Categories.DISADVANTAGES ? -1 : 1);
		this.props.setTier(id, selectedTier, finalCost, sid as string | number);
	}
	removeFromList = (args: DeactivateArgs) => this.props.removeFromList(args);

	render() {
		const { phase, item: { id, active: activeObject, index }} = this.props;
		const { sid, sid2, tier } = activeObject;
		const a = get(id) as AdvantageInstance | DisadvantageInstance;
		const { tiers, cost, category, sel, dependencies, active, input } = a;
		let disabled = false;
		let add = '';
		let currentCost: number | undefined = undefined;
		const args: RemoveObject = { id, index, cost: 0 };

		switch (id) {
			case 'ADV_4':
			case 'ADV_47':
			case 'DISADV_48': {
				const { name, ic } = (get(sid as string)) as CombatTechniqueInstance | LiturgyInstance | SpellInstance | TalentInstance;
				add = name;
				currentCost = (cost as number[])[ic - 1];
				break;
			}
			case 'ADV_16': {
				const { name, ic, value } = (get(sid as string)) as LiturgyInstance | SpellInstance | TalentInstance;
				const counter = a.active.reduce((e, obj) => obj.sid === sid ? e + 1 : e, 0);
				add = name;
				currentCost = (cost as number[])[ic - 1];
				disabled = disabled || ELStore.getStart().maxSkillRating + counter === value;
				break;
			}
			case 'ADV_17': {
				const { name, ic, value } = (get(sid as string)) as CombatTechniqueInstance;
				add = name;
				currentCost = (cost as number[])[ic - 1];
				disabled = disabled || ELStore.getStart().maxCombatTechniqueRating + 1 === value;
				break;
			}
			case 'ADV_28':
			case 'ADV_29':
				add = sel[sid as number - 1].name;
				currentCost = sel[sid as number - 1].cost as number;
				break;
			case 'ADV_32':
			case 'DISADV_1':
			case 'DISADV_24':
			case 'DISADV_45':
				add = typeof sid === 'number' ? sel[sid - 1].name : sid as string;
				break;
			case 'DISADV_34':
			case 'DISADV_50': {
				const maxCurrentTier = active.reduce((a,b) => b.tier > a ? b.tier as number : a, 0);
				const subMaxCurrentTier = active.reduce((a,b) => b.tier > a && b.tier < maxCurrentTier ? b.tier as number : a, 0);
				add = typeof sid === 'number' ? sel[sid - 1].name : sid as string;
				currentCost = maxCurrentTier > tier || active.filter(e => e.tier === tier).length > 1 ? 0 : (cost as number) * (tier - subMaxCurrentTier);
				break;
			}
			case 'DISADV_33': {
				if (sid === 7 && active.filter(e => e.sid === 7).length > 1) {
					currentCost = 0;
				} else {
					currentCost = sel[sid as number - 1].cost as number;
				}
				if ([7,8].includes(sid as number)) {
					add = `${sel[sid as number - 1].name}: ${sid2}`;
				} else {
					add = sel[sid as number - 1].name;
				}
				break;
			}
			case 'DISADV_36':
				add = typeof sid === 'number' ? sel[sid - 1].name : sid as string;
				currentCost = active.length > 3 ? 0 : cost as number;
				break;
			case 'DISADV_37':
			case 'DISADV_51':
				add = sel[sid as number - 1].name;
				currentCost = sel[sid as number - 1].cost as number;
				break;
			default:
				if (input) {
					add = sid as string;
				}
				break;
		}

		let tierElement;
		const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
		if (tiers && !['DISADV_34','DISADV_50'].includes(id)) {
			const array = Array.from(Array(tiers).keys()).map(e => ({ id: e + 1, name: roman[e] }));
			tierElement = (
				<Dropdown
					className="tiers"
					value={tier as number}
					onChange={this.handleSelectTier}
					options={array} />
			);
			currentCost = (cost as number) * tier;
		}

		let { name } = a;
		if (['ADV_28','ADV_29'].includes(id)) {
			name = `Immunität gegen ${add}`;
		}
		else if (id === 'DISADV_1') {
			name = `Angst vor ${add}`;
		}
		else if (['DISADV_34','DISADV_50'].includes(id)) {
			name  += ` ${roman[tier - 1]} (${add})`;
		}
		else if (add) {
			name += ` (${add})`;
		}

		if (!currentCost) {
			currentCost = cost as number;
		}
		if (category === Categories.DISADVANTAGES) {
			currentCost = -currentCost;
		}
		args.cost = -currentCost;

		if (dependencies.some(e => typeof e === 'boolean' ? e && active.length === 1 : Object.keys(activeObject).every((key: keyof ActiveObject) => activeObject[key] === e[key]) && Object.keys(activeObject).length === Object.keys(e).length)) {
			disabled = true;
		}


		/*
		if (isActive === true) {
			let disabled = dependencies.length > 0;
			if (sel.length > 0 && cost === 'sel' && typeof sid === 'number') {
				if (id === 'SA_86' && (getAllByCategory(Categories.SPELLS) as SpellInstance[]).some(e => e.active)) {
					disabled = true;
				}
				if (id === 'SA_102' && (getAllByCategory(Categories.LITURGIES) as LiturgyInstance[]).some(e => e.active)) {
					disabled = true;
				}
				sas.push({ id, name, add: sel[sid - 1][0], cost: sel[sid - 1][2], gr, disabled });
			} else {
				let phase = PhaseStore.get();
				if (id === 'SA_92' && phase < 3 && typeof cost === 'number') {
					cost += 4;
				}
				sas.push({ id, name, cost, gr, disabled });
			}
		} else if (Array.isArray(active) && active.length > 0) {
			let disabled = dependencies.length > 0;
			let ap_default = cost;
			if (id === 'SA_10') {
				let counter = count(active as [string, number][], true);
				(active as [string, number][]).forEach(n => {
					let sid = n.join('&');
					let tal = get(n[0]);
					let cost = tal.ic * counter.get(n[0]);
					let add = `${tal.name}: ${typeof n[1] === 'number' ? tal.spec[n[1] - 1] : n[1]}`;
					sas.push({ id, name, sid, add, cost, gr, disabled });
				});
			} else for (let i = 0; i < active.length; i++) {
				let sid;
				let add;
				let tier;
				let tiers;
				let cost;
				if (id === 'SA_30') {
					sid = sa.active[i][0];
					cost = ap_default;
					tier = sa.active[i][1];
					tiers = 3;
					add = sa.sel[sid - 1][0];
				} else if (sel.length > 0 && ap_default === 'sel') {
					sid = sa.active[i];
					cost = sa.sel[sid - 1][2];
					add = sa.sel[sid - 1][0];
				} else if (sel.length > 0 && typeof ap_default === 'number') {
					sid = sa.active[i];
					cost = sa.cost;
					add = sa.sel[sid - 1][0];
				} else if (sa.input !== null) {
					sid = sa.active[i];
					add = sa.active[i];
					cost = sa.cost;
				}
				if (dependencies.includes(sid)) disabled = true;
				sas.push({ id, name, sid, add, cost, tier, tiers, gr, disabled });
			}
		}
		if (item.tiers !== undefined && item.tiers !== null) {
			var array = [];
			if (item.id === 'SA_30' && (item.tier === 4 || this.props.phase < 3)) array.push(['MS', 4]);
			for (let i = 0; i < item.tiers; i++ ) {
				if (this.props.phase < 3 || i + 1 >= item.tier) {
					array.push([roman[i], i + 1]);
				}
			}
			if (array.length > 1) {
				tierElement = (
					<Dropdown
						className="tiers"
						value={item.tier}
						onChange={this.handleSelectTier}
						options={array} />
				);
			} else {
				addSpecial = ' ' + array[0][0];
			}
			cost = item.tier === 4 && item.id === 'SA_30' ? 0 : item.cost * item.tier;
		}

		args.cost = cost;

		if (item.hasOwnProperty('sid')) args.sid = item.sid;

		if (item.hasOwnProperty('add')) name += ` (${item.add})`;
		if (addSpecial) name += addSpecial;
		*/

		return (
			<div className="list-item">
				<div className="name">
					<p className="title">{name}</p>
				</div>
				<div className="selections">
					{tierElement}
				</div>
				<div className="hr"></div>
				<div className="values">
					<div className="cost">{currentCost}</div>
				</div>
				<div className="btns">
					<IconButton icon="&#xE15B;" onClick={this.removeFromList.bind(null, args as DeactivateArgs)} disabled={disabled || phase === 3} flat />
					<IconButton icon="&#xE88F;" flat disabled />
				</div>
			</div>
		);
	}
}
