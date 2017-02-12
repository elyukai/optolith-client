import Dependent from './Dependent';
import { get, getPrimaryAttrID } from '../stores/ListStore';
import validate from '../utils/validate';

export default class Activatable extends Dependent {
	readonly cost: number | number[] | string;
	readonly input: string | null;
	readonly max: number | null;
	readonly reqs: ('RCP' | RequirementObject)[];
	readonly sel: SelectionObject[];
	readonly tiers: number | null;
	readonly gr: number;
	active: ActiveObject[] = [];

	constructor({ ap, input, max, req, sel, tiers, gr, ...args }: RawAdvantage | RawDisadvantage | RawSpecialAbility) {
		super(args);
		this.cost = ap;
		this.input = input;
		this.max = max;
		this.reqs = req;
		this.sel = sel;
		this.tiers = tiers;
		this.gr = gr;
	}

	get isMultiselect() {
		return this.max !== 1;
	}

	get isActive() {
		return this.active.length > 0;
	}

	get isActivatable() {
		return validate(this.reqs);
	}

	get isDeactivatable() {
		return this.dependencies.length === 0;
	}

	get sid() {
		return this.active.map(e => e.sid);
	}

	get dsid() {
		return this.dependencies.map(e => typeof e !== 'number' && typeof e !== 'boolean' && e.sid);
	}

	getSelectionItem = (id: string | number) => {
		for (const selectionItem of this.sel) {
			if (selectionItem.id === id) {
				return selectionItem;
			}
		}
		return undefined;
	}

	activate({ sel, sel2, input, tier }: ActivateObject) {
		const adds: RequirementObject[] = [];
		let active: ActiveObject | undefined;
		let sidNew;
		switch (this.id) {
			case 'ADV_4':
			case 'ADV_16':
			case 'DISADV_48':
				active = { sid: sel };
				sidNew = sel as string;
				break;
			case 'DISADV_1':
			case 'DISADV_34':
			case 'DISADV_50':
				if (!input) {
					active = { sid: sel, tier };
				}
				else if (this.active.filter(e => e.sid === input).length === 0) {
					active = { sid: input, tier };
				}
				break;
			case 'DISADV_33':
				if ([7,8].includes(sel as number) && input) {
					if (this.active.filter(e => e.sid2 === input).length === 0) {
						active = { sid: sel, sid2: input };
					}
				} else {
					active = { sid: sel };
				}
				break;
			case 'DISADV_36':
				if (!input) {
					active = { sid: sel };
				}
				else if (this.active.filter(e => e.sid === input).length === 0) {
					active = { sid: input };
				}
				break;
			case 'SA_10':
				if (input === '') {
					active = { sid: sel, sid2: sel2 };
					adds.push({ id: sel as string, value: (this.active.filter(e => e.sid === sel).length + 1) * 6 });
				} else if (this.active.filter(e => e.sid === input).length === 0) {
					active = { sid: sel, sid2: input };
					adds.push({ id: sel as string, value: (this.active.filter(e => e.sid === sel).length + 1) * 6 });
				}
				break;
			case 'SA_30':
				active = { sid: sel, tier };
				break;

			default:
				if (sel) {
					active = { sid: (this.input && input) || sel };
				}
				else if (input && this.active.filter(e => e.sid === input).length === 0) {
					active = { sid: input };
				}
				else if (tier) {
					active = { tier };
				}
				else if (this.max === 1) {
					active = {};
				}
				break;
		}
		if (active) {
			this.active.push(active);
		}
		return { active, dependencies: this.addDependencies(adds, sidNew) };
	}

	deactivate(index: number) {
		const adds: RequirementObject[] = [];
		const sid = this.active[index].sid;
		let sidOld;
		switch (this.id) {
			case 'ADV_4':
			case 'ADV_16':
			case 'DISADV_48':
				sidOld = sid as string;
				break;
			case 'SA_10':
				adds.push({ id: sid as string, value: this.active.filter(e => e.sid === sid).length * 6 });
				break;
		}
		this.active.splice(index, 1);
		this.removeDependencies(adds, sidOld);
	}

	setTier(index: number, tier: number) {
		this.active[index].tier = tier;
	}

	addDependencies(adds: RequirementObject[] = [], sel?: string) {
		const allReqs = [ ...this.reqs, ...adds ];
		allReqs.forEach(req => {
			if (req !== 'RCP') {
				const { active, value, sid, sid2, type } = req;
				let { id } = req;
				if (id === 'auto_req' || sid === 'GR') {
					return;
				}
				if (id === 'ATTR_PRIMARY') {
					id = getPrimaryAttrID(type as 1 | 2);
					(get(id) as AttributeInstance).addDependency(value as number);
				}
				else {
					let dependency;
					if (Object.keys(req).length === 2) {
						dependency = active as boolean;
					}
					else if (value) {
						dependency = value;
					}
					else {
						dependency = { sid: sid === 'sel' ? sel : sid, sid2 };
					}
					(get(id) as AdvantageInstance | DisadvantageInstance | SpecialAbilityInstance | AttributeInstance | CombatTechniqueInstance | TalentInstance).addDependency(dependency);
				}
			}
		});
	}

	removeDependencies(adds: RequirementObject[] = [], sel?: string) {
		const allReqs = [ ...this.reqs, ...adds ];
		allReqs.forEach(req => {
			if (req !== 'RCP') {
				const { active, value, sid, sid2, type } = req;
				let { id } = req;
				if (id === 'auto_req' || sid === 'GR') {
					return;
				}
				if (id === 'ATTR_PRIMARY') {
					id = getPrimaryAttrID(type as 1 | 2);
					(get(id) as AttributeInstance).removeDependency(value as number);
				}
				else {
					let dependency;
					if (Object.keys(req).length === 2) {
						dependency = active as boolean;
					}
					else if (value) {
						dependency = value;
					}
					else {
						dependency = { sid: sid === 'sel' ? sel : sid, sid2 };
					}
					(get(id) as AdvantageInstance | DisadvantageInstance | SpecialAbilityInstance | AttributeInstance | CombatTechniqueInstance | TalentInstance).removeDependency(dependency);
				}
			}
		});
	}

	reset() {
		this.active = [];
		this.dependencies = [];
	}
}
