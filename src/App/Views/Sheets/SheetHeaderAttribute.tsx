import * as React from "react"
import { List } from "../../../Data/List"
import { Just, Maybe } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"
import { renderMaybe } from "../../Utilities/ReactUtils"

interface Props {
  id: string
  label: string
  value: Maybe<number | string>
}

export const SheetHeaderAttribute: React.FC<Props> = ({ id, label, value }) => (
  <div className={classListMaybe (List (Just ("sheet-attribute"), Maybe (id)))}>
    <span className="label">{label}</span>
    <span className="value">{renderMaybe (value)}</span>
  </div>
)
