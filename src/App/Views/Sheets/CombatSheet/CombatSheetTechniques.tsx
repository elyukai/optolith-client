import * as React from "react";
import { equals } from "../../../../Data/Eq";
import { fmap } from "../../../../Data/Functor";
import { find, intercalate, List, map, toArray } from "../../../../Data/List";
import { fromMaybeR, mapMaybe, Maybe } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { AttributeCombined, AttributeCombinedA_ } from "../../../Models/View/AttributeCombined";
import { CombatTechniqueWithAttackParryBase, CombatTechniqueWithAttackParryBaseA_ } from "../../../Models/View/CombatTechniqueWithAttackParryBase";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { getICName } from "../../../Utilities/AdventurePoints/improvementCostUtils";
import { translate } from "../../../Utilities/I18n";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { renderMaybe } from "../../../Utilities/ReactUtils";
import { TextBox } from "../../Universal/TextBox";

export interface CombatSheetTechniquesProps {
  attributes: Maybe<List<Record<AttributeCombined>>>
  combatTechniques: Maybe<List<Record<CombatTechniqueWithAttackParryBase>>>
  l10n: L10nRecord
}

const CTWAPBA = CombatTechniqueWithAttackParryBase.A
const CTWAPBA_ = CombatTechniqueWithAttackParryBaseA_

export function CombatSheetTechniques (props: CombatSheetTechniquesProps) {
  const { attributes: mattributes, combatTechniques: mcombat_techniques, l10n } = props

  return (
    <TextBox
      className="combat-techniques"
      label={translate (l10n) ("combattechniques")}
      >
      <table>
        <thead>
          <tr>
            <th className="name">
              {translate (l10n) ("combattechnique")}
            </th>
            <th className="primary">
              {translate (l10n) ("primaryattribute")}
            </th>
            <th className="ic">
              {translate (l10n) ("improvementcost.short")}
            </th>
            <th className="value">
              {translate (l10n) ("combattechniquerating.short")}
            </th>
            <th className="at">
              {translate (l10n) ("attackrangecombat.short")}
            </th>
            <th className="pa">
              {translate (l10n) ("parry.short")}
            </th>
          </tr>
        </thead>
        <tbody>
          {pipe_ (
            mcombat_techniques,
            fmap (pipe (
              map (e => (
                <tr key={CTWAPBA_.id (e)}>
                  <td className="name">{CTWAPBA_.name (e)}</td>
                  <td className="primary">
                    {pipe_ (
                      mattributes,
                      fmap (attributes => pipe_ (
                                           e,
                                           CTWAPBA_.primary,
                                           mapMaybe (pipe (
                                             id => find (pipe (AttributeCombinedA_.id, equals (id)))
                                                        (attributes),
                                             fmap (AttributeCombinedA_.short)
                                           )),
                                           intercalate ("/")
                                         )),
                      renderMaybe
                    )}
                  </td>
                  <td className="ic">{getICName (CTWAPBA_.ic (e))}</td>
                  <td className="value">{CTWAPBA_.value (e)}</td>
                  <td className="at">{CTWAPBA.at (e)}</td>
                  <td className="pa">
                    {Maybe.fromMaybe<string | number> ("-") (CTWAPBA.pa (e))}
                  </td>
                </tr>
              )),
              toArray
            )),
            fromMaybeR (null)
          )}
        </tbody>
      </table>
    </TextBox>
  )
}
