import { Categories } from '../constants/Categories';
import { IdPrefixes } from '../constants/IdPrefixes';
import * as Raw from '../types/rawdata';
import * as Wiki from '../types/wiki';
import { StringKeyObject } from './collectionUtils';
import { convertRawApplications, convertRawIncreaseSkills, convertRawPrerequisiteObjects, convertRawPrerequisites, convertRawProfessionDependencyObjects, convertRawProfessionPrerequisiteObjects, convertRawProfessionRequiresActivatableObject, convertRawProfessionSelections, convertRawProfessionVariantSelections, convertRawSelections, mapRawWithPrefix } from './convertRawObjectsToWikiUtils';
import { Just, List, Maybe, Nothing, OrderedMap, Record, Tuple } from './dataUtils';

const getSourceBooks =
  (srcIds: string[], srcPages: number[]): List<Record<Wiki.SourceLink>> =>
    List.fromArray(srcIds.map(
      (bookId, index) => Record.of({ id: bookId, page: srcPages[index] })
    ));

export const initExperienceLevel = (
  raw: Raw.RawExperienceLevel,
  locale: StringKeyObject<Raw.RawExperienceLevelLocale>,
): (Maybe<Record<Wiki.ExperienceLevel>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const { name } = localeObject;

    return Just(Record.of({
      ...raw,
      id,
      name
    }));
  }

  return Nothing();
};

interface SizeNew {
  sizeBase: number;
  sizeRandom: List<Record<Wiki.Die>>;
}

const convertSize = (
  old: (number | [number, number])[] | undefined,
): SizeNew | undefined => {
  return old && old.reduce<SizeNew>(
    (obj, value) => {
      if (typeof value === 'number') {
        return {
          ...obj,
          sizeBase: obj.sizeBase + value
        };
      }

      const [ amount, sides ] = value;

      return {
        ...obj,
        sizeRandom: obj.sizeRandom.append(Record.of({ amount, sides }))
      };
    },
    {
      sizeBase: 0,
      sizeRandom: List.of()
    }
  );
};

interface WeightNew {
  weightBase: number;
  weightRandom: List<Record<Wiki.Die>>;
}

const convertWeight = (
  old: (number | [number, number])[],
): WeightNew => {
  return old.reduce<WeightNew>(
    (obj, value) => {
      if (typeof value === 'number') {
        return {
          ...obj,
          weightBase: obj.weightBase + value
        };
      }

      const [ amount, sides ] = value;

      return {
        ...obj,
        weightRandom: obj.weightRandom.append(Record.of({ amount, sides }))
      };
    },
    {
      weightBase: 0,
      weightRandom: List.of()
    }
  );
};

export const initRace = (
  raw: Raw.RawRace,
  locale: StringKeyObject<Raw.RawRaceLocale>,
): (Maybe<Record<Wiki.Race>>) => {
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

    const {
      ap,
      attr,
      attr_sel,
      auto_adv,
      autoAdvCost,
      eyes,
      gs,
      hair,
      imp_adv,
      imp_dadv,
      le,
      src: srcIds,
      typ_adv,
      typ_cultures,
      typ_dadv,
      size,
      sk,
      untyp_adv,
      untyp_dadv,
      weight,
      zk,
      vars
    } = raw;

    return Just(Record.of<Wiki.Race>({
      ap,
      attributeAdjustments: List.fromArray(attr.map<Tuple<number, string>>(
        e => Tuple.of(e[0], `${IdPrefixes.ATTRIBUTES}_${e[1]}`)
      )),
      attributeAdjustmentsSelection: Tuple.of(
        attr_sel[0],
        List.fromArray(attr_sel[1].map(k => `${IdPrefixes.ATTRIBUTES}_${k}`))
      ),
      attributeAdjustmentsText,
      automaticAdvantages: List.fromArray(auto_adv.map(
        e => `${IdPrefixes.ADVANTAGES}_${e}`
      )),
      automaticAdvantagesCost: autoAdvCost,
      automaticAdvantagesText,
      category: Categories.RACES,
      eyeColors: eyes && List.fromArray(eyes),
      hairColors: hair && List.fromArray(hair),
      id,
      stronglyRecommendedAdvantages: List.fromArray(imp_adv.map(
        e => `${IdPrefixes.ADVANTAGES}_${e}`
      )),
      stronglyRecommendedAdvantagesText,
      stronglyRecommendedDisadvantages: List.fromArray(imp_dadv.map(
        e => `${IdPrefixes.DISADVANTAGES}_${e}`
      )),
      stronglyRecommendedDisadvantagesText,
      lp: le,
      mov: gs,
      name,
      ...convertSize(size),
      ...convertWeight(weight),
      spi: sk,
      tou: zk,
      commonAdvantages: List.fromArray(typ_adv.map(
        e => `${IdPrefixes.ADVANTAGES}_${e}`
      )),
      commonAdvantagesText,
      commonCultures: List.fromArray(typ_cultures.map(
        e => `${IdPrefixes.CULTURES}_${e}`
      )),
      commonDisadvantages: List.fromArray(typ_dadv.map(
        e => `${IdPrefixes.DISADVANTAGES}_${e}`
      )),
      commonDisadvantagesText,
      uncommonAdvantages: List.fromArray(untyp_adv.map(
        e => `${IdPrefixes.ADVANTAGES}_${e}`
      )),
      uncommonAdvantagesText,
      uncommonDisadvantages: List.fromArray(untyp_dadv.map(
        e => `${IdPrefixes.DISADVANTAGES}_${e}`
      )),
      uncommonDisadvantagesText,
      variants: List.fromArray(vars.map(e => `${IdPrefixes.RACE_VARIANTS}_${e}`)),
      src: getSourceBooks(srcIds, srcPages)
    }));
  }

  return Nothing();
};

export const initRaceVariant = (
  raw: Raw.RawRaceVariant,
  locale: StringKeyObject<Raw.RawRaceVariantLocale>,
): (Maybe<Record<Wiki.RaceVariant>>) => {
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

    const {
      eyes,
      hair,
      typ_adv,
      typ_cultures,
      typ_dadv,
      size,
      untyp_adv,
      untyp_dadv
    } = raw;

    return Just(Record.of<Wiki.RaceVariant>({
      category: Categories.RACE_VARIANTS,
      eyeColors: eyes && List.fromArray(eyes),
      hairColors: hair && List.fromArray(hair),
      id,
      name,
      ...convertSize(size),
      commonAdvantages: List.fromArray(typ_adv.map(
        e => `${IdPrefixes.ADVANTAGES}_${e}`
      )),
      commonAdvantagesText,
      commonCultures: List.fromArray(typ_cultures.map(
        e => `${IdPrefixes.CULTURES}_${e}`
      )),
      commonDisadvantages: List.fromArray(typ_dadv.map(
        e => `${IdPrefixes.DISADVANTAGES}_${e}`
      )),
      commonDisadvantagesText,
      uncommonAdvantages: List.fromArray(untyp_adv.map(
        e => `${IdPrefixes.ADVANTAGES}_${e}`
      )),
      uncommonAdvantagesText,
      uncommonDisadvantages: List.fromArray(untyp_dadv.map(
        e => `${IdPrefixes.DISADVANTAGES}_${e}`
      )),
      uncommonDisadvantagesText
    }));
  }

  return Nothing();
};

export const initCulture = (
  raw: Raw.RawCulture,
  locale: StringKeyObject<Raw.RawCultureLocale>,
): (Maybe<Record<Wiki.Culture>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      src: srcPages,
      commonAdvantages,
      commonDisadvantages,
      uncommonAdvantages,
      uncommonDisadvantages,
      ...localeRest
    } = localeObject;

    const {
      ap,
      lang,
      literacy,
      social,
      typ_prof,
      typ_adv,
      typ_dadv,
      untyp_adv,
      untyp_dadv,
      typ_talents,
      untyp_talents,
      talents,
      src: srcIds
    } = raw;

    return Just(Record.of<Wiki.Culture>({
      ...localeRest,
      culturalPackageAdventurePoints: ap,
      category: Categories.CULTURES,
      id,
      languages: List.fromArray(lang),
      scripts: List.fromArray(literacy),
      socialStatus: List.fromArray(social),
      culturalPackageSkills: List.fromArray(talents.map(e => Record.of({
        id: `${IdPrefixes.TALENTS}_${e[0]}`,
        value: e[1]
      }))),
      commonProfessions: List.fromArray(
        typ_prof.map<Wiki.CommonProfession>(
          e => typeof e === 'boolean' ? e : Record.of({
            ...e,
            list: List.fromArray(e.list)
          })
        )
      ),
      commonAdvantages: List.fromArray(typ_adv.map(
        e => `${IdPrefixes.ADVANTAGES}_${e}`
      )),
      commonAdvantagesText: commonAdvantages,
      commonDisadvantages: List.fromArray(typ_dadv.map(
        e => `${IdPrefixes.DISADVANTAGES}_${e}`
      )),
      commonDisadvantagesText: commonDisadvantages,
      uncommonAdvantages: List.fromArray(untyp_adv.map(
        e => `${IdPrefixes.ADVANTAGES}_${e}`
      )),
      uncommonAdvantagesText: uncommonAdvantages,
      uncommonDisadvantages: List.fromArray(untyp_dadv.map(
        e => `${IdPrefixes.DISADVANTAGES}_${e}`
      )),
      uncommonDisadvantagesText: uncommonDisadvantages,
      commonSkills: List.fromArray(typ_talents.map(
        e => `${IdPrefixes.TALENTS}_${e}`
      )),
      uncommonSkills: List.fromArray(untyp_talents.map(
        e => `${IdPrefixes.TALENTS}_${e}`
      )),
      src: getSourceBooks(srcIds, srcPages)
    }));
  }

  return Nothing();
};

export const initProfession = (
  raw: Raw.RawProfession,
  locale: StringKeyObject<Raw.RawProfessionLocale>,
): (Maybe<Record<Wiki.Profession>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      name,
      subname,
      req: localeReq,
      prerequisitesEnd,
      prerequisitesStart,
      suggestedAdvantages,
      suggestedDisadvantages,
      unsuitableAdvantages,
      unsuitableDisadvantages,
      src: srcPages
    } = localeObject;

    const {
      ap,
      apOfActivatables,
      pre_req,
      req,
      sel,
      sa,
      combattech,
      talents,
      spells,
      chants,
      typ_adv,
      typ_dadv,
      untyp_adv,
      untyp_dadv,
      vars,
      gr,
      src: srcIds,
      blessings,
      sgr
    } = raw;

    return Just(Record.of<Wiki.Profession>({
      id,
      name: typeof name === 'object' ? Record.of(name) : name,
      subname: typeof subname === 'object' ? Record.of(subname) : subname,
      ap,
      apOfActivatables,
      category: Categories.PROFESSIONS,
      dependencies: convertRawProfessionDependencyObjects(pre_req),
      prerequisites:  convertRawProfessionPrerequisiteObjects([...req, ...localeReq]),
      selections: convertRawProfessionSelections(sel),
      specialAbilities: List.fromArray(sa.map(convertRawProfessionRequiresActivatableObject)),
      combatTechniques: convertRawIncreaseSkills(combattech, IdPrefixes.COMBAT_TECHNIQUES),
      skills: convertRawIncreaseSkills(talents, IdPrefixes.TALENTS),
      spells: convertRawIncreaseSkills(spells, IdPrefixes.SPELLS),
      liturgicalChants: convertRawIncreaseSkills(chants, IdPrefixes.LITURGIES),
      blessings: mapRawWithPrefix(blessings, IdPrefixes.BLESSINGS),
      suggestedAdvantages: mapRawWithPrefix(typ_adv, IdPrefixes.ADVANTAGES),
      suggestedDisadvantages: mapRawWithPrefix(typ_dadv, IdPrefixes.DISADVANTAGES),
      unsuitableAdvantages: mapRawWithPrefix(untyp_adv, IdPrefixes.ADVANTAGES),
      unsuitableDisadvantages: mapRawWithPrefix(untyp_dadv, IdPrefixes.DISADVANTAGES),
      variants: mapRawWithPrefix(vars, IdPrefixes.PROFESSION_VARIANTS),
      gr,
      subgr: sgr,
      prerequisitesEnd,
      prerequisitesStart,
      suggestedAdvantagesText: suggestedAdvantages,
      suggestedDisadvantagesText: suggestedDisadvantages,
      unsuitableAdvantagesText: unsuitableAdvantages,
      unsuitableDisadvantagesText: unsuitableDisadvantages,
      src: getSourceBooks(srcIds, srcPages)
    }));
  }

  return Nothing();
};

export const initProfessionVariant = (
  raw: Raw.RawProfessionVariant,
  locale: StringKeyObject<Raw.RawProfessionVariantLocale>,
): (Maybe<Record<Wiki.ProfessionVariant>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      name,
      ...otherLocale
    } = localeObject;

    const {
      ap,
      apOfActivatables,
      pre_req,
      req,
      sel,
      sa,
      combattech,
      talents,
      spells,
      chants,
      blessings
    } = raw;

    return Just(Record.of<Wiki.ProfessionVariant>({
      ...otherLocale,
      id,
      name: typeof name === 'object' ? Record.of(name) : name,
      ap,
      apOfActivatables,
      category: Categories.PROFESSION_VARIANTS,
      dependencies: convertRawProfessionDependencyObjects(pre_req),
      prerequisites:  convertRawProfessionPrerequisiteObjects(req),
      selections: convertRawProfessionVariantSelections(sel),
      specialAbilities: List.fromArray(sa.map(convertRawProfessionRequiresActivatableObject)),
      combatTechniques: convertRawIncreaseSkills(combattech, IdPrefixes.COMBAT_TECHNIQUES),
      skills: convertRawIncreaseSkills(talents, IdPrefixes.TALENTS),
      spells: convertRawIncreaseSkills(spells, IdPrefixes.SPELLS),
      liturgicalChants: convertRawIncreaseSkills(chants, IdPrefixes.LITURGIES),
      blessings: mapRawWithPrefix(blessings, IdPrefixes.BLESSINGS),
    }));
  }

  return Nothing();
};

export const initAdvantage = (
  raw: Raw.RawAdvantage,
  locale: StringKeyObject<Raw.RawAdvantageLocale>,
): (Maybe<Record<Wiki.Advantage>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      sel: localeSel,
      src: srcPages,
      req: reqText,
      reqEnd,
      reqStart,
      reqIndex: reqIndexText,
      ...otherLocale
    } = localeObject;

    const {
      ap,
      sel,
      req,
      src: srcIds,
      reqIndex: reqIndexIgnore,
      ...otherData
    } = raw;

    return Just(Record.of<Wiki.Advantage>({
      ...otherLocale,
      ...otherData,
      category: Categories.ADVANTAGES,
      cost: typeof ap === 'object' ? List.fromArray(ap) : ap,
      prerequisites: convertRawPrerequisites(req),
      select: convertRawSelections(localeSel, sel),
      prerequisitesText: reqText,
      prerequisitesTextEnd: reqEnd,
      prerequisitesTextStart: reqStart,
      prerequisitesTextIndex: OrderedMap.of<number, string | false>([
        ...Object.entries(reqIndexText).map<[number, string]>(pair => {
          const [index, text] = pair;

          return [Number.parseInt(index) - 1, text];
        }),
        ...reqIndexIgnore.map<[number, false]>(e => {
          return [Number.parseInt(e), false];
        })
      ]),
      src: getSourceBooks(srcIds, srcPages)
    }));
  }

  return Nothing();
};

export const initDisadvantage = (
  raw: Raw.RawDisadvantage,
  locale: StringKeyObject<Raw.RawDisadvantageLocale>,
): (Maybe<Record<Wiki.Disadvantage>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      sel: localeSel,
      src: srcPages,
      req: reqText,
      reqEnd,
      reqStart,
      reqIndex: reqIndexText,
      ...otherLocale
    } = localeObject;

    const {
      ap,
      sel,
      req,
      src: srcIds,
      reqIndex: reqIndexIgnore,
      ...otherData
    } = raw;

    return Just(Record.of<Wiki.Disadvantage>({
      ...otherLocale,
      ...otherData,
      category: Categories.DISADVANTAGES,
      cost: typeof ap === 'object' ? List.fromArray(ap) : ap,
      prerequisites: convertRawPrerequisites(req),
      select: convertRawSelections(localeSel, sel),
      prerequisitesText: reqText,
      prerequisitesTextEnd: reqEnd,
      prerequisitesTextStart: reqStart,
      prerequisitesTextIndex: OrderedMap.of<number, string | false>([
        ...Object.entries(reqIndexText).map<[number, string]>(pair => {
          const [index, text] = pair;

          return [Number.parseInt(index) - 1, text];
        }),
        ...reqIndexIgnore.map<[number, false]>(e => {
          return [Number.parseInt(e), false];
        })
      ]),
      src: getSourceBooks(srcIds, srcPages)
    }));
  }

  return Nothing();
};

export const initSpecialAbility = (
  raw: Raw.RawSpecialAbility,
  locale: StringKeyObject<Raw.RawSpecialAbilityLocale>,
): (Maybe<Record<Wiki.SpecialAbility>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      sel: localeSel,
      src: srcPages,
      req: reqText,
      reqEnd,
      reqStart,
      reqIndex: reqIndexText,
      ...otherLocale
    } = localeObject;

    const {
      ap,
      sel,
      req,
      src: srcIds,
      reqIndex: reqIndexIgnore,
      extended,
      ...otherData
    } = raw;

    return Just(Record.of<Wiki.SpecialAbility>({
      ...otherLocale,
      ...otherData,
      category: Categories.SPECIAL_ABILITIES,
      cost: typeof ap === 'object' ? List.fromArray(ap) : ap,
      prerequisites: Array.isArray(req[0])
        ? OrderedMap.of<number, List<Wiki.AllRequirements>>(
          (req as [number, Raw.AllRawRequirements[]][]).map(
            e => [
              e[0],
              convertRawPrerequisites(e[1])
            ] as [number, List<Wiki.AllRequirements>]
          )
        )
        : convertRawPrerequisites(req as Raw.AllRawRequirements[]),
      select: convertRawSelections(localeSel, sel),
      prerequisitesText: reqText,
      prerequisitesTextEnd: reqEnd,
      prerequisitesTextStart: reqStart,
      prerequisitesTextIndex: OrderedMap.of<number, string | false>([
        ...Object.entries(reqIndexText).map<[number, string]>(pair => {
          const [index, text] = pair;

          return [Number.parseInt(index) - 1, text];
        }),
        ...reqIndexIgnore.map<[number, false]>(e => {
          return [Number.parseInt(e), false];
        })
      ]),
      extended: extended && List.fromArray(extended.map(
        e => typeof e === 'object' ? List.fromArray(e) : e
      )),
      src: getSourceBooks(srcIds, srcPages)
    }));
  }

  return Nothing();
};

export const initAttribute = (
  raw: Raw.RawAttribute,
  locale: StringKeyObject<Raw.RawAttributeLocale>,
): (Maybe<Record<Wiki.Attribute>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const { name, short } = localeObject;

    return Just(Record.of<Wiki.Attribute>({
      category: Categories.ATTRIBUTES,
      id,
      name,
      short,
    }));
  }

  return Nothing();
};

export const initCombatTechnique = (
  raw: Raw.RawCombatTechnique,
  locale: StringKeyObject<Raw.RawCombatTechniqueLocale>,
): (Maybe<Record<Wiki.CombatTechnique>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const { src: srcPages, ...otherLocale } = localeObject;
    const { gr, skt, leit, bf, src: srcIds, ...otherData } = raw;

    return Just(Record.of<Wiki.CombatTechnique>({
      ...otherLocale,
      ...otherData,
      category: Categories.COMBAT_TECHNIQUES,
      gr,
      ic: skt,
      primary: List.fromArray(leit),
      bf,
      src: getSourceBooks(srcIds, srcPages)
    }));
  }

  return Nothing();
};

export const initLiturgicalChant = (
  raw: Raw.RawLiturgy,
  locale: StringKeyObject<Raw.RawLiturgyLocale>,
): (Maybe<Record<Wiki.LiturgicalChant>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      castingtime,
      castingtimeShort,
      kpcost,
      kpcostShort,
      src: srcPages,
      ...otherLocale
    } = localeObject;

    const { check, gr, skt, aspc, trad, mod, src: srcIds } = raw;

    return Just(Record.of<Wiki.LiturgicalChant>({
      ...otherLocale,
      aspects: List.fromArray(aspc),
      category: Categories.LITURGIES,
      check: List.fromArray(check),
      checkmod: mod,
      gr,
      ic: skt,
      id,
      tradition: List.fromArray(trad),
      castingTime: castingtime,
      castingTimeShort: castingtimeShort,
      cost: kpcost,
      costShort: kpcostShort,
      src: getSourceBooks(srcIds, srcPages)
    }));
  }

  return Nothing();
}

export const initBlessing = (
  raw: Raw.RawBlessing,
  locale: StringKeyObject<Raw.RawBlessingLocale>,
): (Maybe<Record<Wiki.Blessing>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      name,
      src: srcPages,
      ...otherLocale
    } = localeObject;

    const { aspc, trad, req, src: srcIds } = raw;

    return Just(Record.of<Wiki.Blessing>({
      ...otherLocale,
      name,
      category: Categories.BLESSINGS,
      aspects: List.fromArray(aspc),
      tradition: List.fromArray(trad),
      prerequisites: convertRawPrerequisiteObjects(req),
      src: getSourceBooks(srcIds, srcPages)
    }));
  }

  return Nothing();
};

export const initSpell = (
  raw: Raw.RawSpell,
  locale: StringKeyObject<Raw.RawSpellLocale>,
): (Maybe<Record<Wiki.Spell>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      castingtime,
      castingtimeShort,
      aecost,
      aecostShort,
      src: srcPages,
      ...otherLocale
    } = localeObject;

    const {
      check,
      gr,
      skt,
      merk,
      trad,
      subtrad,
      req,
      mod,
      src: srcIds
    } = raw;

    return Just(Record.of<Wiki.Spell>({
      ...otherLocale,
      category: Categories.SPELLS,
      check: List.fromArray(check),
      checkmod: mod,
      gr,
      ic: skt,
      property: merk,
      tradition: List.fromArray(trad),
      subtradition: List.fromArray(subtrad),
      prerequisites: convertRawPrerequisiteObjects(req),
      castingTime: castingtime,
      castingTimeShort: castingtimeShort,
      cost: aecost,
      costShort: aecostShort,
      src: getSourceBooks(srcIds, srcPages)
    }));
  }

  return Nothing();
};

export const initCantrip = (
  raw: Raw.RawCantrip,
  locale: StringKeyObject<Raw.RawCantripLocale>,
): (Maybe<Record<Wiki.Cantrip>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      name,
      src: srcPages,
      ...otherLocale
    } = localeObject;

    const { merk, trad, req, src: srcIds } = raw;

    return Just(Record.of<Wiki.Cantrip>({
      ...otherLocale,
      name,
      category: Categories.CANTRIPS,
      property: merk,
      tradition: List.fromArray(trad),
      prerequisites: convertRawPrerequisiteObjects(req),
      src: getSourceBooks(srcIds, srcPages)
    }));
  }

  return Nothing();
};

export const initSkill = (
  raw: Raw.RawSkill,
  locale: StringKeyObject<Raw.RawSkillLocale>,
): (Maybe<Record<Wiki.Skill>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      name,
      spec: appNames,
      spec_input,
      ...other
    } = localeObject;

    const {
      be,
      check,
      gr,
      skt,
      applications: appPrerequisites
    } = raw;

    return Just(Record.of<Wiki.Skill>({
      ...other,
      category: Categories.TALENTS,
      check: List.fromArray(check),
      encumbrance: be,
      gr,
      ic: skt,
      name,
      applications: convertRawApplications(appNames, appPrerequisites),
      applicationsInput: spec_input,
    }));
  }

  return Nothing();
};

export const initItemTemplate = (
  raw: Raw.RawItemTemplate,
  locale: StringKeyObject<Raw.RawItemLocale>,
): (Maybe<Record<Wiki.ItemTemplate>>) => {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { src: srcPages, ...otherLocale } = localeObject;
    const { imp, primaryThreshold, src: srcIds, ...otherData } = raw;

    return Just(Record.of<Wiki.ItemTemplate>({
      ...otherLocale,
      ...otherData,
      amount: 1,
      improvisedWeaponGroup: imp,
      damageBonus: primaryThreshold && Record.of({
        ...primaryThreshold,
        threshold: typeof primaryThreshold.threshold === 'object'
          ? List.fromArray(primaryThreshold.threshold)
          : primaryThreshold.threshold
      }),
      isTemplateLocked: true,
      src: getSourceBooks(srcIds, srcPages)
    }));
  }

  return Nothing();
};
