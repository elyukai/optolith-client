import * as React from "react"
import { Textfit } from "react-textfit"
import { fmap, fmapF } from "../../../../Data/Functor"
import { flength, fnull, intercalate, List, map, replicateR, subscriptF, toArray } from "../../../../Data/List"
import { bindF, fromMaybe, Just, Maybe } from "../../../../Data/Maybe"
import { lookupF } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { bimap, fst, isTuple, snd } from "../../../../Data/Tuple"
import { NumIdName } from "../../../Models/NumIdName"
import { MeleeWeapon } from "../../../Models/View/MeleeWeapon"
import { StaticData, StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { mdash, ndash } from "../../../Utilities/Chars"
import { localizeNumber, localizeWeight, translate, translateP } from "../../../Utilities/I18n"
import { getDamageStr } from "../../../Utilities/ItemUtils"
import { sign, toRoman } from "../../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { renderMaybe, renderMaybeWith } from "../../../Utilities/ReactUtils"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  staticData: StaticDataRecord
  meleeWeapons: Maybe<List<Record<MeleeWeapon>>>
}

const SDA = StaticData.A
const MWA = MeleeWeapon.A

export const CombatSheetMeleeWeapons: React.FC<Props> = props => {
  const { staticData, meleeWeapons: mmelee_weapons } = props

  return (
    <TextBox
      label={translate (staticData) ("sheets.combatsheet.closecombatweapons")}
      className="melee-weapons"
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (staticData) ("sheets.combatsheet.closecombatweapons.labels.weapon")}
            </th>
            <th className="combat-technique">
              {translate (staticData)
                         ("sheets.combatsheet.closecombatweapons.labels.combattechnique")}
            </th>
            <th className="damage-bonus">
              {translate (staticData) ("sheets.combatsheet.closecombatweapons.labels.damagebonus")}
            </th>
            <th className="damage">
              {translate (staticData) ("sheets.combatsheet.closecombatweapons.labels.damagepoints")}
            </th>
            <th className="mod" colSpan={2}>
              {translate (staticData)
                         ("sheets.combatsheet.closecombatweapons.labels.attackparrymodifier")}
            </th>
            <th className="reach">
              {translate (staticData) ("sheets.combatsheet.closecombatweapons.labels.reach")}
            </th>
            <th className="bf">
              {translate (staticData)
                         ("sheets.combatsheet.closecombatweapons.labels.breakingpointrating")}
            </th>
            <th className="loss">
              {translate (staticData) ("sheets.combatsheet.closecombatweapons.labels.damaged")}
            </th>
            <th className="at">
              {translate (staticData) ("sheets.combatsheet.closecombatweapons.labels.attack")}
            </th>
            <th className="pa">
              {translate (staticData) ("sheets.combatsheet.closecombatweapons.labels.parry")}
            </th>
            <th className="weight">
              {translate (staticData) ("sheets.combatsheet.closecombatweapons.labels.weight")}
            </th>
          </tr>
        </thead>
        <tbody>
          {pipe_ (
            mmelee_weapons,
            fmap (pipe (
              map (e => {
                const primaryBonus = MWA.primaryBonus (e)

                const getPrimaryAtIndex =
                  (i: number) => pipe (MWA.primary, subscriptF (i), renderMaybe)

                return (
                  <tr key={MWA.id (e)}>
                    <td className="name">
                      <Textfit max={11} min={7} mode="single">{MWA.name (e)}</Textfit>
                    </td>
                    <td className="combat-technique">{MWA.combatTechnique (e)}</td>
                    <td className="damage-bonus">
                      {fnull (MWA.primary (e))
                        ? mdash
                        : isTuple (primaryBonus)
                        ? pipe_ (
                            primaryBonus,
                            bimap (first => `${getPrimaryAtIndex (0) (e)} ${first}`)
                                  (second => `${getPrimaryAtIndex (1) (e)} ${second}`),
                            p => `${fst (p)}/${snd (p)}`
                          )
                        : `${intercalate ("/") (MWA.primary (e))} ${primaryBonus}`}
                    </td>
                    <td className="damage">
                      {getDamageStr (staticData)
                                    (Just (MWA.damageFlat (e)))
                                    (MWA.damageDiceNumber (e))
                                    (MWA.damageDiceSides (e))}
                    </td>
                    <td className="at-mod mod">
                      {sign (Maybe.sum (MWA.atMod (e)))}
                    </td>
                    <td className="pa-mod mod">
                      {sign (Maybe.sum (MWA.paMod (e)))}
                    </td>
                    <td className="reach">
                      {pipe_ (
                        e,
                        MWA.reach,
                        bindF (lookupF (SDA.reaches (staticData))),
                        renderMaybeWith (NumIdName.A.name)
                      )}
                    </td>
                    <td className="bf">{MWA.bf (e)}</td>
                    <td className="loss">
                      {renderMaybeWith (toRoman) (MWA.loss (e))}
                    </td>
                    <td className="at">{MWA.at (e)}</td>
                    <td className="pa">
                      {fromMaybe<string | number> (ndash) (MWA.pa (e))}
                    </td>
                    <td className="weight">
                      {translateP (staticData)
                                  ("general.weightvalue")
                                  (List (
                                    pipe_ (
                                      e,
                                      MWA.weight,
                                      localizeWeight (staticData),
                                      localizeNumber (staticData)
                                    )
                                  ))}
                    </td>
                  </tr>
                )
              }),
              toArray
            )),
            fromMaybe (null as React.ReactNode)
          )}
          {replicateR (2 - Maybe.sum (fmapF (mmelee_weapons) (flength)))
                      (i => (
                        <tr key={`undefined-${i}`}>
                          <td className="name" />
                          <td className="combat-technique" />
                          <td className="damage-bonus" />
                          <td className="damage" />
                          <td className="at-mod mod" />
                          <td className="pa-mod mod" />
                          <td className="reach" />
                          <td className="bf" />
                          <td className="loss" />
                          <td className="at" />
                          <td className="pa" />
                          <td className="weight" />
                        </tr>
                      ))}
        </tbody>
      </table>
    </TextBox>
  )
}
