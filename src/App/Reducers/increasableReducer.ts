import { ident } from "../../Data/Function";
import { over, set } from "../../Data/Lens";
import { insert, sdelete } from "../../Data/OrderedSet";
import * as AttributesActions from "../Actions/AttributesActions";
import * as CombatTechniquesActions from "../Actions/CombatTechniquesActions";
import * as LiturgicalChantActions from "../Actions/LiturgicalChantActions";
import * as SkillActions from "../Actions/SkillActions";
import * as SpellsActions from "../Actions/SpellsActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { ActivatableSkillDependentL, isActivatableSkillDependentUnused } from "../Models/ActiveEntries/ActivatableSkillDependent";
import { isAttributeDependentUnused } from "../Models/ActiveEntries/AttributeDependent";
import { isCombatTechniqueSkillDependentUnused, isSkillDependentUnused } from "../Models/ActiveEntries/SkillDependent";
import { HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel";
import { Spell } from "../Models/Wiki/Spell";
import { addDependencies, removeDependencies } from "../Utilities/Dependencies/dependencyUtils";
import { adjustEntryDef, adjustRemoveEntryDef } from "../Utilities/heroStateUtils";
import { addPoint, removePoint } from "../Utilities/Increasable/increasableUtils";
import { pipe } from "../Utilities/pipe";

type Action = AttributesActions.AddAttributePointAction
            | AttributesActions.RemoveAttributePointAction
            | SkillActions.AddSkillPointAction
            | SkillActions.RemoveSkillPointAction
            | CombatTechniquesActions.AddCombatTechniquePointAction
            | CombatTechniquesActions.RemoveCombatTechniquePointAction
            | SpellsActions.ActivateSpellAction
            | SpellsActions.AddSpellPointAction
            | SpellsActions.DeactivateSpellAction
            | SpellsActions.RemoveSpellPointAction
            | SpellsActions.ActivateCantripAction
            | SpellsActions.DeactivateCantripAction
            | LiturgicalChantActions.ActivateLiturgicalChantAction
            | LiturgicalChantActions.AddLiturgicalChantPointAction
            | LiturgicalChantActions.DeactivateLiturgyAction
            | LiturgicalChantActions.RemoveLiturgicalChantPointAction
            | LiturgicalChantActions.ActivateBlessingAction
            | LiturgicalChantActions.DeactivateBlessingAction

export const increasableReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.ACTIVATE_SPELL: {
        return pipe (
          adjustEntryDef (set (ActivatableSkillDependentL.active) (true))
                         (action.payload.id),
          addDependencies (action.payload.id)
                          (Spell.AL.prerequisites (action.payload.wikiEntry))
        )
      }

      case ActionTypes.ACTIVATE_CANTRIP: {
        return over (HeroModelL.cantrips) (insert (action.payload.id))
      }

      case ActionTypes.ACTIVATE_LITURGY: {
        return adjustEntryDef (set (ActivatableSkillDependentL.active) (true))
                              (action.payload.id)
      }

      case ActionTypes.ACTIVATE_BLESSING: {
        return over (HeroModelL.blessings) (insert (action.payload.id))
      }

      case ActionTypes.DEACTIVATE_SPELL: {
        return pipe (
          adjustRemoveEntryDef (isActivatableSkillDependentUnused)
                               (set (ActivatableSkillDependentL.active) (false))
                               (action.payload.id),
          removeDependencies (action.payload.id)
                             (Spell.AL.prerequisites (action.payload.wikiEntry))
        )
      }

      case ActionTypes.DEACTIVATE_CANTRIP: {
        return over (HeroModelL.cantrips) (sdelete (action.payload.id))
      }

      case ActionTypes.DEACTIVATE_LITURGY: {
        return adjustRemoveEntryDef (isActivatableSkillDependentUnused)
                                    (set (ActivatableSkillDependentL.active) (false))
                                    (action.payload.id)
      }

      case ActionTypes.DEACTIVATE_BLESSING: {
        return over (HeroModelL.blessings) (sdelete (action.payload.id))
      }

      case ActionTypes.ADD_ATTRIBUTE_POINT:
      case ActionTypes.ADD_TALENT_POINT:
      case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
      case ActionTypes.ADD_SPELL_POINT:
      case ActionTypes.ADD_LITURGY_POINT: {
        return adjustEntryDef (addPoint) (action.payload.id)
      }

      case ActionTypes.REMOVE_ATTRIBUTE_POINT: {
        return adjustRemoveEntryDef (isAttributeDependentUnused)
                                    (removePoint)
                                    (action.payload.id)
      }

      case ActionTypes.REMOVE_TALENT_POINT: {
        return adjustRemoveEntryDef (isSkillDependentUnused)
                                    (removePoint)
                                    (action.payload.id)
      }

      case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT: {
        return adjustRemoveEntryDef (isCombatTechniqueSkillDependentUnused)
                                    (removePoint)
                                    (action.payload.id)
      }

      case ActionTypes.REMOVE_SPELL_POINT:
      case ActionTypes.REMOVE_LITURGY_POINT: {
        return adjustRemoveEntryDef (isActivatableSkillDependentUnused)
                                    (removePoint)
                                    (action.payload.id)
      }

      default:
        return ident
    }
  }
