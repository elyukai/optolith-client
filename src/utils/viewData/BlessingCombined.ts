import { fromDefault, Record } from "../structures/Record";
import { Blessing } from "../wikiData/Blessing";
import { IsActive } from "./viewTypeHelpers";

export interface BlessingCombined extends IsActive {
  wikiEntry: Record<Blessing>
}

export const BlessingCombined =
  fromDefault<BlessingCombined> ({
    wikiEntry: Blessing .default,
    active: false,
  })
