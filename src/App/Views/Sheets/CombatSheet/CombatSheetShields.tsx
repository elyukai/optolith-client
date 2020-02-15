import * as React from "react"
import { Textfit } from "react-textfit"
import { fmap, fmapF } from "../../../../Data/Functor"
import { flength, List, map, replicateR, toArray } from "../../../../Data/List"
import { fromMaybe, Maybe } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { ShieldOrParryingWeapon } from "../../../Models/View/ShieldOrParryingWeapon"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { localizeNumber, localizeWeight, translate, translateP } from "../../../Utilities/I18n"
import { sign, toRoman } from "../../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { renderMaybeWith } from "../../../Utilities/ReactUtils"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  staticData: StaticDataRecord
  shieldsAndParryingWeapons: Maybe<List<Record<ShieldOrParryingWeapon>>>
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
          {pipe_ (
            msh_or_parry_weapons,
            fmap (pipe (
              map (e => (
                <tr key={SOPWA.id (e)}>
                  <td className="name">
                    <Textfit max={11} min={7} mode="single">{SOPWA.name (e)}</Textfit>
                  </td>
                  <td className="str">
                    {Maybe.fromMaybe<string | number> ("") (SOPWA.stp (e))}
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
              )),
              toArray
            )),
            fromMaybe (null as React.ReactNode)
          )}
          {replicateR (2 - Maybe.sum (fmapF (msh_or_parry_weapons) (flength)))
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
