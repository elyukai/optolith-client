import * as React from "react"
import { List } from "../../../Data/List"
import { Record } from "../../../Data/Record"
import { AttributeCombined } from "../../Models/View/AttributeCombined"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { HeaderValue, SheetHeader } from "./SheetHeader"

export interface SheetProps {
  addHeaderInfo?: List<Record<HeaderValue>>
  attributes: List<Record<AttributeCombined>>
  id: string
  staticData: StaticDataRecord
  title: string
}

export const Sheet: React.FC<SheetProps> = props => {
  const { addHeaderInfo, attributes, children, id, staticData, title } = props

  return (
    <div className="sheet" id={id}>
      <SheetHeader
        title={title}
        add={addHeaderInfo}
        attributes={attributes}
        staticData={staticData}
        />
      {children}
    </div>
  )
}
