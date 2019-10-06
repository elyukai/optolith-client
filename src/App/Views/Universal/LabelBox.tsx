import * as React from "react";
import { List } from "../../../Data/List";
import { fromMaybe, Just, Maybe, Nothing } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";
import { Box } from "./Box";

export interface LabelBoxProps {
  children?: React.ReactNode
  className?: string
  label: string
  value?: Maybe<string | number>
}

export function LabelBox (props: LabelBoxProps) {
  const { className, children, label, value = Nothing } = props

  return (
    <div className={classListMaybe (List (Just ("labelbox"), Maybe (className)))}>
      <Box>{fromMaybe (children as any) (value)}</Box>
      <label>{label}</label>
    </div>
  )
}
