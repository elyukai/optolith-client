import * as React from "react"
import { Textfit } from "react-textfit"
import { notEquals } from "../../../../Data/Eq"
import { fmap, fmapF } from "../../../../Data/Functor"
import { intercalate, List, notNull, replicateR } from "../../../../Data/List"
import { catMaybes, ensure, Maybe, maybe, maybeRNull } from "../../../../Data/Maybe"
import { lookup } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Armor } from "../../../Models/View/Armor"
import { DerivedCharacteristic } from "../../../Models/Wiki/DerivedCharacteristic"
import { StaticData, StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { ndash } from "../../../Utilities/Chars"
import { localizeNumber, localizeWeight, translate, translateP } from "../../../Utilities/I18n"
import { sign, toRoman } from "../../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { renderMaybe, renderMaybeWith } from "../../../Utilities/ReactUtils"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  armors: Maybe<Record<Armor>[]>
  staticData: StaticDataRecord
}

const SDA = StaticData.A
const AA = Armor.A

export const CombatSheetArmor: React.FC<Props> = props => {
  const { staticData, armors: marmors } = props

  const movement_tag = pipe_ (
                         staticData,
                         SDA.derivedCharacteristics,
                         lookup ("MOV"),
                         maybe ("") (DerivedCharacteristic.A.name)
                       )

  const initiative_tag = pipe_ (
                         staticData,
                         SDA.derivedCharacteristics,
                         lookup ("INI"),
                         maybe ("") (DerivedCharacteristic.A.name)
                       )

  return (
    <TextBox
      label={translate (staticData) ("sheets.combatsheet.armors.title")}
      className="armor"
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (staticData) ("sheets.combatsheet.armors.labels.armor")}
            </th>
            <th className="st">
              {translate (staticData) ("sheets.combatsheet.armors.labels.sturdinessrating")}
            </th>
            <th className="loss">
              {translate (staticData) ("sheets.combatsheet.armors.labels.wear")}
            </th>
            <th className="pro">
              {translate (staticData) ("sheets.combatsheet.armors.labels.protection")}
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
            <th className="where">
              {translate (staticData) ("sheets.combatsheet.armors.labels.carriedwhereexamples")}
            </th>
          </tr>
        </thead>
        <tbody>
          {maybeRNull ((xs: Record<Armor>[]) => xs.map (e => {
                        const addPenalties =
                          catMaybes (List (
                                      fmapF (ensure (notEquals (0)) (AA.mov (e)))
                                            (mov => `${sign (mov)} ${movement_tag}`),
                                      fmapF (ensure (notEquals (0)) (AA.ini (e)))
                                            (ini => `${sign (ini)} ${initiative_tag}`)
                                    ))

                        return (
                          <tr key={AA.id (e)}>
                            <td className="name">
                              <Textfit max={11} min={7} mode="single">{AA.name (e)}</Textfit>
                            </td>
                            <td className="st">{Maybe.sum (AA.st (e))}</td>
                            <td className="loss">{renderMaybeWith (toRoman) (AA.loss (e))}</td>
                            <td className="pro">{Maybe.sum (AA.pro (e))}</td>
                            <td className="enc">{Maybe.sum (AA.enc (e))}</td>
                            <td className="add-penalties">
                              {maybe (ndash)
                                     (intercalate (", "))
                                     (ensure (notNull) (addPenalties))}
                            </td>
                            <td className="weight">
                              {translateP (staticData)
                                          ("general.weightvalue")
                                          (List (
                                            pipe_ (
                                              e,
                                              AA.weight,
                                              fmap (pipe (
                                                localizeWeight (staticData),
                                                localizeNumber (staticData)
                                              )),
                                              renderMaybe
                                            )
                                          ))}
                            </td>
                            <td className="where">
                              <Textfit max={11} min={7} mode="single">
                                {renderMaybe (AA.where (e))}
                              </Textfit>
                            </td>
                          </tr>
                        )
                      }))
                      (marmors)}
          {replicateR (2 - Maybe.sum (fmapF (marmors) (xs => xs.length)))
                      (i => (
                        <tr key={`undefined-${i}`}>
                          <td className="name" />
                          <td className="st" />
                          <td className="loss" />
                          <td className="pro" />
                          <td className="enc" />
                          <td className="add-penalties" />
                          <td className="weight" />
                          <td className="where" />
                        </tr>
                      ))}
        </tbody>
      </table>
    </TextBox>
  )
}
