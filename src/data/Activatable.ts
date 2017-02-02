import Dependent from './Dependent';
import { get, getPrimaryAttrID } from '../stores/ListStore';
import validate from '../utils/validate';

export default class Activatable extends Dependent {
	readonly cost: number;
	readonly input: string | null;
	readonly max: number | null;
	readonly reqs: [string, string | number | boolean, string | number | boolean | undefined][];
	readonly sel: (string | number | boolean)[][];
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

	activate({ sel, sel2, input, tier }: ActivateObject) {
		const adds: [string, number][] = [];
		let active: ActiveObject | undefined;
		let new_sid;
		switch (this.id) {
			case 'ADV_4':
			case 'ADV_16':
			case 'DISADV_48':
				active = { sid: sel };
				new_sid = sel as string;
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
					adds.push([sel as string, (this.active.filter(e => e.sid === sel).length + 1) * 6]);
				} else if (this.active.filter(e => e.sid === input).length === 0) {
					active = { sid: sel, sid2: input };
					adds.push([sel as string, (this.active.filter(e => e.sid === sel).length + 1) * 6]);
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
		return { active, dependencies: this.addDependencies(adds, new_sid) };
	}

	deactivate(active: ActiveObject) {
		const { sid, sid2, tier } = active;
		const adds: [string, number][] = [];
		let old_sid;
		switch (this.id) {
			case 'ADV_4':
			case 'ADV_16':
			case 'DISADV_48':
				old_sid = sid as string;
				break;
			case 'SA_10':
				adds.push([sid as string, this.active.filter(e => e.sid === sid).length * 6]);
				break;
		}
		this.active.some((e, index) => {
			const isEqual = Object.keys(active).every((key: keyof ActiveObject) => active[key] === e[key]) && Object.keys(active).length === Object.keys(e).length;
			if (isEqual) {
				this.active.splice(index, 1);
				return true;
			}
			return false;
		});
		this.removeDependencies(adds, old_sid);
	}

	setTier(active: SetTierObject) {
		this.active.some((e, index) => {
			const isEqual = Object.keys(active).every((key: keyof ActiveObject) => key === 'tier' || active[key] === e[key]) && Object.keys(active).length === Object.keys(e).length;
			if (isEqual) {
				this.active[index] = active;
				return true;
			}
			return false;
		});
	}

	addDependencies(adds: [string, number][] = [], sel?: string) {
		const allReqs = [ ...this.reqs, ...adds as [string, number, undefined][] ];
		allReqs.forEach(req => {
			let [ id, value, option ] = req;
			if (id === 'auto_req' || option === 'TAL_GR_2') {
				return;
			}
			if (id === 'ATTR_PRIMARY') {
				id = getPrimaryAttrID(option);
				(get(id) as Attribute).addDependency(value);
			}
			else {
				let sid: string | number | boolean;
				if (typeof option !== 'undefined') {
					if (typeof option === 'boolean' || typeof option === 'string' && Number.isNaN(parseInt(option))) {
						if (option === 'sel' && sel) {
							sid = sel;
						} else {
							sid = option;
						}
					} else {
						sid = typeof option === 'number' ? option : parseInt(option);
					}
				} else {
					sid = value;
				}
				(get(id) as Advantage | Disadvantage | SpecialAbility).addDependency(sid);
			}
		});
		return allReqs;
	}

	removeDependencies(adds: [string, number][] = [], sel?: string) {
		const allReqs = [ ...this.reqs, ...adds as [string, number, undefined][] ];
		allReqs.forEach(req => {
			let [ id, value, option ] = req;
			if (id === 'auto_req' || option === 'TAL_GR_2') {
				return;
			}
			if (id === 'ATTR_PRIMARY') {
				id = getPrimaryAttrID(option);
				(get(id) as Advantage | Disadvantage | SpecialAbility).removeDependency(value);
			}
			else {
				let sid: string | number | boolean;
				if (typeof option !== 'undefined') {
					if (typeof option === 'boolean' || typeof option === 'string' && Number.isNaN(parseInt(option))) {
						if (option === 'sel' && sel) {
							sid = sel;
						} else {
							sid = option;
						}
					} else {
						sid = typeof option === 'number' ? option : parseInt(option);
					}
				} else {
					sid = value;
				}
				(get(id) as Advantage | Disadvantage | SpecialAbility).removeDependency(sid);
			}
		});
		return allReqs;
	}

	reset() {
		this.active = [];
		this.dependencies = [];
	}
}
