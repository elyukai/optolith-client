import { Categories } from '../../constants/Categories';
import { Skill } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';
import { RequiredExceptCategoryFunction } from './sub/typeHelpers';

const SkillCreator =
  fromDefault<Skill> ({
    id: '',
    name: '',
    category: Categories.TALENTS,
    check: List.empty,
    encumbrance: '',
    gr: 0,
    ic: 0,
    applications: Nothing,
    applicationsInput: Nothing,
    tools: Nothing,
    quality: '',
    failed: '',
    critical: '',
    botch: '',
    src: '',
  })

export const SkillG = makeGetters (SkillCreator)

export const createSkill: RequiredExceptCategoryFunction<Skill> =
  SkillCreator
