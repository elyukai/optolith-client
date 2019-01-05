import { List } from "../../../Data/List";
import { fromDefault, Record } from "../../../Data/Record";
import { Race } from "../Wiki/Race";
import { RaceVariant } from "../Wiki/RaceVariant";

export interface RaceCombined {
  wikiEntry: Record<Race>
  mappedVariants: List<Record<RaceVariant>>
}

export const RaceCombined =
  fromDefault<RaceCombined> ({
    wikiEntry: Race .default,
    mappedVariants: List.empty,
  })
