import { ident } from "../../Data/Function"
import { fmap } from "../../Data/Functor"
import { filter, foldr, groupByKey } from "../../Data/List"
import { fromMaybe, listToMaybe } from "../../Data/Maybe"
import { max, min } from "../../Data/Num"
import { elems, map } from "../../Data/OrderedMap"
import { fst, isTuple, Pair, snd } from "../../Data/Tuple"
import { upd1, upd2 } from "../../Data/Tuple/Update"
import { ConditionId } from "../Constants/Ids.gen"
import { SkillCombinedA_ } from "../Models/View/SkillCombined"
import { Condition } from "../Models/Wiki/Condition"
import { Skill } from "../Models/Wiki/Skill"
import { State } from "../Models/Wiki/State"
import { SourceLink } from "../Models/Wiki/sub/SourceLink"
import { StaticData } from "../Models/Wiki/WikiModel"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { pipe, pipe_ } from "../Utilities/pipe"
import { filterByAvailability } from "../Utilities/RulesUtils"
import { sortRecordsByName } from "../Utilities/sortBy"
import { getRuleBooksEnabled } from "./rulesSelectors"
import { getAllSkills } from "./skillsSelectors"
import { getWiki, getWikiSkills } from "./stateSelectors"

const CA = Condition.A

export const getConditions = createMaybeSelector (
  getWiki,
  getRuleBooksEnabled,
  (staticData, availability) =>
    pipe_ (
      staticData,
      StaticData.A.conditions,
      elems,
      filter (x => CA.id (x) !== ConditionId.sikaryanVerlust
                   && CA.id (x) !== ConditionId.daemonischeAuszehrung),
      filterByAvailability (CA.src) (availability),
      sortRecordsByName (staticData),
    )
)

export const getStates = createMaybeSelector (
  getWiki,
  getRuleBooksEnabled,
  (staticData, availability) =>
    pipe_ (
      staticData,
      StaticData.A.states,
      elems,
      filterByAvailability (State.A.src) (availability),
      sortRecordsByName (staticData),
    )
)

export const getSkillsByGroup = createMaybeSelector (
  getAllSkills,
  fmap (groupByKey (SkillCombinedA_.gr))
)

export const getSkillPages = createMaybeSelector (
  getWikiSkills,
  pipe (
    elems,
    groupByKey (Skill.A.gr),
    map (foldr (pipe (
                 Skill.A.src,
                 listToMaybe,
                 fmap (sl => {
                   const pages = SourceLink.A.page (sl)

                   if (isTuple (pages)) {
                     const lower = min (fst (pages)) (snd (pages))
                     const higher = max (fst (pages)) (snd (pages))

                     return (acc: Pair<number, number>) =>
                       pipe_ (
                         acc,
                         fst (acc) > lower ? upd1 (lower) : ident,
                         snd (acc) < higher ? upd2 (higher) : ident
                       )
                   }

                   return (acc: Pair<number, number>) =>
                     pipe_ (
                       acc,
                       fst (acc) > pages ? upd1 (pages) : ident,
                       snd (acc) < pages ? upd2 (pages) : ident
                     )
                 }),
                 fromMaybe (ident as ident<Pair<number, number>>)
               ))
               (Pair (1000, 0)))
  )
)
