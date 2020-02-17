import * as React from "react"
import { List } from "../../../Data/List"
import { Record } from "../../../Data/Record"
import { ActiveActivatable } from "../../Models/View/ActiveActivatable"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { compressList } from "../../Utilities/Activatable/activatableNameUtils"

interface ActivatableTextListProps {
  list: List<Record<ActiveActivatable>>
  staticData: StaticDataRecord
}

export const ActivatableTextList: React.FC<ActivatableTextListProps> = ({ staticData, list }) => (
  <div className="list">
    {compressList (staticData) (list)}
  </div>
)
