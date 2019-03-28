import { fmap, fmapF } from "../../Data/Functor";
import { foldr, List } from "../../Data/List";
import { bind, elem, fromJust, isJust, Just, liftM2, Maybe, Nothing } from "../../Data/Maybe";
import { Record } from "../../Data/Record";
import { AdventurePointsCategories } from "../Models/View/AdventurePointsCategories";
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel";
import { getAPSpentForAdvantages, getAPSpentForAttributes, getAPSpentForBlessedAdvantages, getAPSpentForBlessedDisadvantages, getAPSpentForBlessings, getAPSpentForCantrips, getAPSpentForCombatTechniques, getAPSpentForDisadvantages, getAPSpentForEnergies, getAPSpentForLiturgicalChants, getAPSpentForMagicalAdvantages, getAPSpentForMagicalDisadvantages, getAPSpentForProfession, getAPSpentForRace, getAPSpentForSkills, getAPSpentForSpecialAbilities, getAPSpentForSpells } from "../Utilities/AdventurePoints/adventurePointsSumUtils";
import { getDisAdvantagesSubtypeMax } from "../Utilities/AdventurePoints/adventurePointsUtils";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { add, subtractBy } from "../Utilities/mathUtils";
import { pipe } from "../Utilities/pipe";
import { getAdvantagesForEdit, getDisadvantagesForEdit, getSpecialAbilitiesForEdit } from "./activatableSelectors";
import { getStartEl } from "./elSelectors";
import { getAdvantages, getAttributes, getBlessings, getCantrips, getCombatTechniques, getCurrentHeroPresent, getCurrentProfessionId, getCurrentProfessionVariantId, getCurrentRaceId, getDisadvantages, getEnergies, getLiturgicalChants, getPhase, getSkills, getSpecialAbilities, getSpells, getTotalAdventurePoints, getWiki, getWikiCombatTechniques, getWikiLiturgicalChants, getWikiSkills, getWikiSpells } from "./stateSelectors";

export const getAdventurePointsSpentForAttributes = createMaybeSelector (
  getAttributes,
  fmap (getAPSpentForAttributes)
)

export const getAdventurePointsSpentForSkills = createMaybeSelector (
  getWikiSkills,
  getSkills,
  (wiki, mhero) => fmapF (mhero) (getAPSpentForSkills (wiki))
)

export const getAdventurePointsSpentForCombatTechniques = createMaybeSelector (
  getWikiCombatTechniques,
  getCombatTechniques,
  (wiki, mhero) => fmapF (mhero) (getAPSpentForCombatTechniques (wiki))
)

export const getAdventurePointsSpentForSpells = createMaybeSelector (
  getWikiSpells,
  getSpells,
  (wiki, mhero) => fmapF (mhero) (getAPSpentForSpells (wiki))
)

export const getAdventurePointsSpentForLiturgicalChants = createMaybeSelector (
  getWikiLiturgicalChants,
  getLiturgicalChants,
  (wiki, mhero) => fmapF (mhero) (getAPSpentForLiturgicalChants (wiki))
)

export const getAdventurePointsSpentForCantrips = createMaybeSelector (
  getCantrips,
  fmap (getAPSpentForCantrips)
)

export const getAdventurePointsSpentForBlessings = createMaybeSelector (
  getBlessings,
  fmap (getAPSpentForBlessings)
)

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
