import { Maybe, Nothing } from "../../../../Data/Maybe";
import { fromDefault, Record } from "../../../../Data/Record";
import { AnyProfessionSelection, ProfessionSelectionIds } from "../wikiTypeHelpers";

export interface SkillsSelection {
  "@@name": "SkillsSelection"
  id: ProfessionSelectionIds

  /**
   * If specified, only choose from skills of the specified group.
   */
  gr: Maybe<number>

  /**
   * The AP value the user can spend.
   */
  value: number
}

export const SkillsSelection =
  fromDefault ("SkillsSelection")
              <SkillsSelection> ({
                id: ProfessionSelectionIds.SKILLS,
                value: 0,
                gr: Nothing,
              })

export const isSkillsSelection =
  (obj: AnyProfessionSelection): obj is Record<SkillsSelection> =>
    SkillsSelection.AL.id (obj) === ProfessionSelectionIds.SKILLS
