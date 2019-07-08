import * as React from "react";
import { List, notNullStrUndef } from "../../../Data/List";
import { guardReplace, Just, Maybe, orN } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";
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
      className={
        classListMaybe (List (
          Just ("tab"),
          guardReplace (active) ("active"),
          guardReplace (orN (disabled)) ("disabled"),
          Maybe (className)
        ))
      }
      onClick={orN (disabled) ? undefined : onClick}
      >
      <Text>{notNullStrUndef (label) ? label : children}</Text>
    </div>
  )
}
