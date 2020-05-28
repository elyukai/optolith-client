import { Pair } from "../../../Data/Tuple"

export interface EditPrimaryAttributeDamageThreshold {
  primary?: string | Pair<string, string>
  threshold: string | Pair<string, string>
}
