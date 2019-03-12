import * as R from 'ramda';
import * as AttributesActions from '../Actions/AttributesActions';
import * as CombatTechniquesActions from '../Actions/CombatTechniquesActions';
import * as LiturgicalChantActions from '../Actions/LiturgicalChantActions';
import * as SkillActions from '../Actions/SkillActions';
import * as SpellsActions from '../Actions/SpellsActions';
import { ActionTypes } from '../Constants/ActionTypes';
import * as Data from '../Models/Hero/heroTypeHelpers';
import { isActivatableDependentSkillUnused, isAttributeDependentUnused, isDependentSkillUnused } from '../utils/activeEntries/unusedEntryUtils';
import { createActivatableDependentSkill, createAttributeDependent, createDependentSkillWithValue0, createDependentSkillWithValue6 } from '../utils/createEntryUtils';
import { Just, Record } from '../utils/dataUtils';
import { addDependenciesReducer, removeDependenciesReducer } from '../utils/dependencies/dependencyUtils';
import { adjustEntryDef, modifyHeroListStateItemOrRemove, updateHeroListStateItemOr, updateSliceEntry } from '../Utils/heroStateUtils';
import { addPoint, removePoint } from '../Utils/Increasable/increasableUtils';

type Action =
  AttributesActions.AddAttributePointAction |
  AttributesActions.RemoveAttributePointAction |
  SkillActions.AddSkillPointAction |
  SkillActions.RemoveSkillPointAction |
  CombatTechniquesActions.AddCombatTechniquePointAction |
  CombatTechniquesActions.RemoveCombatTechniquePointAction |
  SpellsActions.ActivateSpellAction |
  SpellsActions.AddSpellPointAction |
  SpellsActions.DeactivateSpellAction |
  SpellsActions.RemoveSpellPointAction |
  SpellsActions.ActivateCantripAction |
  SpellsActions.DeactivateCantripAction |
  LiturgicalChantActions.ActivateLiturgicalChantAction |
  LiturgicalChantActions.AddLiturgicalChantPointAction |
  LiturgicalChantActions.DeactivateLiturgyAction |
  LiturgicalChantActions.RemoveLiturgicalChantPointAction |
  LiturgicalChantActions.ActivateBlessingAction |
  LiturgicalChantActions.DeactivateBlessingAction;

export function increasableReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.ACTIVATE_SPELL: {
      const { id, wikiEntry } = action.payload;

      const activateSpell = R.pipe (
        updateHeroListStateItemOr (
          createActivatableDependentSkill,
          value => Just (value.insert ('active') (true)),
          id
        ),
        addDependenciesReducer (wikiEntry.get ('prerequisites'), id)
      );

      return activateSpell (state);
    }

    case ActionTypes.ACTIVATE_CANTRIP: {
      const { id } = action.payload;

      return state.modify<'cantrips'> (cantrips => cantrips.insert (id)) ('cantrips');
    }

    case ActionTypes.ACTIVATE_LITURGY: {
      const { id } = action.payload;

      const activateLiturgicalChant = updateHeroListStateItemOr (
        createActivatableDependentSkill,
        value => Just (value.insert ('active') (true)),
        id
      );

      return activateLiturgicalChant (state);
    }

    case ActionTypes.ACTIVATE_BLESSING: {
      const { id } = action.payload;

      return state.modify<'blessings'> (blessings => blessings.insert (id)) ('blessings');
    }

    case ActionTypes.DEACTIVATE_SPELL: {
      const { id, wikiEntry } = action.payload;

      const deactivateSpell = R.pipe (
        modifyHeroListStateItemOrRemove (
          isActivatableDependentSkillUnused,
          value => value.insert ('active') (false),
          id
        ),
        removeDependenciesReducer (wikiEntry.get ('prerequisites'), id)
      );

      return deactivateSpell (state);
    }

    case ActionTypes.DEACTIVATE_CANTRIP: {
      const { id } = action.payload;

      return state.modify<'cantrips'> (cantrips => cantrips.delete (id)) ('cantrips');
    }

    case ActionTypes.DEACTIVATE_LITURGY: {
      const { id } = action.payload;

      const deactivateLiturgicalChant = modifyHeroListStateItemOrRemove (
        isActivatableDependentSkillUnused,
        value => value.insert ('active') (false),
        id
      );

      return deactivateLiturgicalChant (state);
    }

    case ActionTypes.DEACTIVATE_BLESSING: {
      const { id } = action.payload;

      return state.modify<'blessings'> (blessings => blessings.delete (id)) ('blessings');;
    }

    case ActionTypes.ADD_ATTRIBUTE_POINT: {
      const { id } = action.payload;

      return state.modify<'attributes'>
        (adjustEntryDef (createAttributeDependent) (addPoint) (id))
        ('attributes');
    }

    case ActionTypes.ADD_TALENT_POINT: {
      const { id } = action.payload;

      return state.modify<'skills'>
        (adjustEntryDef (createDependentSkillWithValue0) (addPoint) (id))
        ('skills');
    }

    case ActionTypes.ADD_COMBATTECHNIQUE_POINT: {
      const { id } = action.payload;

      return state.modify<'combatTechniques'>
        (adjustEntryDef (createDependentSkillWithValue6) (addPoint) (id))
        ('combatTechniques');
    }

    case ActionTypes.ADD_SPELL_POINT: {
      const { id } = action.payload;

      return state.modify<'spells'>
        (adjustEntryDef (createActivatableDependentSkill) (addPoint) (id))
        ('spells');
    }

    case ActionTypes.ADD_LITURGY_POINT: {
      const { id } = action.payload;

      return state.modify<'liturgicalChants'>
        (adjustEntryDef (createActivatableDependentSkill) (addPoint) (id))
        ('liturgicalChants');
    }

    case ActionTypes.REMOVE_ATTRIBUTE_POINT: {
      const { id } = action.payload;

      return state.modify<'attributes'>
        (updateSliceEntry<Record<Data.AttributeDependent>> (removePoint)
                                                           (isAttributeDependentUnused)
                                                           (id))
        ('attributes');
    }

    case ActionTypes.REMOVE_TALENT_POINT: {
      const { id } = action.payload;

      return state.modify<'skills'>
        (updateSliceEntry<Record<Data.SkillDependent>> (removePoint) (isDependentSkillUnused) (id))
        ('skills');
    }

    case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT: {
      const { id } = action.payload;

      return state.modify<'combatTechniques'>
        (updateSliceEntry<Record<Data.SkillDependent>> (removePoint) (isDependentSkillUnused) (id))
        ('combatTechniques');
    }

    case ActionTypes.REMOVE_SPELL_POINT: {
      const { id } = action.payload;

      return state.modify<'spells'>
        (updateSliceEntry<Record<Data.ActivatableSkillDependent>>
          (removePoint)
          (isActivatableDependentSkillUnused)
          (id))
        ('spells');
    }

    case ActionTypes.REMOVE_LITURGY_POINT: {
      const { id } = action.payload;

      return state.modify<'liturgicalChants'>
        (updateSliceEntry<Record<Data.ActivatableSkillDependent>>
          (removePoint)
          (isActivatableDependentSkillUnused)
          (id))
        ('liturgicalChants');
    }

    default:
      return state;
  }
}
