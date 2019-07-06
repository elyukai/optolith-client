import * as React from "react";
import { List, notNullStrUndef } from "../../../Data/List";
import { Just, Maybe, normalize, or } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";
import { pipe } from "../../Utilities/pipe";
import { Activate } from "./Activate";
import { Icon } from "./Icon";
import { Text } from "./Text";

export interface CheckboxProps {
  checked: boolean | Maybe<boolean>
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  label?: string
  onClick (): void
}

const normalizeChecked: (checked: Maybe<boolean> | boolean) => boolean =
  pipe (normalize, or)

export function Checkbox (props: CheckboxProps) {
  const { checked, children, className, label, onClick, ...other } = props

  return (
    <Activate
      {...other}
      active={normalizeChecked (checked)}
      className={classListMaybe (List (Just ("checkbox"), Maybe (className)))}
      onClick={onClick}
      >
      <Icon>
        <div className="border"></div>
        <div className="hook"></div>
      </Icon>
      <Text>
        {notNullStrUndef (label) ? label : children}
      </Text>
    </Activate>
  )
}
