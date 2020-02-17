import * as React from "react"
import { List } from "../../../../Data/List"
import { fromMaybe, Maybe } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { ActiveActivatable } from "../../../Models/View/ActiveActivatable"
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { compressList } from "../../../Utilities/Activatable/activatableNameUtils"
import { translate } from "../../../Utilities/I18n"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  combatSpecialAbilities: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  staticData: StaticDataRecord
}

export const CombatSheetSpecialAbilities: React.FC<Props> = props => {
  const { combatSpecialAbilities: maybeCombatSpecialAbilities, staticData } = props

  return (
    <TextBox
      className="activatable-list"
      label={translate (staticData) ("sheets.combatsheet.combatspecialabilities")}
      value={compressList (staticData)
                          (fromMaybe (List<Record<ActiveActivatable<SpecialAbility>>> ())
                                     (maybeCombatSpecialAbilities))}
      />
  )
}
