import * as React from "react"
import { List, subscriptF } from "../../../../Data/List"
import { bindF, fromMaybe, Maybe, maybe } from "../../../../Data/Maybe"
import { lookup, OrderedMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Pair } from "../../../../Data/Tuple"
import { AttributeCombined } from "../../../Models/View/AttributeCombined"
import { SkillWithActivations } from "../../../Models/View/SkillWithActivations"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { pipe_ } from "../../../Utilities/pipe"
import { TextBox } from "../../Universal/TextBox"
import { iterateGroupHeaders } from "./SkillsSheetSkillsGroups"
import { iterateList } from "./SkillsSheetSkillsIterate"

interface Props {
  attributes: List<Record<AttributeCombined>>
  checkAttributeValueVisibility: boolean
  generateNotes: boolean
  staticData: StaticDataRecord
  skillsByGroup: Maybe<OrderedMap<number, List<Record<SkillWithActivations>>>>
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
  const {
    attributes,
    checkAttributeValueVisibility,
    generateNotes,
    staticData,
    skillsByGroup,
    skillGroupPages,
  } = props

  const groupHeaders = iterateGroupHeaders (staticData)
                                           (checkAttributeValueVisibility)
                                           (skillGroupPages)
                                           (attributes)

  return (
    <TextBox label={translate (staticData) ("sheets.gamestatssheet.skillstable.title")}>
      <div className="upper">
        <table>
          <thead>
            <tr>
              <th className="name">
                {translate (staticData) ("sheets.gamestatssheet.skillstable.labels.skill")}
              </th>
              <th className="check">
                {translate (staticData) ("sheets.gamestatssheet.skillstable.labels.check")}
              </th>
              <th className="enc">
                {translate (staticData) ("sheets.gamestatssheet.skillstable.labels.encumbrance")}
              </th>
              <th className="ic">
                {translate (staticData)
                           ("sheets.gamestatssheet.skillstable.labels.improvementcost")}
              </th>
              <th className="sr">
                {translate (staticData) ("sheets.gamestatssheet.skillstable.labels.skillrating")}
              </th>
              <th className="routine">
                {translate (staticData) ("sheets.gamestatssheet.skillstable.labels.routinechecks")}
              </th>
              <th className="comment">
                {translate (staticData) ("sheets.gamestatssheet.skillstable.labels.notes")}
              </th>
            </tr>
          </thead>
          <tbody>
            {pipe_ (groupHeaders, subscriptF (0), fromMaybe (null as React.ReactNode))}
            {pipe_ (
              skillsByGroup,
              bindF (lookup (1)),
              maybe (null as React.ReactNode)
                    (iterateList (staticData)
                                 (checkAttributeValueVisibility, generateNotes)
                                 (attributes))
            )}
            <EmptyRow />
            {pipe_ (groupHeaders, subscriptF (1), fromMaybe (null as React.ReactNode))}
            {pipe_ (
              skillsByGroup,
              bindF (lookup (2)),
              maybe (null as React.ReactNode)
                    (iterateList (staticData)
                    (checkAttributeValueVisibility, generateNotes)
                    (attributes))
            )}
            <EmptyRow />
            {pipe_ (groupHeaders, subscriptF (2), fromMaybe (null as React.ReactNode))}
            {pipe_ (
              skillsByGroup,
              bindF (lookup (3)),
              maybe (null as React.ReactNode)
                    (iterateList (staticData)
                    (checkAttributeValueVisibility, generateNotes)
                    (attributes))
            )}
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th className="name">
                {translate (staticData) ("sheets.gamestatssheet.skillstable.labels.skill")}
              </th>
              <th className="check">
                {translate (staticData) ("sheets.gamestatssheet.skillstable.labels.check")}
              </th>
              <th className="enc">
                {translate (staticData) ("sheets.gamestatssheet.skillstable.labels.encumbrance")}
              </th>
              <th className="ic">
                {translate (staticData)
                           ("sheets.gamestatssheet.skillstable.labels.improvementcost")}
              </th>
              <th className="sr">
                {translate (staticData) ("sheets.gamestatssheet.skillstable.labels.skillrating")}
              </th>
              <th className="routine">
                {translate (staticData) ("sheets.gamestatssheet.skillstable.labels.routinechecks")}
              </th>
              <th className="comment">
                {translate (staticData) ("sheets.gamestatssheet.skillstable.labels.notes")}
              </th>
            </tr>
          </thead>
          <tbody>
            {pipe_ (groupHeaders, subscriptF (3), fromMaybe (null as React.ReactNode))}
            {pipe_ (
              skillsByGroup,
              bindF (lookup (4)),
              maybe (null as React.ReactNode)
                    (iterateList (staticData)
                    (checkAttributeValueVisibility, generateNotes)
                    (attributes))
            )}
            <EmptyRow />
            {pipe_ (groupHeaders, subscriptF (4), fromMaybe (null as React.ReactNode))}
            {pipe_ (
              skillsByGroup,
              bindF (lookup (5)),
              maybe (null as React.ReactNode)
                    (iterateList (staticData)
                    (checkAttributeValueVisibility, generateNotes)
                    (attributes))
            )}
          </tbody>
        </table>
      </div>
    </TextBox>
  )
}
