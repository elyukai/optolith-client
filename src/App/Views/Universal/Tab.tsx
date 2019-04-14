import * as classNames from "classnames";
import * as React from "react";
import { notNullStrUndef } from "../../../Data/List";
import { Text } from "./Text";

export interface TabBaseProps {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  label: string | undefined
}

export interface TabProps extends TabBaseProps {
  active: boolean
  onClick (): void
}

export function Tab (props: TabProps) {
  const { active, children, className, disabled, label, onClick } = props

  return (
    <div
      className={classNames (className, {
        "active": active,
        "disabled": disabled,
        "tab": true,
      })}
      onClick={disabled === true ? undefined : onClick}
      >
      <Text>{notNullStrUndef (label) ? label : children}</Text>
    </div>
  )
}
