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

interface Props {
  l10n: L10nRecord
  magicalSpecialAbilities: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
}

export const SpellsSheetSpecialAbilities: React.FC<Props> = props => {
  const { l10n, magicalSpecialAbilities: maybeMagicalSpecialAbilities } = props

  return (
    <TextBox
      className="activatable-list"
      label={translate (l10n) ("magicalspecialabilities")}
      value={compressList (l10n)
                          (fromMaybe (List<Record<ActiveActivatable<SpecialAbility>>> ())
                                     (maybeMagicalSpecialAbilities))}
      />
  )
}
