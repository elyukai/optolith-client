import * as React from "react";
import { List } from "../../../Data/List";
import { guardReplace, Maybe, normalize, orN } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";

export interface ActivateProps {
  active: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  value?: Maybe<string | number> | string | number;
  onClick (value: Maybe<string | number>): void;
}

export function Activate (props: ActivateProps) {
  const { active, className, disabled, onClick, value, ...other } = props;

  const normalizedValue = normalize (value);

  const onClickEval = orN (disabled) ? undefined : () => onClick (normalizedValue);

  return (
    <div
      {...other}
      className={classListMaybe (List (
        Maybe (className),
        guardReplace (active) ("active"),
        guardReplace (orN (disabled)) ("disabled")
      ))}
      onClick={onClickEval}
      />
  );
}
