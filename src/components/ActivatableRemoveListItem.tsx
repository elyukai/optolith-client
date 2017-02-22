import { get, getAllByCategory } from '../stores/ListStore';
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
	setTier: (id: string, index: number, tier: number, cost: number) => void;
	removeFromList: (args: DeactivateArgs) => void;
}

export default class ActivatableRemoveListItem extends React.Component<Props, undefined> {
	handleSelectTier = (selectedTier: number) => {
		const { id, active: { tier }, index } = this.props.item;
		const { cost, category } = get(id) as AdvantageInstance | DisadvantageInstance;
		const finalCost = (selectedTier - (tier as number)) * (cost as number) * (category === Categories.DISADVANTAGES ? -1 : 1);
		this.props.setTier(id, index, selectedTier, finalCost);
	}
	removeFromList = (args: DeactivateArgs) => this.props.removeFromList(args);

	render() {
		const { phase, item: { id, active: activeObject, index }} = this.props;
		const { sid, sid2, tier } = activeObject;
		const a = get(id) as AdvantageInstance | DisadvantageInstance;
		const { cost, category, sel, dependencies, active, input, getSelectionItem } = a;
		let { tiers } = a;
		let disabled = false;
		let add = '';
		let addSpecial = '';
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
				add = (getSelectionItem(sid as string | number) as SelectionObject).name;
				currentCost = (getSelectionItem(sid as string | number) as SelectionObject).cost as number;
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
				currentCost = maxCurrentTier > (tier as number) || active.filter(e => e.tier === tier).length > 1 ? 0 : (cost as number) * ((tier as number) - subMaxCurrentTier);
				break;
			}
			case 'DISADV_33': {
				if (sid === 7 && active.filter(e => e.sid === 7).length > 1) {
					currentCost = 0;
				} else {
					currentCost = (getSelectionItem(sid as string | number) as SelectionObject).cost as number;
				}
				if ([7,8].includes(sid as number)) {
					add = `${(getSelectionItem(sid as string | number) as SelectionObject).name}: ${sid2}`;
				} else {
					add = (getSelectionItem(sid as string | number) as SelectionObject).name;
				}
				break;
			}
			case 'DISADV_36':
				add = typeof sid === 'number' ? sel[sid - 1].name : sid as string;
				currentCost = active.length > 3 ? 0 : cost as number;
				break;
			case 'DISADV_37':
			case 'DISADV_51':
				add = (getSelectionItem(sid as string | number) as SelectionObject).name;
				currentCost = (getSelectionItem(sid as string | number) as SelectionObject).cost as number;
				break;
			case 'SA_10': {
				const counter = (get(id) as SpecialAbilityInstance).active.reduce((c, obj) => obj.sid === sid ? c + 1 : c, 0);
				const skill = get(sid as string) as TalentInstance;
				currentCost = skill.ic * counter;
				add = `${skill.name}: ${typeof sid2 === 'number' ? skill.specialisation![sid2 - 1] : sid2}`;
				break;
			}
			case 'SA_30':
				tiers = 3;
				add = (getSelectionItem(sid as string | number) as SelectionObject).name;
				break;
			case 'SA_86':
				if ((getAllByCategory(Categories.SPELLS) as SpellInstance[]).some(e => e.active)) {
					disabled = true;
				}
				add = (getSelectionItem(sid as string | number) as SelectionObject).name;
				currentCost = (getSelectionItem(sid as string | number) as SelectionObject).cost as number;
				break;
			case 'SA_102':
				if ((getAllByCategory(Categories.LITURGIES) as LiturgyInstance[]).some(e => e.active)) {
					disabled = true;
				}
				add = (getSelectionItem(sid as string | number) as SelectionObject).name;
				currentCost = (getSelectionItem(sid as string | number) as SelectionObject).cost as number;
				break;

			default:
				if (input) {
					add = sid as string;
				}
				else if (sel.length > 0 && cost === 'sel') {
					const selectionItem = getSelectionItem(sid!);
					add = selectionItem!.name;
					currentCost = selectionItem!.cost as number;
				}
				else if (sel.length > 0 && typeof cost === 'number') {
					add = (getSelectionItem(sid as string | number) as SelectionObject).name;
				}
				break;
		}

		let tierElement;
		const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
		if (tiers && !['DISADV_34','DISADV_50'].includes(id)) {
			const array = Array.from(Array(tiers).keys()).map(e => ({ id: e + 1, name: roman[e] }));
			if (id === 'SA_30' && (tier === 4 || this.props.phase < 3)) {
				array.push({ id: 4, name: 'MS' });
			}
			if (array.length > 1) {
				tierElement = (
					<Dropdown
						className="tiers"
						value={tier as number}
						onChange={this.handleSelectTier}
						options={array} />
				);
			} else {
				addSpecial = ' ' + array[0].name;
			}
			currentCost = tier === 4 && id === 'SA_30' ? 0 : (cost as number) * (tier as number);
		}

		let { name } = a;
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

		if (!currentCost) {
			currentCost = cost as number;
		}
		if (category === Categories.DISADVANTAGES) {
			currentCost = -currentCost;
		}
		args.cost = currentCost;

		if (dependencies.some(e => typeof e === 'boolean' ? e && active.length === 1 : Object.keys(e).every((key: keyof ActiveObject) => activeObject[key] === e[key]) && Object.keys(activeObject).length === Object.keys(e).length)) {
			disabled = true;
		}

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
					{phase === 2 ? (
						<IconButton
							icon="&#xE15B;"
							onClick={this.removeFromList.bind(null, args as DeactivateArgs)}
							disabled={disabled}
							flat
							/>
					) : null}
					<IconButton icon="&#xE88F;" flat disabled />
				</div>
			</div>
		);
	}
}
