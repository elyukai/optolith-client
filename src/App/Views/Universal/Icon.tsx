import * as classNames from "classnames";
import * as React from "react";

export interface IconProps {
  className?: string
  [id: string]: any
}

export function Icon (props: IconProps) {
  const { className, ...other } = props

  return (
    <div className={classNames ("icon", className)} {...other} />
  )
}
