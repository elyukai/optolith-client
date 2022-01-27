import * as React from "react"
import { Textfit } from "react-textfit"
import { intercalate, List, replicateR } from "../../../../Data/List"
import { Maybe } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { show } from "../../../../Data/Show"
import { ShieldOrParryingWeapon } from "../../../Models/View/ShieldOrParryingWeapon"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { localizeNumber, localizeWeight, translate, translateP } from "../../../Utilities/I18n"
import { toNewMaybe } from "../../../Utilities/Maybe"
import { sign, toRoman } from "../../../Utilities/NumberUtils"
import { pipe_ } from "../../../Utilities/pipe"
import { renderMaybeWith } from "../../../Utilities/ReactUtils"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  staticData: StaticDataRecord
  shieldsAndParryingWeapons: Maybe<Record<ShieldOrParryingWeapon>[]>
}

const SOPWA = ShieldOrParryingWeapon.A

export const CombatSheetShields: React.FC<Props> = props => {
  const { staticData, shieldsAndParryingWeapons: msh_or_parry_weapons } = props

  return (
    <TextBox
      label={translate (staticData) ("sheets.combatsheet.shieldparryingweapon.title")}
      className="shields"
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (staticData)
                         ("sheets.combatsheet.shieldparryingweapon.labels.shieldparryingweapon")}
            </th>
            <th className="str">
              {translate (staticData)
                         ("sheets.combatsheet.shieldparryingweapon.labels.structurepoints")}
            </th>
            <th className="bf">
              {translate (staticData)
                         ("sheets.combatsheet.shieldparryingweapon.labels.breakingpointrating")}
            </th>
            <th className="loss">
              {translate (staticData) ("sheets.combatsheet.shieldparryingweapon.labels.damaged")}
            </th>
            <th className="mod">
              {translate (staticData)
                         ("sheets.combatsheet.shieldparryingweapon.labels.attackparrymodifier")}
            </th>
            <th className="weight">
              {translate (staticData) ("sheets.combatsheet.shieldparryingweapon.labels.weight")}
            </th>
          </tr>
        </thead>
        <tbody>
          {
            toNewMaybe(msh_or_parry_weapons)
              .maybe<React.ReactNode>(null, xs =>
                xs.map(e => (
                  <tr key={SOPWA.id (e)}>
                    <td className="name">
                      <Textfit max={11} min={7} mode="single">{SOPWA.name (e)}</Textfit>
                    </td>
                    <td className="str">
                      {pipe_ (
                        e,
                        SOPWA.stp,
                        renderMaybeWith (x => typeof x === "object"
                                              ? intercalate ("/") (x)
                                              : show (x))
                      )}
                    </td>
                    <td className="bf">{SOPWA.bf (e)}</td>
                    <td className="loss">
                      {renderMaybeWith (toRoman) (SOPWA.loss (e))}
                    </td>
                    <td className="mod">
                      {sign (Maybe.sum (SOPWA.atMod (e)))}
                      {"/"}
                      {sign (Maybe.sum (SOPWA.paMod (e)))}
                    </td>
                    <td className="weight">
                      {translateP (staticData)
                                  ("general.weightvalue")
                                  (List (
                                    pipe_ (
                                      e,
                                      SOPWA.weight,
                                      localizeWeight (staticData),
                                      localizeNumber (staticData)
                                    )
                                  ))}
                    </td>
                  </tr>
                ))
              )
          }
          {replicateR (2 - toNewMaybe(msh_or_parry_weapons).map(xs => xs.length).sum())
                      (i => (
                        <tr key={`undefined-${i}`}>
                          <td className="name" />
                          <td className="str" />
                          <td className="bf" />
                          <td className="loss" />
                          <td className="mod" />
                          <td className="weight" />
                        </tr>
                      ))}
        </tbody>
      </table>
    </TextBox>
  )
}
