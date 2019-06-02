import * as classNames from "classnames";
import * as React from "react";
import { Maybe } from "../../../Data/Maybe";
import { renderMaybe } from "../../Utilities/ReactUtils";

export interface SheetHeaderAttributeProps {
  id: string
  label: string
  value: Maybe<number | string>
}

export function SheetHeaderAttribute (props: SheetHeaderAttributeProps) {
  return (
    <div className={classNames ("sheet-attribute", props.id)}>
      <span className="label">{props.label}</span>
      <span className="value">{renderMaybe (props.value)}</span>
    </div>
  )
}
