import * as React from "react";
import { ActiveViewObject } from "../../../Models/Hero/heroTypeHelpers";
import { SpecialAbility } from "../../../Models/Wiki/wikiTypeHelpers";
import { compressList } from "../../../Utilities/Activatable/activatableNameUtils";
import { translate, UIMessagesObject } from "../../../Utilities/I18n";
import { TextBox } from "../../Universal/TextBox";

export interface CombatSheetSpecialAbilitiesProps {
  combatSpecialAbilities: Maybe<List<Record<ActiveViewObject<SpecialAbility>>>>
  locale: UIMessagesObject
}

export function CombatSheetSpecialAbilities (props: CombatSheetSpecialAbilitiesProps) {
  const { combatSpecialAbilities: maybeCombatSpecialAbilities, locale } = props

  return (
    <TextBox
      className="activatable-list"
      label={translate (locale, "charactersheet.combat.combatspecialabilities.title")}
      value={compressList (
        Maybe.fromMaybe<List<Record<ActiveViewObject<SpecialAbility>>>>
          (List.empty<Record<ActiveViewObject<SpecialAbility>>> ())
          (maybeCombatSpecialAbilities) as List<Record<ActiveViewObject>>,
        locale
      )}
      />
  )
}
