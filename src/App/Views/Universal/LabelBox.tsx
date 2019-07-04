import classNames from "classnames";
import * as React from "react";
import { fromMaybeR, Maybe, Nothing } from "../../../Data/Maybe";
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
    <div className={classNames ("labelbox", className)}>
      <Box>{fromMaybeR (children as any) (value)}</Box>
      <label>{label}</label>
    </div>
  )
}
