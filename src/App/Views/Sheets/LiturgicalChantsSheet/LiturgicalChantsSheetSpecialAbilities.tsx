import * as React from "react";
import { ActiveViewObject } from "../../../Models/Hero/heroTypeHelpers";
import { SpecialAbility } from "../../../Models/Wiki/wikiTypeHelpers";
import { compressList } from "../../../Utilities/Activatable/activatableNameUtils";
import { translate, UIMessagesObject } from "../../../Utilities/I18n";
import { TextBox } from "../../Universal/TextBox";

export interface LiturgicalChantsSheetSpecialAbilitiesProps {
  blessedSpecialAbilities: Maybe<List<Record<ActiveViewObject<SpecialAbility>>>>
  locale: UIMessagesObject
}

export function LiturgicalChantsSheetSpecialAbilities (
  props: LiturgicalChantsSheetSpecialAbilitiesProps
) {
  const { locale, blessedSpecialAbilities: maybeBlessedSpecialAbilities } = props

  return (
    <TextBox
      className="activatable-list"
      label={translate (locale, "charactersheet.chants.blessedspecialabilities.title")}
      value={compressList (
        Maybe.fromMaybe<List<Record<ActiveViewObject<SpecialAbility>>>>
          (List.empty<Record<ActiveViewObject<SpecialAbility>>> ())
          (maybeBlessedSpecialAbilities) as List<Record<ActiveViewObject>>,
        locale
      )}
      />
  )
}
