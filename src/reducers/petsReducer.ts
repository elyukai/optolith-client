import * as PetActions from '../actions/PetActions';
import * as Data from '../App/Models/Hero/heroTypeHelpers';
import { convertToEdit, convertToSave, getNewPetInstance } from '../App/Utils/PetUtils';
import { ActionTypes } from '../constants/ActionTypes';
import { Maybe, OrderedMap, Record } from '../utils/dataUtils';

type Action =
  PetActions.AddPetAction
  | PetActions.CreatePetAction
  | PetActions.ClosePetEditorAction
  | PetActions.SavePetAction
  | PetActions.EditPetAction
  | PetActions.RemovePetAction
  | PetActions.SetPetAvatarAction
  | PetActions.SetPetNameAction
  | PetActions.SetPetSizeAction
  | PetActions.SetPetTypeAction
  | PetActions.SetPetSpentApAction
  | PetActions.SetPetTotalApAction
  | PetActions.SetPetCourageAction
  | PetActions.SetPetSagacityAction
  | PetActions.SetPetIntuitionAction
  | PetActions.SetPetCharismaAction
  | PetActions.SetPetDexterityAction
  | PetActions.SetPetAgilityAction
  | PetActions.SetPetConstitutionAction
  | PetActions.SetPetStrengthAction
  | PetActions.SetPetLpAction
  | PetActions.SetPetAeAction
  | PetActions.SetPetSpiAction
  | PetActions.SetPetTouAction
  | PetActions.SetPetProAction
  | PetActions.SetPetIniAction
  | PetActions.SetPetMovAction
  | PetActions.SetPetAttackAction
  | PetActions.SetPetAtAction
  | PetActions.SetPetPaAction
  | PetActions.SetPetDpAction
  | PetActions.SetPetReachAction
  | PetActions.SetPetActionsAction
  | PetActions.SetPetSkillsAction
  | PetActions.SetPetAbilitiesAction
  | PetActions.SetPetNotesAction;

function petGeneralReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.SET_PET_AVATAR:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'avatar'> ('avatar') (action.payload.path))
        ('petInEditor');

    case ActionTypes.SET_PET_NAME:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'name'> ('name') (action.payload.name))
        ('petInEditor');

    case ActionTypes.SET_PET_SIZE:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'size'> ('size') (action.payload.size))
        ('petInEditor');

    case ActionTypes.SET_PET_TYPE:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'type'> ('type') (action.payload.type))
        ('petInEditor');

    case ActionTypes.SET_PET_SPENT_AP:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'spentAp'> ('spentAp') (action.payload.spentAp))
        ('petInEditor');

    case ActionTypes.SET_PET_TOTAL_AP:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'totalAp'> ('totalAp') (action.payload.totalAp))
        ('petInEditor');

    case ActionTypes.SET_PET_COURAGE:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'cou'> ('cou') (action.payload.courage))
        ('petInEditor');

    case ActionTypes.SET_PET_SAGACITY:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'sgc'> ('sgc') (action.payload.sagacity))
        ('petInEditor');

    case ActionTypes.SET_PET_INTUITION:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'int'> ('int') (action.payload.intuition))
        ('petInEditor');

    case ActionTypes.SET_PET_CHARISMA:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'cha'> ('cha') (action.payload.charisma))
        ('petInEditor');

    case ActionTypes.SET_PET_DEXTERITY:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'dex'> ('dex') (action.payload.dexterity))
        ('petInEditor');

    case ActionTypes.SET_PET_AGILITY:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'agi'> ('agi') (action.payload.agility))
        ('petInEditor');

    case ActionTypes.SET_PET_CONSTITUTION:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'con'> ('con') (action.payload.constitution))
        ('petInEditor');

    case ActionTypes.SET_PET_STRENGTH:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'str'> ('str') (action.payload.strength))
        ('petInEditor');

    default:
      return state;
  }
}

function petAbilitiesAndCombatReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.SET_PET_LP:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'lp'> ('lp') (action.payload.lp))
        ('petInEditor');

    case ActionTypes.SET_PET_AE:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'ae'> ('ae') (action.payload.ae))
        ('petInEditor');

    case ActionTypes.SET_PET_SPI:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'spi'> ('spi') (action.payload.spi))
        ('petInEditor');

    case ActionTypes.SET_PET_TOU:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'tou'> ('tou') (action.payload.tou))
        ('petInEditor');

    case ActionTypes.SET_PET_PRO:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'pro'> ('pro') (action.payload.pro))
        ('petInEditor');

    case ActionTypes.SET_PET_INI:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'ini'> ('ini') (action.payload.ini))
        ('petInEditor');

    case ActionTypes.SET_PET_MOV:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'mov'> ('mov') (action.payload.mov))
        ('petInEditor');

    case ActionTypes.SET_PET_ATTACK:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'attack'> ('attack') (action.payload.attack))
        ('petInEditor');

    case ActionTypes.SET_PET_AT:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'at'> ('at') (action.payload.at))
        ('petInEditor');

    case ActionTypes.SET_PET_PA:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'pa'> ('pa') (action.payload.pa))
        ('petInEditor');

    case ActionTypes.SET_PET_DP:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'dp'> ('dp') (action.payload.dp))
        ('petInEditor');

    case ActionTypes.SET_PET_REACH:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'reach'> ('reach') (action.payload.reach))
        ('petInEditor');

    case ActionTypes.SET_PET_ACTIONS:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'actions'> ('actions') (action.payload.actions))
        ('petInEditor');

    case ActionTypes.SET_PET_SKILLS:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'talents'> ('talents') (action.payload.skills))
        ('petInEditor');

    case ActionTypes.SET_PET_ABILITIES:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'skills'> ('skills') (action.payload.abilities))
        ('petInEditor');

    case ActionTypes.SET_PET_NOTES:
      return state .modify<'petInEditor'>
        (Record.insert<Data.PetEditorInstance, 'notes'> ('notes') (action.payload.notes))
        ('petInEditor');

    default:
      return state;
  }
}

export function petsReducer (
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.ADD_PET: {
      const { newId } = action.payload;

      return Maybe.fromMaybe (state) (
        state .lookup ('petInEditor')
          .fmap (
            petInEditor => state
              .modify<'pets'>
                (items => items .insert (newId) (convertToSave (newId) (petInEditor)))
                ('pets')
              .delete ('petInEditor') as Data.Hero
          )
      );
    }

    case ActionTypes.CREATE_PET:
      return state
        .insert ('petInEditor') (getNewPetInstance ())
        .insert ('isInPetCreation') (true);

    case ActionTypes.SAVE_PET:
      return Maybe.fromMaybe (state) (
        state .lookup ('petInEditor')
          .bind (Maybe.ensure (petInEditor => petInEditor .member ('id')))
          .fmap (
            petInEditor => state
              .modify<'pets'>
                (
                  pets => {
                    const id =
                      (petInEditor as Record<Data.PetEditorInstance & { id: string }>)
                        .get ('id');

                    return pets.insert
                      (id)
                      (
                        convertToSave (id) (petInEditor)
                        // TODO: does not handle locked templated anymore
                      );
                  }
                )
                ('pets')
              .delete ('petInEditor') as Data.Hero
          )
      );

    case ActionTypes.EDIT_PET:
      return state
        .insert ('petInEditor') (convertToEdit (action.payload.pet))
        .insert ('isInPetCreation') (false);

    case ActionTypes.CLOSE_PET_EDITOR:
      return state
        .delete ('petInEditor')
        .insert ('isInPetCreation') (false) as Data.Hero;

    case ActionTypes.REMOVE_PET:
      return state .modify<'pets'> (OrderedMap.delete (action.payload.id)) ('pets');

    case ActionTypes.SET_PET_AVATAR:
    case ActionTypes.SET_PET_NAME:
    case ActionTypes.SET_PET_SIZE:
    case ActionTypes.SET_PET_TYPE:
    case ActionTypes.SET_PET_SPENT_AP:
    case ActionTypes.SET_PET_TOTAL_AP:
    case ActionTypes.SET_PET_COURAGE:
    case ActionTypes.SET_PET_SAGACITY:
    case ActionTypes.SET_PET_INTUITION:
    case ActionTypes.SET_PET_CHARISMA:
    case ActionTypes.SET_PET_DEXTERITY:
    case ActionTypes.SET_PET_AGILITY:
    case ActionTypes.SET_PET_CONSTITUTION:
    case ActionTypes.SET_PET_STRENGTH:
      return petGeneralReducer (state, action);

    case ActionTypes.SET_PET_LP:
    case ActionTypes.SET_PET_AE:
    case ActionTypes.SET_PET_SPI:
    case ActionTypes.SET_PET_TOU:
    case ActionTypes.SET_PET_PRO:
    case ActionTypes.SET_PET_INI:
    case ActionTypes.SET_PET_MOV:
    case ActionTypes.SET_PET_ATTACK:
    case ActionTypes.SET_PET_AT:
    case ActionTypes.SET_PET_PA:
    case ActionTypes.SET_PET_DP:
    case ActionTypes.SET_PET_REACH:
    case ActionTypes.SET_PET_ACTIONS:
    case ActionTypes.SET_PET_SKILLS:
    case ActionTypes.SET_PET_ABILITIES:
    case ActionTypes.SET_PET_NOTES:
      return petAbilitiesAndCombatReducer (state, action);

    default:
      return state;
  }
}
