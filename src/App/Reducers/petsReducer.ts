import { ident } from "../../Data/Function";
import { fmap } from "../../Data/Functor";
import { over, set } from "../../Data/Lens";
import { bind, ensure, fromJust, Just, maybe, Nothing } from "../../Data/Maybe";
import { insert, lookup, sdelete } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import * as PetActions from "../Actions/PetActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { EditPet, EditPetL, EditPetSafe } from "../Models/Hero/EditPet";
import { HeroModel, HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel";
import { Pet } from "../Models/Hero/Pet";
import { ensureEditPetId, fromEditPet, toEditPet } from "../Utilities/PetUtils";
import { pipe } from "../Utilities/pipe";

type Action = PetActions.AddPetAction
            | PetActions.CreatePetAction
            | PetActions.ClosePetEditorAction
            | PetActions.SavePetAction
            | PetActions.EditPetAction
            | PetActions.RemovePetAction
            | PetActions.SetPetAvatarAction
            | PetActions.DeletePetAvatarAction
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
            | PetActions.SetPetNotesAction

const modifyEditPet =
  (f: ident<Record<EditPet>>) =>
    over (HeroModelL.petInEditor)
         (fmap (f))

const petGeneralReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.SET_PET_AVATAR:
        return modifyEditPet (set (EditPetL.avatar)
                                  (Just (action.payload.path)))

      case ActionTypes.DELETE_PET_AVATAR:
        return modifyEditPet (set (EditPetL.avatar)
                                  (Nothing))

      case ActionTypes.SET_PET_NAME:
        return modifyEditPet (set (EditPetL.name)
                                  (action.payload.name))

      case ActionTypes.SET_PET_SIZE:
        return modifyEditPet (set (EditPetL.size)
                                  (action.payload.size))

      case ActionTypes.SET_PET_TYPE:
        return modifyEditPet (set (EditPetL.type)
                                  (action.payload.type))

      case ActionTypes.SET_PET_SPENT_AP:
        return modifyEditPet (set (EditPetL.spentAp)
                                  (action.payload.spentAp))

      case ActionTypes.SET_PET_TOTAL_AP:
        return modifyEditPet (set (EditPetL.totalAp)
                                  (action.payload.totalAp))

      case ActionTypes.SET_PET_COURAGE:
        return modifyEditPet (set (EditPetL.cou)
                                  (action.payload.courage))

      case ActionTypes.SET_PET_SAGACITY:
        return modifyEditPet (set (EditPetL.sgc)
                                  (action.payload.sagacity))

      case ActionTypes.SET_PET_INTUITION:
        return modifyEditPet (set (EditPetL.int)
                                  (action.payload.intuition))

      case ActionTypes.SET_PET_CHARISMA:
        return modifyEditPet (set (EditPetL.cha)
                                  (action.payload.charisma))

      case ActionTypes.SET_PET_DEXTERITY:
        return modifyEditPet (set (EditPetL.dex)
                                  (action.payload.dexterity))

      case ActionTypes.SET_PET_AGILITY:
        return modifyEditPet (set (EditPetL.agi)
                                  (action.payload.agility))

      case ActionTypes.SET_PET_CONSTITUTION:
        return modifyEditPet (set (EditPetL.con)
                                  (action.payload.constitution))

      case ActionTypes.SET_PET_STRENGTH:
        return modifyEditPet (set (EditPetL.str)
                                  (action.payload.strength))

      default:
        return ident
    }
  }

const petAbilitiesAndCombatReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.SET_PET_LP:
        return modifyEditPet (set (EditPetL.lp)
                                  (action.payload.lp))

      case ActionTypes.SET_PET_AE:
        return modifyEditPet (set (EditPetL.ae)
                                  (action.payload.ae))

      case ActionTypes.SET_PET_SPI:
        return modifyEditPet (set (EditPetL.spi)
                                  (action.payload.spi))

      case ActionTypes.SET_PET_TOU:
        return modifyEditPet (set (EditPetL.tou)
                                  (action.payload.tou))

      case ActionTypes.SET_PET_PRO:
        return modifyEditPet (set (EditPetL.pro)
                                  (action.payload.pro))

      case ActionTypes.SET_PET_INI:
        return modifyEditPet (set (EditPetL.ini)
                                  (action.payload.ini))

      case ActionTypes.SET_PET_MOV:
        return modifyEditPet (set (EditPetL.mov)
                                  (action.payload.mov))

      case ActionTypes.SET_PET_ATTACK:
        return modifyEditPet (set (EditPetL.attack)
                                  (action.payload.attack))

      case ActionTypes.SET_PET_AT:
        return modifyEditPet (set (EditPetL.at)
                                  (action.payload.at))

      case ActionTypes.SET_PET_PA:
        return modifyEditPet (set (EditPetL.pa)
                                  (action.payload.pa))

      case ActionTypes.SET_PET_DP:
        return modifyEditPet (set (EditPetL.dp)
                                  (action.payload.dp))

      case ActionTypes.SET_PET_REACH:
        return modifyEditPet (set (EditPetL.reach)
                                  (action.payload.reach))

      case ActionTypes.SET_PET_ACTIONS:
        return modifyEditPet (set (EditPetL.actions)
                                  (action.payload.actions))

      case ActionTypes.SET_PET_SKILLS:
        return modifyEditPet (set (EditPetL.talents)
                                  (action.payload.skills))

      case ActionTypes.SET_PET_ABILITIES:
        return modifyEditPet (set (EditPetL.skills)
                                  (action.payload.abilities))

      case ActionTypes.SET_PET_NOTES:
        return modifyEditPet (set (EditPetL.notes)
                                  (action.payload.notes))

      default:
        return ident
    }
  }

export const petsReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.ADD_PET: {
        const { newId } = action.payload

        return hero =>
          maybe (hero)
                ((edit_pet: Record<EditPet>) =>
                  pipe (
                         over (HeroModelL.pets)
                              (insert (newId)
                                      (fromEditPet (set (EditPetL.id)
                                                   (Just (newId))
                                                   (edit_pet) as Record<EditPetSafe>))),
                         set (HeroModelL.petInEditor) (Nothing)
                       )
                       (hero))
                (HeroModel.AL.petInEditor (hero))
      }

      case ActionTypes.CREATE_PET: {
        return pipe (
          set (HeroModelL.petInEditor) (Just (EditPet.default)),
          set (HeroModelL.isInPetCreation) (true)
        )
      }

      case ActionTypes.SAVE_PET: {
        return hero =>
          maybe (hero)
                ((edit_pet: Record<EditPetSafe>) =>
                  pipe (
                         over (HeroModelL.pets)
                              (insert (fromJust (EditPet.AL.id (edit_pet) as Just<string>))
                                      (fromEditPet (edit_pet))),
                         set (HeroModelL.petInEditor) (Nothing)
                       )
                       (hero))
                (bind (HeroModel.AL.petInEditor (hero))
                      (ensure (ensureEditPetId)))
      }

      case ActionTypes.EDIT_PET: {
        return hero =>
          maybe (hero)
                ((x: Record<Pet>) =>
                  pipe (
                         set (HeroModelL.petInEditor)
                             (Just (toEditPet (x))),
                         set (HeroModelL.isInPetCreation)
                             (false)
                       )
                       (hero))
                (lookup (action.payload.id)
                        (HeroModel.AL.pets (hero)))
      }

      case ActionTypes.CLOSE_PET_EDITOR: {
        return pipe (
          set (HeroModelL.petInEditor)
              (Nothing),
          set (HeroModelL.isInPetCreation)
              (false)
        )
      }

      case ActionTypes.REMOVE_PET: {
        return over (HeroModelL.pets)
                    (sdelete (action.payload.id))
      }

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
        return petGeneralReducer (action)

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
        return petAbilitiesAndCombatReducer (action)

      default:
        return ident
    }
  }
