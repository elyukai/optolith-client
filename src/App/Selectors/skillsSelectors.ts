import { flip } from "../../Data/Function";
import { fmap } from "../../Data/Functor";
import { foldr, map } from "../../Data/List";
import { fromMaybe, liftM3, maybe } from "../../Data/Maybe";
import { elems, insertF, lookup, OrderedMap } from "../../Data/OrderedMap";
import { uncurryN, uncurryN3, uncurryN4 } from "../../Data/Tuple/Curry";
import { AdvantageId } from "../Constants/Ids";
import { createPlainSkillDependent } from "../Models/ActiveEntries/SkillDependent";
import { HeroModel } from "../Models/Hero/HeroModel";
import { EntryRating } from "../Models/Hero/heroTypeHelpers";
import { SkillCombined } from "../Models/View/SkillCombined";
import { SkillWithRequirements } from "../Models/View/SkillWithRequirements";
import { Culture } from "../Models/Wiki/Culture";
import { Skill } from "../Models/Wiki/Skill";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy";
import { isSkillDecreasable, isSkillIncreasable } from "../Utilities/Increasable/skillUtils";
import { pipe, pipe_ } from "../Utilities/pipe";
import { getStartEl } from "./elSelectors";
import { getCurrentCulture } from "./rcpSelectors";
import { getSkillsCombinedSortOptions } from "./sortOptionsSelectors";
import { getCurrentHeroPresent, getSkills, getSkillsFilterText, getWiki, getWikiSkills } from "./stateSelectors";

const HA = HeroModel.A
const SA = Skill.A
const SCA = SkillCombined.A
const SWRA = SkillWithRequirements.A
const CA = Culture.A

export const getAllSkills = createMaybeSelector (
  getWikiSkills,
  getSkills,
  uncurryN (wiki_skills =>
              fmap (hero_skills => pipe_ (
                     wiki_skills,
                     elems,
                     map (wiki_entry =>
                            SkillCombined ({
                              stateEntry:
                                fromMaybe (createPlainSkillDependent (SA.id (wiki_entry)))
                                          (lookup (SA.id (wiki_entry))
                                                  (hero_skills)),
                              wikiEntry: wiki_entry,
                            }))
                   )))
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
                                            ([pipe (SWRA.wikiEntry, SA.name)])
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
