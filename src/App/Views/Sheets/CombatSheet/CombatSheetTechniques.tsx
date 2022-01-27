import * as React from "react"
import { equals } from "../../../../Data/Eq"
import { fmap } from "../../../../Data/Functor"
import { find, intercalate, List, map, toArray } from "../../../../Data/List"
import { mapMaybe, Maybe } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { icFromJs } from "../../../Constants/Groups"
import { AttributeCombined, AttributeCombinedA_ } from "../../../Models/View/AttributeCombined"
import { CombatTechniqueWithAttackParryBase, CombatTechniqueWithAttackParryBaseA_ } from "../../../Models/View/CombatTechniqueWithAttackParryBase"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { ndash } from "../../../Utilities/Chars"
import { translate } from "../../../Utilities/I18n"
import { icToStr } from "../../../Utilities/IC.gen"
import { toNewMaybe } from "../../../Utilities/Maybe"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  attributes: List<Record<AttributeCombined>>
  combatTechniques: Maybe<List<Record<CombatTechniqueWithAttackParryBase>>>
  staticData: StaticDataRecord
}

const CTWAPBA = CombatTechniqueWithAttackParryBase.A
const CTWAPBA_ = CombatTechniqueWithAttackParryBaseA_

export const CombatSheetTechniques: React.FC<Props> = props => {
  const { attributes, combatTechniques: mcombat_techniques, staticData } = props

  return (
    <TextBox
      className="combat-techniques"
      label={translate (staticData) ("sheets.combatsheet.combattechniquestable.title")}
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (staticData)
                         ("sheets.combatsheet.combattechniquestable.labels.combattechnique")}
            </th>
            <th className="primary">
              {translate (staticData)
                         ("sheets.combatsheet.combattechniquestable.labels.primaryattribute")}
            </th>
            <th className="ic">
              {translate (staticData)
                         ("sheets.combatsheet.combattechniquestable.labels.improvementcost")}
            </th>
            <th className="value">
              {translate (staticData)
                         ("sheets.combatsheet.combattechniquestable.labels.combattechniquerating")}
            </th>
            <th className="at">
              {translate (staticData)
                         ("sheets.combatsheet.combattechniquestable.labels.attackrangecombat")}
            </th>
            <th className="pa">
              {translate (staticData) ("sheets.combatsheet.combattechniquestable.labels.parry")}
            </th>
          </tr>
        </thead>
        <tbody>
          {toNewMaybe(mcombat_techniques)
            .maybe<React.ReactNode>(null, pipe (
              map (e => (
                <tr key={CTWAPBA_.id (e)}>
                  <td className="name">{CTWAPBA_.name (e)}</td>
                  <td className="primary">
                    {pipe_ (
                      e,
                      CTWAPBA_.primary,
                      mapMaybe (pipe (
                        id => find (pipe (AttributeCombinedA_.id, equals (id)))
                                   (attributes),
                        fmap (AttributeCombinedA_.short)
                      )),
                      intercalate ("/")
                    )}
                  </td>
                  <td className="ic">{icToStr (icFromJs (CTWAPBA_.ic (e)))}</td>
                  <td className="value">{CTWAPBA_.value (e)}</td>
                  <td className="at">{CTWAPBA.at (e)}</td>
                  <td className="pa">
                    {Maybe.fromMaybe<string | number> (ndash) (CTWAPBA.pa (e))}
                  </td>
                </tr>
              )),
              toArray
            ))
          }
        </tbody>
      </table>
    </TextBox>
  )
}
