import { ActivatableDependent, ActivatableSkillDependent, AttributeDependent, Dependent, ExtendedSkillDependent, SkillDependent } from '../../types/data';
import { fromJust, isJust, Just, Maybe } from '../structures/Maybe.new';
import { member, notMember, Record } from '../structures/Record.new';

export const isMaybeActivatableDependent =
  (entry: Maybe<Dependent>): entry is Just<Record<ActivatableDependent>> =>
    isJust (entry)
    && member ('active') (fromJust (entry))
    && notMember ('value') (fromJust (entry))

export const isMaybeActivatableSkillDependent =
  (entry: Maybe<Dependent>): entry is Just<Record<ActivatableSkillDependent>> =>
    isJust (entry)
    && member ('value') (fromJust (entry))
    && member ('active') (fromJust (entry))

export const isMaybeSkillDependentSkill =
  (entry: Maybe<Dependent>): entry is Just<Record<SkillDependent>> =>
    isJust (entry)
    && member ('value') (fromJust (entry))
    && notMember ('mod') (fromJust (entry))
    && notMember ('active') (fromJust (entry))

export const isMaybeAttributeDependentSkill =
  (entry: Maybe<Dependent>): entry is Just<Record<AttributeDependent>> =>
    isJust (entry)
    && member ('value') (fromJust (entry))
    && member ('mod') (fromJust (entry))
    && notMember ('active') (fromJust (entry))

export const isDependentSkill =
  (entry: Dependent): entry is Record<SkillDependent> =>
    member ('value') (entry)
    && notMember ('mod') (entry)
    && notMember ('active') (entry)

export const isDependentSkillExtended =
  (entry: Dependent): entry is ExtendedSkillDependent =>
    member ('value') (entry)
    && notMember ('mod') (entry)
