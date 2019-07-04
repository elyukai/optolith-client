import classNames from "classnames";
import * as React from "react";
import { Maybe, normalize } from "../../../Data/Maybe";

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

  const onClickEval = disabled === true ? undefined : () => onClick (normalizedValue);

  return (
    <div
      {...other}
      className={classNames (className, {
        "active": active,
        "disabled": disabled,
      })}
      onClick={onClickEval}
      />
  );
}
