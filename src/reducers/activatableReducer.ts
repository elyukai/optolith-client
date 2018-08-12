import * as DisAdvActions from '../actions/DisAdvActions';
import * as SpecialAbilitiesActions from '../actions/SpecialAbilitiesActions';
import { ActionTypes } from '../constants/ActionTypes';
import * as Data from '../types/data';
import { activate, deactivate, setTier } from '../utils/activatableActivationUtils';
import { Maybe, Record } from '../utils/dataUtils';
import * as ExtendedStyleUtils from '../utils/ExtendedStyleUtils';
import { getHeroStateListItem } from '../utils/heroStateUtils';
import * as IncreasableUtils from '../utils/IncreasableUtils';

type Action =
  DisAdvActions.ActivateDisAdvAction |
  DisAdvActions.DeactivateDisAdvAction |
  DisAdvActions.SetDisAdvTierAction |
  SpecialAbilitiesActions.ActivateSpecialAbilityAction |
  SpecialAbilitiesActions.DeactivateSpecialAbilityAction |
  SpecialAbilitiesActions.SetSpecialAbilityTierAction;

export function activatableReducer(
  state: Record<Data.HeroDependent>,
  action: Action,
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.ACTIVATE_DISADV: {
      const { id, wikiEntry } = action.payload;

      return activate(action.payload)(
        state,
        wikiEntry,
        state.get('advantages').lookup(id)
          .alt(state.get('disadvantages').lookup(id))
      );
    }

    case ActionTypes.ACTIVATE_SPECIALABILITY: {
      const { id, wikiEntry } = action.payload;

      return activate(action.payload)(
        ExtendedStyleUtils.addAllStyleRelatedDependencies(state, wikiEntry),
        wikiEntry,
        state.get('specialAbilities').lookup(id)
      );
    }
    case ActionTypes.DEACTIVATE_DISADV: {
      const { id, index, wikiEntry } = action.payload;

      return Maybe.fromMaybe(
        state,
        state.get('advantages').lookup(id)
          .alt(state.get('disadvantages').lookup(id))
          .fmap(instance => deactivate(index)(
            state,
            wikiEntry,
            instance
          ))
      );
    }

    case ActionTypes.DEACTIVATE_SPECIALABILITY: {
      const { id, index, wikiEntry } = action.payload;

      return Maybe.fromMaybe(
        state,
        state.get('specialAbilities').lookup(id)
          .fmap(instance => deactivate(index)(
            ExtendedStyleUtils.removeAllStyleRelatedDependencies(state, wikiEntry),
            wikiEntry,
            instance
          ))
          .fmap(updatedState => {
            if (id === 'SA_109') {
              return Maybe.fromMaybe(
                updatedState,
                updatedState.get('combatTechniques').lookup('CT_17')
                  .fmap(entry => IncreasableUtils.set(entry, 6))
                  .fmap(
                    entry => updatedState.modify(
                      slice => slice.insert('CT_17', entry),
                      'combatTechniques'
                    )
                  )
              );
            }

            return updatedState;
          })
      );
    }

    case ActionTypes.SET_DISADV_TIER:
    case ActionTypes.SET_SPECIALABILITY_TIER: {
      const { id, index, tier, wikiEntry } = action.payload;

      return Maybe.fromMaybe(
        state,
        (getHeroStateListItem(id, state) as Maybe<Record<Data.ActivatableDependent>>)
          .fmap(instance => setTier(index, tier)(
            state,
            wikiEntry,
            instance
          ))
      );
    }

    default:
      return state;
  }
}
