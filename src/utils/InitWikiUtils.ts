import * as Categories from '../constants/Categories';
import { ToListById } from '../types/data';
import { RawAdvantage, RawAdvantageLocale, RawAttribute, RawAttributeLocale, RawBlessing, RawBlessingLocale, RawCantrip, RawCantripLocale, RawCombatTechnique, RawCombatTechniqueLocale, RawCulture, RawCultureLocale, RawDisadvantage, RawDisadvantageLocale, RawExperienceLevel, RawExperienceLevelLocale, RawItem, RawItemLocale, RawLiturgy, RawLiturgyLocale, RawProfession, RawProfessionLocale, RawProfessionVariant, RawProfessionVariantLocale, RawRace, RawRaceLocale, RawRaceVariant, RawRaceVariantLocale, RawSpecialAbility, RawSpecialAbilityLocale, RawSpell, RawSpellLocale, RawTalent, RawTalentLocale } from '../types/rawdata';
import * as Reusable from '../types/reusable';
import { Advantage, Attribute, Blessing, Cantrip, CombatTechnique, Culture, Die, Disadvantage, ExperienceLevel, ItemTemplate, LiturgicalChant, Profession, ProfessionVariant, Race, RaceVariant, SelectionObject, Skill, SpecialAbility, Spell } from '../types/wiki';

export function initExperienceLevel(raw: RawExperienceLevel, locale: ToListById<RawExperienceLevelLocale>): ExperienceLevel | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { name } = localeObject;
    return {
      ...raw,
      id,
      name
    };
  }
  return;
}

interface SizeNew {
	sizeBase: number;
	sizeRandom: Die[];
}

function convertSize(old: (number | [number, number])[] | undefined): SizeNew | undefined {
	return old && old.reduce<SizeNew>((obj, value) => {
		if (typeof value === 'number') {
			return {
				...obj,
				sizeBase: obj.sizeBase + value
			};
		}
		const [ amount, sides ] = value;
		return {
			...obj,
			sizeRandom: [...obj.sizeRandom, { amount, sides }]
		};
	}, {
		sizeBase: 0,
		sizeRandom: []
	})
}

interface WeightNew {
	weightBase: number;
	weightRandom: Die[];
}

function convertWeight(old: (number | [number, number])[]): WeightNew {
	return old.reduce<WeightNew>((obj, value) => {
		if (typeof value === 'number') {
			return {
				...obj,
				weightBase: obj.weightBase + value
			};
		}
		const [ amount, sides ] = value;
		return {
			...obj,
			weightRandom: [...obj.weightRandom, { amount, sides }]
		};
	}, {
		weightBase: 0,
		weightRandom: []
	})
}

export function initRace(raw: RawRace, locale: ToListById<RawRaceLocale>): Race | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const {
      attributeAdjustments: attributeAdjustmentsText,
      automaticAdvantages: automaticAdvantagesText,
      commonAdvantages: commonAdvantagesText,
      commonDisadvantages: commonDisadvantagesText,
      name,
      src: srcPages,
      stronglyRecommendedAdvantages: stronglyRecommendedAdvantagesText,
      stronglyRecommendedDisadvantages: stronglyRecommendedDisadvantagesText,
      uncommonAdvantages: uncommonAdvantagesText,
      uncommonDisadvantages: uncommonDisadvantagesText
    } = localeObject;
    const { ap, attr, attr_sel, auto_adv, autoAdvCost, eyes, gs, hair, imp_adv, imp_dadv, le, src: srcIds, typ_adv, typ_cultures, typ_dadv, size, sk, untyp_adv, untyp_dadv, weight, zk, vars } = raw;
    return {
      ap,
      attributeAdjustments: attr.map<[number, string]>(e => [e[0], `ATTR_${e[1]}`]),
      attributeAdjustmentsSelection: [attr_sel[0], attr_sel[1].map(k => `ATTR_${k}`)],
      attributeAdjustmentsText,
      automaticAdvantages: auto_adv.map(e => `ADV_${e}`),
      automaticAdvantagesCost: autoAdvCost,
      automaticAdvantagesText,
      category: Categories.RACES,
      eyeColors: eyes,
      hairColors: hair,
      id,
      stronglyRecommendedAdvantages: imp_adv.map(e => `ADV_${e}`),
      stronglyRecommendedAdvantagesText,
      stronglyRecommendedDisadvantages: imp_dadv.map(e => `DISADV_${e}`),
      stronglyRecommendedDisadvantagesText,
      lp: le,
      mov: gs,
      name,
			...convertSize(size),
			...convertWeight(weight),
      spi: sk,
      tou: zk,
      commonAdvantages: typ_adv.map(e => `ADV_${e}`),
      commonAdvantagesText,
      commonCultures: typ_cultures.map(e => `C_${e}`),
      commonDisadvantages: typ_dadv.map(e => `DISADV_${e}`),
      commonDisadvantagesText,
      uncommonAdvantages: untyp_adv.map(e => `ADV_${e}`),
      uncommonAdvantagesText,
      uncommonDisadvantages: untyp_dadv.map(e => `DISADV_${e}`),
      uncommonDisadvantagesText,
      variants: vars.map(e => `RV_${e}`),
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }
  return;
}

export function initRaceVariant(raw: RawRaceVariant, locale: ToListById<RawRaceVariantLocale>): RaceVariant | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const {
      commonAdvantages: commonAdvantagesText,
      commonDisadvantages: commonDisadvantagesText,
      name,
      uncommonAdvantages: uncommonAdvantagesText,
      uncommonDisadvantages: uncommonDisadvantagesText
    } = localeObject;
    const { eyes, hair, typ_adv, typ_cultures, typ_dadv, size, untyp_adv, untyp_dadv } = raw;
    return {
      category: Categories.RACE_VARIANTS,
      eyeColors: eyes,
      hairColors: hair,
      id,
      name,
			...convertSize(size),
      commonAdvantages: typ_adv.map(e => `ADV_${e}`),
      commonAdvantagesText,
      commonCultures: typ_cultures.map(e => `C_${e}`),
      commonDisadvantages: typ_dadv.map(e => `DISADV_${e}`),
      commonDisadvantagesText,
      uncommonAdvantages: untyp_adv.map(e => `ADV_${e}`),
      uncommonAdvantagesText,
      uncommonDisadvantages: untyp_dadv.map(e => `DISADV_${e}`),
      uncommonDisadvantagesText
    };
  }
  return;
}

export function initCulture(raw: RawCulture, locale: ToListById<RawCultureLocale>): Culture | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { src: srcPages, commonAdvantages, commonDisadvantages, uncommonAdvantages, uncommonDisadvantages, ...localeRest } = localeObject;
    const { ap, lang, literacy, social, typ_prof, typ_adv, typ_dadv, untyp_adv, untyp_dadv, typ_talents, untyp_talents, talents, src: srcIds } = raw;
    return {
      ...localeRest,
      culturalPackageAdventurePoints: ap,
      category: Categories.CULTURES,
      id,
      languages: lang,
      scripts: literacy,
      socialStatus: social,
      culturalPackageSkills: talents.map(e => ({
				id: `TAL_${e[0]}`,
				value: e[1]
			})),
      commonProfessions: typ_prof,
      commonAdvantages: typ_adv.map(e => `ADV_${e}`),
			commonAdvantagesText: commonAdvantages,
      commonDisadvantages: typ_dadv.map(e => `DISADV_${e}`),
			commonDisadvantagesText: commonDisadvantages,
      uncommonAdvantages: untyp_adv.map(e => `ADV_${e}`),
			uncommonAdvantagesText: uncommonAdvantages,
      uncommonDisadvantages: untyp_dadv.map(e => `DISADV_${e}`),
			uncommonDisadvantagesText: uncommonDisadvantages,
      commonSkills: typ_talents.map(e => `TAL_${e}`),
			uncommonSkills: untyp_talents.map(e => `TAL_${e}`),
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }
  return;
}

export function initProfession(raw: RawProfession, locale: ToListById<RawProfessionLocale>): Profession | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { name, subname, req: localeReq, prerequisitesEnd, prerequisitesStart, suggestedAdvantages, suggestedDisadvantages, unsuitableAdvantages, unsuitableDisadvantages, src: srcPages } = localeObject;
    const { id, ap, apOfActivatables, pre_req, req, sel, sa, combattech, talents, spells, chants, typ_adv, typ_dadv, untyp_adv, untyp_dadv, vars, gr, src: srcIds, blessings, sgr } = raw;
    const finalReq = [ ...req, ...localeReq ];
    return {
      ap,
      apOfActivatables,
      category: Categories.PROFESSIONS,
      combatTechniques: combattech.map(e => ({
				id: `CT_${e[0]}`,
				value: e[1]
			})),
      dependencies: pre_req,
      id,
      liturgicalChants: chants.map(e => ({
				id: `LITURGY_${e[0]}`,
				value: e[1]
			})),
      blessings: blessings.map(e => `BLESSING_${e[0]}`),
      name,
      prerequisites: finalReq,
      selections: sel,
      specialAbilities: sa,
      spells: spells.map(e => ({
				id: `SPELL_${e[0]}`,
				value: e[1]
			})),
      subname,
      skills: talents.map(e => ({
				id: `TAL_${e[0]}`,
				value: e[1]
			})),
      suggestedAdvantages: typ_adv.map(e => `ADV_${e}`),
      suggestedDisadvantages: typ_dadv.map(e => `DISADV_${e}`),
      unsuitableAdvantages: untyp_adv.map(e => `ADV_${e}`),
      unsuitableDisadvantages: untyp_dadv.map(e => `DISADV_${e}`),
      variants: vars.map(e => `PV_${e}`),
      gr,
      subgr: sgr,
      prerequisitesEnd,
      prerequisitesStart,
      suggestedAdvantagesText: suggestedAdvantages,
      suggestedDisadvantagesText: suggestedDisadvantages,
      unsuitableAdvantagesText: unsuitableAdvantages,
      unsuitableDisadvantagesText: unsuitableDisadvantages,
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }
  return;
}

export function initProfessionVariant(raw: RawProfessionVariant, locale: ToListById<RawProfessionVariantLocale>): ProfessionVariant | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { id, ap, apOfActivatables, pre_req, req, sel, sa, combattech, talents, spells, chants } = raw;
    return {
      ...localeObject,
      ap,
      apOfActivatables,
      category: Categories.PROFESSION_VARIANTS,
      combatTechniques: combattech.map(e => ({
				id: `CT_${e[0]}`,
				value: e[1]
			})),
      dependencies: pre_req,
      id,
      prerequisites: req,
      selections: sel,
      specialAbilities: sa,
      skills: talents.map(e => ({
				id: `TAL_${e[0]}`,
				value: e[1]
			})),
      spells: spells.map(e => ({
				id: `SPELL_${e[0]}`,
				value: e[1]
			})),
      liturgicalChants: chants.map(e => ({
				id: `LITURGY_${e[0]}`,
				value: e[1]
			}))
    };
  }
  return;
}

export function initAdvantage(raw: RawAdvantage, locale: ToListById<RawAdvantageLocale>): Advantage | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { sel: localeSel, src: srcPages, req: reqText, reqEnd, reqStart, reqIndex: reqIndexText, ...otherLocale } = localeObject;
    const { ap, sel, req, src: srcIds, reqIndex: reqIndexIgnore, ...otherData } = raw;
    let finalSel: SelectionObject[] | undefined;
    if (localeSel && sel) {
      finalSel = localeSel.map(e => ({ ...sel.find(n => n.id === e.id), ...e }));
    }
    else if (sel) {
      finalSel = sel;
    }
    else if (localeSel) {
      finalSel = localeSel;
    }
    return {
      ...otherLocale,
      ...otherData,
      category: Categories.ADVANTAGES,
      cost: ap,
      id,
      prerequisites: req,
      select: finalSel,
      prerequisitesText: reqText,
      prerequisitesTextEnd: reqEnd,
      prerequisitesTextStart: reqStart,
      prerequisitesTextIndex: new Map<number, string | false>([
        ...Object.entries(reqIndexText).map<[number, string]>(([index, text]) => [Number.parseInt(index) - 1, text]),
        ...reqIndexIgnore.map<[number, false]>(e => [Number.parseInt(e), false])
      ]),
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }
  return;
}

export function initDisadvantage(raw: RawDisadvantage, locale: ToListById<RawDisadvantageLocale>): Disadvantage | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { sel: localeSel, src: srcPages, req: reqText, reqEnd, reqStart, reqIndex: reqIndexText, ...otherLocale } = localeObject;
    const { ap, sel, req, src: srcIds, reqIndex: reqIndexIgnore, ...otherData } = raw;
    let finalSel: SelectionObject[] | undefined;
    if (localeSel && sel) {
      finalSel = localeSel.map(e => ({ ...sel.find(n => n.id === e.id), ...e }));
    }
    else if (sel) {
      finalSel = sel;
    }
    else if (localeSel) {
      finalSel = localeSel;
    }
    return {
      ...otherLocale,
      ...otherData,
      category: Categories.DISADVANTAGES,
      cost: ap,
      prerequisites: req,
      select: finalSel,
      prerequisitesText: reqText,
      prerequisitesTextEnd: reqEnd,
      prerequisitesTextStart: reqStart,
      prerequisitesTextIndex: new Map<number, string | false>([
        ...Object.entries(reqIndexText).map<[number, string]>(([index, text]) => [Number.parseInt(index) - 1, text]),
        ...reqIndexIgnore.map<[number, false]>(e => [Number.parseInt(e), false])
      ]),
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }
  return;
}

export function initSpecialAbility(raw: RawSpecialAbility, locale: ToListById<RawSpecialAbilityLocale>): SpecialAbility | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { sel: localeSel, src: srcPages, req: reqText, reqEnd, reqStart, reqIndex: reqIndexText, ...otherLocale } = localeObject;
    const { ap, sel, req, src: srcIds, reqIndex: reqIndexIgnore, ...otherData } = raw;
    let finalSel: SelectionObject[] | undefined;
    if (localeSel && sel) {
      finalSel = localeSel.map(e => ({ ...sel.find(n => n.id === e.id), ...e }));
    }
    else if (sel) {
      finalSel = sel;
    }
    else if (localeSel) {
      finalSel = localeSel;
    }
    return {
      ...otherLocale,
      ...otherData,
      category: Categories.SPECIAL_ABILITIES,
      cost: ap,
      prerequisites: Array.isArray(req[0]) ? new Map<number, ('RCP' | Reusable.AllRequirementTypes)[]>(req as any) : req as ('RCP' | Reusable.AllRequirementTypes)[],
      select: finalSel,
      prerequisitesText: reqText,
      prerequisitesTextEnd: reqEnd,
      prerequisitesTextStart: reqStart,
      prerequisitesTextIndex: new Map<number, string | false>([
        ...Object.entries(reqIndexText).map<[number, string]>(([index, text]) => [Number.parseInt(index) - 1, text]),
        ...reqIndexIgnore.map<[number, false]>(e => [Number.parseInt(e), false])
      ]),
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }
  return;
}

export function initAttribute(raw: RawAttribute, locale: ToListById<RawAttributeLocale>): Attribute | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { name, short } = localeObject;
    return {
      category: Categories.ATTRIBUTES,
      id,
      name,
      short,
    };
  }
  return;
}

export function initCombatTechnique(raw: RawCombatTechnique, locale: ToListById<RawCombatTechniqueLocale>): CombatTechnique | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { src: srcPages, ...otherLocale } = localeObject;
    const { id, gr, skt, leit, bf, src: srcIds, ...otherData } = raw;
    return {
      ...otherLocale,
      ...otherData,
      category: Categories.COMBAT_TECHNIQUES,
      gr,
      ic: skt,
      primary: leit,
      bf,
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }
  return;
}

export function initLiturgicalChant(raw: RawLiturgy, locale: ToListById<RawLiturgyLocale>): LiturgicalChant | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { name, effect, castingtime, castingtimeShort, kpcost, kpcostShort, range, rangeShort, duration, durationShort, target, src: srcPages } = localeObject;
    const { id, check, gr, skt, aspc, trad, mod, src: srcIds } = raw;
    return {
      aspects: aspc,
      category: Categories.LITURGIES,
      check,
      checkmod: mod,
      gr,
      ic: skt,
      id,
      name,
      tradition: trad,
      effect,
      castingTime: castingtime,
      castingTimeShort: castingtimeShort,
      cost: kpcost,
      costShort: kpcostShort,
      range,
      rangeShort,
      duration,
      durationShort,
      target,
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }
  return;
}

export function initBlessing(raw: RawBlessing, locale: ToListById<RawBlessingLocale>): Blessing | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { name, effect, range, duration, target, src: srcPages } = localeObject;
    const { id, aspc, trad, req, src: srcIds } = raw;
    return {
      id,
      name,
      category: Categories.BLESSINGS,
      aspects: aspc,
      tradition: trad,
			prerequisites: req,
      effect,
      range,
      duration,
			target,
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }
  return;
}

export function initSpell(raw: RawSpell, locale: ToListById<RawSpellLocale>): Spell | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { name, effect, castingtime, castingtimeShort, aecost, aecostShort, range, rangeShort, duration, durationShort, target, src: srcPages } = localeObject;
    const { id, check, gr, skt, merk, trad, subtrad, req, mod, src: srcIds } = raw;
    return {
      category: Categories.SPELLS,
      check,
      checkmod: mod,
      gr,
      ic: skt,
      id,
      name,
      property: merk,
      tradition: trad,
      subtradition: subtrad,
      prerequisites: req,
      effect,
      castingTime: castingtime,
      castingTimeShort: castingtimeShort,
      cost: aecost,
      costShort: aecostShort,
      range,
      rangeShort,
      duration,
      durationShort,
      target,
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }
  return;
}

export function initCantrip(raw: RawCantrip, locale: ToListById<RawCantripLocale>): Cantrip | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { name, effect, range, duration, target, note, src: srcPages } = localeObject;
    const { id, merk, trad, req, src: srcIds } = raw;
    return {
      id,
      name,
      category: Categories.CANTRIPS,
      property: merk,
      tradition: trad,
      prerequisites: req,
      effect,
      range,
      duration,
      target,
      note,
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }
  return;
}

export function initSkill(raw: RawTalent, locale: ToListById<RawTalentLocale>): Skill | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { name, spec, spec_input, ...other } = localeObject;
    const { be, check, gr, skt } = raw;
    return {
      ...other,
      category: Categories.TALENTS,
      check,
      encumbrance: be,
      gr,
      ic: skt,
      name,
      applications: spec,
      applicationsInput: spec_input,
    };
  }
  return;
}

export function initItemTemplate(raw: RawItem, locale: ToListById<RawItemLocale>): ItemTemplate | undefined {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { src: srcPages, ...otherLocale } = localeObject;
    const { imp, primaryThreshold, src: srcIds, ...otherData } = raw;
    return {
      ...otherLocale,
      ...otherData,
      amount: 1,
      improvisedWeaponGroup: imp,
      damageBonus: primaryThreshold,
      isTemplateLocked: true,
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }
  return;
}
