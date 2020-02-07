import * as React from "react"
import { List, map, toArray } from "../../../Data/List"
import { Record } from "../../../Data/Record"
import { AttributeCombined, AttributeCombinedA_ } from "../../Models/View/AttributeCombined"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { translate } from "../../Utilities/I18n"
import { sign } from "../../Utilities/NumberUtils"
import { pipe_ } from "../../Utilities/pipe"
import { TextBox } from "../Universal/TextBox"
import { AttributeModsListItem } from "./AttributeModsListItem"

interface Props {
  l10n: L10nRecord
  attributes: List<Record<AttributeCombined>>
}

export const AttributeMods: React.FC<Props> = ({ attributes, l10n }) => (
  <TextBox
    className="attribute-mods"
    label={translate (l10n) ("attributemodifiers")}
    >
    <table>
      <thead>
        <tr>
          <th className="name" />
          <th>{sign (-3)}</th>
          <th>{sign (-2)}</th>
          <th>{sign (-1)}</th>
          <th className="null">{sign (0)}</th>
          <th>{sign (1)}</th>
          <th>{sign (2)}</th>
          <th>{sign (3)}</th>
        </tr>
      </thead>
      <tbody>
        {pipe_ (
          attributes,
          map (e => <AttributeModsListItem attribute={e} key={AttributeCombinedA_.id (e)} />),
          toArray
        )}
      </tbody>
    </table>
  </TextBox>
)
