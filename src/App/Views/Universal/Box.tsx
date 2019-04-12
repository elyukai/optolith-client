import * as classNames from "classnames";
import * as React from "react";

export interface BoxProps {
  children?: React.ReactNode
  className?: string
}

export function Box (props: BoxProps) {
  const { children, ...other } = props
  let { className } = props

  className = classNames ("box", className)

  return (
    <div {...other} className={className}>
      {children}
    </div>
  )
}
