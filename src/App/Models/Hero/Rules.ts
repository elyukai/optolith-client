import { StrSet } from "../../../Data/StrSet"

export interface Rules {
  higherParadeValues: number
  attributeValueLimit: boolean
  enableAllRuleBooks: boolean
  enabledRuleBooks: StrSet
  enableLanguageSpecializations: boolean
}
