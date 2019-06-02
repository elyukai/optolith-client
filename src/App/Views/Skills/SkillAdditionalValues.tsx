import * as React from "react";
import { List, map, toArray } from "../../../Data/List";
import { pipe_ } from "../../Utilities/pipe";

export interface AdditionalValue {
  className: string
  value?: string | number
}

export interface SkillAdditionalValuesProps {
  addValues?: List<AdditionalValue>
}

export function SkillAdditionalValues (props: SkillAdditionalValuesProps) {
  const { addValues } = props

  if (typeof addValues === "object") {
    return (
      <>
        {pipe_ (
          addValues,
          map (e => (
            <div key={e.className} className={e.className}>
              {e.value}
            </div>
          )),
          toArray
        )}
      </>
    )
  }

  return null
}
