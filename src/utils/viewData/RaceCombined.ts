import { List } from "../structures/List";
import { fromDefault, Record } from "../structures/Record";
import { Race } from "../wikiData/Race";
import { RaceVariant } from "../wikiData/RaceVariant";

export interface RaceCombined {
  wikiEntry: Record<Race>
  mappedVariants: List<Record<RaceVariant>>
}

export const RaceCombined =
  fromDefault<RaceCombined> ({
    wikiEntry: Race .default,
    mappedVariants: List.empty,
  })
