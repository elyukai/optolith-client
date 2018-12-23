import { Rules } from '../../types/data';
import { OrderedSet } from '../structures/OrderedSet';
import { fromDefault, makeGetters, makeLenses_ } from '../structures/Record';

/**
 * Create a new `Rules` object.
 */
export const RulesCreator =
  fromDefault<Rules> ({
    higherParadeValues: 0,
    attributeValueLimit: false,
    enableAllRuleBooks: false,
    enabledRuleBooks: OrderedSet.empty,
    enableLanguageSpecializations: false,
  })

export const RulesG = makeGetters (RulesCreator)
export const RulesL = makeLenses_ (RulesG) (RulesCreator)
