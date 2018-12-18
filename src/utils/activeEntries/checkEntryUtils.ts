import { ActivatableDependent, ActivatableSkillDependent, AttributeDependent, Dependent, ExtendedSkillDependent, SkillDependent } from '../../types/data';
import { fromJust, isJust, Just, Maybe } from '../structures/Maybe';
import { member, notMember, Record } from '../structures/Record';

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

export const isMaybeSkillDependent =
  (entry: Maybe<Dependent>): entry is Just<Record<SkillDependent>> =>
    isJust (entry)
    && member ('value') (fromJust (entry))
    && notMember ('mod') (fromJust (entry))
    && notMember ('active') (fromJust (entry))

export const isMaybeAttributeDependent =
  (entry: Maybe<Dependent>): entry is Just<Record<AttributeDependent>> =>
    isJust (entry)
    && member ('value') (fromJust (entry))
    && member ('mod') (fromJust (entry))
    && notMember ('active') (fromJust (entry))

export const isActivatableDependent =
  (entry: Dependent): entry is Record<ActivatableDependent> =>
    member ('active') (entry)
    && notMember ('value') (entry)

export const isActivatableSkillDependent =
  (entry: Dependent): entry is Record<ActivatableSkillDependent> =>
    member ('value') (entry)
    && member ('active') (entry)

export const isAttributeDependent =
  (entry: Dependent): entry is Record<AttributeDependent> =>
    member ('value') (entry)
    && member ('mod') (entry)
    && notMember ('active') (entry)

export const isSkillDependent =
  (entry: Dependent): entry is Record<SkillDependent> =>
    member ('value') (entry)
    && notMember ('mod') (entry)
    && notMember ('active') (entry)

export const isExtendedSkillDependent =
  (entry: Dependent): entry is ExtendedSkillDependent =>
    member ('value') (entry)
    && notMember ('mod') (entry)
