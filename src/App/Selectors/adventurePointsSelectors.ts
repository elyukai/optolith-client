import { cnst } from "../../Data/Function"
import { foldr, List } from "../../Data/List"
import { any, elem, fmap, fromJust, isJust, join, Just, liftM2, Maybe, Nothing } from "../../Data/Maybe"
import { add, subtract } from "../../Data/Num"
import { fst, snd } from "../../Data/Tuple"
import { uncurryN } from "../../Data/Tuple/Curry"
import { UndoableHero } from "../Models/Hero/UndoHero"
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel"
import { getAPSpentForAdvantages, getAPSpentForAttributes, getAPSpentForBlessedAdvantages, getAPSpentForBlessedDisadvantages, getAPSpentForBlessings, getAPSpentForCantrips, getAPSpentForCombatTechniques, getAPSpentForDisadvantages, getAPSpentForEnergies, getAPSpentForLiturgicalChants, getAPSpentForMagicalAdvantages, getAPSpentForMagicalDisadvantages, getAPSpentForProfession, getAPSpentForRace, getAPSpentForSkills, getAPSpentForSpecialAbilities, getAPSpentForSpells } from "../Utilities/AdventurePoints/adventurePointsSumUtils"
import { getDisAdvantagesSubtypeMax } from "../Utilities/AdventurePoints/adventurePointsUtils"
import { createMapSelector, createMapSelectorS } from "../Utilities/createMapSelector"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { pipe } from "../Utilities/pipe"
import { getAdvantagesForEditMap, getDisadvantagesForEditMap, getSpecialAbilitiesForEditMap } from "./activatableSelectors"
import { getStartEl } from "./elSelectors"
import { getCurrentHeroPresent, getHeroes, getTotalAdventurePoints, getWiki, getWikiCombatTechniques, getWikiLiturgicalChants, getWikiSkills, getWikiSpells } from "./stateSelectors"

export const getAPSpentOnAttributesMap =
  createMapSelectorS (getHeroes)
                     ()
                     (hero => hero.present.attributes)
                     (cnst (getAPSpentForAttributes))

export const getAPSpentOnSkillsMap =
  createMapSelectorS (getHeroes)
                     (getWikiSkills)
                     (hero => hero.present.skills)
                     (getAPSpentForSkills)

export const getAPSpentOnCombatTechniquesMap =
  createMapSelectorS (getHeroes)
                     (getWikiCombatTechniques)
                     (hero => hero.present.combatTechniques)
                     (getAPSpentForCombatTechniques)

export const getAPSpentOnSpellsMap =
  createMapSelectorS (getHeroes)
                     (getWikiSpells)
                     (hero => hero.present.spells)
                     (getAPSpentForSpells)

export const getAPSpentOnLiturgicalChantsMap =
  createMapSelectorS (getHeroes)
                     (getWikiLiturgicalChants)
                     (hero => hero.present.liturgicalChants)
                     (getAPSpentForLiturgicalChants)

export const getAPSpentOnCantripsMap =
  createMapSelectorS (getHeroes)
                     ()
                     (hero => hero.present.cantrips)
                     (cnst (getAPSpentForCantrips))

export const getAPSpentOnBlessingsMap =
  createMapSelectorS (getHeroes)
                     ()
                     (hero => hero.present.blessings)
                     (cnst (getAPSpentForBlessings))

export const getAPSpentOnAdvantagesMap =
  createMapSelector (getHeroes)
                    (getAdvantagesForEditMap)
                    (getWiki)
                    (hero => hero.present.advantages)
                    (map => wiki => xmap =>
                      fmap (getAPSpentForAdvantages (wiki) (xmap)) (map))

export const getAPSpentOnMagicalAdvantagesMap =
  createMapSelector (getHeroes)
                    (getAdvantagesForEditMap)
                    (getWiki)
                    (hero => hero.present.advantages)
                    (map => wiki => xmap =>
                      fmap (getAPSpentForMagicalAdvantages (wiki) (xmap)) (map))

export const getAPSpentOnBlessedAdvantagesMap =
  createMapSelector (getHeroes)
                    (getAdvantagesForEditMap)
                    (getWiki)
                    (hero => hero.present.advantages)
                    (map => wiki => xmap =>
                      fmap (getAPSpentForBlessedAdvantages (wiki) (xmap)) (map))

export const getAPSpentOnDisadvantagesMap =
  createMapSelector (getHeroes)
                    (getDisadvantagesForEditMap)
                    (getWiki)
                    (hero => hero.present.disadvantages)
                    (map => wiki => xmap =>
                      fmap (getAPSpentForDisadvantages (wiki) (xmap)) (map))

export const getAPSpentOnMagicalDisadvantagesMap =
  createMapSelector (getHeroes)
                    (getDisadvantagesForEditMap)
                    (getWiki)
                    (hero => hero.present.disadvantages)
                    (map => wiki => xmap =>
                      fmap (getAPSpentForMagicalDisadvantages (wiki) (xmap)) (map))

export const getAPSpentOnBlessedDisadvantagesMap =
  createMapSelector (getHeroes)
                    (getDisadvantagesForEditMap)
                    (getWiki)
                    (hero => hero.present.disadvantages)
                    (map => wiki => xmap =>
                      fmap (getAPSpentForBlessedDisadvantages (wiki) (xmap)) (map))

export const getMagicalAdvantagesDisadvantagesAdventurePointsMaximum = createMaybeSelector (
  getCurrentHeroPresent,
  fmap (getDisAdvantagesSubtypeMax (true))
)

export const getAPSpentOnSpecialAbilitiesMap =
  createMapSelector (getHeroes)
                    (getSpecialAbilitiesForEditMap)
                    (getWiki)
                    (hero => hero.present.specialAbilities)
                    (map => wiki => xmap =>
                      fmap (getAPSpentForSpecialAbilities (wiki) (xmap)) (map))

export const getAPSpentOnEnergiesMap =
  createMapSelectorS (getHeroes)
                     ()
                     (hero => hero.present.energies)
                     (cnst (getAPSpentForEnergies))

export const getAPSpentOnRaceMap =
  createMapSelectorS (getHeroes)
                     (getWiki)
                     (hero => hero.present.race)
                     (getAPSpentForRace)

export const getAPSpentOnProfessionMap =
  createMapSelectorS (getHeroes)
                     (getWiki)
                     (
                       hero => hero.present.profession,
                       hero => hero.present.phase
                     )
                     (wiki => uncurryN (getAPSpentForProfession (wiki)))

export const getAPSpentMap =
  createMapSelector (getHeroes)
                    (
                      getAPSpentOnAttributesMap,
                      getAPSpentOnSkillsMap,
                      getAPSpentOnCombatTechniquesMap,
                      getAPSpentOnSpellsMap,
                      getAPSpentOnLiturgicalChantsMap,
                      getAPSpentOnCantripsMap,
                      getAPSpentOnBlessingsMap,
                      getAPSpentOnEnergiesMap,
                      getAPSpentOnAdvantagesMap,
                      getAPSpentOnDisadvantagesMap,
                      getAPSpentOnSpecialAbilitiesMap,
                      getAPSpentOnProfessionMap,
                      getAPSpentOnRaceMap
                    )
                    ()
                    ()
                    ((
                      spentOnAttributes,
                      spentOnSkills,
                      spentOnCombatTechniques,
                      spentOnSpells,
                      spentOnLiturgicalChants,
                      spentOnCantrips,
                      spentOnBlessings,
                      spentOnEnergies,
                      spentOnAdvantages,
                      spentOnDisadvantages,
                      spentOnSpecialAbilities,
                      spentOnProfession,
                      spentOnRace
                    ) => () => () =>
                      foldr (pipe (
                              (e: Maybe<number> | Maybe<Maybe<number>>) =>
                                any (isMaybe) (e) ? join (e) : e,
                              Maybe.sum,
                              add
                            ))
                            (0)
                            (List<Maybe<number> | Maybe<Maybe<number>>> (
                              spentOnAttributes,
                              spentOnSkills,
                              spentOnCombatTechniques,
                              spentOnSpells,
                              spentOnLiturgicalChants,
                              spentOnCantrips,
                              spentOnBlessings,
                              spentOnEnergies,
                              fmapF (spentOnAdvantages) (fmap (snd)),
                              fmapF (spentOnDisadvantages) (fmap (snd)),
                              spentOnSpecialAbilities,
                              spentOnProfession,
                              spentOnRace
                            )))

export const getAvailableAPMap =
  createMapSelector (getHeroes)
                    (getAPSpentMap)
                    ()
                    ((hero: UndoableHero) => hero.present.adventurePointsTotal)
                    (spent => () => total => fmap (subtract (total)) (spent))

export const getAPObjectMap =
  createMapSelector (getHeroes)
                    (
                      getAPSpentMap,
                      getAvailableAPMap,
                      getAPSpentOnAttributesMap,
                      getAPSpentOnSkillsMap,
                      getAPSpentOnCombatTechniquesMap,
                      getAPSpentOnSpellsMap,
                      getAPSpentOnLiturgicalChantsMap,
                      getAPSpentOnCantripsMap,
                      getAPSpentOnBlessingsMap,
                      getAPSpentOnEnergiesMap,
                      getAPSpentOnAdvantagesMap,
                      getAPSpentOnBlessedAdvantagesMap,
                      getAPSpentOnMagicalAdvantagesMap,
                      getAPSpentOnDisadvantagesMap,
                      getAPSpentOnBlessedDisadvantagesMap,
                      getAPSpentOnMagicalDisadvantagesMap,
                      getAPSpentOnSpecialAbilitiesMap,
                      getAPSpentOnRaceMap,
                      getAPSpentOnProfessionMap
                    )
                    ()
                    (hero => hero.present.adventurePointsTotal)
                    ((
                      spent,
                      available,
                      attrs,
                      skills,
                      cts,
                      spells,
                      chants,
                      cantrs,
                      bless,
                      energs,
                      advs,
                      bl_advs,
                      ma_advs,
                      diss,
                      bl_diss,
                      ma_diss,
                      sas,
                      race,
                      prof
                    ) =>
                    () =>
                    total =>
                      isJust (spent)
                      && any (isJust) (available)
                      && any (isJust) (advs)
                      && any (isJust) (bl_advs)
                      && any (isJust) (ma_advs)
                      && any (isJust) (diss)
                      && any (isJust) (bl_diss)
                      && any (isJust) (ma_diss)
                      && any (isJust) (sas)
                      && isJust (attrs)
                      && isJust (skills)
                      && isJust (cts)
                      && isJust (spells)
                      && isJust (chants)
                      && isJust (cantrs)
                      && isJust (bless)
                      && isJust (energs)
                      && isJust (race)
                      && isJust (prof)
                      ? Just ({
                        total,
                        spent: fromJust (spent),
                        available: fromJust (fromJust (available)),
                        spentOnAdvantages: fst (fromJust (fromJust (advs))),
                        spentOnMagicalAdvantages: fst (fromJust (fromJust (ma_advs))),
                        spentOnBlessedAdvantages: fst (fromJust (fromJust (bl_advs))),
                        spentOnDisadvantages: Math.abs (fst (fromJust (fromJust (diss)))),
                        spentOnMagicalDisadvantages: Math.abs (fst (fromJust (fromJust (ma_diss)))),
                        spentOnBlessedDisadvantages: Math.abs (fst (fromJust (fromJust (bl_diss)))),
                        spentOnSpecialAbilities: fromJust (fromJust (sas)),
                        spentOnAttributes: fromJust (attrs),
                        spentOnSkills: fromJust (skills),
                        spentOnCombatTechniques: fromJust (cts),
                        spentOnSpells: fromJust (spells),
                        spentOnLiturgicalChants: fromJust (chants),
                        spentOnCantrips: fromJust (cantrs),
                        spentOnBlessings: fromJust (bless),
                        spentOnEnergies: fromJust (energs),
                        spentOnRace: fromJust (race),
                        spentOnProfession: fromJust (prof),
                      })
                      : Nothing)

export const getHasCurrentNoAddedAP = createMaybeSelector (
  getTotalAdventurePoints,
  getStartEl,
  (mtotal_ap, mel) =>
    elem (true)
         (liftM2<number, ExperienceLevel, boolean>
           (totalAdventurePoints => experienceLevel =>
             totalAdventurePoints === experienceLevel.ap)
           (mtotal_ap)
           (mel))
)
