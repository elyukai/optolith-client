import { ProfessionSelectionIds } from '../../../types/wiki';
import { Maybe, Nothing } from '../../structures/Maybe';
import { fromDefault, makeGetters } from '../../structures/Record';

export interface SkillsSelection {
  id: ProfessionSelectionIds.SKILLS;
  /**
   * If specified, only choose from skills of the specified group.
   */
  gr: Maybe<number>;
  /**
   * The AP value the user can spend.
   */
  value: number;
}

export const SkillsSelection =
  fromDefault<SkillsSelection> ({
    id: ProfessionSelectionIds.SKILLS,
    value: 0,
    gr: Nothing,
  })

export const SkillsSelectionG = makeGetters (SkillsSelection)
