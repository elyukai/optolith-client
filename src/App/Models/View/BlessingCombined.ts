import { fromDefault, Record } from "../../../Data/Record";
import { Blessing } from "../Wiki/Blessing";
import { IsActive } from "./viewTypeHelpers";

export interface BlessingCombined extends IsActive {
  wikiEntry: Record<Blessing>
}

export const BlessingCombined =
  fromDefault<BlessingCombined> ({
    wikiEntry: Blessing .default,
    active: false,
  })
