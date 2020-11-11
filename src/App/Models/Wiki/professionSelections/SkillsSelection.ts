import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromDefault } from "../../../../Data/Record"
import { ProfessionSelectionIds } from "../wikiTypeHelpers"

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

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SkillsSelection =
  fromDefault ("SkillsSelection")
              <SkillsSelection> ({
                id: ProfessionSelectionIds.SKILLS,
                value: 0,
                gr: Nothing,
              })
