import * as Categories from '../constants/Categories';
import { AdvantageInstance, AttributeInstance, BlessingInstance, CantripInstance, CombatTechniqueInstance, CultureInstance, DisadvantageInstance, ExperienceLevel, ItemInstance, LiturgyInstance, ProfessionInstance, ProfessionVariantInstance, RaceInstance, SelectionObject, SpecialAbilityInstance, SpellInstance, TalentInstance, ToListById } from '../types/data.d';
import { RawAdvantage, RawAdvantageLocale, RawAttribute, RawAttributeLocale, RawBlessing, RawBlessingLocale, RawCantrip, RawCantripLocale, RawCombatTechnique, RawCombatTechniqueLocale, RawCulture, RawCultureLocale, RawDisadvantage, RawDisadvantageLocale, RawExperienceLevel, RawExperienceLevelLocale, RawItem, RawItemLocale, RawLiturgy, RawLiturgyLocale, RawProfession, RawProfessionLocale, RawProfessionVariant, RawProfessionVariantLocale, RawRace, RawRaceLocale, RawSpecialAbility, RawSpecialAbilityLocale, RawSpell, RawSpellLocale, RawTalent, RawTalentLocale } from '../types/rawdata.d';

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

export function initRace(raw: RawRace, locale: ToListById<RawRaceLocale>): RaceInstance | undefined {
	const { id } = raw;
	const localeObject = locale[id];
	if (localeObject) {
		const {
			attributeAdjustments: attributeAdjustmentsText,
			automaticAdvantages: automaticAdvantagesText,
			commonAdvantages: commonAdvantagesText,
			commonDisadvantages: commonDisadvantagesText,
			name,
			src: page,
			stronglyRecommendedAdvantages: stronglyRecommendedAdvantagesText,
			stronglyRecommendedDisadvantages: stronglyRecommendedDisadvantagesText,
			uncommonAdvantages: uncommonAdvantagesText,
			uncommonDisadvantages: uncommonDisadvantagesText
		} = localeObject;
		const { ap, attr, attr_sel, auto_adv, autoAdvCost, eyes, gs, hair, imp_adv, imp_dadv, le, src: bookId, typ_adv, typ_cultures, typ_dadv, size, sk, untyp_adv, untyp_dadv, weight, zk } = raw;
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
			size,
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
			weight,
			src: {
				id: bookId,
				page
			}
		};
	}
	return;
}

export function initCulture(raw: RawCulture, locale: ToListById<RawCultureLocale>): CultureInstance | undefined {
	const { id } = raw;
	const localeObject = locale[id];
	if (localeObject) {
		const { name } = localeObject;
		const { ap, lang, literacy, social, typ_prof, typ_adv, typ_dadv, untyp_adv, untyp_dadv, typ_talents, untyp_talents, talents } = raw;
		return {
			ap,
			category: Categories.CULTURES,
			id,
			languages: lang,
			name,
			scripts: literacy,
			socialTiers: social,
			talents: talents.map<[string, number]>(e => [`TAL_${e[0]}`, e[1]]),
			typicalAdvantages: typ_adv.map(e => `ADV_${e}`),
			typicalDisadvantages: typ_dadv.map(e => `DISADV_${e}`),
			typicalProfessions: typ_prof,
			typicalTalents: typ_talents.map(e => `TAL_${e}`),
			untypicalAdvantages: untyp_adv.map(e => `ADV_${e}`),
			untypicalDisadvantages: untyp_dadv.map(e => `DISADV_${e}`),
			untypicalTalents: untyp_talents.map(e => `TAL_${e}`),
		};
	}
	return;
}

export function initProfession(raw: RawProfession, locale: ToListById<RawProfessionLocale>): ProfessionInstance | undefined {
	const { id } = raw;
	const localeObject = locale[id];
	if (localeObject) {
		const { name, subname, req: localeReq, src: page } = localeObject;
		const { id, ap, pre_req, req, sel, sa, combattech, talents, spells, chants, typ_adv, typ_dadv, untyp_adv, untyp_dadv, vars, gr, src, blessings, sgr } = raw;
		const finalReq = [ ...req, ...localeReq ];
		return {
			ap,
			category: Categories.PROFESSIONS,
			combatTechniques: combattech.map<[string, number]>(e => [`CT_${e[0]}`, e[1]]),
			dependencies: pre_req,
			id,
			liturgies: chants.map<[string, number]>(e => [`LITURGY_${e[0]}`, e[1]]),
			blessings: blessings.map(e => `BLESSING_${e[0]}`),
			name,
			requires: finalReq,
			selections: sel,
			specialAbilities: sa,
			spells: spells.map<[string, number]>(e => [`SPELL_${e[0]}`, e[1]]),
			subname,
			talents: talents.map<[string, number]>(e => [`TAL_${e[0]}`, e[1]]),
			typicalAdvantages: typ_adv.map(e => `ADV_${e}`),
			typicalDisadvantages: typ_dadv.map(e => `DISADV_${e}`),
			untypicalAdvantages: untyp_adv.map(e => `ADV_${e}`),
			untypicalDisadvantages: untyp_dadv.map(e => `DISADV_${e}`),
			variants: vars.map(e => `PV_${e}`),
			gr,
			subgr: sgr,
			src: {
				id: src,
				page
			}
		};
	}
	return;
}

export function initProfessionVariant(raw: RawProfessionVariant, locale: ToListById<RawProfessionVariantLocale>): ProfessionVariantInstance | undefined {
	const { id } = raw;
	const localeObject = locale[id];
	if (localeObject) {
		const { name } = localeObject;
		const { id, ap, pre_req, req, sel, sa, combattech, talents, spells, chants } = raw;
		return {
			ap,
			category: Categories.PROFESSION_VARIANTS,
			combatTechniques: combattech.map<[string, number]>(e => [`CT_${e[0]}`, e[1]]),
			dependencies: pre_req,
			id,
			name,
			requires: req,
			selections: sel,
			specialAbilities: sa,
			talents: talents.map<[string, number]>(e => [`TAL_${e[0]}`, e[1]]),
			spells: spells.map<[string, number]>(e => [`SPELL_${e[0]}`, e[1]]),
			liturgies: chants.map<[string, number]>(e => [`LITURGY_${e[0]}`, e[1]])
		};
	}
	return;
}

export function initAdvantage(raw: RawAdvantage, locale: ToListById<RawAdvantageLocale>): AdvantageInstance | undefined {
	const { id } = raw;
	const localeObject = locale[id];
	if (localeObject) {
		const { name, input, sel: localeSel } = localeObject;
		const { id, ap, max, sel, req, tiers } = raw;
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
			active: [],
			category: Categories.ADVANTAGES,
			cost: ap,
			dependencies: [],
			id,
			input,
			max,
			name,
			reqs: req,
			sel: finalSel,
			tiers,
			gr: 1
		};
	}
	return;
}

export function initDisadvantage(raw: RawDisadvantage, locale: ToListById<RawDisadvantageLocale>): DisadvantageInstance | undefined {
	const { id } = raw;
	const localeObject = locale[id];
	if (localeObject) {
		const { name, input, sel: localeSel } = localeObject;
		const { id, ap, max, sel, req, tiers } = raw;
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
			active: [],
			category: Categories.DISADVANTAGES,
			cost: ap,
			dependencies: [],
			id,
			input,
			max,
			name,
			reqs: req,
			sel: finalSel,
			tiers,
			gr: 1
		};
	}
	return;
}

export function initSpecialAbility(raw: RawSpecialAbility, locale: ToListById<RawSpecialAbilityLocale>): SpecialAbilityInstance | undefined {
	const { id } = raw;
	const localeObject = locale[id];
	if (localeObject) {
		const { name, sel: localeSel, input } = localeObject;
		const { id, ap, tiers, max, sel, req, gr } = raw;
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
			active: [],
			category: Categories.SPECIAL_ABILITIES,
			cost: ap,
			dependencies: [],
			gr,
			id,
			input,
			tiers,
			max,
			name,
			reqs: req,
			sel: finalSel
		};
	}
	return;
}

export function initAttribute(raw: RawAttribute, locale: ToListById<RawAttributeLocale>): AttributeInstance | undefined {
	const { id } = raw;
	const localeObject = locale[id];
	if (localeObject) {
		const { name, short } = localeObject;
		return {
			category: Categories.ATTRIBUTES,
			dependencies: [],
			ic: 5,
			id,
			mod: 0,
			name,
			short,
			value: 8,
		};
	}
	return;
}

export function initCombatTechnique(raw: RawCombatTechnique, locale: ToListById<RawCombatTechniqueLocale>): CombatTechniqueInstance | undefined {
	const { id } = raw;
	const localeObject = locale[id];
	if (localeObject) {
		const { name } = localeObject;
		const { id, gr, skt, leit, bf } = raw;
		return {
			category: Categories.COMBAT_TECHNIQUES,
			dependencies: [],
			gr,
			ic: skt,
			id,
			name,
			primary: leit,
			value: 6,
			bf
		};
	}
	return;
}

export function initLiturgy(raw: RawLiturgy, locale: ToListById<RawLiturgyLocale>): LiturgyInstance | undefined {
	const { id } = raw;
	const localeObject = locale[id];
	if (localeObject) {
		const { name } = localeObject;
		const { id, check, gr, skt, aspc, trad, mod } = raw;
		return {
			active: false,
			aspects: aspc,
			category: Categories.LITURGIES,
			check,
			checkmod: mod,
			dependencies: [],
			gr,
			ic: skt,
			id,
			name,
			tradition: trad,
			value: 0,
		};
	}
	return;
}

export function initBlessing(raw: RawBlessing, locale: ToListById<RawBlessingLocale>): BlessingInstance | undefined {
	const { id } = raw;
	const localeObject = locale[id];
	if (localeObject) {
		const { name } = localeObject;
		const { id, aspc, trad, req } = raw;
		return {
			id,
			name,
			active: false,
			category: Categories.BLESSINGS,
			aspects: aspc,
			tradition: trad,
			reqs: req,
			dependencies: []
		};
	}
	return;
}

export function initSpell(raw: RawSpell, locale: ToListById<RawSpellLocale>): SpellInstance | undefined {
	const { id } = raw;
	const localeObject = locale[id];
	if (localeObject) {
		const { name, effect, castingtime, castingtimeShort, aecost, aecostShort, range, rangeShort, duration, durationShort, target, src: srcPages } = localeObject;
		const { id, check, gr, skt, merk, trad, subtrad, req, mod, src: srcIds } = raw;
		return {
			active: false,
			category: Categories.SPELLS,
			check,
			checkmod: mod,
			dependencies: [],
			gr,
			ic: skt,
			id,
			name,
			property: merk,
			tradition: trad,
			subtradition: subtrad,
			value: 0,
			reqs: req,
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

export function initCantrip(raw: RawCantrip, locale: ToListById<RawCantripLocale>): CantripInstance | undefined {
	const { id } = raw;
	const localeObject = locale[id];
	if (localeObject) {
		const { name } = localeObject;
		const { id, merk, trad, req } = raw;
		return {
			id,
			name,
			active: false,
			category: Categories.CANTRIPS,
			property: merk,
			tradition: trad,
			reqs: req,
			dependencies: []
		};
	}
	return;
}

export function initTalent(raw: RawTalent, locale: ToListById<RawTalentLocale>): TalentInstance | undefined {
	const { id } = raw;
	const localeObject = locale[id];
	if (localeObject) {
		const { name, spec, spec_input, ...other } = localeObject;
		const { be, check, gr, skt } = raw;
		return {
			category: Categories.TALENTS,
			check,
			dependencies: [],
			encumbrance: be,
			gr,
			ic: skt,
			name,
			applications: spec,
			applicationsInput: spec_input,
			value: 0,
			...other
		};
	}
	return;
}

export function initItem(raw: RawItem, locale: ToListById<RawItemLocale>): ItemInstance | undefined {
	const { id } = raw;
	const localeObject = locale[id];
	if (localeObject) {
		const { name } = localeObject;
		const { addPenalties, imp, ...other } = raw;
		return {
			...other,
			name,
			addPenalties,
			amount: 1,
			improvisedWeaponGroup: imp,
			isTemplateLocked: true
		};
	}
	return;
}
