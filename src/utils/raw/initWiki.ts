import { Categories } from '../../constants/Categories';
import { IdPrefixes } from '../../constants/IdPrefixes';
import * as Raw from '../../types/rawdata';
import * as Wiki from '../../types/wiki';
import { prefixId as prefixId, prefixRawId } from '../IDUtils';
import { add } from '../mathUtils';
import { cons, cons_, List } from '../structures/List';
import { fmap, fromNullable, Just, Maybe, Nothing } from '../structures/Maybe';
import { fromBoth } from '../structures/Pair';
import { Record, StringKeyObject } from '../structures/Record';
import { convertRawApplications, convertRawIncreaseSkills, convertRawPrerequisiteObjects, convertRawPrerequisites, convertRawProfessionDependencyObjects, convertRawProfessionPrerequisiteObjects, convertRawProfessionRequiresActivatableObject, convertRawProfessionSelections, convertRawProfessionVariantSelections, convertRawSelections, mapRawWithPrefix } from './convertRawObjectsToWikiUtils';
import { createCulture, createDie, createExperienceLevel, createRace, createRaceVariant, createSourceLink } from './wikiData';

const getSourceBooks =
  (srcIds: string[], srcPages: number[]): List<Record<Wiki.SourceLink>> =>
    List.fromArray (srcIds .map (
      (bookId, index) => createSourceLink (bookId) (srcPages [index])
    ))

export const initExperienceLevel =
  (locale: StringKeyObject<Raw.RawExperienceLevelLocale>) =>
  (raw: Raw.RawExperienceLevel): Maybe<Record<Wiki.ExperienceLevel>> => {
    const { id } = raw
    const localeObject = locale [id]

    if (localeObject !== undefined) {
      const { name } = localeObject

      return Just (createExperienceLevel ({
        ...raw,
        id,
        name,
      }))
    }

    return Nothing
  }

interface SizeNew {
  sizeBase: Maybe<number>;
  sizeRandom: Maybe<List<Record<Wiki.Die>>>;
}

const convertSize = (old: (number | [number, number])[] | undefined): SizeNew =>
  old !== undefined
    ? old .reduce<SizeNew> (
      (obj, value) => {
        if (typeof value === 'number') {
          return {
            ...obj,
            sizeBase: fmap (add (value)) (obj .sizeBase),
          }
        }

        const [ amount, sides ] = value

        return {
          ...obj,
          sizeRandom: fmap (cons_ (createDie (amount) (sides))) (obj .sizeRandom),
        };
      },
      {
        sizeBase: Just (0),
        sizeRandom: Just (List.empty),
      }
    )
    : {
      sizeBase: Nothing,
      sizeRandom: Nothing,
    }

interface WeightNew {
  weightBase: number;
  weightRandom: List<Record<Wiki.Die>>;
}

const convertWeight = (old: (number | [number, number])[]): WeightNew =>
  old.reduce<WeightNew> (
    (obj, value) => {
      if (typeof value === 'number') {
        return {
          ...obj,
          weightBase: obj .weightBase + value,
        }
      }

      const [ amount, sides ] = value

      return {
        ...obj,
        weightRandom: cons (obj .weightRandom) (createDie (amount) (sides)),
      }
    },
    {
      weightBase: 0,
      weightRandom: List.empty,
    }
  )

export const initRace =
  (locale: StringKeyObject<Raw.RawRaceLocale>) =>
  (raw: Raw.RawRace): Maybe<Record<Wiki.Race>> => {
    const { id } = raw
    const localeObject = locale [id]

    if (localeObject !== undefined) {
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
        uncommonDisadvantages: uncommonDisadvantagesText,
      } = localeObject

      const {
        ap,
        attr,
        attr_sel,
        auto_adv,
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
        vars,
      } = raw

      return Just (createRace ({
        id,
        name,
        lp: le,
        spi: sk,
        tou: zk,
        mov: gs,
        ap,

        attributeAdjustments: List.fromArray (attr .map (
          e => fromBoth<string, number> (prefixId (IdPrefixes.ATTRIBUTES) (e [1]))
                                        (e [0])
        )),
        attributeAdjustmentsSelection:
          fromBoth<number, List<string>> (attr_sel [0])
                                         (List.fromArray (attr_sel [1]
                                           .map (prefixId (IdPrefixes.ATTRIBUTES))
                                         )),
        attributeAdjustmentsText,
        automaticAdvantages: List.fromArray (auto_adv .map (prefixRawId (IdPrefixes.ADVANTAGES))),
        automaticAdvantagesText,

        eyeColors: fmap<number[], List<number>> (List.fromArray) (fromNullable (eyes)),
        hairColors: fmap<number[], List<number>> (List.fromArray) (fromNullable (hair)),

        stronglyRecommendedAdvantages:
          List.fromArray (imp_adv .map (prefixRawId (IdPrefixes.ADVANTAGES))),
        stronglyRecommendedAdvantagesText,
        stronglyRecommendedDisadvantages:
          List.fromArray (imp_dadv .map (prefixRawId (IdPrefixes.DISADVANTAGES))),
        stronglyRecommendedDisadvantagesText,

        ...convertSize (size),
        ...convertWeight (weight),

        commonAdvantages: List.fromArray (typ_adv .map (prefixRawId (IdPrefixes.ADVANTAGES))),
        commonAdvantagesText: fromNullable (commonAdvantagesText),
        commonCultures: List.fromArray (typ_cultures .map (prefixRawId (IdPrefixes.CULTURES))),
        commonDisadvantages:
          List.fromArray (typ_dadv .map (prefixRawId (IdPrefixes.DISADVANTAGES))),
        commonDisadvantagesText: fromNullable (commonDisadvantagesText),

        uncommonAdvantages: List.fromArray (untyp_adv .map (prefixRawId (IdPrefixes.ADVANTAGES))),
        uncommonAdvantagesText: fromNullable (uncommonAdvantagesText),
        uncommonDisadvantages:
          List.fromArray (untyp_dadv .map (prefixRawId (IdPrefixes.DISADVANTAGES))),
        uncommonDisadvantagesText: fromNullable (uncommonDisadvantagesText),

        variants: List.fromArray (vars .map (prefixRawId (IdPrefixes.RACE_VARIANTS))),
        src: getSourceBooks (srcIds, srcPages),
      }))
    }

    return Nothing
  }

export const initRaceVariant =
  (locale: StringKeyObject<Raw.RawRaceVariantLocale>) =>
  (raw: Raw.RawRaceVariant): Maybe<Record<Wiki.RaceVariant>> => {
    const { id } = raw
    const localeObject = locale [id]

    if (localeObject !== undefined) {
      const {
        commonAdvantages: commonAdvantagesText,
        commonDisadvantages: commonDisadvantagesText,
        name,
        uncommonAdvantages: uncommonAdvantagesText,
        uncommonDisadvantages: uncommonDisadvantagesText,
      } = localeObject

      const {
        eyes,
        hair,
        typ_adv,
        typ_cultures,
        typ_dadv,
        size,
        untyp_adv,
        untyp_dadv,
      } = raw

      return Just (createRaceVariant ({
        id,
        name,

        eyeColors: fmap<number[], List<number>> (List.fromArray) (fromNullable (eyes)),
        hairColors: fmap<number[], List<number>> (List.fromArray) (fromNullable (hair)),

        ...convertSize (size),

        commonAdvantages: List.fromArray (typ_adv .map (prefixRawId (IdPrefixes.ADVANTAGES))),
        commonAdvantagesText: fromNullable (commonAdvantagesText),
        commonCultures: List.fromArray (typ_cultures .map (prefixRawId (IdPrefixes.CULTURES))),
        commonDisadvantages:
          List.fromArray (typ_dadv .map (prefixRawId (IdPrefixes.DISADVANTAGES))),
        commonDisadvantagesText: fromNullable (commonDisadvantagesText),

        uncommonAdvantages: List.fromArray (untyp_adv .map (prefixRawId (IdPrefixes.ADVANTAGES))),
        uncommonAdvantagesText: fromNullable (uncommonAdvantagesText),
        uncommonDisadvantages:
          List.fromArray (untyp_dadv .map (prefixRawId (IdPrefixes.DISADVANTAGES))),
        uncommonDisadvantagesText: fromNullable (uncommonDisadvantagesText),
      }))
    }

    return Nothing
  }

export const initCulture =
  (locale: StringKeyObject<Raw.RawCultureLocale>) =>
  (raw: Raw.RawCulture): Maybe<Record<Wiki.Culture>> => {
    const { id } = raw
    const localeObject = locale [id]

    if (localeObject !== undefined) {
      const {
        src: srcPages,
        commonAdvantages,
        commonDisadvantages,
        uncommonAdvantages,
        uncommonDisadvantages,
        commonBlessedProfessions,
        commonMagicProfessions,
        commonMundaneProfessions,
        ...localeRest
      } = localeObject

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
        src: srcIds,
      } = raw

      return Just (createCulture ({
        ...localeRest,
        culturalPackageAdventurePoints: ap,
        id,
        languages: List.fromArray (lang),
        scripts: List.fromArray (literacy),
        socialStatus: List.fromArray (social),
        culturalPackageSkills: List.fromArray (talents.map (e => Record.of ({
          id: `${IdPrefixes.TALENTS}_${e[0]}`,
          value: e[1],
        }))),
        commonProfessions: List.fromArray (
          typ_prof.map<Wiki.CommonProfession> (
            e => typeof e === 'boolean' ? e : Record.of ({
              ...e,
              list: List.fromArray (e.list),
            })
          )
        ),
        commonBlessedProfessions: fromNullable (commonBlessedProfessions),
        commonMagicProfessions: fromNullable (commonMagicProfessions),
        commonMundaneProfessions: fromNullable (commonMundaneProfessions),
        commonAdvantages: List.fromArray (typ_adv .map (prefixRawId (IdPrefixes.ADVANTAGES))),
        commonAdvantagesText: fromNullable (commonAdvantages),
        commonDisadvantages:
          List.fromArray (typ_dadv .map (prefixRawId (IdPrefixes.DISADVANTAGES))),
        commonDisadvantagesText: fromNullable (commonDisadvantages),
        uncommonAdvantages: List.fromArray (untyp_adv .map (prefixRawId (IdPrefixes.ADVANTAGES))),
        uncommonAdvantagesText: fromNullable (uncommonAdvantages),
        uncommonDisadvantages:
          List.fromArray (untyp_dadv .map (prefixRawId (IdPrefixes.DISADVANTAGES))),
        uncommonDisadvantagesText: fromNullable (uncommonDisadvantages),
        commonSkills: List.fromArray (typ_talents .map (prefixRawId (IdPrefixes.TALENTS))),
        uncommonSkills: List.fromArray (untyp_talents .map (prefixRawId (IdPrefixes.TALENTS))),
        src: getSourceBooks (srcIds, srcPages),
      }))
    }

    return Nothing
  }

export const initProfession =
  (locale: StringKeyObject<Raw.RawProfessionLocale>) =>
  (raw: Raw.RawProfession): Maybe<Record<Wiki.Profession>> => {
    const { id } = raw
    const localeObject = locale [id]

    if (localeObject !== undefined) {
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
        src: srcPages,
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
        sgr,
      } = raw;

      return Just (Record.of<Wiki.Profession> ({
        id,
        name: typeof name === 'object' ? Record.of (name) : name,
        subname: typeof subname === 'object' ? Record.of (subname) : subname,
        ap,
        apOfActivatables,
        category: Categories.PROFESSIONS,
        dependencies: convertRawProfessionDependencyObjects (pre_req),
        prerequisites:  convertRawProfessionPrerequisiteObjects ([...req, ...localeReq]),
        selections: convertRawProfessionSelections (sel),
        specialAbilities: List.fromArray (sa.map (convertRawProfessionRequiresActivatableObject)),
        combatTechniques: convertRawIncreaseSkills (combattech, IdPrefixes.COMBAT_TECHNIQUES),
        skills: convertRawIncreaseSkills (talents, IdPrefixes.TALENTS),
        spells: convertRawIncreaseSkills (spells, IdPrefixes.SPELLS),
        liturgicalChants: convertRawIncreaseSkills (chants, IdPrefixes.LITURGIES),
        blessings: mapRawWithPrefix (blessings, IdPrefixes.BLESSINGS),
        suggestedAdvantages: mapRawWithPrefix (typ_adv, IdPrefixes.ADVANTAGES),
        suggestedDisadvantages: mapRawWithPrefix (typ_dadv, IdPrefixes.DISADVANTAGES),
        unsuitableAdvantages: mapRawWithPrefix (untyp_adv, IdPrefixes.ADVANTAGES),
        unsuitableDisadvantages: mapRawWithPrefix (untyp_dadv, IdPrefixes.DISADVANTAGES),
        variants: mapRawWithPrefix (vars, IdPrefixes.PROFESSION_VARIANTS),
        gr,
        subgr: sgr,
        prerequisitesEnd,
        prerequisitesStart,
        suggestedAdvantagesText: suggestedAdvantages,
        suggestedDisadvantagesText: suggestedDisadvantages,
        unsuitableAdvantagesText: unsuitableAdvantages,
        unsuitableDisadvantagesText: unsuitableDisadvantages,
        src: getSourceBooks (srcIds, srcPages),
      }))
    }

    return Nothing
  }

export const initProfessionVariant = (
  raw: Raw.RawProfessionVariant,
  locale: StringKeyObject<Raw.RawProfessionVariantLocale>
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
      blessings,
    } = raw;

    return Just (Record.of<Wiki.ProfessionVariant> ({
      ...otherLocale,
      id,
      name: typeof name === 'object' ? Record.of (name) : name,
      ap,
      apOfActivatables,
      category: Categories.PROFESSION_VARIANTS,
      dependencies: convertRawProfessionDependencyObjects (pre_req),
      prerequisites:  convertRawProfessionPrerequisiteObjects (req),
      selections: convertRawProfessionVariantSelections (sel),
      specialAbilities: List.fromArray (sa.map (convertRawProfessionRequiresActivatableObject)),
      combatTechniques: convertRawIncreaseSkills (combattech, IdPrefixes.COMBAT_TECHNIQUES),
      skills: convertRawIncreaseSkills (talents, IdPrefixes.TALENTS),
      spells: convertRawIncreaseSkills (spells, IdPrefixes.SPELLS),
      liturgicalChants: convertRawIncreaseSkills (chants, IdPrefixes.LITURGIES),
      blessings: mapRawWithPrefix (blessings, IdPrefixes.BLESSINGS),
    }));
  }

  return Nothing ();
};

export const initAdvantage = (
  raw: Raw.RawAdvantage,
  locale: StringKeyObject<Raw.RawAdvantageLocale>
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

    return Just (Record.of<Wiki.Advantage> ({
      ...otherLocale,
      ...otherData,
      category: Categories.ADVANTAGES,
      cost: typeof ap === 'object' ? List.fromArray (ap) : ap,
      prerequisites: convertRawPrerequisites (req),
      select: convertRawSelections (localeSel, sel),
      prerequisitesText: reqText,
      prerequisitesTextEnd: reqEnd,
      prerequisitesTextStart: reqStart,
      prerequisitesTextIndex: OrderedMap.of<number, string | false> ([
        ...Object.entries (reqIndexText).map<[number, string]> (pair => {
          const [index, text] = pair;

          return [Number.parseInt (index) - 1, text];
        }),
        ...reqIndexIgnore.map<[number, false]> (e => {
          return [Number.parseInt (e), false];
        }),
      ]),
      src: getSourceBooks (srcIds, srcPages),
    }));
  }

  return Nothing ();
};

export const initDisadvantage = (
  raw: Raw.RawDisadvantage,
  locale: StringKeyObject<Raw.RawDisadvantageLocale>
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

    return Just (Record.of<Wiki.Disadvantage> ({
      ...otherLocale,
      ...otherData,
      category: Categories.DISADVANTAGES,
      cost: typeof ap === 'object' ? List.fromArray (ap) : ap,
      prerequisites: convertRawPrerequisites (req),
      select: convertRawSelections (localeSel, sel),
      prerequisitesText: reqText,
      prerequisitesTextEnd: reqEnd,
      prerequisitesTextStart: reqStart,
      prerequisitesTextIndex: OrderedMap.of<number, string | false> ([
        ...Object.entries (reqIndexText).map<[number, string]> (pair => {
          const [index, text] = pair;

          return [Number.parseInt (index) - 1, text];
        }),
        ...reqIndexIgnore.map<[number, false]> (e => {
          return [Number.parseInt (e), false];
        }),
      ]),
      src: getSourceBooks (srcIds, srcPages),
    }));
  }

  return Nothing ();
};

export const initSpecialAbility = (
  raw: Raw.RawSpecialAbility,
  locale: StringKeyObject<Raw.RawSpecialAbilityLocale>
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

    return Just (Record.of<Wiki.SpecialAbility> ({
      ...otherLocale,
      ...otherData,
      category: Categories.SPECIAL_ABILITIES,
      cost: typeof ap === 'object' ? List.fromArray (ap) : ap,
      prerequisites: Array.isArray (req[0])
        ? OrderedMap.of<number, List<Wiki.AllRequirements>> (
          (req as [number, Raw.AllRawRequirements[]][]).map (
            e => [
              e[0],
              convertRawPrerequisites (e[1]),
            ] as [number, List<Wiki.AllRequirements>]
          )
        )
        : convertRawPrerequisites (req as Raw.AllRawRequirements[]),
      select: convertRawSelections (localeSel, sel),
      prerequisitesText: reqText,
      prerequisitesTextEnd: reqEnd,
      prerequisitesTextStart: reqStart,
      prerequisitesTextIndex: OrderedMap.of<number, string | false> ([
        ...Object.entries (reqIndexText).map<[number, string]> (pair => {
          const [index, text] = pair;

          return [Number.parseInt (index) - 1, text];
        }),
        ...reqIndexIgnore.map<[number, false]> (e => {
          return [Number.parseInt (e), false];
        }),
      ]),
      extended: extended && List.fromArray (extended.map (
        e => typeof e === 'object' ? List.fromArray (e) : e
      )),
      src: getSourceBooks (srcIds, srcPages),
    }));
  }

  return Nothing ();
};

export const initAttribute = (
  raw: Raw.RawAttribute,
  locale: StringKeyObject<Raw.RawAttributeLocale>
): (Maybe<Record<Wiki.Attribute>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const { name, short } = localeObject;

    return Just (Record.of<Wiki.Attribute> ({
      category: Categories.ATTRIBUTES,
      id,
      name,
      short,
    }));
  }

  return Nothing ();
};

export const initCombatTechnique = (
  raw: Raw.RawCombatTechnique,
  locale: StringKeyObject<Raw.RawCombatTechniqueLocale>
): (Maybe<Record<Wiki.CombatTechnique>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const { src: srcPages, ...otherLocale } = localeObject;
    const { gr, skt, leit, bf, src: srcIds, ...otherData } = raw;

    return Just (Record.of<Wiki.CombatTechnique> ({
      ...otherLocale,
      ...otherData,
      category: Categories.COMBAT_TECHNIQUES,
      gr,
      ic: skt,
      primary: List.fromArray (leit),
      bf,
      src: getSourceBooks (srcIds, srcPages),
    }));
  }

  return Nothing ();
};

export const initLiturgicalChant = (
  raw: Raw.RawLiturgy,
  locale: StringKeyObject<Raw.RawLiturgyLocale>
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

    return Just (Record.of<Wiki.LiturgicalChant> ({
      ...otherLocale,
      aspects: List.fromArray (aspc),
      category: Categories.LITURGIES,
      check: List.fromArray (check),
      checkmod: mod,
      gr,
      ic: skt,
      id,
      tradition: List.fromArray (trad),
      castingTime: castingtime,
      castingTimeShort: castingtimeShort,
      cost: kpcost,
      costShort: kpcostShort,
      src: getSourceBooks (srcIds, srcPages),
    }));
  }

  return Nothing ();
}

export const initBlessing = (
  raw: Raw.RawBlessing,
  locale: StringKeyObject<Raw.RawBlessingLocale>
): (Maybe<Record<Wiki.Blessing>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      name,
      src: srcPages,
      ...otherLocale
    } = localeObject;

    const { aspc, trad, src: srcIds } = raw;

    return Just (Record.of<Wiki.Blessing> ({
      ...otherLocale,
      name,
      category: Categories.BLESSINGS,
      aspects: List.fromArray (aspc),
      tradition: List.fromArray (trad),
      src: getSourceBooks (srcIds, srcPages),
    }));
  }

  return Nothing ();
};

export const initSpell = (
  raw: Raw.RawSpell,
  locale: StringKeyObject<Raw.RawSpellLocale>
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
      src: srcIds,
    } = raw;

    return Just (Record.of<Wiki.Spell> ({
      ...otherLocale,
      category: Categories.SPELLS,
      check: List.fromArray (check),
      checkmod: mod,
      gr,
      ic: skt,
      property: merk,
      tradition: List.fromArray (trad),
      subtradition: List.fromArray (subtrad),
      prerequisites: convertRawPrerequisiteObjects (req),
      castingTime: castingtime,
      castingTimeShort: castingtimeShort,
      cost: aecost,
      costShort: aecostShort,
      src: getSourceBooks (srcIds, srcPages),
    }));
  }

  return Nothing ();
};

export const initCantrip = (
  raw: Raw.RawCantrip,
  locale: StringKeyObject<Raw.RawCantripLocale>
): (Maybe<Record<Wiki.Cantrip>>) => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      name,
      src: srcPages,
      ...otherLocale
    } = localeObject;

    const { merk, trad, src: srcIds } = raw;

    return Just (Record.of<Wiki.Cantrip> ({
      ...otherLocale,
      name,
      category: Categories.CANTRIPS,
      property: merk,
      tradition: List.fromArray (trad),
      src: getSourceBooks (srcIds, srcPages),
    }));
  }

  return Nothing ();
};

export const initSkill = (
  raw: Raw.RawSkill,
  locale: StringKeyObject<Raw.RawSkillLocale>
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
      applications: appPrerequisites,
    } = raw;

    return Just (Record.of<Wiki.Skill> ({
      ...other,
      category: Categories.TALENTS,
      check: List.fromArray (check),
      encumbrance: be,
      gr,
      ic: skt,
      name,
      applications: convertRawApplications (appNames, appPrerequisites),
      applicationsInput: spec_input,
    }));
  }

  return Nothing ();
};

export const initItemTemplate = (
  raw: Raw.RawItemTemplate,
  locale: StringKeyObject<Raw.RawItemLocale>
): (Maybe<Record<Wiki.ItemTemplate>>) => {
  const { id } = raw;
  const localeObject = locale[id];
  if (localeObject) {
    const { src: srcPages, ...otherLocale } = localeObject;
    const { imp, primaryThreshold, src: srcIds, ...otherData } = raw;

    return Just (Record.of<Wiki.ItemTemplate> ({
      ...otherLocale,
      ...otherData,
      amount: 1,
      improvisedWeaponGroup: imp,
      damageBonus: primaryThreshold && Record.of ({
        ...primaryThreshold,
        threshold: typeof primaryThreshold.threshold === 'object'
          ? List.fromArray (primaryThreshold.threshold)
          : primaryThreshold.threshold,
      }),
      isTemplateLocked: true,
      src: getSourceBooks (srcIds, srcPages),
    }));
  }

  return Nothing ();
};
