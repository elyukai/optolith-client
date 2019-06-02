import * as React from "react";
import { List, subscriptF } from "../../../../Data/List";
import { bindF, fromMaybeR, Maybe, maybeR } from "../../../../Data/Maybe";
import { lookup, OrderedMap } from "../../../../Data/OrderedMap";
import { Pair } from "../../../../Data/Pair";
import { Record } from "../../../../Data/Record";
import { AttributeCombined } from "../../../Models/View/AttributeCombined";
import { SkillCombined } from "../../../Models/View/SkillCombined";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { pipe_ } from "../../../Utilities/pipe";
import { TextBox } from "../../Universal/TextBox";
import { iterateGroupHeaders } from "./SkillsSheetSkillsGroups";
import { iterateList } from "./SkillsSheetSkillsIterate";

export interface SkillsSheetSkillsProps {
  attributes: List<Record<AttributeCombined>>
  checkAttributeValueVisibility: boolean
  l10n: L10nRecord
  skillsByGroup: Maybe<OrderedMap<number, List<Record<SkillCombined>>>>
  skillGroupPages: OrderedMap<number, Pair<number, number>>
}

const EmptyRow = () => (
  <tr>
    <td/>
    <td/>
    <td/>
    <td/>
    <td/>
    <td/>
    <td/>
  </tr>
)

export function SkillsSheetSkills (props: SkillsSheetSkillsProps) {
  const { attributes, checkAttributeValueVisibility, l10n, skillsByGroup, skillGroupPages } = props

  const groupHeaders = iterateGroupHeaders (l10n)
                                           (checkAttributeValueVisibility)
                                           (skillGroupPages)
                                           (attributes)

  return (
    <TextBox label={translate (l10n) ("skills")}>
      <div className="upper">
        <table>
          <thead>
            <tr>
              <th className="name">
                {translate (l10n) ("skill")}
              </th>
              <th className="check">
                {translate (l10n) ("check")}
              </th>
              <th className="enc">
                {translate (l10n) ("encumbrance.short")}
              </th>
              <th className="ic">
                {translate (l10n) ("improvementcost.short")}
              </th>
              <th className="sr">
                {translate (l10n) ("skillrating.short")}
              </th>
              <th className="routine">
                {translate (l10n) ("routinechecks.short")}
              </th>
              <th className="comment">
                {translate (l10n) ("notes")}
              </th>
            </tr>
          </thead>
          <tbody>
            {pipe_ (groupHeaders, subscriptF (0), fromMaybeR (null))}
            {pipe_ (
              skillsByGroup,
              bindF (lookup (0)),
              maybeR (null) (iterateList (l10n) (checkAttributeValueVisibility) (attributes))
            )}
            <EmptyRow />
            {pipe_ (groupHeaders, subscriptF (1), fromMaybeR (null))}
            {pipe_ (
              skillsByGroup,
              bindF (lookup (1)),
              maybeR (null) (iterateList (l10n) (checkAttributeValueVisibility) (attributes))
            )}
            <EmptyRow />
            {pipe_ (groupHeaders, subscriptF (2), fromMaybeR (null))}
            {pipe_ (
              skillsByGroup,
              bindF (lookup (2)),
              maybeR (null) (iterateList (l10n) (checkAttributeValueVisibility) (attributes))
            )}
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th className="name">
                {translate (l10n) ("skill")}
              </th>
              <th className="check">
                {translate (l10n) ("check")}
              </th>
              <th className="enc">
                {translate (l10n) ("encumbrance.short")}
              </th>
              <th className="ic">
                {translate (l10n) ("improvementcost.short")}
              </th>
              <th className="sr">
                {translate (l10n) ("skillrating.short")}
              </th>
              <th className="routine">
                {translate (l10n) ("routinechecks.short")}
              </th>
              <th className="comment">
                {translate (l10n) ("notes")}
              </th>
            </tr>
          </thead>
          <tbody>
            {pipe_ (groupHeaders, subscriptF (3), fromMaybeR (null))}
            {pipe_ (
              skillsByGroup,
              bindF (lookup (3)),
              maybeR (null) (iterateList (l10n) (checkAttributeValueVisibility) (attributes))
            )}
            <EmptyRow />
            {pipe_ (groupHeaders, subscriptF (4), fromMaybeR (null))}
            {pipe_ (
              skillsByGroup,
              bindF (lookup (4)),
              maybeR (null) (iterateList (l10n) (checkAttributeValueVisibility) (attributes))
            )}
          </tbody>
        </table>
      </div>
    </TextBox>
  )
}
