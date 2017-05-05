import * as Categories from '../constants/Categories';
import { ActivatableInstance, InstanceInInit, SkillishInstance, TalentInstance, ToListById } from '../types/data.d';
import { RawAdvantage, RawAttribute, RawAttributeLocale, RawBlessing, RawCantrip, RawCombatTechnique, RawCulture, RawCultureLocale, RawDisadvantage, RawLiturgy, RawLocale, RawProfession, RawProfessionVariant, RawRace, RawRaceLocale, RawSpecialAbility, RawSpell, RawTables, RawTalent } from '../types/rawdata.d';
import * as InitUtils from '../utils/InitUtils';

type RawDataClass = RawAdvantage | RawAttribute | RawBlessing | RawCantrip | RawCombatTechnique | RawCulture | RawDisadvantage | RawLiturgy | RawProfession | RawProfessionVariant | RawRace | RawSpecialAbility | RawSpell | RawTalent;

type RawLocales = RawAttributeLocale | RawRaceLocale | RawCultureLocale;

interface List {
	[id: string]: InstanceInInit;
}

const isActivatableInstance = (obj: InstanceInInit): obj is ActivatableInstance => {
	return [Categories.ADVANTAGES, Categories.DISADVANTAGES, Categories.SPECIAL_ABILITIES].includes(obj.category);
};

export function init(raw: RawTables, rawlocale: RawLocale) {
	const { attributes, adv, blessings, cantrips, cultures, disadv, talents, combattech, professions, professionVariants, races, spells, liturgies, specialabilities } = raw;

	const list: List = {};

	const iterate = <TRaw extends RawDataClass, T extends InstanceInInit, L extends RawLocales>(source: { [id: string]: TRaw }, initFn: (raw: TRaw, locale: ToListById<L>) => T | undefined, locale: ToListById<L>) => {
		for (const id in source) {
			if (source.hasOwnProperty(id)) {
				const result = initFn(source[id], locale);
				if (result) {
					list[id] = result;
				}
			}
		}
	};

	const getAllByCategory = (...categories: Categories.Category[]) => {
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

	iterate(races, InitUtils.initRace, rawlocale.races);
	iterate(cultures, InitUtils.initCulture, rawlocale.cultures);
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
		blessings: [],
		spells: [],
		subname: '',
		talents: [],
		typ_adv: [],
		typ_dadv: [],
		untyp_adv: [],
		untyp_dadv: [],
		vars: [],
		gr: 0,
		sgr: 0,
		src: { id: 'US25001' }
	});
	iterate(professionVariants, InitUtils.initProfessionVariant);
	iterate(attributes, InitUtils.initAttribute, rawlocale.attributes);
	iterate(talents, InitUtils.initTalent, rawlocale.talents);
	iterate(combattech, InitUtils.initCombatTechnique);
	iterate(spells, InitUtils.initSpell);
	iterate(cantrips, InitUtils.initCantrip);
	iterate(liturgies, InitUtils.initLiturgy);
	iterate(blessings, InitUtils.initBlessing);
	iterate(adv, InitUtils.initAdvantage);
	iterate(disadv, InitUtils.initDisadvantage);
	iterate(specialabilities, InitUtils.initSpecialAbility);

	for (const id in list) {
		if (list.hasOwnProperty(id)) {
			const obj = list[id] as InstanceInInit;
			if (isActivatableInstance(obj)) {
				if (['ADV_4', 'ADV_16', 'ADV_17', 'ADV_47', 'DISADV_48', 'SA_252', 'SA_273'].includes(id)) {
					const rawNames = getAllByCategory(...obj.sel!.map(e => e.name as Categories.Category)) as SkillishInstance[];
					const mapped = rawNames.map(({ id, name, ic }) => ({ id, name, cost: ic }));
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

				list[id] = obj;
			}
		}
	}
	return list;
}
