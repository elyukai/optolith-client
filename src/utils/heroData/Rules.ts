import { OrderedSet } from '../structures/OrderedSet';
import { fromDefault, makeLenses_ } from '../structures/Record';

export interface Rules {
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
  fromDefault<Rules> ({
    higherParadeValues: 0,
    attributeValueLimit: false,
    enableAllRuleBooks: false,
    enabledRuleBooks: OrderedSet.empty,
    enableLanguageSpecializations: false,
  })

export const RulesL = makeLenses_ (Rules)
