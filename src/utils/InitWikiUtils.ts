import { Categories } from '../constants/Categories';
import { IdPrefixes } from '../constants/IdPrefixes';
import * as Rawdata from '../types/rawdata.d';
import * as Reusable from '../types/reusable.d';
import * as Wiki from '../types/wiki.d';
import { StringKeyObject } from './collectionUtils';

export const initExperienceLevel = (
  raw: Rawdata.RawExperienceLevel,
  locale: StringKeyObject<Rawdata.RawExperienceLevelLocale>,
): Wiki.ExperienceLevel | undefined => {
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
};

interface SizeNew {
  sizeBase: number;
  sizeRandom: Wiki.Die[];
}

const convertSize = (
  old: (number | [number, number])[] | undefined,
): SizeNew | undefined => {
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
};

interface WeightNew {
  weightBase: number;
  weightRandom: Wiki.Die[];
}

const convertWeight = (
  old: (number | [number, number])[],
): WeightNew => {
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
};

export const initRace = (
  raw: Rawdata.RawRace,
  locale: StringKeyObject<Rawdata.RawRaceLocale>,
): Wiki.Race | undefined => {
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

    return {
      ap,
      attributeAdjustments: attr.map<[number, string]>(e => {
        return [e[0], `${IdPrefixes.ATTRIBUTES}_${e[1]}`];
      }),
      attributeAdjustmentsSelection: [attr_sel[0], attr_sel[1].map(k => {
        return `${IdPrefixes.ATTRIBUTES}_${k}`;
      })],
      attributeAdjustmentsText,
      automaticAdvantages: auto_adv.map(e => {
        return `${IdPrefixes.ADVANTAGES}_${e}`;
      }),
      automaticAdvantagesCost: autoAdvCost,
      automaticAdvantagesText,
      category: Categories.RACES,
      eyeColors: eyes,
      hairColors: hair,
      id,
      stronglyRecommendedAdvantages: imp_adv.map(e => {
        return `${IdPrefixes.ADVANTAGES}_${e}`;
      }),
      stronglyRecommendedAdvantagesText,
      stronglyRecommendedDisadvantages: imp_dadv.map(e => {
        return `${IdPrefixes.DISADVANTAGES}_${e}`;
      }),
      stronglyRecommendedDisadvantagesText,
      lp: le,
      mov: gs,
      name,
      ...convertSize(size),
      ...convertWeight(weight),
      spi: sk,
      tou: zk,
      commonAdvantages: typ_adv.map(e => {
        return `${IdPrefixes.ADVANTAGES}_${e}`;
      }),
      commonAdvantagesText,
      commonCultures: typ_cultures.map(e => {
        return `${IdPrefixes.CULTURES}_${e}`;
      }),
      commonDisadvantages: typ_dadv.map(e => {
        return `${IdPrefixes.DISADVANTAGES}_${e}`;
      }),
      commonDisadvantagesText,
      uncommonAdvantages: untyp_adv.map(e => {
        return `${IdPrefixes.ADVANTAGES}_${e}`;
      }),
      uncommonAdvantagesText,
      uncommonDisadvantages: untyp_dadv.map(e => {
        return `${IdPrefixes.DISADVANTAGES}_${e}`;
      }),
      uncommonDisadvantagesText,
      variants: vars.map(e => `${IdPrefixes.RACE_VARIANTS}_${e}`),
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }

  return;
};

export const initRaceVariant = (
  raw: Rawdata.RawRaceVariant,
  locale: StringKeyObject<Rawdata.RawRaceVariantLocale>,
): Wiki.RaceVariant | undefined => {
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

    return {
      category: Categories.RACE_VARIANTS,
      eyeColors: eyes,
      hairColors: hair,
      id,
      name,
      ...convertSize(size),
      commonAdvantages: typ_adv.map(e => {
        return `${IdPrefixes.ADVANTAGES}_${e}`;
      }),
      commonAdvantagesText,
      commonCultures: typ_cultures.map(e => {
        return `${IdPrefixes.CULTURES}_${e}`;
      }),
      commonDisadvantages: typ_dadv.map(e => {
        return `${IdPrefixes.DISADVANTAGES}_${e}`;
      }),
      commonDisadvantagesText,
      uncommonAdvantages: untyp_adv.map(e => {
        return `${IdPrefixes.ADVANTAGES}_${e}`;
      }),
      uncommonAdvantagesText,
      uncommonDisadvantages: untyp_dadv.map(e => {
        return `${IdPrefixes.DISADVANTAGES}_${e}`;
      }),
      uncommonDisadvantagesText
    };
  }

  return;
};

export const initCulture = (
  raw: Rawdata.RawCulture,
  locale: StringKeyObject<Rawdata.RawCultureLocale>,
): Wiki.Culture | undefined => {
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

    return {
      ...localeRest,
      culturalPackageAdventurePoints: ap,
      category: Categories.CULTURES,
      id,
      languages: lang,
      scripts: literacy,
      socialStatus: social,
      culturalPackageSkills: talents.map(e => ({
        id: `${IdPrefixes.TALENTS}_${e[0]}`,
        value: e[1]
      })),
      commonProfessions: typ_prof,
      commonAdvantages: typ_adv.map(e => {
        return `${IdPrefixes.ADVANTAGES}_${e}`;
      }),
      commonAdvantagesText: commonAdvantages,
      commonDisadvantages: typ_dadv.map(e => {
        return `${IdPrefixes.DISADVANTAGES}_${e}`;
      }),
      commonDisadvantagesText: commonDisadvantages,
      uncommonAdvantages: untyp_adv.map(e => {
        return `${IdPrefixes.ADVANTAGES}_${e}`;
      }),
      uncommonAdvantagesText: uncommonAdvantages,
      uncommonDisadvantages: untyp_dadv.map(e => {
        return `${IdPrefixes.DISADVANTAGES}_${e}`;
      }),
      uncommonDisadvantagesText: uncommonDisadvantages,
      commonSkills: typ_talents.map(e => {
        return `${IdPrefixes.TALENTS}_${e}`;
      }),
      uncommonSkills: untyp_talents.map(e => {
        return `${IdPrefixes.TALENTS}_${e}`;
      }),
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }

  return;
};

export const initProfession = (
  raw: Rawdata.RawProfession,
  locale: StringKeyObject<Rawdata.RawProfessionLocale>,
): Wiki.Profession | undefined => {
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
      id,
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

    const finalReq = [ ...req, ...localeReq ];

    return {
      ap,
      apOfActivatables,
      category: Categories.PROFESSIONS,
      combatTechniques: combattech.map(e => ({
        id: `${IdPrefixes.COMBAT_TECHNIQUES}_${e[0]}`,
        value: e[1]
      })),
      dependencies: pre_req,
      id,
      liturgicalChants: chants.map(e => ({
        id: `${IdPrefixes.LITURGIES}_${e[0]}`,
        value: e[1]
      })),
      blessings: blessings.map(e => `${IdPrefixes.BLESSINGS}_${e[0]}`),
      name,
      prerequisites: finalReq,
      selections: sel,
      specialAbilities: sa,
      spells: spells.map(e => ({
        id: `${IdPrefixes.SPELLS}_${e[0]}`,
        value: e[1]
      })),
      subname,
      skills: talents.map(e => ({
        id: `${IdPrefixes.TALENTS}_${e[0]}`,
        value: e[1]
      })),
      suggestedAdvantages: typ_adv.map(e => {
        return `${IdPrefixes.ADVANTAGES}_${e}`;
      }),
      suggestedDisadvantages: typ_dadv.map(e => {
        return `${IdPrefixes.DISADVANTAGES}_${e}`;
      }),
      unsuitableAdvantages: untyp_adv.map(e => {
        return `${IdPrefixes.ADVANTAGES}_${e}`;
      }),
      unsuitableDisadvantages: untyp_dadv.map(e => {
        return `${IdPrefixes.DISADVANTAGES}_${e}`;
      }),
      variants: vars.map(e => {
        return `${IdPrefixes.PROFESSION_VARIANTS}_${e}`;
      }),
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
};

export const initProfessionVariant = (
  raw: Rawdata.RawProfessionVariant,
  locale: StringKeyObject<Rawdata.RawProfessionVariantLocale>,
): Wiki.ProfessionVariant | undefined => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      id,
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

    return {
      ...localeObject,
      ap,
      apOfActivatables,
      category: Categories.PROFESSION_VARIANTS,
      combatTechniques: combattech.map(e => ({
        id: `${IdPrefixes.COMBAT_TECHNIQUES}_${e[0]}`,
        value: e[1]
      })),
      dependencies: pre_req,
      id,
      prerequisites: req,
      selections: sel,
      specialAbilities: sa,
      skills: talents.map(e => ({
        id: `${IdPrefixes.TALENTS}_${e[0]}`,
        value: e[1]
      })),
      spells: spells.map(e => ({
        id: `${IdPrefixes.SPELLS}_${e[0]}`,
        value: e[1]
      })),
      liturgicalChants: chants.map(e => ({
        id: `${IdPrefixes.LITURGIES}_${e[0]}`,
        value: e[1]
      })),
      blessings: blessings.map(e => `${IdPrefixes.BLESSINGS}_${e}`)
    };
  }

  return;
};

export const initAdvantage = (
  raw: Rawdata.RawAdvantage,
  locale: StringKeyObject<Rawdata.RawAdvantageLocale>,
): Wiki.Advantage | undefined => {
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

    let finalSel: Wiki.SelectionObject[] | undefined;

    if (localeSel && sel) {
      finalSel = localeSel.map(e => ({
        ...sel.find(n => n.id === e.id),
        ...e,
      }));
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
        ...Object.entries(reqIndexText).map<[number, string]>(req => {
          const [index, text] = req;
          return [Number.parseInt(index) - 1, text];
        }),
        ...reqIndexIgnore.map<[number, false]>(e => {
          return [Number.parseInt(e), false];
        })
      ]),
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }

  return;
};

export const initDisadvantage = (
  raw: Rawdata.RawDisadvantage,
  locale: StringKeyObject<Rawdata.RawDisadvantageLocale>,
): Wiki.Disadvantage | undefined => {
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

    let finalSel: Wiki.SelectionObject[] | undefined;

    if (localeSel && sel) {
      finalSel = localeSel.map(e => ({
        ...sel.find(n => n.id === e.id),
        ...e
      }));
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
        ...Object.entries(reqIndexText).map<[number, string]>(req => {
          const [index, text] = req;
          return [Number.parseInt(index) - 1, text];
        }),
        ...reqIndexIgnore.map<[number, false]>(e => {
          return [Number.parseInt(e), false];
        })
      ]),
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }

  return;
};

export const initSpecialAbility = (
  raw: Rawdata.RawSpecialAbility,
  locale: StringKeyObject<Rawdata.RawSpecialAbilityLocale>,
): Wiki.SpecialAbility | undefined => {
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

    let finalSel: Wiki.SelectionObject[] | undefined;

    if (localeSel && sel) {
      finalSel = localeSel.map(e => ({
        ...sel.find(n => n.id === e.id),
        ...e
      }));
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
      prerequisites: Array.isArray(req[0])
        ? new Map<number, ('RCP' | Reusable.AllRequirementTypes)[]>(req as any)
        : req as ('RCP' | Reusable.AllRequirementTypes)[],
      select: finalSel,
      prerequisitesText: reqText,
      prerequisitesTextEnd: reqEnd,
      prerequisitesTextStart: reqStart,
      prerequisitesTextIndex: new Map<number, string | false>([
        ...Object.entries(reqIndexText).map<[number, string]>(req => {
          const [index, text] = req;
          return [Number.parseInt(index) - 1, text];
        }),
        ...reqIndexIgnore.map<[number, false]>(e => {
          return [Number.parseInt(e), false];
        })
      ]),
      src: srcIds.map((id, index) => ({ id, page: srcPages[index] }))
    };
  }

  return;
};

export const initAttribute = (
  raw: Rawdata.RawAttribute,
  locale: StringKeyObject<Rawdata.RawAttributeLocale>,
): Wiki.Attribute | undefined => {
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
};

export const initCombatTechnique = (
  raw: Rawdata.RawCombatTechnique,
  locale: StringKeyObject<Rawdata.RawCombatTechniqueLocale>,
): Wiki.CombatTechnique | undefined => {
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
};

export const initLiturgicalChant = (
  raw: Rawdata.RawLiturgy,
  locale: StringKeyObject<Rawdata.RawLiturgyLocale>,
): Wiki.LiturgicalChant | undefined => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      name,
      effect,
      castingtime,
      castingtimeShort,
      kpcost,
      kpcostShort,
      range,
      rangeShort,
      duration,
      durationShort,
      target,
      src: srcPages
    } = localeObject;

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

export const initBlessing = (
  raw: Rawdata.RawBlessing,
  locale: StringKeyObject<Rawdata.RawBlessingLocale>,
): Wiki.Blessing | undefined => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      name,
      effect,
      range,
      duration,
      target,
      src: srcPages
    } = localeObject;

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
};

export const initSpell = (
  raw: Rawdata.RawSpell,
  locale: StringKeyObject<Rawdata.RawSpellLocale>,
): Wiki.Spell | undefined => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      name,
      effect,
      castingtime,
      castingtimeShort,
      aecost,
      aecostShort,
      range,
      rangeShort,
      duration,
      durationShort,
      target,
      src: srcPages
    } = localeObject;

    const {
      id,
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
};

export const initCantrip = (
  raw: Rawdata.RawCantrip,
  locale: StringKeyObject<Rawdata.RawCantripLocale>,
): Wiki.Cantrip | undefined => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      name,
      effect,
      range,
      duration,
      target,
      note,
      src: srcPages
    } = localeObject;

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
};

export const initSkill = (
  raw: Rawdata.RawTalent,
  locale: StringKeyObject<Rawdata.RawTalentLocale>,
): Wiki.Skill | undefined => {
  const { id } = raw;
  const localeObject = locale[id];

  if (localeObject) {
    const {
      name,
      spec: applicationNames,
      spec_input,
      ...other
    } = localeObject;

    const {
      be,
      check,
      gr,
      skt,
      applications: applicationPrerequisites
    } = raw;

    return {
      ...other,
      category: Categories.TALENTS,
      check,
      encumbrance: be,
      gr,
      ic: skt,
      name,
      applications: applicationNames.map(app => {
        if (app.id < 0) {
          const prerequisitesElem =
            applicationPrerequisites &&
            applicationPrerequisites.find(e => {
              return app.id === e.id;
            });

          if (typeof prerequisitesElem === 'object') {
            return {
              ...prerequisitesElem,
              ...app,
            };
          }

          return;
        }
        return app;
      }).filter(e => typeof e === 'object') as Wiki.Application[],
      applicationsInput: spec_input,
    };
  }
  return;
};

export const initItemTemplate = (
  raw: Rawdata.RawItem,
  locale: StringKeyObject<Rawdata.RawItemLocale>,
): Wiki.ItemTemplate | undefined => {
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
};
