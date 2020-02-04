import * as React from "react";
import { Maybe, maybe, normalize } from "../../../Data/Maybe";

interface Props {
  current?: Maybe<number> | number
  max?: Maybe<number> | number
}

export const NumberBox: React.FC<Props> = ({ current, max }) => {
  const mcurrent = normalize (current)
  const mmax = normalize (max)

  return (
    <div className="number-box">
      {maybe (<></>)
             ((x: number) => (<span className="current">{x}</span>))
             (mcurrent)}
      {maybe (<></>)
             ((x: number) => (<span className="max">{x}</span>))
             (mmax)}
    </div>
  )
}
