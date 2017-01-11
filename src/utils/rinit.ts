import { RawAdvantage, RawAttribute, RawCombatTechnique, RawData, RawDisadvantage, RawLiturgy, RawSpecialAbility, RawSpell, RawTalent } from '../actions/ServerActions';
import { Advantage, Attribute, CombatTechnique, Disadvantage, Liturgy, SpecialAbility, Spell, Talent } from '../reducers/AbilitiesReducer';
import { ADVANTAGES, ATTRIBUTES, COMBAT_TECHNIQUES, DISADVANTAGES, LITURGIES, SPECIAL_ABILITIES, SPELLS, TALENTS } from '../constants/Categories';

function initAttribute({ id, name, short }: RawAttribute): Attribute {
	return {
		id,
		name,
		dependencies: [],
		short,
		category: ATTRIBUTES,
		value: 8,
		mod: 0,
		ic: 5
	};
}

function initTalent({ id, name, skt, gr, check, be, spec, spec_input }: RawTalent): Talent {
	return {
		id,
		name,
		dependencies: [],
		ic: skt,
		gr,
		value: 0,
		check,
		enc: be,
		spec,
		spec_input,
		category: TALENTS
	};
}

function initCombatTechnique({ id, name, skt, gr, leit }: RawCombatTechnique): CombatTechnique {
	return {
		id,
		name,
		dependencies: [],
		ic: skt,
		gr,
		primary: leit,
		value: 6,
		category: COMBAT_TECHNIQUES
	};
}

function initSpell({ id, name, skt, gr, check, trad, merk }: RawSpell): Spell {
	return {
		id,
		name,
		dependencies: [],
		ic: skt,
		gr,
		value: 0,
		check: check.map((e,i) => typeof e === 'number' ? `ATTR_${e}` : e),
		tradition: trad,
		property: merk,
		active: false,
		category: SPELLS
	};
}

function initLiturgy({ id, name, skt, gr, check, trad, aspc }: RawLiturgy): Liturgy {
	return {
		id,
		name,
		dependencies: [],
		ic: skt,
		gr,
		value: 0,
		check: check.map((e,i) => typeof e === 'number' ? `ATTR_${e}` : e),
		tradition: trad,
		aspect: aspc,
		active: false,
		category: LITURGIES
	};
}

function initAdvantage({ id, name, ap, tiers, max, sel, input, req }: RawAdvantage): Advantage {
	return {
		id,
		name,
		dependencies: [],
		cost: ap,
		input,
		max,
		reqs: req,
		sel: sel as [string, number][],
		tiers,
		active: max === null ? false : [],
		category: ADVANTAGES
	};
}

function initDisadvantage({ id, name, ap, tiers, max, sel, input, req }: RawDisadvantage): Disadvantage {
	return {
		id,
		name,
		dependencies: [],
		cost: ap,
		input,
		max,
		reqs: req,
		sel: sel as [string, number][],
		tiers,
		active: max === null ? false : [],
		category: DISADVANTAGES
	};
}

function initSpecialAbility({ id, name, ap, gr, max, sel, input, req }: RawSpecialAbility): SpecialAbility {
	return {
		id,
		name,
		dependencies: [],
		cost: ap,
		gr,
		input,
		max,
		reqs: req,
		sel: sel as [string, number][],
		active: max === null ? false : [],
		category: SPECIAL_ABILITIES
	};
}

type Source = RawAdvantage | RawAttribute | RawCombatTechnique | RawDisadvantage | RawLiturgy | RawSpecialAbility | RawSpell | RawTalent;
type Instance = Advantage | Attribute | CombatTechnique | Disadvantage | Liturgy | SpecialAbility | Spell | Talent;
type Category = ADVANTAGES | ATTRIBUTES | COMBAT_TECHNIQUES | DISADVANTAGES | LITURGIES | SPECIAL_ABILITIES | SPELLS | TALENTS;

export default ({ attributes, adv, combattech, disadv, talents, professions, professionVariants, races, spells, liturgies, specialabilities }: RawData) => {
	const byId: { [id: string]: Instance } = {};
	const allIds: string[] = [];
	const byCategory = {
		attributes: <string[]>[],
		combatTechniques: <string[]>[],
		disAdvantages: <string[]>[],
		liturgies: <string[]>[],
		specialAbilities: <string[]>[],
		spells: <string[]>[],
		talents: <string[]>[]
	}

	const iterate = <RawT, T extends Instance>(source: { [id: string]: RawT }, init: (data: RawT) => T) => {
		for (const id in source) {
			byId[id] = init(source[id]);
			allIds.push(id);

			if (byId[id].category === ATTRIBUTES) {
				byCategory.attributes.push(id);
			}
			else if (byId[id].category === COMBAT_TECHNIQUES) {
				byCategory.combatTechniques.push(id);
			}
			else if (byId[id].category === ADVANTAGES || byId[id].category === DISADVANTAGES) {
				byCategory.disAdvantages.push(id);
			}
			else if (byId[id].category === LITURGIES) {
				byCategory.liturgies.push(id);
			}
			else if (byId[id].category === SPECIAL_ABILITIES) {
				byCategory.specialAbilities.push(id);
			}
			else if (byId[id].category === SPELLS) {
				byCategory.spells.push(id);
			}
			else if (byId[id].category === TALENTS) {
				byCategory.talents.push(id);
			}
		}
	};

	const getAllByCategory = (...categories: Category[]) => {
		const list = [];
		for (const id in byId) {
			const obj = byId[id];
			if (categories.includes(obj.category)) {
				list.push(obj);
			}
		}
		return list;
	};

	iterate(attributes, initAttribute);
	iterate(talents, initTalent);
	iterate(combattech, initCombatTechnique);
	iterate(spells, initSpell);
	iterate(liturgies, initLiturgy);
	iterate(adv, initAdvantage);
	iterate(disadv, initDisadvantage);
	iterate(specialabilities, initSpecialAbility);

	for (const id in byId) {
		const ability = byId[id];
		if (ability.category === ADVANTAGES || ability.category === DISADVANTAGES || ability.category === SPECIAL_ABILITIES) {
			ability.sel = (() => {
				if (['ADV_4', 'ADV_16', 'ADV_17', 'ADV_47', 'DISADV_48'].includes(id)) {
					return getAllByCategory(...(ability.sel as [Category][]).map(e => e[0]))
					.filter(({ category: cg, gr }: { category: Category, gr?: number }) => !((cg === SPELLS && gr === 5) || (cg === LITURGIES && gr === 3)))
					.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
					.map(e => [ e.name, e.id ]);
				}

				if (id === 'SA_72') {
					return (ability.sel as [string, number][]).map((e, i) => [ byId[e[0]].name, i + 1, e[1] ]);
				}

				if (id === 'SA_10') {
					return getAllByCategory(TALENTS).map(({ id, name, ic, spec, spec_input }: Talent) => {
						const newSpec = spec === null ? [] : spec.map((n, i) => [n, i + 1]) as [string, number][];
						return [ name, id, ic, newSpec, spec_input ];
					});
				}

				const isAdv = ['ADV_28', 'ADV_29', 'ADV_32'].includes(id);
				const isSA = !['SA_3', 'SA_28', 'SA_30'].includes(id) && ability.category === SPECIAL_ABILITIES;
				const isDisadv = ability.category === DISADVANTAGES;

				if (isAdv || isSA || isDisadv) {
					return (ability.sel as [string, number][]).map((e, i) => {
						const arr = [e[0], i + 1];
						if (e[1] !== null) {
							arr[2] = e[1];
						}
						return arr;
					});
				}

				return ability.sel;
			})();
		}
	}

	(byId['DISADV_34'] as Disadvantage).sel = [
		['99 Gesetze', 1, 1],
		['Moralkodex der Hesindekirche', 2, 1],
		['Moralkodex der Phexkirche', 3, 1],
		['Moralkodex der Perainekirche', 4, 1],
		['99 Gesetze (streng)', 5, 2],
		['Ehrenkodex der Krieger', 6, 2],
		['Ehrenkodex der Ritter', 7, 2],
		['Elfische Weltsicht', 8, 2],
		['Moralkodex der Boronkirche', 9, 2],
		['Moralkodex der Praioskirche', 10, 2],
		['Moralkodex der Rondrakirche', 11, 2],
		['Zwergischer Ehrenkodex', 12, 2],
		['99 Gesetze (radikal)', 13, 3],
		['Pazifismus', 14, 3]
	];
	(byId['DISADV_50'] as Disadvantage).sel = [
		['Sippenmitglied gegenüber der Sippe', 1, 1],
		['Verschuldeter Held', 2, 1],
		['Adliger gegenüber seinem Lehnsherrn', 3, 2],
		['Geweihter gegenüber seinem Tempel', 5, 2],
		['Geweihter gegenüber seiner Kirche', 4, 2],
		['Magier gegenüber seinem Lehrmeister', 6, 2],
		['Magier gegenüber seiner Akademie', 7, 2],
		['Magier gegenüber seiner Gilde', 8, 2],
		['Mitglied einer radikalen Sekte gegenüber den Anführern der Gruppe', 9, 3]
	];

	return { byId, allIds, byCategory };
};
