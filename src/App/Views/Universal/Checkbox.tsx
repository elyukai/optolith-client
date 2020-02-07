import * as React from "react"
import { List, notNullStrUndef } from "../../../Data/List"
import { Just, Maybe, normalize, or } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"
import { pipe } from "../../Utilities/pipe"
import { Activate } from "./Activate"
import { Icon } from "./Icon"
import { Text } from "./Text"

interface Props {
  checked: boolean | Maybe<boolean>
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  label?: string
  onClick (): void
}

const normalizeChecked: (checked: Maybe<boolean> | boolean) => boolean =
  pipe (normalize, or)

export const Checkbox: React.FC<Props> = props => {
  const { checked, children, className, disabled, label, onClick } = props

  return (
    <Activate
      active={normalizeChecked (checked)}
      className={classListMaybe (List (Just ("checkbox"), Maybe (className)))}
      onClick={onClick}
      disabled={disabled}
      >
      <Icon>
        <div className="border" />
        <div className="hook" />
      </Icon>
      <Text>
        {notNullStrUndef (label) ? label : children}
      </Text>
    </Activate>
  )
}
