import * as React from "react"
import { List } from "../../../Data/List"
import { Record } from "../../../Data/Record"
import { ActiveActivatable } from "../../Models/View/ActiveActivatable"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { compressList } from "../../Utilities/Activatable/activatableNameUtils"

interface ActivatableTextListProps {
  list: List<Record<ActiveActivatable>>
  l10n: L10nRecord
}

export const ActivatableTextList: React.FC<ActivatableTextListProps> = ({ l10n, list }) => (
  <div className="list">
    {compressList (l10n) (list)}
  </div>
)
