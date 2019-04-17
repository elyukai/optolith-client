import * as React from "react";
import { ActiveViewObject } from "../../../Models/Hero/heroTypeHelpers";
import { SpecialAbility } from "../../../Models/Wiki/wikiTypeHelpers";
import { compressList } from "../../../Utilities/Activatable/activatableNameUtils";
import { translate, UIMessagesObject } from "../../../Utilities/I18n";
import { TextBox } from "../../Universal/TextBox";

export interface SpellsSheetSpecialAbilitiesProps {
  locale: UIMessagesObject
  magicalSpecialAbilities: Maybe<List<Record<ActiveViewObject<SpecialAbility>>>>
}

export function SpellsSheetSpecialAbilities (props: SpellsSheetSpecialAbilitiesProps) {
  const { locale, magicalSpecialAbilities: maybeMagicalSpecialAbilities } = props

  return (
    <TextBox
      className="activatable-list"
      label={translate (locale, "charactersheet.spells.magicalspecialabilities.title")}
      value={compressList (
        Maybe.fromMaybe<List<Record<ActiveViewObject<SpecialAbility>>>>
          (List.empty<Record<ActiveViewObject<SpecialAbility>>> ())
          (maybeMagicalSpecialAbilities) as List<Record<ActiveViewObject>>,
        locale
      )}
      />
  )
}
