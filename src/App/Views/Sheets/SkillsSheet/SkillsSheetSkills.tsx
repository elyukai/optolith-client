import * as React from "react"
import { List, subscriptF } from "../../../../Data/List"
import { bindF, fromMaybe, Maybe, maybe } from "../../../../Data/Maybe"
import { lookup, OrderedMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Pair } from "../../../../Data/Tuple"
import { AttributeCombined } from "../../../Models/View/AttributeCombined"
import { SkillCombined } from "../../../Models/View/SkillCombined"
import { L10nRecord } from "../../../Models/Wiki/L10n"
import { translate } from "../../../Utilities/I18n"
import { pipe_ } from "../../../Utilities/pipe"
import { TextBox } from "../../Universal/TextBox"
import { iterateGroupHeaders } from "./SkillsSheetSkillsGroups"
import { iterateList } from "./SkillsSheetSkillsIterate"

interface Props {
  attributes: List<Record<AttributeCombined>>
  checkAttributeValueVisibility: boolean
  l10n: L10nRecord
  skillsByGroup: Maybe<OrderedMap<number, List<Record<SkillCombined>>>>
  skillGroupPages: OrderedMap<number, Pair<number, number>>
}

const EmptyRow = () => (
  <tr>
    <td />
    <td />
    <td />
    <td />
    <td />
    <td />
    <td />
  </tr>
)

export const SkillsSheetSkills: React.FC<Props> = props => {
  const { attributes, checkAttributeValueVisibility, l10n, skillsByGroup, skillGroupPages } = props

  const groupHeaders = iterateGroupHeaders (l10n)
                                           (checkAttributeValueVisibility)
                                           (skillGroupPages)
                                           (attributes)

  return (
    <TextBox label={translate (l10n) ("sheets.gamestatssheet.skillstable.title")}>
      <div className="upper">
        <table>
          <thead>
            <tr>
              <th className="name">
                {translate (l10n) ("sheets.gamestatssheet.skillstable.labels.skill")}
              </th>
              <th className="check">
                {translate (l10n) ("sheets.gamestatssheet.skillstable.labels.check")}
              </th>
              <th className="enc">
                {translate (l10n) ("sheets.gamestatssheet.skillstable.labels.encumbrance")}
              </th>
              <th className="ic">
                {translate (l10n) ("sheets.gamestatssheet.skillstable.labels.improvementcost")}
              </th>
              <th className="sr">
                {translate (l10n) ("sheets.gamestatssheet.skillstable.labels.skillrating")}
              </th>
              <th className="routine">
                {translate (l10n) ("sheets.gamestatssheet.skillstable.labels.routinechecks")}
              </th>
              <th className="comment">
                {translate (l10n) ("sheets.gamestatssheet.skillstable.labels.notes")}
              </th>
            </tr>
          </thead>
          <tbody>
            {pipe_ (groupHeaders, subscriptF (0), fromMaybe (null as React.ReactNode))}
            {pipe_ (
              skillsByGroup,
              bindF (lookup (1)),
              maybe (null as React.ReactNode)
                    (iterateList (l10n) (checkAttributeValueVisibility) (attributes))
            )}
            <EmptyRow />
            {pipe_ (groupHeaders, subscriptF (1), fromMaybe (null as React.ReactNode))}
            {pipe_ (
              skillsByGroup,
              bindF (lookup (2)),
              maybe (null as React.ReactNode)
                    (iterateList (l10n) (checkAttributeValueVisibility) (attributes))
            )}
            <EmptyRow />
            {pipe_ (groupHeaders, subscriptF (2), fromMaybe (null as React.ReactNode))}
            {pipe_ (
              skillsByGroup,
              bindF (lookup (3)),
              maybe (null as React.ReactNode)
                    (iterateList (l10n) (checkAttributeValueVisibility) (attributes))
            )}
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th className="name">
                {translate (l10n) ("sheets.gamestatssheet.skillstable.labels.skill")}
              </th>
              <th className="check">
                {translate (l10n) ("sheets.gamestatssheet.skillstable.labels.check")}
              </th>
              <th className="enc">
                {translate (l10n) ("sheets.gamestatssheet.skillstable.labels.encumbrance")}
              </th>
              <th className="ic">
                {translate (l10n) ("sheets.gamestatssheet.skillstable.labels.improvementcost")}
              </th>
              <th className="sr">
                {translate (l10n) ("sheets.gamestatssheet.skillstable.labels.skillrating")}
              </th>
              <th className="routine">
                {translate (l10n) ("sheets.gamestatssheet.skillstable.labels.routinechecks")}
              </th>
              <th className="comment">
                {translate (l10n) ("sheets.gamestatssheet.skillstable.labels.notes")}
              </th>
            </tr>
          </thead>
          <tbody>
            {pipe_ (groupHeaders, subscriptF (3), fromMaybe (null as React.ReactNode))}
            {pipe_ (
              skillsByGroup,
              bindF (lookup (4)),
              maybe (null as React.ReactNode)
                    (iterateList (l10n) (checkAttributeValueVisibility) (attributes))
            )}
            <EmptyRow />
            {pipe_ (groupHeaders, subscriptF (4), fromMaybe (null as React.ReactNode))}
            {pipe_ (
              skillsByGroup,
              bindF (lookup (5)),
              maybe (null as React.ReactNode)
                    (iterateList (l10n) (checkAttributeValueVisibility) (attributes))
            )}
          </tbody>
        </table>
      </div>
    </TextBox>
  )
}
