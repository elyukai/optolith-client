import * as R from 'ramda';
import * as AttributesActions from '../actions/AttributesActions';
import * as CombatTechniquesActions from '../actions/CombatTechniquesActions';
import * as LiturgicalChantActions from '../actions/LiturgicalChantActions';
import * as SkillActions from '../actions/SkillActions';
import * as SpellsActions from '../actions/SpellsActions';
import { ActionTypes } from '../constants/ActionTypes';
import * as Data from '../types/data';
import { createActivatableDependentSkill } from '../utils/createEntryUtils';
import { Just, Record } from '../utils/dataUtils';
import { addDependenciesReducer, removeDependenciesReducer } from '../utils/dependencyUtils';
import { adjustHeroListStateItemOr, updateHeroListStateItemOrRemove } from '../utils/heroStateUtils';
import { addPoint, removePoint } from '../utils/IncreasableUtils';
import { isActivatableDependentSkillUnused } from '../utils/unusedEntryUtils';

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
        adjustHeroListStateItemOr (
          createActivatableDependentSkill,
          value => Just (value.insert ('active') (true)),
          id,
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

      const activateLiturgicalChant = adjustHeroListStateItemOr (
        createActivatableDependentSkill,
        value => Just (value.insert ('active') (true)),
        id,
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
        updateHeroListStateItemOrRemove (
          isActivatableDependentSkillUnused,
          value => value.insert ('active') (false),
          id,
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

      const deactivateLiturgicalChant = updateHeroListStateItemOrRemove (
        isActivatableDependentSkillUnused,
        value => value.insert ('active') (false),
        id,
      );

      return deactivateLiturgicalChant (state);
    }

    case ActionTypes.DEACTIVATE_BLESSING: {
      const { id } = action.payload;

      return state.modify<'blessings'> (blessings => blessings.delete (id)) ('blessings');;
    }

    case ActionTypes.ADD_ATTRIBUTE_POINT: {
      const { id } = action.payload;

      return state.modify<'attributes'> (attributes => attributes.adjust (addPoint) (id))
                                        ('attributes');
    }

    case ActionTypes.ADD_TALENT_POINT: {
      const { id } = action.payload;

      return state.modify<'skills'> (skills => skills.adjust (addPoint) (id)) ('skills');
    }

    case ActionTypes.ADD_COMBATTECHNIQUE_POINT: {
      const { id } = action.payload;

      return state.modify<'combatTechniques'> (
        combatTechniques => combatTechniques.adjust (addPoint) (id)
      ) ('combatTechniques');
    }

    case ActionTypes.ADD_SPELL_POINT: {
      const { id } = action.payload;

      return state.modify<'spells'> (spells => spells.adjust (addPoint) (id)) ('spells');
    }

    case ActionTypes.ADD_LITURGY_POINT: {
      const { id } = action.payload;

      return state.modify<'liturgicalChants'> (
        liturgicalChants => liturgicalChants.adjust (addPoint) (id)
      ) ('liturgicalChants');
    }

    case ActionTypes.REMOVE_ATTRIBUTE_POINT: {
      const { id } = action.payload;

      return state.modify<'attributes'> (attributes => attributes.adjust (removePoint) (id))
                                        ('attributes');
    }

    case ActionTypes.REMOVE_TALENT_POINT: {
      const { id } = action.payload;

      return state.modify<'skills'> (skills => skills.adjust (removePoint) (id)) ('skills');
    }

    case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT: {
      const { id } = action.payload;

      return state.modify<'combatTechniques'> (
        combatTechniques => combatTechniques.adjust (removePoint) (id)
      ) ('combatTechniques');
    }

    case ActionTypes.REMOVE_SPELL_POINT: {
      const { id } = action.payload;

      return state.modify<'spells'> (spells => spells.adjust (removePoint) (id)) ('spells');
    }

    case ActionTypes.REMOVE_LITURGY_POINT: {
      const { id } = action.payload;

      return state.modify<'liturgicalChants'> (
        liturgicalChants => liturgicalChants.adjust (removePoint) (id)
      ) ('liturgicalChants');
    }

    default:
      return state;
  }
}
