import * as React from "react"
import { Textfit } from "react-textfit"
import { fmapF } from "../../../../Data/Functor"
import { intercalate, List, replicateR } from "../../../../Data/List"
import { Maybe } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { show } from "../../../../Data/Show"
import { RangedWeapon } from "../../../Models/View/RangedWeapon"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { localizeNumber, localizeWeight, translate, translateP } from "../../../Utilities/I18n"
import { getDamageStr } from "../../../Utilities/ItemUtils"
import { toNewMaybe } from "../../../Utilities/Maybe"
import { toRoman } from "../../../Utilities/NumberUtils"
import { pipe_ } from "../../../Utilities/pipe"
import { renderMaybe, renderMaybeWith } from "../../../Utilities/ReactUtils"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  staticData: StaticDataRecord
  rangedWeapons: Maybe<Record<RangedWeapon>[]>
}

const RWA = RangedWeapon.A

export const CombatSheetRangedWeapons: React.FC<Props> = props => {
  const { staticData, rangedWeapons: mranged_weapons } = props

  return (
    <TextBox
      label={translate (staticData) ("sheets.combatsheet.rangedcombatweapons")}
      className="melee-weapons"
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (staticData) ("sheets.combatsheet.rangedcombatweapons.labels.weapon")}
            </th>
            <th className="combat-technique">
              {translate (staticData)
                         ("sheets.combatsheet.rangedcombatweapons.labels.combattechnique")}
            </th>
            <th className="reload-time">
              {translate (staticData) ("sheets.combatsheet.rangedcombatweapons.labels.reloadtime")}
            </th>
            <th className="damage">
              {translate (staticData)
                         ("sheets.combatsheet.rangedcombatweapons.labels.damagepoints")}
            </th>
            <th className="ammunition">
              {translate (staticData) ("sheets.combatsheet.rangedcombatweapons.labels.ammunition")}
            </th>
            <th className="range">
              {translate (staticData)
                         ("sheets.combatsheet.rangedcombatweapons.labels.rangebrackets")}
            </th>
            <th className="bf">
              {translate (staticData)
                         ("sheets.combatsheet.rangedcombatweapons.labels.breakingpointrating")}
            </th>
            <th className="loss">
              {translate (staticData) ("sheets.combatsheet.rangedcombatweapons.labels.damaged")}
            </th>
            <th className="ranged">
              {translate (staticData)
                         ("sheets.combatsheet.rangedcombatweapons.labels.rangedcombat")}
            </th>
            <th className="weight">
              {translate (staticData) ("sheets.combatsheet.rangedcombatweapons.labels.weight")}
            </th>
          </tr>
        </thead>
        <tbody>
          {
            toNewMaybe (mranged_weapons)
              .maybe<React.ReactNode> (null, xs =>
                xs.map (e => (
                  <tr key={RWA.id (e)}>
                    <td className="name">
                      <Textfit max={11} min={7} mode="single">{RWA.name (e)}</Textfit>
                    </td>
                    <td className="combat-technique">{RWA.combatTechnique (e)}</td>
                    <td className="reload-time">
                      {pipe_ (
                        e,
                        RWA.reloadTime,
                        renderMaybeWith (x => typeof x === "object"
                                              ? intercalate ("/") (x)
                                              : show (x))
                      )}
                      {" "}
                      {translate (staticData) ("sheets.combatsheet.actions")}
                    </td>
                    <td className="damage">
                      {getDamageStr (staticData)
                                    (RWA.damageFlat (e))
                                    (RWA.damageDiceNumber (e))
                                    (RWA.damageDiceSides (e))}
                    </td>
                    <td className="ammunition">
                      {renderMaybe (RWA.ammunition (e))}
                    </td>
                    <td className="range">
                      {toNewMaybe (RWA.range (e)).maybe ("", ({ close, medium, far }) => `${close}/${medium}/${far}`)}
                    </td>
                    <td className="bf">{RWA.bf (e)}</td>
                    <td className="loss">
                      {renderMaybeWith (toRoman) (RWA.loss (e))}
                    </td>
                    <td className="ranged">{RWA.at (e)}</td>
                    <td className="weight">
                      {translateP (staticData)
                                  ("general.weightvalue")
                                  (List (
                                    pipe_ (
                                      e,
                                      RWA.weight,
                                      localizeWeight (staticData),
                                      localizeNumber (staticData)
                                    )
                                  ))}
                    </td>
                  </tr>
                )))
          }
          {replicateR (2 - Maybe.sum (fmapF (mranged_weapons) (xs => xs.length)))
                      (i => (
                        <tr key={`undefined-${i}`}>
                          <td className="name" />
                          <td className="combat-technique" />
                          <td className="reload-time" />
                          <td className="damage" />
                          <td className="ammunition" />
                          <td className="range" />
                          <td className="bf" />
                          <td className="loss" />
                          <td className="ranged" />
                          <td className="weight" />
                        </tr>
                      ))}
        </tbody>
      </table>
    </TextBox>
  )
}
