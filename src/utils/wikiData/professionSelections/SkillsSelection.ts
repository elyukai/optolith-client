import { Maybe, Nothing } from '../../structures/Maybe';
import { fromDefault, Record } from '../../structures/Record';
import { ProfessionSelection, ProfessionSelectionIds } from '../wikiTypeHelpers';

export interface SkillsSelection {
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
  fromDefault<SkillsSelection> ({
    id: ProfessionSelectionIds.SKILLS,
    value: 0,
    gr: Nothing,
  })

export const isSkillsSelection =
  (obj: ProfessionSelection): obj is Record<SkillsSelection> =>
    SkillsSelection.A.id (obj) === ProfessionSelectionIds.SKILLS
