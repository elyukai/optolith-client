import { ProfessionSelectionIds } from "../../../../Models/Wiki/wikiTypeHelpers";
import { AnyRawProfessionSelection } from "../rawTypeHelpers";

export interface RawSkillsSelection {
  id: ProfessionSelectionIds

  /**
   * If specified, only choose from skills of the specified group.
   */
  gr?: number

  /**
   * The AP value the user can spend.
   */
  value: number
}

export const isRawSkillsSelection =
  (obj: AnyRawProfessionSelection): obj is RawSkillsSelection =>
    obj.id === ProfessionSelectionIds.SKILLS
    // @ts-ignore
    && (typeof obj.gr === "number" || obj.gr === undefined)
    // @ts-ignore
    && typeof obj.value === "number"
