import * as classNames from "classnames";
import * as React from "react";

export interface TextProps {
  children?: React.ReactNode
  className?: string
  [id: string]: any
}

export function Text (props: TextProps) {
  const { children, className, ...other } = props

  return (
    <div {...other} className={classNames ("text", className)}>
      {children}
    </div>
  )
}
