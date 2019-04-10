import { cnst } from "../../Data/Function";
import { fmap, fmapF } from "../../Data/Functor";
import { foldr, List } from "../../Data/List";
import { bind, elem, fromJust, isJust, Just, liftM2, Maybe, Nothing } from "../../Data/Maybe";
import { Record } from "../../Data/Record";
import { HeroModel } from "../Models/Hero/HeroModel";
import { AdventurePointsCategories } from "../Models/View/AdventurePointsCategories";
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel";
import { heroReducer } from "../Reducers/heroReducer";
import { getAPSpentForAdvantages, getAPSpentForAttributes, getAPSpentForBlessedAdvantages, getAPSpentForBlessedDisadvantages, getAPSpentForBlessings, getAPSpentForCantrips, getAPSpentForCombatTechniques, getAPSpentForDisadvantages, getAPSpentForEnergies, getAPSpentForLiturgicalChants, getAPSpentForMagicalAdvantages, getAPSpentForMagicalDisadvantages, getAPSpentForProfession, getAPSpentForRace, getAPSpentForSkills, getAPSpentForSpecialAbilities, getAPSpentForSpells } from "../Utilities/AdventurePoints/adventurePointsSumUtils";
import { getDisAdvantagesSubtypeMax } from "../Utilities/AdventurePoints/adventurePointsUtils";
import { createMapSelector } from "../Utilities/createMapSelector";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { add, subtractBy } from "../Utilities/mathUtils";
import { pipe } from "../Utilities/pipe";
import { getAdvantagesForEdit, getDisadvantagesForEdit, getSpecialAbilitiesForEdit } from "./activatableSelectors";
import { getStartEl } from "./elSelectors";
import { getAdvantages, getCurrentHeroPresent, getCurrentProfessionId, getCurrentProfessionVariantId, getCurrentRaceId, getDisadvantages, getEnergies, getHeroes, getPhase, getSpecialAbilities, getTotalAdventurePoints, getWiki, getWikiCombatTechniques, getWikiLiturgicalChants, getWikiSkills, getWikiSpells } from "./stateSelectors";

const UA = heroReducer.A
const HA = HeroModel.A

export const getAPSpentForAttributesMap =
  createMapSelector ({
                      map: getHeroes,
                      global: [],
                      value: [pipe (UA.present, HA.attributes)],
                      fold: cnst (getAPSpentForAttributes),
                    })

export const getAPSpentForSkillsMap =
  createMapSelector ({
                      map: getHeroes,
                      global: [getWikiSkills],
                      value: [pipe (UA.present, HA.skills)],
                      fold: getAPSpentForSkills,
                    })

export const getAPSpentForCombatTechniquesMap =
  createMapSelector ({
                      map: getHeroes,
                      global: [getWikiCombatTechniques],
                      value: [pipe (UA.present, HA.combatTechniques)],
                      fold: getAPSpentForCombatTechniques,
                    })

export const getAPSpentForSpellsMap =
  createMapSelector ({
                      map: getHeroes,
                      global: [getWikiSpells],
                      value: [pipe (UA.present, HA.spells)],
                      fold: getAPSpentForSpells,
                    })

export const getAPSpentForLiturgicalChantsMap =
  createMapSelector ({
                      map: getHeroes,
                      global: [getWikiLiturgicalChants],
                      value: [pipe (UA.present, HA.liturgicalChants)],
                      fold: getAPSpentForLiturgicalChants,
                    })

export const getAPSpentForCantripsMap =
  createMapSelector ({
                      map: getHeroes,
                      global: [],
                      value: [pipe (UA.present, HA.cantrips)],
                      fold: cnst (getAPSpentForCantrips),
                    })

export const getAPSpentForBlessingsMap =
  createMapSelector ({
                      map: getHeroes,
                      global: [],
                      value: [pipe (UA.present, HA.blessings)],
                      fold: cnst (getAPSpentForBlessings),
                    })

type test = typeof getAdvantagesForEdit

export const getAPSpentForAdvantagesMap =
  createMapSelector ({
                      map: getHeroes,
                      global: [getAdvantages, getAdvantagesForEdit],
                      value: [],
                      fold: getAPSpentForSkills,
                    })

export const getAdventurePointsSpentForAdvantages = createMaybeSelector (
  getWiki,
  getAdvantages,
  getAdvantagesForEdit,
  (wiki, mhero, mactive) => liftM2 (getAPSpentForAdvantages (wiki))
                                   (mhero)
                                   (mactive)
)

export const getAdventurePointsSpentForMagicalAdvantages = createMaybeSelector (
  getWiki,
  getAdvantages,
  getAdvantagesForEdit,
  (wiki, mhero, mactive) => liftM2 (getAPSpentForMagicalAdvantages (wiki))
                                   (mhero)
                                   (mactive)
)

export const getAdventurePointsSpentForBlessedAdvantages = createMaybeSelector (
  getWiki,
  getAdvantages,
  getAdvantagesForEdit,
  (wiki, mhero, mactive) => liftM2 (getAPSpentForBlessedAdvantages (wiki))
                                   (mhero)
                                   (mactive)
)

export const getAdventurePointsSpentForDisadvantages = createMaybeSelector (
  getWiki,
  getDisadvantages,
  getDisadvantagesForEdit,
  (wiki, mhero, mactive) => liftM2 (getAPSpentForDisadvantages (wiki))
                                   (mhero)
                                   (mactive)
)

export const getAdventurePointsSpentForMagicalDisadvantages = createMaybeSelector (
  getWiki,
  getDisadvantages,
  getDisadvantagesForEdit,
  (wiki, mhero, mactive) => liftM2 (getAPSpentForMagicalDisadvantages (wiki))
                                   (mhero)
                                   (mactive)
)

export const getAdventurePointsSpentForBlessedDisadvantages = createMaybeSelector (
  getWiki,
  getDisadvantages,
  getDisadvantagesForEdit,
  (wiki, mhero, mactive) => liftM2 (getAPSpentForBlessedDisadvantages (wiki))
                                   (mhero)
                                   (mactive)
)

export const getMagicalAdvantagesDisadvantagesAdventurePointsMaximum = createMaybeSelector (
  getCurrentHeroPresent,
  fmap (getDisAdvantagesSubtypeMax (true))
)

export const getAdventurePointsSpentForSpecialAbilities = createMaybeSelector (
  getWiki,
  getSpecialAbilities,
  getSpecialAbilitiesForEdit,
  (wiki, mhero, mactive) => liftM2 (getAPSpentForSpecialAbilities (wiki))
                                   (mhero)
                                   (mactive)
)

export const getAdventurePointsSpentForEnergies = createMaybeSelector (
  getEnergies,
  fmap (getAPSpentForEnergies)
)

export const getAdventurePointsSpentForRace = createMaybeSelector (
  getWiki,
  getCurrentRaceId,
  (wiki, mid) => getAPSpentForRace (wiki) (mid)
)

export const getAdventurePointsSpentForProfession = createMaybeSelector (
  getWiki,
  getCurrentProfessionId,
  getCurrentProfessionVariantId,
  getPhase,
  (wiki, mprofId, mprofVarId, mphase) =>
    bind (mphase) (getAPSpentForProfession (wiki) (mprofId) (mprofVarId))
)

const getAdventurePointsSpentPart = createMaybeSelector (
  getAdventurePointsSpentForAttributes,
  getAdventurePointsSpentForSkills,
  getAdventurePointsSpentForCombatTechniques,
  getAdventurePointsSpentForSpells,
  getAdventurePointsSpentForLiturgicalChants,
  getAdventurePointsSpentForCantrips,
  getAdventurePointsSpentForBlessings,
  (...cost: Maybe<number>[]) => foldr (pipe (Maybe.sum, add)) (0) (List.fromArray (cost))
)

export const getAdventurePointsSpent = createMaybeSelector (
  getAdventurePointsSpentPart,
  getAdventurePointsSpentForProfession,
  getAdventurePointsSpentForAdvantages,
  getAdventurePointsSpentForDisadvantages,
  getAdventurePointsSpentForSpecialAbilities,
  getAdventurePointsSpentForEnergies,
  getAdventurePointsSpentForRace,
  (part, costProf, costAdv, costDis, costSA, costEne, costRace) =>
    part + foldr (pipe (Maybe.sum, add))
                 (0)
                 (List (costProf, costAdv, costDis, costSA, costEne, Just (costRace)))
)

export const getAvailableAdventurePoints = createMaybeSelector (
  getTotalAdventurePoints,
  getAdventurePointsSpent,
  (total, spent) => fmapF (total) (subtractBy (spent))
)

const getAdventurePointsObjectPart = createMaybeSelector (
  getAdventurePointsSpentForAttributes,
  getAdventurePointsSpentForSkills,
  getAdventurePointsSpentForCombatTechniques,
  getAdventurePointsSpentForSpells,
  getAdventurePointsSpentForLiturgicalChants,
  getAdventurePointsSpentForCantrips,
  getAdventurePointsSpentForBlessings,
  getAdventurePointsSpentForSpecialAbilities,
  getAdventurePointsSpentForEnergies,
  getAdventurePointsSpentForRace,
  getAdventurePointsSpentForProfession,
  (
    spentOnAttributes,
    spentOnSkills,
    spentOnCombatTechniques,
    spentOnSpells,
    spentOnLiturgicalChants,
    spentOnCantrips,
    spentOnBlessings,
    spentOnSpecialAbilities,
    spentOnEnergies,
    spentOnRace,
    spentOnProfession
  ) =>
    isJust (spentOnAttributes)
    && isJust (spentOnSkills)
    && isJust (spentOnCombatTechniques)
    && isJust (spentOnSpells)
    && isJust (spentOnLiturgicalChants)
    && isJust (spentOnCantrips)
    && isJust (spentOnBlessings)
    && isJust (spentOnSpecialAbilities)
    && isJust (spentOnEnergies)
    ? Just ({
      spentOnAttributes: fromJust (spentOnAttributes),
      spentOnSkills: fromJust (spentOnSkills),
      spentOnCombatTechniques: fromJust (spentOnCombatTechniques),
      spentOnSpells: fromJust (spentOnSpells),
      spentOnLiturgicalChants: fromJust (spentOnLiturgicalChants),
      spentOnCantrips: fromJust (spentOnCantrips),
      spentOnBlessings: fromJust (spentOnBlessings),
      spentOnSpecialAbilities: fromJust (spentOnSpecialAbilities),
      spentOnEnergies: fromJust (spentOnEnergies),
      spentOnRace,
      spentOnProfession,
    })
    : Nothing
)

export const getAdventurePointsObject = createMaybeSelector (
  getTotalAdventurePoints,
  getAdventurePointsSpent,
  getAvailableAdventurePoints,
  getAdventurePointsSpentForAdvantages,
  getAdventurePointsSpentForBlessedAdvantages,
  getAdventurePointsSpentForMagicalAdvantages,
  getAdventurePointsSpentForDisadvantages,
  getAdventurePointsSpentForBlessedDisadvantages,
  getAdventurePointsSpentForMagicalDisadvantages,
  getAdventurePointsObjectPart,
  (
    total,
    spent,
    available,
    spentOnAdvantages,
    spentOnBlessedAdvantages,
    spentOnMagicalAdvantages,
    spentOnDisadvantages,
    spentOnBlessedDisadvantages,
    spentOnMagicalDisadvantages,
    part
  ) =>
    isJust (total)
    && isJust (available)
    && isJust (spentOnAdvantages)
    && isJust (spentOnBlessedAdvantages)
    && isJust (spentOnMagicalAdvantages)
    && isJust (spentOnDisadvantages)
    && isJust (spentOnBlessedDisadvantages)
    && isJust (spentOnMagicalDisadvantages)
    && isJust (part)
    ? Just (AdventurePointsCategories ({
      total: fromJust (total),
      spent,
      available: fromJust (available),
      spentOnAdvantages: fromJust (spentOnAdvantages),
      spentOnMagicalAdvantages: fromJust (spentOnMagicalAdvantages),
      spentOnBlessedAdvantages: fromJust (spentOnBlessedAdvantages),
      spentOnDisadvantages: fromJust (spentOnDisadvantages),
      spentOnMagicalDisadvantages: fromJust (spentOnMagicalDisadvantages),
      spentOnBlessedDisadvantages: fromJust (spentOnBlessedDisadvantages),
      ...fromJust (part),
    }))
    : Nothing
)

export const getHasCurrentNoAddedAP = createMaybeSelector (
  getTotalAdventurePoints,
  getStartEl,
  (mtotal_ap, mel) =>
    elem (true)
         (liftM2<number, Record<ExperienceLevel>, boolean>
           (totalAdventurePoints => experienceLevel =>
             totalAdventurePoints === ExperienceLevel.A.ap (experienceLevel))
           (mtotal_ap)
           (mel))
)
