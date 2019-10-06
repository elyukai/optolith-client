import { fromDefault, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { Blessing } from "../Wiki/Blessing";
import { IsActive } from "./viewTypeHelpers";

export interface BlessingCombined extends IsActive {
  "@@name": "BlessingCombined"
  wikiEntry: Record<Blessing>
}

export const BlessingCombined =
  fromDefault ("BlessingCombined")
              <BlessingCombined> ({
                wikiEntry: Blessing .default,
                active: false,
              })

export const BlessingCombinedA_ = {
  name: pipe (BlessingCombined.A.wikiEntry, Blessing.A.name),
  tradition: pipe (BlessingCombined.A.wikiEntry, Blessing.A.tradition),
}
