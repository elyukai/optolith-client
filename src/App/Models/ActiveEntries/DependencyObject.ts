import { List } from "../../../Data/List"

export interface DependencyObject {
  origin?: string
  active?: boolean
  sid?: string | number | List<number>
  sid2?: string | number
  tier?: number
}
