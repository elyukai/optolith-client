import { IncreaseSkill } from '../../../types/wiki';
import { fromDefault, makeGetters } from '../../structures/Record';
import { RequiredFunction } from './typeHelpers';

const IncreaseSkillCreator =
  fromDefault<IncreaseSkill> ({
    id: '',
    value: 0,
  })

export const IncreaseSkillG = makeGetters (IncreaseSkillCreator)

export const createIncreaseSkill: RequiredFunction<IncreaseSkill> = IncreaseSkillCreator
