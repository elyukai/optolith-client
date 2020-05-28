import { List } from "../../../Data/List"
import { Race } from "../Wiki/Race"
import { RaceVariant } from "../Wiki/RaceVariant"

export interface RaceCombined {
  wikiEntry: Race
  mappedVariants: List<RaceVariant>
}
