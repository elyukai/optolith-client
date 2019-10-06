import { OrderedSet } from "../../../Data/OrderedSet";
import { fromDefault, makeLenses } from "../../../Data/Record";

export interface Rules {
  "@@name": "Rules"
  higherParadeValues: number
  attributeValueLimit: boolean
  enableAllRuleBooks: boolean
  enabledRuleBooks: OrderedSet<string>
  enableLanguageSpecializations: boolean
}

/**
 * Create a new `Rules` object.
 */
export const Rules =
  fromDefault ("Rules")
              <Rules> ({
                higherParadeValues: 0,
                attributeValueLimit: false,
                enableAllRuleBooks: false,
                enabledRuleBooks: OrderedSet.empty,
                enableLanguageSpecializations: false,
              })

export const RulesL = makeLenses (Rules)
