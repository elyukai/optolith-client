import { ProfessionSelectionIds, SkillsSelection } from '../../../types/wiki';
import { Maybe, Nothing } from '../../structures/Maybe';
import { fromDefault, makeGetters } from '../../structures/Record';

const SkillsSelectionCreator =
  fromDefault<SkillsSelection> ({
    id: ProfessionSelectionIds.SKILLS,
    value: 0,
    gr: Nothing,
  })

export const SkillsSelectionG = makeGetters (SkillsSelectionCreator)

export const createSkillsSelectionWithGroup =
  (gr: Maybe<number>) => (points: number) =>
    SkillsSelectionCreator ({ id: ProfessionSelectionIds.SKILLS, value: points, gr })
