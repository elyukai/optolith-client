import * as Categories from '../constants/Categories';
import { DependentInstancesState } from '../reducers/dependentInstances';
import { getAllByCategoryGroup } from '../selectors/dependentInstancesSelectors';
import { AdvantageInstanceInInit, DisadvantageInstanceInInit, InstanceInInit, SelectionObject, SkillishInstance, SpecialAbilityInstanceInInit, ToListById } from '../types/data.d';
import { RawAdvantage, RawAdvantageLocale, RawAttribute, RawAttributeLocale, RawBlessing, RawBlessingLocale, RawCantrip, RawCantripLocale, RawCombatTechnique, RawCombatTechniqueLocale, RawCulture, RawCultureLocale, RawDisadvantage, RawDisadvantageLocale, RawLiturgy, RawLiturgyLocale, RawLocale, RawProfession, RawProfessionLocale, RawProfessionVariant, RawProfessionVariantLocale, RawRace, RawRaceLocale, RawSpecialAbility, RawSpecialAbilityLocale, RawSpell, RawSpellLocale, RawTables, RawTalent, RawTalentLocale } from '../types/rawdata.d';
import { _translate } from '../utils/I18n';
import { getStateKeyByCategory } from '../utils/IDUtils';
import * as InitUtils from '../utils/InitUtils';

type RawDataClass = RawAdvantage | RawAttribute | RawBlessing | RawCantrip | RawCombatTechnique | RawCulture | RawDisadvantage | RawLiturgy | RawProfession | RawProfessionVariant | RawRace | RawSpecialAbility | RawSpell | RawTalent;

type RawLocales = RawAdvantageLocale | RawAttributeLocale | RawBlessingLocale | RawCantripLocale | RawCombatTechniqueLocale | RawDisadvantageLocale | RawLiturgyLocale | RawProfessionLocale | RawProfessionVariantLocale | RawRaceLocale | RawCultureLocale | RawSpecialAbilityLocale | RawSpellLocale | RawTalentLocale;

export function init(raw: RawTables, rawlocale: RawLocale): DependentInstancesState {
	const { attributes, advantages, blessings, cantrips, cultures, disadvantages, talents, combattech, professions, professionvariants, races, spells, liturgies, specialabilities } = raw;

	const list: DependentInstancesState = {
		advantages: new Map(),
		attributes: new Map(),
		blessings: new Map(),
		cantrips: new Map(),
		combatTechniques: new Map(),
		cultures: new Map(),
		disadvantages: new Map(),
		liturgies: new Map(),
		professions: new Map(),
		professionVariants: new Map(),
		races: new Map(),
		specialAbilities: new Map(),
		spells: new Map(),
		talents: new Map(),
		blessedStyleDependencies: [],
		combatStyleDependencies: [],
		magicalStyleDependencies: [],
	};

	const iterate = <TRaw extends RawDataClass, T extends InstanceInInit, L extends RawLocales>(source: { [id: string]: TRaw }, initFn: (raw: TRaw, locale: ToListById<L>) => T | undefined, locale: ToListById<L>) => {
		const newslice = new Map<string, T>();
		for (const id in source) {
			if (source.hasOwnProperty(id)) {
				const result = initFn(source[id], locale);
				if (result) {
					newslice.set(id, result);
				}
			}
		}
		return newslice;
	};

	list.races = iterate(races, InitUtils.initRace, rawlocale.races);
	list.cultures = iterate(cultures, InitUtils.initCulture, rawlocale.cultures);
	list.professions = iterate(professions, InitUtils.initProfession, rawlocale.professions);
	const ownProfession = InitUtils.initProfession({
		ap: 0,
		apOfActivatables: 0,
		chants: [],
		combattech: [],
		id: 'P_0',
		pre_req: [],
		req: [],
		sa: [],
		sel: [],
		blessings: [],
		spells: [],
		talents: [],
		typ_adv: [],
		typ_dadv: [],
		untyp_adv: [],
		untyp_dadv: [],
		vars: [],
		gr: 0,
		sgr: 0,
		src: []
	}, {
		P_0: {
			id: 'P_0',
			name: _translate(rawlocale.ui, 'professions.ownprofession'),
			req: [],
			src: []
		}
	});
	if (ownProfession) {
		list.professions.set('P_0', ownProfession);
	}
	list.professionVariants = iterate(professionvariants, InitUtils.initProfessionVariant, rawlocale.professionvariants);
	list.attributes = iterate(attributes, InitUtils.initAttribute, rawlocale.attributes);
	list.talents = iterate(talents, InitUtils.initTalent, rawlocale.talents);
	list.combatTechniques = iterate(combattech, InitUtils.initCombatTechnique, rawlocale.combattech);
	list.spells = iterate(spells, InitUtils.initSpell, rawlocale.spells);
	list.cantrips = iterate(cantrips, InitUtils.initCantrip, rawlocale.cantrips);
	list.liturgies = iterate(liturgies, InitUtils.initLiturgy, rawlocale.liturgies);
	list.blessings = iterate(blessings, InitUtils.initBlessing, rawlocale.blessings);
	list.advantages = iterate(advantages, InitUtils.initAdvantage, rawlocale.advantages);
	list.disadvantages = iterate(disadvantages, InitUtils.initDisadvantage, rawlocale.disadvantages);
	list.specialAbilities = iterate(specialabilities, InitUtils.initSpecialAbility, rawlocale.specialabilities);

	function getSelectionCategories(source: SelectionObject[]) {
		const rawNames = source.reduce<SkillishInstance[]>((arr, e) => {
			const key = getStateKeyByCategory(e.id as Categories.Category);
			if (key) {
				return [...arr, ...list[key].values()] as SkillishInstance[];
			}
			return arr;
		}, []);
		const mapped = rawNames.map(({ id, name, ic }) => ({ id, name, cost: ic }));
		mapped.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
		return mapped;
	}

	for (const [id, obj] of list.advantages as Map<string, AdvantageInstanceInInit>) {
		if (['ADV_4', 'ADV_16', 'ADV_17', 'ADV_47'].includes(id) && obj.sel) {
			obj.sel = getSelectionCategories(obj.sel);
		}
		list.advantages.set(id, obj);
	}

	for (const [id, obj] of list.disadvantages as Map<string, DisadvantageInstanceInInit>) {
		if (['DISADV_48'].includes(id) && obj.sel) {
			obj.sel = getSelectionCategories(obj.sel);
		}
		list.disadvantages.set(id, obj);
	}

	for (const [id, obj] of list.specialAbilities as Map<string, SpecialAbilityInstanceInInit>) {
		if (['SA_231', 'SA_250', 'SA_562', 'SA_569'].includes(id) && obj.sel) {
			obj.sel = getSelectionCategories(obj.sel);
		}
		else if (['SA_472', 'SA_473', 'SA_531', 'SA_533'].includes(id) && obj.sel) {
			obj.sel = getAllByCategoryGroup(list, Categories.TALENTS, 4).map(({ id, name, ic }) => ({ id, name, cost: ic }));
		}
		else if (id === 'SA_258' && obj.sel) {
			obj.sel = getSelectionCategories(obj.sel);
		}
		else if (id === 'SA_60') {
			type SpecialAbility72Selection = Array<{ id: number; name: string; cost: number; }>;
			obj.sel = (obj.sel as SpecialAbility72Selection).map(e => {
				const entry = list.combatTechniques.get(e.name);
				return { ...e, name: entry ? entry.name as string : '...' };
			});
		}
		else if (id === 'SA_9') {
			obj.sel = [...list.talents.values()].map(talent => {
				const { id, name, ic, applications, applicationsInput } = talent;
				return {
					id,
					name,
					cost: ic,
					applications,
					applicationsInput,
				};
			});
		}
		list.specialAbilities.set(id, obj);
	}

	return list;
}
