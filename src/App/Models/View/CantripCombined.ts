import { fromDefault, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
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

export const CantripCombinedA_ = {
  name: pipe (CantripCombined.A.wikiEntry, Cantrip.A.name),
  property: pipe (CantripCombined.A.wikiEntry, Cantrip.A.property),
}
