import { fromDefault, Record } from "../../../Data/Record";
import { Cantrip } from "../Wiki/Cantrip";
import { IsActive } from "./viewTypeHelpers";

export interface CantripCombined extends IsActive {
  wikiEntry: Record<Cantrip>
}

export const CantripCombined =
  fromDefault<CantripCombined> ({
    wikiEntry: Cantrip .default,
    active: false,
  })
