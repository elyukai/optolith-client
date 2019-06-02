import * as React from "react";
import { List } from "../../../../Data/List";
import { fromMaybe, Maybe } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { ActiveActivatable } from "../../../Models/View/ActiveActivatable";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility";
import { compressList } from "../../../Utilities/Activatable/activatableNameUtils";
import { translate } from "../../../Utilities/I18n";
import { TextBox } from "../../Universal/TextBox";

export interface LiturgicalChantsSheetSpecialAbilitiesProps {
  blessedSpecialAbilities: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  l10n: L10nRecord
}

export function LiturgicalChantsSheetSpecialAbilities (
  props: LiturgicalChantsSheetSpecialAbilitiesProps
) {
  const { l10n, blessedSpecialAbilities: maybeBlessedSpecialAbilities } = props

  return (
    <TextBox
      className="activatable-list"
      label={translate (l10n) ("blessedspecialabilities")}
      value={compressList (l10n)
                          (fromMaybe (List<Record<ActiveActivatable<SpecialAbility>>> ())
                                     (maybeBlessedSpecialAbilities))}
      />
  )
}
