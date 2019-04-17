import * as React from "react";

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
        {
          ...addValues
            .map (e => (
              <div key={e.className} className={e.className}>
                {e.value}
              </div>
            ))
            .toArray () as JSX.Element[]
        }
      </>
    )
  }

  return null
}
