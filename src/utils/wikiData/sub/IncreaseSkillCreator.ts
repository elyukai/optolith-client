import { IncreaseSkill } from '../../../types/wiki';
import { fromDefault, makeGetters } from '../../structures/Record';

const IncreaseSkillCreator =
  fromDefault<IncreaseSkill> ({
    id: '',
    value: 0,
  })

export const IncreaseSkillG = makeGetters (IncreaseSkillCreator)

export const createIncreaseSkill = IncreaseSkillCreator
