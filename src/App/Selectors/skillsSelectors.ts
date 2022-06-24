import { flip } from "../../Data/Function"
import { fmap, fmapF } from "../../Data/Functor"
import { foldr, map, List } from "../../Data/List"
import { Record } from "../../Data/Record"
import { fromMaybe, liftM2, liftM3, Maybe, maybe } from "../../Data/Maybe"
import { elems, insertF, lookup, OrderedMap } from "../../Data/OrderedMap"
import { uncurryN3, uncurryN4 } from "../../Data/Tuple/Curry"
import { AdvantageId } from "../Constants/Ids"
import { createPlainSkillDependent } from "../Models/ActiveEntries/SkillDependent"
import { HeroModel } from "../Models/Hero/HeroModel"
import { EntryRating } from "../Models/Hero/heroTypeHelpers"
import { Affection } from "../Models/View/Affection"
import { SkillCombined } from "../Models/View/SkillCombined"
import { SkillWithRequirements } from "../Models/View/SkillWithRequirements"
import { SkillWithActivations } from "../Models/View/SkillWithActivations"
import { Culture } from "../Models/Wiki/Culture"
import { Skill } from "../Models/Wiki/Skill"
import { Affection as WikiAffection } from "../Models/Wiki/sub/Affection"
import { Application } from "../Models/Wiki/sub/Application"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy"
import {
  isSkillDecreasable,
  isSkillIncreasable,
} from "../Utilities/Increasable/skillUtils"
import { pipe, pipe_ } from "../Utilities/pipe"
import { validateObject } from "../Utilities/Prerequisites/validatePrerequisitesUtils"
import { getCurrentCulture } from "./cultureSelectors"
import { getStartEl } from "./elSelectors"
import { getSkillsCombinedSortOptions } from "./sortOptionsSelectors"
import { getCurrentHeroPresent, getSkills, getSkillsFilterText, getWiki, getWikiSkills } from "./stateSelectors"

const HA = HeroModel.A
const SA = Skill.A
const AA = Application.A
const SCA = SkillCombined.A
const SWRA = SkillWithRequirements.A
const CA = Culture.A

export const getAllSkills = createMaybeSelector (
  getWikiSkills,
  getSkills,
  (staticSkills, heroSkills) =>
    fmapF (heroSkills)
          (hero_skills => pipe_ (
            staticSkills,
            elems,
            map (wiki_entry =>
                  SkillCombined ({
                    stateEntry:
                      fromMaybe (createPlainSkillDependent (SA.id (wiki_entry)))
                                (lookup (SA.id (wiki_entry))
                                        (hero_skills)),
                    wikiEntry: wiki_entry,
                  }))
          ))
)

const createAffection = (hero: Record<HeroModel>) =>
  (affections: List<WikiAffection>) => (name: string) => {
  const activeAffections = List.filter ((affection: WikiAffection) => {
    const affectedAdvantage = lookup (affection.id) (HA.advantages (hero))
    const affectedSpecialAbility = lookup (affection.id) (HA.specialAbilities (hero))
    const affectedDisadvantage = lookup (affection.id) (HA.disadvantages (hero))

    return Maybe.isJust (affectedAdvantage)
      || Maybe.isJust (affectedSpecialAbility)
      || Maybe.isJust (affectedDisadvantage)
  }) (affections)

  const getBonus = (affection: WikiAffection) => affection.bonus || 0
  const getFP = (affection: WikiAffection) => affection.fp || 0
  const getQS = (affection: WikiAffection) => affection.qs || 0
  const getBonusOnCH = (affection: WikiAffection) => affection.bonusOnAttribute?.CH || 0
  const getBonusOnKL = (affection: WikiAffection) => affection.bonusOnAttribute?.KL || 0
  const getPenalty = (affection: WikiAffection) => affection.penalty || 0
  const getPenaltyOnCH = (affection: WikiAffection) => affection.penaltyOnAttribute?.CH || 0
  const getPenaltyOnKL = (affection: WikiAffection) => affection.penaltyOnAttribute?.KL || 0
  const getSituative = (affection: WikiAffection) => affection.situative || false

  const active = !List.fnull (activeAffections)
  const fp = List.sum (List.map (getFP) (activeAffections))
  const qs = List.sum (List.map (getQS) (activeAffections))
  const bonus = List.sum (List.map (getBonus) (activeAffections))
  const bonusOnCH = List.sum (List.map (getBonusOnCH) (activeAffections))
  const bonusOnKL = List.sum (List.map (getBonusOnKL) (activeAffections))
  const penalty = List.sum (List.map (getPenalty) (activeAffections))
  const penaltyOnCH = List.sum (List.map (getPenaltyOnCH) (activeAffections))
  const penaltyOnKL = List.sum (List.map (getPenaltyOnKL) (activeAffections))
  const situative = List.any (getSituative) (activeAffections)

  return Affection ({
    name,
    active,
    fp,
    qs,
    bonus,
    bonusOnAttribute: {
      CH: bonusOnCH,
      KL: bonusOnKL,
    },
    penalty,
    penaltyOnAttribute: {
      CH: penaltyOnCH,
      KL: penaltyOnKL,
    },
    situative,
  })
}

export const getSkillsWithActivations = createMaybeSelector (
  getWiki,
  getCurrentHeroPresent,
  getAllSkills,
  uncurryN3 (wiki =>
    liftM2 (hero =>
        map (x =>
          SkillWithActivations ({
            activeAffection: createAffection (hero)
            (SA.affections (SCA.wikiEntry (x))) (SA.name (SCA.wikiEntry (x))),
            activeApplicationAffections: pipe_ (
              x,
              SCA.wikiEntry,
              SA.applications,
              List.map (item => createAffection (hero) (AA.affections (item)) (AA.name (item))),
              List.filter (item => Affection.A.active (item))
            ),
            activeApplications: pipe_ (x, SCA.wikiEntry, SA.applications, List.filter (item => {
              const requirements = AA.prerequisite (item)
              const id = SA.id (SCA.wikiEntry (x))

              if (Maybe.isJust (requirements)) {
                return validateObject (wiki) (hero) (Maybe.fromJust (requirements)) (id)
              }

              return false
            })),
            stateEntry: SCA.stateEntry (x),
            wikiEntry: SCA.wikiEntry (x),
          }))))
)

export const getSkillsWithRequirements = createMaybeSelector (
  getWiki,
  getCurrentHeroPresent,
  getStartEl,
  getAllSkills,
  uncurryN4 (wiki =>
              liftM3 (hero =>
                      start_el =>
                        map (x =>
                              SkillWithRequirements ({
                                isDecreasable:
                                  isSkillDecreasable (wiki)
                                                     (hero)
                                                     (x),
                                isIncreasable:
                                  isSkillIncreasable (start_el)
                                                     (HA.phase (hero))
                                                     (HA.attributes (hero))
                                                     (lookup<string> (AdvantageId.ExceptionalSkill)
                                                                     (HA.advantages (hero)))
                                                     (x),
                                stateEntry: SCA.stateEntry (x),
                                wikiEntry: SCA.wikiEntry (x),
                              }))))
)

export const getFilteredSkills = createMaybeSelector (
  getSkillsCombinedSortOptions,
  getSkillsFilterText,
  getSkillsWithRequirements,
  uncurryN3 (sort_options =>
             filter_text =>
               fmap (filterAndSortRecordsBy (0)
                                            ([ pipe (SWRA.wikiEntry, SA.name) ])
                                            (sort_options)
                                            (filter_text)))
)

export const getSkillRating = createMaybeSelector (
  getCurrentCulture,
  maybe (OrderedMap.empty as OrderedMap<string, EntryRating>)
        (c => pipe_ (
          OrderedMap.empty as OrderedMap<string, EntryRating>,
          flip (foldr (insertF<EntryRating> (EntryRating.Common)))
               (CA.commonSkills (c)),
          flip (foldr (insertF<EntryRating> (EntryRating.Uncommon)))
               (CA.uncommonSkills (c))
        ))
)
