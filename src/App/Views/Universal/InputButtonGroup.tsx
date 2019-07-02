import classNames from "classnames";
import * as React from "react";

export interface InputButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function InputButtonGroup (props: InputButtonGroupProps) {
  const { className, children, ...other } = props

  return (
    <div className={classNames (className, "btn-group")} {...other}>
      {children}
    </div>
  )
}
