import { fromJust, isJust, Just } from "../../Data/Maybe"
import { keys, OrderedMap } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import * as ActionTypes from "../Constants/ActionTypes"
import { IdPrefixes } from "../Constants/IdPrefixes"
import { Pet } from "../Models/Hero/Pet"
import { getPets } from "../Selectors/stateSelectors"
import { getNewId, prefixId } from "../Utilities/IDUtils"
import { pipe } from "../Utilities/pipe"
import { ReduxAction } from "./Actions"

const getNewIdFromCurrentPets: (x: Just<OrderedMap<string, Record<Pet>>>) => string =
  pipe (fromJust, keys, getNewId, prefixId (IdPrefixes.ANIMAL))

export interface AddPetAction {
  type: ActionTypes.ADD_PET
  payload: {
    newId: string
  }
}

export const addPet: ReduxAction =
  (dispatch, getState) => {
    const mpets = getPets (getState ())

    if (isJust (mpets)) {
      const newId = getNewIdFromCurrentPets (mpets)

      return dispatch<AddPetAction> ({
        type: ActionTypes.ADD_PET,
        payload: {
          newId,
        },
      })
    }

    return undefined
  }

export interface CreatePetAction {
  type: ActionTypes.CREATE_PET
}

export const createPet = (): CreatePetAction => ({
  type: ActionTypes.CREATE_PET,
})

export interface ClosePetEditorAction {
  type: ActionTypes.CLOSE_PET_EDITOR
}

export const closePetEditor = (): ClosePetEditorAction => ({
  type: ActionTypes.CLOSE_PET_EDITOR,
})

export interface SavePetAction {
  type: ActionTypes.SAVE_PET
}

export const savePet = (): SavePetAction => ({
  type: ActionTypes.SAVE_PET,
})

export interface EditPetAction {
  type: ActionTypes.EDIT_PET
  payload: {
    id: string
  }
}

export const editPet = (id: string): EditPetAction => ({
  type: ActionTypes.EDIT_PET,
  payload: {
    id,
  },
})

export interface RemovePetAction {
  type: ActionTypes.REMOVE_PET
  payload: {
    id: string
  }
}

export const removePet = (id: string): RemovePetAction => ({
  type: ActionTypes.REMOVE_PET,
  payload: {
    id,
  },
})

export interface SetPetsSortOrderAction {
  type: ActionTypes.SET_PETS_SORT_ORDER
  payload: {
    sortOrder: string
  }
}

export const setPetsSortOrder = (sortOrder: string): SetPetsSortOrderAction => ({
  type: ActionTypes.SET_PETS_SORT_ORDER,
  payload: {
    sortOrder,
  },
})

export interface SetPetAvatarAction {
  type: ActionTypes.SET_PET_AVATAR
  payload: {
    path: string
  }
}

export const setPetAvatar = (path: string): SetPetAvatarAction => ({
  type: ActionTypes.SET_PET_AVATAR,
  payload: {
    path,
  },
})

export interface DeletePetAvatarAction {
  type: ActionTypes.DELETE_PET_AVATAR
}

export const deletePetAvatar = (): DeletePetAvatarAction => ({
  type: ActionTypes.DELETE_PET_AVATAR,
})

export interface SetPetNameAction {
  type: ActionTypes.SET_PET_NAME
  payload: {
    name: string
  }
}

export const setPetName = (name: string): SetPetNameAction => ({
  type: ActionTypes.SET_PET_NAME,
  payload: {
    name,
  },
})

export interface SetPetSizeAction {
  type: ActionTypes.SET_PET_SIZE
  payload: {
    size: string
  }
}

export const setPetSize = (size: string): SetPetSizeAction => ({
  type: ActionTypes.SET_PET_SIZE,
  payload: {
    size,
  },
})

export interface SetPetTypeAction {
  type: ActionTypes.SET_PET_TYPE
  payload: {
    type: string
  }
}

export const setPetType = (type: string): SetPetTypeAction => ({
  type: ActionTypes.SET_PET_TYPE,
  payload: {
    type,
  },
})

export interface SetPetSpentApAction {
  type: ActionTypes.SET_PET_SPENT_AP
  payload: {
    spentAp: string
  }
}

export const setPetSpentAp = (spentAp: string): SetPetSpentApAction => ({
  type: ActionTypes.SET_PET_SPENT_AP,
  payload: {
    spentAp,
  },
})

export interface SetPetTotalApAction {
  type: ActionTypes.SET_PET_TOTAL_AP
  payload: {
    totalAp: string
  }
}

export const setPetTotalAp = (totalAp: string): SetPetTotalApAction => ({
  type: ActionTypes.SET_PET_TOTAL_AP,
  payload: {
    totalAp,
  },
})

export interface SetPetCourageAction {
  type: ActionTypes.SET_PET_COURAGE
  payload: {
    courage: string
  }
}

export const setPetCourage = (courage: string): SetPetCourageAction => ({
  type: ActionTypes.SET_PET_COURAGE,
  payload: {
    courage,
  },
})

export interface SetPetSagacityAction {
  type: ActionTypes.SET_PET_SAGACITY
  payload: {
    sagacity: string
  }
}

export const setPetSagacity = (sagacity: string): SetPetSagacityAction => ({
  type: ActionTypes.SET_PET_SAGACITY,
  payload: {
    sagacity,
  },
})

export interface SetPetIntuitionAction {
  type: ActionTypes.SET_PET_INTUITION
  payload: {
    intuition: string
  }
}

export const setPetIntuition = (intuition: string): SetPetIntuitionAction => ({
  type: ActionTypes.SET_PET_INTUITION,
  payload: {
    intuition,
  },
})

export interface SetPetCharismaAction {
  type: ActionTypes.SET_PET_CHARISMA
  payload: {
    charisma: string
  }
}

export const setPetCharisma = (charisma: string): SetPetCharismaAction => ({
  type: ActionTypes.SET_PET_CHARISMA,
  payload: {
    charisma,
  },
})

export interface SetPetDexterityAction {
  type: ActionTypes.SET_PET_DEXTERITY
  payload: {
    dexterity: string
  }
}

export const setPetDexterity = (dexterity: string): SetPetDexterityAction => ({
  type: ActionTypes.SET_PET_DEXTERITY,
  payload: {
    dexterity,
  },
})

export interface SetPetAgilityAction {
  type: ActionTypes.SET_PET_AGILITY
  payload: {
    agility: string
  }
}

export const setPetAgility = (agility: string): SetPetAgilityAction => ({
  type: ActionTypes.SET_PET_AGILITY,
  payload: {
    agility,
  },
})

export interface SetPetConstitutionAction {
  type: ActionTypes.SET_PET_CONSTITUTION
  payload: {
    constitution: string
  }
}

export const setPetConstitution = (constitution: string): SetPetConstitutionAction => ({
  type: ActionTypes.SET_PET_CONSTITUTION,
  payload: {
    constitution,
  },
})

export interface SetPetStrengthAction {
  type: ActionTypes.SET_PET_STRENGTH
  payload: {
    strength: string
  }
}

export const setPetStrength = (strength: string): SetPetStrengthAction => ({
  type: ActionTypes.SET_PET_STRENGTH,
  payload: {
    strength,
  },
})

export interface SetPetLpAction {
  type: ActionTypes.SET_PET_LP
  payload: {
    lp: string
  }
}

export const setPetLp = (lp: string): SetPetLpAction => ({
  type: ActionTypes.SET_PET_LP,
  payload: {
    lp,
  },
})

export interface SetPetAeAction {
  type: ActionTypes.SET_PET_AE
  payload: {
    ae: string
  }
}

export const setPetAe = (ae: string): SetPetAeAction => ({
  type: ActionTypes.SET_PET_AE,
  payload: {
    ae,
  },
})

export interface SetPetSpiAction {
  type: ActionTypes.SET_PET_SPI
  payload: {
    spi: string
  }
}

export const setPetSpi = (spi: string): SetPetSpiAction => ({
  type: ActionTypes.SET_PET_SPI,
  payload: {
    spi,
  },
})

export interface SetPetTouAction {
  type: ActionTypes.SET_PET_TOU
  payload: {
    tou: string
  }
}

export const setPetTou = (tou: string): SetPetTouAction => ({
  type: ActionTypes.SET_PET_TOU,
  payload: {
    tou,
  },
})

export interface SetPetProAction {
  type: ActionTypes.SET_PET_PRO
  payload: {
    pro: string
  }
}

export const setPetPro = (pro: string): SetPetProAction => ({
  type: ActionTypes.SET_PET_PRO,
  payload: {
    pro,
  },
})

export interface SetPetIniAction {
  type: ActionTypes.SET_PET_INI
  payload: {
    ini: string
  }
}

export const setPetIni = (ini: string): SetPetIniAction => ({
  type: ActionTypes.SET_PET_INI,
  payload: {
    ini,
  },
})

export interface SetPetMovAction {
  type: ActionTypes.SET_PET_MOV
  payload: {
    mov: string
  }
}

export const setPetMov = (mov: string): SetPetMovAction => ({
  type: ActionTypes.SET_PET_MOV,
  payload: {
    mov,
  },
})

export interface SetPetAttackAction {
  type: ActionTypes.SET_PET_ATTACK
  payload: {
    attack: string
  }
}

export const setPetAttack = (attack: string): SetPetAttackAction => ({
  type: ActionTypes.SET_PET_ATTACK,
  payload: {
    attack,
  },
})

export interface SetPetAtAction {
  type: ActionTypes.SET_PET_AT
  payload: {
    at: string
  }
}

export const setPetAt = (at: string): SetPetAtAction => ({
  type: ActionTypes.SET_PET_AT,
  payload: {
    at,
  },
})

export interface SetPetPaAction {
  type: ActionTypes.SET_PET_PA
  payload: {
    pa: string
  }
}

export const setPetPa = (pa: string): SetPetPaAction => ({
  type: ActionTypes.SET_PET_PA,
  payload: {
    pa,
  },
})

export interface SetPetDpAction {
  type: ActionTypes.SET_PET_DP
  payload: {
    dp: string
  }
}

export const setPetDp = (dp: string): SetPetDpAction => ({
  type: ActionTypes.SET_PET_DP,
  payload: {
    dp,
  },
})

export interface SetPetReachAction {
  type: ActionTypes.SET_PET_REACH
  payload: {
    reach: string
  }
}

export const setPetReach = (reach: string): SetPetReachAction => ({
  type: ActionTypes.SET_PET_REACH,
  payload: {
    reach,
  },
})

export interface SetPetActionsAction {
  type: ActionTypes.SET_PET_ACTIONS
  payload: {
    actions: string
  }
}

export const setPetActions = (actions: string): SetPetActionsAction => ({
  type: ActionTypes.SET_PET_ACTIONS,
  payload: {
    actions,
  },
})

export interface SetPetSkillsAction {
  type: ActionTypes.SET_PET_SKILLS
  payload: {
    skills: string
  }
}

export const setPetSkills = (skills: string): SetPetSkillsAction => ({
  type: ActionTypes.SET_PET_SKILLS,
  payload: {
    skills,
  },
})

export interface SetPetAbilitiesAction {
  type: ActionTypes.SET_PET_ABILITIES
  payload: {
    abilities: string
  }
}

export const setPetAbilities = (abilities: string): SetPetAbilitiesAction => ({
  type: ActionTypes.SET_PET_ABILITIES,
  payload: {
    abilities,
  },
})

export interface SetPetNotesAction {
  type: ActionTypes.SET_PET_NOTES
  payload: {
    notes: string
  }
}

export const setPetNotes = (notes: string): SetPetNotesAction => ({
  type: ActionTypes.SET_PET_NOTES,
  payload: {
    notes,
  },
})
