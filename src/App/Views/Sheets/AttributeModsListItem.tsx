import * as React from "react";
import { Record } from "../../../Data/Record";
import { AttributeCombined, AttributeCombinedA_ } from "../../Models/View/AttributeCombined";

interface AttributeModsListItemProps {
  attribute: Record<AttributeCombined>
}

export function AttributeModsListItem (props: AttributeModsListItemProps) {
  const id = AttributeCombinedA_.id (props.attribute)
  const short = AttributeCombinedA_.short (props.attribute)
  const value = AttributeCombinedA_.value (props.attribute)

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
