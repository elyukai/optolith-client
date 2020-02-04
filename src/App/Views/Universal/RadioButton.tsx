import * as React from "react";
import { notNullStrUndef } from "../../../Data/List";
import { Maybe } from "../../../Data/Maybe";
import { Activate } from "./Activate";
import { Icon } from "./Icon";
import { Text } from "./Text";

interface Props {
  active: boolean
  disabled?: boolean
  label?: string
  value?: Maybe<string | number> | string | number
  onClick (value: Maybe<string | number>): void
}

export const RadioButton: React.FC<Props> = props => {
  const { active, children, disabled, label, onClick, value } = props

  return (
    <Activate
      className="radio"
      active={active}
      onClick={onClick}
      disabled={disabled}
      value={value}
      >
      <Icon>
        <div className="border" />
        <div className="dot" />
      </Icon>
      <Text>
        {notNullStrUndef (label) ? label : children}
      </Text>
    </Activate>
  )
}
