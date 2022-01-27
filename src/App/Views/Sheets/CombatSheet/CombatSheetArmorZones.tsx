import * as React from "react"
import { Textfit } from "react-textfit"
import { List, replicateR } from "../../../../Data/List"
import { Maybe } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { HitZoneArmorForView } from "../../../Models/View/HitZoneArmorForView"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { minus, ndash } from "../../../Utilities/Chars"
import { localizeNumber, localizeWeight, translate, translateP } from "../../../Utilities/I18n"
import { Maybe as NewMaybe } from "../../../Utilities/Maybe"
import { pipe_ } from "../../../Utilities/pipe"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  armorZones: NewMaybe<Record<HitZoneArmorForView>[]>
  staticData: StaticDataRecord
}

const HZAFVA = HitZoneArmorForView.A

export const CombatSheetArmorZones: React.FC<Props> = props => {
  const { staticData, armorZones: mhit_zone_armors } = props

  return (
    <TextBox
      label={translate (staticData) ("sheets.combatsheet.armors.title")}
      className="armor armor-zones"
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (staticData) ("sheets.combatsheet.armors.title")}
            </th>
            <th className="zone">
              {translate (staticData) ("sheets.combatsheet.armors.labels.head")}
            </th>
            <th className="zone">
              {translate (staticData) ("sheets.combatsheet.armors.labels.torso")}
            </th>
            <th className="zone">
              {translate (staticData) ("sheets.combatsheet.armors.labels.leftarm")}
            </th>
            <th className="zone">
              {translate (staticData) ("sheets.combatsheet.armors.labels.rightarm")}
            </th>
            <th className="zone">
              {translate (staticData) ("sheets.combatsheet.armors.labels.leftleg")}
            </th>
            <th className="zone">
              {translate (staticData) ("sheets.combatsheet.armors.labels.rightleg")}
            </th>
            <th className="enc">
              {translate (staticData) ("sheets.combatsheet.armors.labels.encumbrance")}
            </th>
            <th className="add-penalties">
              {translate (staticData) ("sheets.combatsheet.armors.labels.movementinitiative")}
            </th>
            <th className="weight">
              {translate (staticData) ("sheets.combatsheet.armors.labels.weight")}
            </th>
          </tr>
        </thead>
        <tbody>
          {
            mhit_zone_armors
              .maybe<React.ReactNode> (null, xs =>
                xs.map (e => (
                  <tr key={HZAFVA.id (e)}>
                    <td className="name">
                      <Textfit max={11} min={7} mode="single">{HZAFVA.name (e)}</Textfit>
                    </td>
                    <td className="zone">{Maybe.sum (HZAFVA.head (e))}</td>
                    <td className="zone">{Maybe.sum (HZAFVA.torso (e))}</td>
                    <td className="zone">{Maybe.sum (HZAFVA.leftArm (e))}</td>
                    <td className="zone">{Maybe.sum (HZAFVA.rightArm (e))}</td>
                    <td className="zone">{Maybe.sum (HZAFVA.leftLeg (e))}</td>
                    <td className="zone">{Maybe.sum (HZAFVA.rightLeg (e))}</td>
                    <td className="enc">{HZAFVA.enc (e)}</td>
                    <td className="add-penalties">
                      {HZAFVA.addPenalties (e) ? `${minus}1/${minus}1` : ndash}
                    </td>
                    <td className="weight">
                      {translateP (staticData)
                                  ("general.weightvalue")
                                  (List (
                                    pipe_ (
                                      e,
                                      HZAFVA.weight,
                                      localizeWeight (staticData),
                                      localizeNumber (staticData)
                                    )
                                  ))}
                    </td>
                  </tr>
                )))
          }
          {replicateR (2 - mhit_zone_armors.map (xs => xs.length).sum ())
                      (i => (
                        <tr key={`undefined-${i}`}>
                          <td className="name" />
                          <td className="zone" />
                          <td className="zone" />
                          <td className="zone" />
                          <td className="zone" />
                          <td className="zone" />
                          <td className="zone" />
                          <td className="enc" />
                          <td className="add-penalties" />
                          <td className="weight" />
                        </tr>
                      ))}
        </tbody>
      </table>
    </TextBox>
  )
}
