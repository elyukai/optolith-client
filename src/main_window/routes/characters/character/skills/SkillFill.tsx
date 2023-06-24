import { FC } from "react"

type Props = {
  addFillElement?: boolean
}

export const SkillFill: FC<Props> = props => {
  const { addFillElement } = props

  return addFillElement === true ? <div className="fill" /> : null
}
