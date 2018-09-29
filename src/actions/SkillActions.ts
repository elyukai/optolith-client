import { ActionTypes } from '../constants/ActionTypes';
import { getAvailableAdventurePoints } from '../selectors/adventurePointsSelectors';
import { getIsInCharacterCreation } from '../selectors/phaseSelectors';
import { getSkills, getWikiSkills } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions';
import { UIMessagesObject } from '../types/ui';
import { Maybe } from '../utils/dataUtils';
import { translate } from '../utils/I18n';
import { getAreSufficientAPAvailableForIncrease } from '../utils/IncreasableUtils';
import { addAlert } from './AlertActions';

export interface AddSkillPointAction {
  type: ActionTypes.ADD_TALENT_POINT;
  payload: {
    id: string;
  };
}

export const addSkillPoint = (locale: UIMessagesObject) => (id: string): AsyncAction =>
  (dispatch, getState) => {
    const state = getState ();
    const maybeHeroSkills = getSkills (state);
    const wikiSkills = getWikiSkills (state);

    const areSufficientAPAvailableForIncrease = wikiSkills.lookup (id).bind (
      wikiSkill => getAvailableAdventurePoints (state, { locale }).fmap (
        availableAP => getAreSufficientAPAvailableForIncrease (
          wikiSkill,
          maybeHeroSkills.bind (skills => skills.lookup (id)),
          availableAP,
          getIsInCharacterCreation (state)
        )
      )
    );

    if (Maybe.elem (true) (areSufficientAPAvailableForIncrease)) {
      dispatch<AddSkillPointAction> ({
        type: ActionTypes.ADD_TALENT_POINT,
        payload: {
          id,
        },
      });
    }
    else {
      dispatch (addAlert ({
        title: translate (locale, 'notenoughap.title'),
        message: translate (locale, 'notenoughap.content'),
      }));
    }
  };

export interface RemoveSkillPointAction {
  type: ActionTypes.REMOVE_TALENT_POINT;
  payload: {
    id: string;
  };
}

export const removeSkillPoint = (id: string): RemoveSkillPointAction => ({
  type: ActionTypes.REMOVE_TALENT_POINT,
  payload: {
    id,
  },
});

export interface SetSkillsSortOrderAction {
  type: ActionTypes.SET_TALENTS_SORT_ORDER;
  payload: {
    sortOrder: string;
  };
}

export const setSkillsSortOrder = (sortOrder: string): SetSkillsSortOrderAction => ({
  type: ActionTypes.SET_TALENTS_SORT_ORDER,
  payload: {
    sortOrder,
  },
});

export interface SwitchSkillRatingVisibilityAction {
  type: ActionTypes.SWITCH_TALENT_RATING_VISIBILITY;
}

export const switchSkillRatingVisibility = (): SwitchSkillRatingVisibilityAction => ({
  type: ActionTypes.SWITCH_TALENT_RATING_VISIBILITY,
});

export interface SetSkillsFilterTextAction {
  type: ActionTypes.SET_SKILLS_FILTER_TEXT;
  payload: {
    filterText: string;
  };
}

export const setSkillsFilterText = (filterText: string): SetSkillsFilterTextAction => ({
  type: ActionTypes.SET_SKILLS_FILTER_TEXT,
  payload: {
    filterText,
  },
});
