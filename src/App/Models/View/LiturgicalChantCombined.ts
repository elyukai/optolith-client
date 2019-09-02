import { elem, OrderedSet } from "../../../Data/OrderedSet";
import { fromDefault, Record } from "../../../Data/Record";
import { ActivatableSkillDependent } from "../ActiveEntries/ActivatableSkillDependent";
import { Blessing } from "../Wiki/Blessing";
import { LiturgicalChant } from "../Wiki/LiturgicalChant";

export interface LiturgicalChantCombined {
  "@@name": "LiturgicalChantCombined"
  wikiEntry: Record<LiturgicalChant>
  stateEntry: Record<ActivatableSkillDependent>
}

export const LiturgicalChantCombined =
  fromDefault ("LiturgicalChantCombined")
              <LiturgicalChantCombined> ({
                wikiEntry: LiturgicalChant .default,
                stateEntry: ActivatableSkillDependent .default,
              })

export const isLiturgicalChantCombined =
  (x: Record<LiturgicalChantCombined> | Record<Blessing>): x is Record<LiturgicalChantCombined> =>
    elem<keyof LiturgicalChantCombined> ("wikiEntry")
                                        (x .keys as OrderedSet<keyof LiturgicalChantCombined>)
