import { fromDefault, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { Cantrip } from "../Wiki/Cantrip";
import { IsActive } from "./viewTypeHelpers";

export interface CantripCombined extends IsActive {
  "@@name": "CantripCombined"
  wikiEntry: Record<Cantrip>
  isUnfamiliar: boolean
}

export const CantripCombined =
  fromDefault ("CantripCombined")
              <CantripCombined> ({
                wikiEntry: Cantrip .default,
                active: false,
                isUnfamiliar: false,
              })

export const CantripCombinedA_ = {
  name: pipe (CantripCombined.A.wikiEntry, Cantrip.A.name),
  property: pipe (CantripCombined.A.wikiEntry, Cantrip.A.property),
}
