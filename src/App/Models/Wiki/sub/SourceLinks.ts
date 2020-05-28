import { List } from "../../../../Data/List"
import { Pair } from "../../../../Data/Tuple"

export type SourceLinks = {
  id: string
  pages: List<number | Pair<number, number>>
}
