import * as React from "react";
import { Textfit } from "react-textfit";
import { equals } from "../../../../Data/Eq";
import { fmap, fmapF } from "../../../../Data/Functor";
import { find, flength, intercalate, List, map, notNull, replicateR, subscript, toArray } from "../../../../Data/List";
import { ensure, fromMaybeR, guardReplace, Just, mapMaybe, Maybe } from "../../../../Data/Maybe";
import { elems } from "../../../../Data/OrderedSet";
import { Record } from "../../../../Data/Record";
import { AttributeCombined } from "../../../Models/View/AttributeCombined";
import { DerivedCharacteristic } from "../../../Models/View/DerivedCharacteristic";
import { SpellCombined, SpellCombinedA_ } from "../../../Models/View/SpellCombined";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { DCIds } from "../../../Selectors/derivedCharacteristicsSelectors";
import { getICName } from "../../../Utilities/AdventurePoints/improvementCostUtils";
import { classListMaybe } from "../../../Utilities/CSS";
import { translate } from "../../../Utilities/I18n";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { renderMaybe, renderMaybeWith } from "../../../Utilities/ReactUtils";
import { getAttributeStringByIdList } from "../../../Utilities/sheetUtils";
import { TextBox } from "../../Universal/TextBox";

export interface SpellsSheetSpellsProps {
  attributes: List<Record<AttributeCombined>>
  checkAttributeValueVisibility: boolean
  derivedCharacteristics: List<Record<DerivedCharacteristic>>
  l10n: L10nRecord
  spells: Maybe<List<Record<SpellCombined>>>
}

const SCA_ = SpellCombinedA_
const DCA = DerivedCharacteristic.A

export function SpellsSheetSpells (props: SpellsSheetSpellsProps) {
  const {
    attributes,
    checkAttributeValueVisibility,
    derivedCharacteristics,
    l10n,
    spells: maybeSpells,
  } = props

  const propertyNames = translate (l10n) ("propertylist")

  return (
    <TextBox
      label={translate (l10n) ("spells")}
      className="skill-list"
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (l10n) ("spellorritual")}
            </th>
            <th className="check">
              {translate (l10n) ("check")}
            </th>
            <th className="value">
              {translate (l10n) ("skillrating.short")}
            </th>
            <th className="cost">
              {translate (l10n) ("cost")}
            </th>
            <th className="cast-time">
              {translate (l10n) ("castingtime")}
            </th>
            <th className="range">
              {translate (l10n) ("range")}
            </th>
            <th className="duration">
              {translate (l10n) ("duration")}
            </th>
            <th className="property">
              {translate (l10n) ("property")}
            </th>
            <th className="ic">
              {translate (l10n) ("improvementcost.short")}
            </th>
            <th className="effect">
              {translate (l10n) ("effect")}
            </th>
            <th className="ref">
              {translate (l10n) ("page.short")}
            </th>
          </tr>
        </thead>
        <tbody>
          {pipe_ (
            maybeSpells,
            fmap (pipe (
              map (e => {
                const check =
                  getAttributeStringByIdList (checkAttributeValueVisibility)
                                             (attributes)
                                             (SCA_.check (e))


                return (
                  <tr key={SCA_.id (e)}>
                    <td
                      className={
                        classListMaybe (List (
                          Just ("name"),
                          guardReplace (notNull (SCA_.tradition (e))) ("unfamiliar")
                        ))
                      }
                      >
                      <Textfit max={11} min={7} mode="single">
                        {SCA_.name (e)}
                        {notNull (SCA_.tradition (e))
                          ? ` (${translate (l10n) ("unfamiliarspell")})`
                          : ""}
                      </Textfit>
                    </td>
                    <td className="check">
                      <Textfit max={11} min={7} mode="single">
                        {check}
                        {pipe_ (
                          e,
                          SCA_.checkmod,
                          elems,
                          ensure (notNull),
                          renderMaybeWith (pipe (
                            mapMaybe (id => fmapF (find (pipe (
                                                          DCA.id,
                                                          equals<DCIds> (id)
                                                        ))
                                                        (derivedCharacteristics))
                                                  (DCA.short)),
                            intercalate ("/"),
                            str => ` (+${str})`
                          ))
                        )}
                      </Textfit>
                    </td>
                    <td className="value">{SCA_.value (e)}</td>
                    <td className="cost">
                      <Textfit max={11} min={7} mode="single">{SCA_.costShort (e)}</Textfit>
                    </td>
                    <td className="cast-time">
                      <Textfit max={11} min={7} mode="single">
                        {SCA_.castingTimeShort (e)}
                      </Textfit>
                    </td>
                    <td className="range">
                      <Textfit max={11} min={7} mode="single">{SCA_.rangeShort (e)}</Textfit>
                    </td>
                    <td className="duration">
                      <Textfit max={11} min={7} mode="single">{SCA_.durationShort (e)}</Textfit>
                    </td>
                    <td className="property">
                      <Textfit max={11} min={7} mode="single">
                        {renderMaybe (subscript (propertyNames) (SCA_.property (e) - 1))}
                      </Textfit>
                    </td>
                    <td className="ic">{getICName (SCA_.ic (e))}</td>
                    <td className="effect"></td>
                    <td className="ref"></td>
                  </tr>
                )
              }),
              toArray
            )),
            fromMaybeR (null)
          )}
          {replicateR (21 - Maybe.sum (fmapF (maybeSpells) (flength)))
                      (i => (
                        <tr key={`undefined-${i}`}>
                          <td className="name"></td>
                          <td className="check"></td>
                          <td className="value"></td>
                          <td className="cost"></td>
                          <td className="cast-time"></td>
                          <td className="range"></td>
                          <td className="duration"></td>
                          <td className="aspect"></td>
                          <td className="ic"></td>
                          <td className="effect"></td>
                          <td className="ref"></td>
                        </tr>
                      ))}
        </tbody>
      </table>
    </TextBox>
  )
}
