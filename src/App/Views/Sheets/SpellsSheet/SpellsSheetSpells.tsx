import * as React from "react"
import { Textfit } from "react-textfit"
import { fmapF } from "../../../../Data/Functor"
import { flength, List, map, notNull, replicateR, toArray } from "../../../../Data/List"
import { guardReplace, Just, Maybe, maybe } from "../../../../Data/Maybe"
import { lookup } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { AttributeCombined } from "../../../Models/View/AttributeCombined"
import { SpellWithRequirements, SpellWithRequirementsA_ } from "../../../Models/View/SpellWithRequirements"
import { StaticData, StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { minus } from "../../../Utilities/Chars"
import { classListMaybe } from "../../../Utilities/CSS"
import { translate } from "../../../Utilities/I18n"
import { icToStr } from "../../../Utilities/ImprovementCost"
import { toNewMaybe } from "../../../Utilities/Maybe"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { renderMaybeWith } from "../../../Utilities/ReactUtils"
import { getAttributeStringByIdList } from "../../../Utilities/sheetUtils"
import { getCheckModStr } from "../../InlineWiki/Elements/WikiSkillCheck"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  attributes: List<Record<AttributeCombined>>
  checkAttributeValueVisibility: boolean
  staticData: StaticDataRecord
  spells: Maybe<List<Record<SpellWithRequirements>>>
}

const SWRA_ = SpellWithRequirementsA_

export const SpellsSheetSpells: React.FC<Props> = props => {
  const {
    attributes,
    checkAttributeValueVisibility,
    staticData,
    spells: maybeSpells,
  } = props

  return (
    <TextBox
      label={translate (staticData) ("sheets.spellssheet.spellstable.title")}
      className="skill-list"
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (staticData) ("sheets.spellssheet.spellstable.labels.spellorritual")}
            </th>
            <th className="check">
              {translate (staticData) ("sheets.spellssheet.spellstable.labels.check")}
            </th>
            <th className="value">
              {translate (staticData) ("sheets.spellssheet.spellstable.labels.skillrating")}
            </th>
            <th className="cost">
              {translate (staticData) ("sheets.spellssheet.spellstable.labels.cost")}
            </th>
            <th className="cast-time">
              {translate (staticData) ("sheets.spellssheet.spellstable.labels.castingtime")}
            </th>
            <th className="range">
              {translate (staticData) ("sheets.spellssheet.spellstable.labels.range")}
            </th>
            <th className="duration">
              {translate (staticData) ("sheets.spellssheet.spellstable.labels.duration")}
            </th>
            <th className="property">
              {translate (staticData) ("sheets.spellssheet.spellstable.labels.property")}
            </th>
            <th className="ic">
              {translate (staticData) ("sheets.spellssheet.spellstable.labels.improvementcost")}
            </th>
            <th className="effect">
              {translate (staticData) ("sheets.spellssheet.spellstable.labels.effect")}
            </th>
            <th className="ref">
              {translate (staticData) ("sheets.spellssheet.spellstable.labels.pages")}
            </th>
          </tr>
        </thead>
        <tbody>
          {toNewMaybe (maybeSpells)
            .maybe<React.ReactNode> (null, pipe (
              map (e => {
                const check =
                  getAttributeStringByIdList (checkAttributeValueVisibility)
                                             (attributes)
                                             (SWRA_.check (e))


                return (
                  <tr key={SWRA_.id (e)}>
                    <td
                      className={
                        classListMaybe (List (
                          Just ("name"),
                          guardReplace (notNull (SWRA_.tradition (e))) ("unfamiliar")
                        ))
                      }
                      >
                      <Textfit max={11} min={7} mode="single">
                        {SWRA_.name (e)}
                        {notNull (SWRA_.tradition (e))
                          ? ` (${translate (staticData)
                                           ("sheets.spellssheet.spellstable.unfamiliarspell")})`
                          : ""}
                      </Textfit>
                    </td>
                    <td className="check">
                      <Textfit max={11} min={7} mode="single">
                        {check}
                        {pipe_ (
                          e,
                          SWRA_.checkmod,
                          maybe ("")
                                (pipe (getCheckModStr (staticData), str => ` (${minus}${str})`))
                        )}
                      </Textfit>
                    </td>
                    <td className="value">{SWRA_.value (e)}</td>
                    <td className="cost">
                      <Textfit max={11} min={7} mode="single">{SWRA_.costShort (e)}</Textfit>
                    </td>
                    <td className="cast-time">
                      <Textfit max={11} min={7} mode="single">
                        {SWRA_.castingTimeShort (e)}
                      </Textfit>
                    </td>
                    <td className="range">
                      <Textfit max={11} min={7} mode="single">{SWRA_.rangeShort (e)}</Textfit>
                    </td>
                    <td className="duration">
                      <Textfit max={11} min={7} mode="single">{SWRA_.durationShort (e)}</Textfit>
                    </td>
                    <td className="property">
                      <Textfit max={11} min={7} mode="single">
                        {renderMaybeWith (NumIdName.A.name)
                                         (lookup (SWRA_.property (e))
                                                 (StaticData.A.properties (staticData)))}
                      </Textfit>
                    </td>
                    <td className="ic">{icToStr (SWRA_.ic (e))}</td>
                    <td className="effect" />
                    <td className="ref" />
                  </tr>
                )
              }),
              toArray
            ))}
          {replicateR (21 - Maybe.sum (fmapF (maybeSpells) (flength)))
                      (i => (
                        <tr key={`undefined-${i}`}>
                          <td className="name" />
                          <td className="check" />
                          <td className="value" />
                          <td className="cost" />
                          <td className="cast-time" />
                          <td className="range" />
                          <td className="duration" />
                          <td className="aspect" />
                          <td className="ic" />
                          <td className="effect" />
                          <td className="ref" />
                        </tr>
                      ))}
        </tbody>
      </table>
    </TextBox>
  )
}
