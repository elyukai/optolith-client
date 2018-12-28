import { fromDefault, makeGetters } from '../../structures/Record';

export interface IncreaseSkill {
  id: string
  value: number
}

export const IncreaseSkill =
  fromDefault<IncreaseSkill> ({
    id: '',
    value: 0,
  })

export const IncreaseSkillG = makeGetters (IncreaseSkill)
