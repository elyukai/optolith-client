import * as React from "react"
import { Textfit } from "react-textfit"
import { ident } from "../../../../Data/Function"
import { fmap, fmapF } from "../../../../Data/Functor"
import { consF, elem, flength, intercalate, List, map, replicateR, toArray } from "../../../../Data/List"
import { fromMaybe, mapMaybe, Maybe, maybe } from "../../../../Data/Maybe"
import { lookup } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { BlessedTradition as BlessedTraditionId } from "../../../Constants/Groups"
import { SpecialAbilityId } from "../../../Constants/Ids"
import { NumIdName } from "../../../Models/NumIdName"
import { AttributeCombined } from "../../../Models/View/AttributeCombined"
import { LiturgicalChantWithRequirements, LiturgicalChantWithRequirementsA_ } from "../../../Models/View/LiturgicalChantWithRequirements"
import { BlessedTradition } from "../../../Models/Wiki/BlessedTradition"
import { StaticData, StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { getICName } from "../../../Utilities/AdventurePoints/improvementCostUtils"
import { minus } from "../../../Utilities/Chars"
import { translate } from "../../../Utilities/I18n"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { getAttributeStringByIdList } from "../../../Utilities/sheetUtils"
import { sortStrings } from "../../../Utilities/sortBy"
import { getCheckModStr } from "../../InlineWiki/Elements/WikiSkillCheck"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  attributes: List<Record<AttributeCombined>>
  checkAttributeValueVisibility: boolean
  liturgicalChants: Maybe<List<Record<LiturgicalChantWithRequirements>>>
  staticData: StaticDataRecord
}

const SDA = StaticData.A
const BTA = BlessedTradition.A
const NINA = NumIdName.A
const LCWRA_ = LiturgicalChantWithRequirementsA_

export const LiturgicalChantsSheetLiturgicalChants: React.FC<Props> = props => {
  const {
    attributes,
    checkAttributeValueVisibility,
    staticData,
    liturgicalChants: maybeLiturgicalChants,
  } = props

  const getAspect = (id: number) => pipe_ (staticData, SDA.aspects, lookup (id), fmap (NINA.name))

  return (
    <TextBox
      label={translate (staticData) ("sheets.chantssheet.chantstable.title")}
      className="skill-list"
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (staticData) ("sheets.chantssheet.chantstable.labels.chant")}
            </th>
            <th className="check">
              {translate (staticData) ("sheets.chantssheet.chantstable.labels.check")}
            </th>
            <th className="value">
              {translate (staticData) ("sheets.chantssheet.chantstable.labels.skillrating")}
            </th>
            <th className="cost">
              {translate (staticData) ("sheets.chantssheet.chantstable.labels.cost")}
            </th>
            <th className="cast-time">
              {translate (staticData) ("sheets.chantssheet.chantstable.labels.castingtime")}
            </th>
            <th className="range">
              {translate (staticData) ("sheets.chantssheet.chantstable.labels.range")}
            </th>
            <th className="duration">
              {translate (staticData) ("sheets.chantssheet.chantstable.labels.duration")}
            </th>
            <th className="aspect">
              {translate (staticData) ("sheets.chantssheet.chantstable.labels.aspect")}
            </th>
            <th className="ic">
              {translate (staticData) ("sheets.chantssheet.chantstable.labels.improvementcost")}
            </th>
            <th className="effect">
              {translate (staticData) ("sheets.chantssheet.chantstable.labels.effect")}
            </th>
            <th className="ref">
              {translate (staticData) ("sheets.chantssheet.chantstable.labels.pages")}
            </th>
          </tr>
        </thead>
        <tbody>
          {pipe_ (
            maybeLiturgicalChants,
            fmap (pipe (
              map (e => {
                const check =
                  getAttributeStringByIdList (checkAttributeValueVisibility)
                                             (attributes)
                                             (LCWRA_.check (e))


                return (
                  <tr key={LCWRA_.id (e)}>
                    <td className="name">
                      <Textfit max={11} min={7} mode="single">
                        {fromMaybe (LCWRA_.name (e)) (LCWRA_.nameShort (e))}
                      </Textfit>
                    </td>
                    <td className="check">
                      <Textfit max={11} min={7} mode="single">
                        {check}
                        {pipe_ (
                          e,
                          LCWRA_.checkmod,
                          maybe ("")
                                (pipe (getCheckModStr (staticData), str => ` (${minus}${str})`))
                        )}
                      </Textfit>
                    </td>
                    <td className="value">{LCWRA_.value (e)}</td>
                    <td className="cost">
                      <Textfit max={11} min={7} mode="single">{LCWRA_.costShort (e)}</Textfit>
                    </td>
                    <td className="cast-time">
                      <Textfit max={11} min={7} mode="single">
                        {LCWRA_.castingTimeShort (e)}
                      </Textfit>
                    </td>
                    <td className="range">
                      <Textfit max={11} min={7} mode="single">{LCWRA_.rangeShort (e)}</Textfit>
                    </td>
                    <td className="duration">
                      <Textfit max={11} min={7} mode="single">{LCWRA_.durationShort (e)}</Textfit>
                    </td>
                    <td className="aspect">
                      <Textfit max={11} min={7} mode="single">
                        {pipe_ (
                          e,
                          LCWRA_.aspects,
                          mapMaybe (getAspect),
                          elem (BlessedTraditionId.CultOfTheNamelessOne) (LCWRA_.tradition (e))
                            ? maybe (ident as ident<List<string>>)
                                    (pipe (BTA.name, consF))
                                    (lookup<string> (SpecialAbilityId.TraditionCultOfTheNamelessOne)
                                                    (SDA.blessedTraditions (staticData)))
                            : ident,
                          sortStrings (staticData),
                          intercalate (", ")
                        )}
                      </Textfit>
                    </td>
                    <td className="ic">{getICName (LCWRA_.ic (e))}</td>
                    <td className="effect" />
                    <td className="ref" />
                  </tr>
                )
              }),
              toArray
            )),
            fromMaybe (null as React.ReactNode)
          )}
          {replicateR (21 - Maybe.sum (fmapF (maybeLiturgicalChants) (flength)))
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
