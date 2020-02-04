import * as React from "react";
import { List } from "../../../Data/List";
import { guardReplace, Maybe, normalize, orN } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

interface Props {
  active: boolean
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  value?: Maybe<string | number> | string | number
  onClick (value: Maybe<string | number>): void
}

export const Activate: React.FC<Props> = props => {
  const { active, className, disabled, onClick, value, children } = props

  const onClickEval = React.useCallback (
    () => orN (disabled) ? undefined : onClick (normalize (value)),
    [ disabled, onClick, value ]
  )

  return (
    <div
      className={classListMaybe (List (
        Maybe (className),
        guardReplace (active) ("active"),
        guardReplace (orN (disabled)) ("disabled")
      ))}
      onClick={onClickEval}
      >
      {children}
    </div>
  )
}
