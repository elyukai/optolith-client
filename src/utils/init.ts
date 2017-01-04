import {
	RawAdvantage,
	RawAttribute,
	RawCombatTechnique,
	RawCore,
	RawCulture,
	RawData,
	RawDisadvantage,
	RawLiturgy,
	RawProfession,
	RawProfessionVariant,
	RawRace,
	RawSpecialAbility,
	RawSpell,
	RawTalent
} from '../actions/ServerActions';
import Categories from '../constants/Categories';
import {
	Advantage,
	Attribute,
	CombatTechnique,
	Culture,
	Disadvantage,
	Liturgy,
	Profession,
	ProfessionVariant,
	Race,
	SpecialAbility,
	Spell,
	Talent
} from '../utils/DataUtils';

interface List {
	[id: string]: any;
}

type Source = (RawAdvantage | RawAttribute | RawCombatTechnique | RawCore | RawCulture | RawData | RawDisadvantage | RawLiturgy | RawProfession | RawProfessionVariant | RawRace | RawSpecialAbility | RawSpell | RawTalent) & List;

export default ({ attributes, adv, cultures, disadv, talents, combattech, professions, professionVariants, races, spells, liturgies, specialabilities }: RawData) => {
	const _list: List = {};

	const iterate = (source: Source, DataClass) => {
		for (const id in source) {
			_list[id] = new DataClass(source[id]);
		}
	};

	const getAllByCategory = (...categories) => {
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
		const { category, sel } = _list[id];
		if ([Categories.ADVANTAGES, Categories.DISADVANTAGES, Categories.SPECIAL_ABILITIES].includes(category)) {
			_list[id].sel = (() => {
				if (['ADV_4', 'ADV_16', 'ADV_17', 'ADV_47', 'DISADV_48'].includes(id)) {
					return getAllByCategory(...sel.map(e => e[0]))
					.filter(({ category: cg, gr }) => !((cg === 'spells' && gr === 5) || (cg === 'liturgies' && gr === 3)))
					.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
					.map(e => [ e.name, e.id ]);
				}

				if (id === 'SA_72') {
					return sel.map((e,i) => [ _list[e[0]].name, i + 1, e[1] ]);
				}

				if (id === 'SA_10') {
					return getAllByCategory('talents')
					.map(({ id, name, ic, spec, spec_input }) => {
						spec = spec === null ? [] : spec.map((n, i) => [n, i + 1]);
						return [ name, id, ic, spec, spec_input ];
					});
				}

				const isAdv = ['ADV_28', 'ADV_29', 'ADV_32'].includes(id);
				const isSA = !['SA_3', 'SA_28', 'SA_30'].includes(id) && category === Categories.SPECIAL_ABILITIES;
				const isDisadv = category === Categories.DISADVANTAGES;

				if (isAdv || isSA || isDisadv) {
					return sel.map((e, i) => {
						const arr = [e[0], i + 1];
						if (e[1] !== null) {
							arr[2] = e[1];
						}
						return arr;
					});
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
