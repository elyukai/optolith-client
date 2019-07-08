import * as React from "react";
import { Textfit } from "react-textfit";
import { List } from "../../../Data/List";
import { fromMaybe, Just, Maybe, orN } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

export interface PlainProps {
  className: string
  label: string
  value: Maybe<string | number>
  multi?: boolean
}

export const Plain = (props: PlainProps) => {
  const { className, label, value, multi } = props

  return (
    <div className={classListMaybe (List (Just ("plain"), Maybe (className)))}>
      <div className="label">{label}</div>
      <Textfit max={13} min={8} mode={orN (multi) ? "multi" : "single"} className="value">
        {fromMaybe<string | number> ("") (value)}
      </Textfit>
    </div>
  )
}
