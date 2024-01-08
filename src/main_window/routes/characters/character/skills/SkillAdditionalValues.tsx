import { FC } from "react"

/**
 * An additional value for a skill row is defined by a value and a class name
 * that can be used to style the value.
 */
export type AdditionalValue = {
  className: string
  value?: string | number
}

type Props = {
  addValues?: AdditionalValue[]
}

/**
 * Returns a list of additional values for the skill row.
 */
export const SkillAdditionalValues: FC<Props> = props => {
  const { addValues } = props

  if (typeof addValues === "object") {
    return (
      <>
        {addValues.map(e => (
          <div key={e.className} className={e.className}>
            {e.value}
          </div>
        ))}
      </>
    )
  }

  return null
}
