import * as React from "react";
import { List } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";
import { renderMaybe } from "../../Utilities/ReactUtils";

export interface SheetHeaderAttributeProps {
  id: string
  label: string
  value: Maybe<number | string>
}

export function SheetHeaderAttribute (props: SheetHeaderAttributeProps) {
  return (
    <div className={classListMaybe (List (Just ("sheet-attribute"), Maybe (props.id)))}>
      <span className="label">{props.label}</span>
      <span className="value">{renderMaybe (props.value)}</span>
    </div>
  )
}
