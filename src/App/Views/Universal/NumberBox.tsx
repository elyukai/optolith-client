import * as React from "react";
import { Maybe, maybe, normalize } from "../../../Data/Maybe";

export interface NumberBoxProps {
  current?: Maybe<number> | number
  max?: Maybe<number> | number
}

export function NumberBox (props: NumberBoxProps) {
  const mcurrent = normalize (props.current)
  const mmax = normalize (props.max)

  return (
    <div className="number-box">
      {maybe (<></>)
             ((current: number) => (<span className="current">{current}</span>))
             (mcurrent)}
      {maybe (<></>)
             ((max: number) => (<span className="max">{max}</span>))
             (mmax)}
    </div>
  )
}
