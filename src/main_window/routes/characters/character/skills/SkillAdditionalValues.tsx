import { FC } from "react"

export type AdditionalValue = {
  className: string
  value?: string | number
}

type Props = {
  addValues?: AdditionalValue[]
}

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
