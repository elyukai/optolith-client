import * as Categories from '../constants/Categories';
import * as InitUtils from '../utils/InitUtils';

type RawDataClass = RawAdvantage | RawAttribute | RawCombatTechnique | RawCulture | RawDisadvantage | RawLiturgy | RawProfession | RawProfessionVariant | RawRace | RawSpecialAbility | RawSpell | RawTalent;

type Source = {
	[id: string]: RawDataClass;
} & object;

interface List {
	[id: string]: InstanceInInit;
}

const isActivatableInstance = (obj: InstanceInInit): obj is ActivatableInstance => {
	return [Categories.ADVANTAGES, Categories.DISADVANTAGES, Categories.SPECIAL_ABILITIES].includes(obj.category);
};

export default (raw: RawData) => {
	const { attributes, adv, cultures, disadv, talents, combattech, professions, professionVariants, races, spells, liturgies, specialabilities } = raw;

	const list: List = {};

	const iterate = <TRaw extends RawDataClass, T extends InstanceInInit>(source: { [id: string]: TRaw }, initFn: (raw: TRaw) => T) => {
		for (const id in source) {
			if (source.hasOwnProperty(id)) {
				list[id] = initFn(source[id]);
			}
		}
	};

	const getAllByCategory = (...categories: Category[]) => {
		const filteredList = [];
		for (const id in list) {
			if (list.hasOwnProperty(id)) {
				const obj = list[id];
				if (categories.includes(obj.category)) {
					filteredList.push(obj);
				}
			}
		}
		return filteredList;
	};

	iterate(races, InitUtils.initRace);
	iterate(cultures, InitUtils.initCulture);
	iterate(professions, InitUtils.initProfession);
	list.P_0 = InitUtils.initProfession({
		ap: 0,
		chants: [],
		combattech: [],
		id: 'P_0',
		name: 'Eigene Profession',
		pre_req: [],
		req: [],
		sa: [],
		sel: [],
		spells: [],
		subname: '',
		talents: [],
		typ_adv: [],
		typ_dadv: [],
		untyp_adv: [],
		untyp_dadv: [],
		vars: [],
	});
	iterate(professionVariants, InitUtils.initProfessionVariant);
	iterate(attributes, InitUtils.initAttribute);
	iterate(talents, InitUtils.initTalent);
	iterate(combattech, InitUtils.initCombatTechnique);
	iterate(spells, InitUtils.initSpell);
	iterate(liturgies, InitUtils.initLiturgy);
	iterate(adv, InitUtils.initAdvantage);
	iterate(disadv, InitUtils.initDisadvantage);
	iterate(specialabilities, InitUtils.initSpecialAbility);

	for (const id in list) {
		if (list.hasOwnProperty(id)) {
			const obj = list[id];
			if (isActivatableInstance(obj)) {
				if (['ADV_4', 'ADV_16', 'ADV_17', 'ADV_47', 'DISADV_48'].includes(id)) {
					const rawNames = getAllByCategory(...obj.sel.map(e => e.id as Category)) as SkillishInstance[];
					const filtered = rawNames.filter(({ category, gr }) => {
						const isCantrip = category === Categories.SPELLS && gr === 5;
						const isBlessing = category === Categories.LITURGIES && gr === 3;
						return !isCantrip && !isBlessing;
					});
					const mapped = filtered.map(({ id, name, ic }) => ({ id, name, cost: ic }));
					mapped.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
					obj.sel = mapped;
				}

				if (id === 'SA_72') {
					type SpecialAbility72Selection = Array<{ id: number; name: string; cost: number; }>;
					obj.sel = (obj.sel as SpecialAbility72Selection).map(e => ({ ...e, name: list[e.name].name as string }));
				}

				if (id === 'SA_10') {
					const talents = getAllByCategory(Categories.TALENTS) as TalentInstance[];
					obj.sel = talents.map(talent => {
						const { id, name, ic, specialisation, specialisationInput } = talent;
						return {
							id,
							name,
							cost: ic,
							specialisation,
							specialisationInput,
						};
					});
				}
			}
		}
	}
	return list;
};
