import { not } from "../../Data/Bool";
import { cnst } from "../../Data/Function";
import { fmap } from "../../Data/Functor";
import { any, fnull, isList } from "../../Data/List";
import { bindF, ensure, fromJust, isJust, maybe } from "../../Data/Maybe";
import { elems, lookup } from "../../Data/OrderedMap";
import { uncurryN } from "../../Data/Pair";
import { Record } from "../../Data/Record";
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent";
import { Pact } from "../Models/Hero/Pact";
import { isPactRequirement } from "../Models/Wiki/prerequisites/PactRequirement";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { AllRequirements } from "../Models/Wiki/wikiTypeHelpers";
import { isPactFromStateValid } from "../Utilities/Activatable/pactUtils";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { pipe } from "../Utilities/pipe";
import { getPact, getSpecialAbilities, getWikiSpecialAbilities } from "./stateSelectors";

export const getIsPactValid = createMaybeSelector (
  getPact,
  maybe (false) (isPactFromStateValid)
)

export const getValidPact = createMaybeSelector (
  getIsPactValid,
  getPact,
  uncurryN (isValid => bindF<Record<Pact>, Record<Pact>> (ensure (cnst (isValid))))
)

export const isPactEditable = createMaybeSelector (
  getWikiSpecialAbilities,
  getSpecialAbilities,
  uncurryN (wiki_special_abilities =>
             fmap (pipe (
               elems,
               any (e => {
                 const curr_active = ActivatableDependent.A.active (e)

                 if (fnull (curr_active)) {
                   return false
                 }

                 const curr_id = ActivatableDependent.A.id (e)

                 const mwiki_entry = lookup (curr_id) (wiki_special_abilities)

                 if (isJust (mwiki_entry)) {
                   const wiki_entry = fromJust (mwiki_entry)
                   const prerequisites = SpecialAbility.A.prerequisites (wiki_entry)

                   if (isList (prerequisites)) {
                     return any ((req: AllRequirements) => req !== "RCP" && isPactRequirement (req))
                                (prerequisites)
                   }

                   const level1 = lookup (1) (prerequisites)

                   if (isJust (level1)) {
                     return any ((req: AllRequirements) => req !== "RCP" && isPactRequirement (req))
                                (fromJust (level1))
                   }
                 }

                 return false
               }),
               not
             )))
)
