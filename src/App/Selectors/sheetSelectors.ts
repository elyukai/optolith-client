import { ident } from "../../Data/Function"
import { fmap } from "../../Data/Functor"
import { foldr, groupByKey, imap, List } from "../../Data/List"
import { fromMaybe, listToMaybe } from "../../Data/Maybe"
import { max, min } from "../../Data/Num"
import { elems, map } from "../../Data/OrderedMap"
import { fst, isTuple, Pair, snd } from "../../Data/Tuple"
import { upd1, upd2 } from "../../Data/Tuple/Update"
import { fromIndexName } from "../Models/NumIdName"
import { SkillCombinedA_ } from "../Models/View/SkillCombined"
import { Skill } from "../Models/Wiki/Skill"
import { SourceLink } from "../Models/Wiki/sub/SourceLink"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { translate } from "../Utilities/I18n"
import { pipe, pipe_ } from "../Utilities/pipe"
import { sortStrings } from "../Utilities/sortBy"
import { getAllSkills } from "./skillsSelectors"
import { getLocaleAsProp, getWikiSkills } from "./stateSelectors"

export const getConditions = createMaybeSelector (
  getLocaleAsProp,
  l10n =>
    pipe_ (
      List (
        translate (l10n) ("animosity"),
        translate (l10n) ("encumbrance"),
        translate (l10n) ("intoxicated"),
        translate (l10n) ("stupor"),
        translate (l10n) ("rapture"),
        translate (l10n) ("fear"),
        translate (l10n) ("paralysis"),
        translate (l10n) ("pain"),
        translate (l10n) ("confusion")
      ),
      sortStrings (l10n),
      imap (fromIndexName)
    )
)

export const getStates = createMaybeSelector (
  getLocaleAsProp,
  l10n =>
    pipe_ (
      List (
        translate (l10n) ("immobilized"),
        translate (l10n) ("unconscious"),
        translate (l10n) ("blind"),
        translate (l10n) ("bloodlust"),
        translate (l10n) ("burning"),
        translate (l10n) ("cramped"),
        translate (l10n) ("bound"),
        translate (l10n) ("incapacitated"),
        translate (l10n) ("diseased"),
        translate (l10n) ("prone"),
        translate (l10n) ("misfortune"),
        translate (l10n) ("rage"),
        translate (l10n) ("mute"),
        translate (l10n) ("deaf"),
        translate (l10n) ("surprised"),
        translate (l10n) ("badsmell"),
        translate (l10n) ("invisible"),
        translate (l10n) ("poisoned"),
        translate (l10n) ("petrified")
      ),
      sortStrings (l10n),
      imap (fromIndexName)
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
