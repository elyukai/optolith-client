import * as Categories from '../constants/Categories';
import Advantage from '../data/Advantage';
import Attribute from '../data/Attribute';
import CombatTechnique from '../data/CombatTechnique';
import Culture from '../data/Culture';
import Disadvantage from '../data/Disadvantage';
import Liturgy from '../data/Liturgy';
import Profession from '../data/Profession';
import ProfessionVariant from '../data/ProfessionVariant';
import Race from '../data/Race';
import SpecialAbility from '../data/SpecialAbility';
import Spell from '../data/Spell';
import Talent from '../data/Talent';

interface List {
	[id: string]: any;
}

type RawDataClass = RawAdvantage | RawAttribute | RawCombatTechnique | RawCulture | RawDisadvantage | RawLiturgy | RawProfession | RawProfessionVariant | RawRace | RawSpecialAbility | RawSpell | RawTalent;

type DataClass = typeof Advantage | typeof Attribute | typeof CombatTechnique | typeof Culture | typeof Disadvantage | typeof Liturgy | typeof Profession | typeof ProfessionVariant | typeof Race | typeof SpecialAbility | typeof Spell | typeof Talent;

type Source = {
	[id: string]: RawDataClass;
};

export default ({ attributes, adv, cultures, disadv, talents, combattech, professions, professionVariants, races, spells, liturgies, specialabilities }: RawData) => {
	const _list: List = {};

	const iterate = (source: Source, DataClass: DataClass) => {
		for (const id in source) {
			_list[id] = new DataClass(source[id]);
		}
	};

	const getAllByCategory = (...categories: Category[]) => {
		const list = [];
		for (const id in _list) {
			const obj = _list[id];
			if (categories.includes(obj.category)) {
				list.push(obj);
			}
		}
		return list;
	};

	iterate(races, Race);
	iterate(cultures, Culture);
	iterate(professions, Profession);
	_list['P_0'] = new Profession({
		id: 'P_0',
		name: 'Eigene Profession',
		subname: '',
		ap: 0,
		pre_req: [],
		req: [],
		sel: [],
		sa: [],
		combattech: [],
		talents: [],
		spells: [],
		chants: [],
		typ_adv: [],
		typ_dadv: [],
		untyp_adv: [],
		untyp_dadv: [],
		vars: []
	});
	iterate(professionVariants, ProfessionVariant);
	iterate(attributes, Attribute);
	iterate(talents, Talent);
	iterate(combattech, CombatTechnique);
	iterate(spells, Spell);
	iterate(liturgies, Liturgy);
	iterate(adv, Advantage);
	iterate(disadv, Disadvantage);
	iterate(specialabilities, SpecialAbility);

	for (const id in _list) {
		const { category, sel } = _list[id] as { category: Category; sel: (string | { id: string | number; name: string; cost?: number; })[] };
		if ([Categories.ADVANTAGES, Categories.DISADVANTAGES, Categories.SPECIAL_ABILITIES].includes(category)) {
			_list[id].sel = (() => {
				if (['ADV_4', 'ADV_16', 'ADV_17', 'ADV_47', 'DISADV_48'].includes(id)) {
					return getAllByCategory(...(sel as { id: string | number; name: Category; cost?: number; }[]).map(e => e.name))
					.filter(({ category: cg, gr }) => !((cg === Categories.SPELLS && gr === 5) || (cg === Categories.LITURGIES && gr === 3)))
					.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
					.map(({ id, name, skt }) => ({ id, name, cost: skt }));
				}

				if (id === 'SA_72') {
					return (sel as { id: number; name: string; cost: number; }[]).map((e,i) => ({ ...e, name: _list[e.name].name }));
				}

				if (id === 'SA_10') {
					return getAllByCategory(Categories.TALENTS).map(({ id, name }) => ({ id, name }));
				}

				return sel;
			})();
		}
	}

	_list['DISADV_34'].sel = [
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
	_list['DISADV_50'].sel = [
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

	return _list;
};
