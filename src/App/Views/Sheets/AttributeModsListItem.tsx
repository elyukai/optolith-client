import * as React from "react"
import { Record } from "../../../Data/Record"
import { AttributeCombined, AttributeCombinedA_ } from "../../Models/View/AttributeCombined"

interface Props {
  attribute: Record<AttributeCombined>
}

export const AttributeModsListItem: React.FC<Props> = ({ attribute }) => {
  const id = AttributeCombinedA_.id (attribute)
  const short = AttributeCombinedA_.short (attribute)
  const value = AttributeCombinedA_.value (attribute)

  return (
    <tr className={id}>
      <td className="name">{short}</td>
      <td>{value - 3}</td>
      <td>{value - 2}</td>
      <td>{value - 1}</td>
      <td className="null">{value}</td>
      <td>{value + 1}</td>
      <td>{value + 2}</td>
      <td>{value + 3}</td>
    </tr>
  )
}
