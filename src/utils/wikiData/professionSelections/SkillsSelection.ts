import { Maybe, Nothing } from '../../structures/Maybe';
import { fromDefault } from '../../structures/Record';
import { ProfessionSelectionIds } from '../wikiTypeHelpers';

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
