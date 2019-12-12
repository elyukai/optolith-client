import * as React from "react";
import { List } from "../../../Data/List";
import { Maybe, maybeRNull } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate, translateP } from "../../Utilities/I18n";

export interface ApTooltipProps {
  l10n: L10nRecord
  adventurePoints: Record<AdventurePointsCategories>
  maximumForMagicalAdvantagesDisadvantages: Maybe<number>
  isSpellcaster: boolean
  isBlessedOne: boolean
}

const APCA = AdventurePointsCategories.A

export function ApTooltip (props: ApTooltipProps) {
  const {
    l10n,
    adventurePoints: ap,
    maximumForMagicalAdvantagesDisadvantages,
    isSpellcaster,
    isBlessedOne,
  } = props

  return (
    <div className="ap-details">
      <h4>{translate (l10n) ("adventurepoints")}</h4>
      <p className="general">
        <span>{translateP (l10n) ("totalap") (List (APCA.total (ap)))}</span>
        <span>{translateP (l10n) ("apspent") (List (APCA.spent (ap)))}</span>
      </p>
      <hr />
      <p>
        <span>
          {translateP (l10n)
                      ("apspentonadvantages")
                      (List (APCA.spentOnAdvantages (ap), 80))}
        </span>
        <span>
          {APCA.spentOnMagicalAdvantages (ap) > 0
            ? translateP (l10n)
                         ("apspentonmagicadvantages")
                         (List (
                           APCA.spentOnMagicalAdvantages (ap),
                           Maybe.sum (maximumForMagicalAdvantagesDisadvantages)
                         ))
            : null}
        </span>
        <span>
          {APCA.spentOnBlessedAdvantages (ap) > 0
            ? translateP (l10n)
                         ("apspentonblessedadvantages")
                         (List (APCA.spentOnBlessedAdvantages (ap), 50))
            : null}
        </span>
        <span>
          {translateP (l10n)
                      ("apspentondisadvantages")
                      (List (APCA.spentOnDisadvantages (ap), 80))}
        </span>
        <span>
          {APCA.spentOnMagicalDisadvantages (ap) > 0
            ? translateP (l10n)
                         ("apspentonmagicdisadvantages")
                         (List (
                           APCA.spentOnMagicalDisadvantages (ap),
                           Maybe.sum (maximumForMagicalAdvantagesDisadvantages)
                         ))
            : null}
        </span>
        <span>
          {APCA.spentOnBlessedDisadvantages (ap) > 0
            ? translateP (l10n)
                         ("apspentonblesseddisadvantages")
                         (List (APCA.spentOnBlessedDisadvantages (ap), 50))
            : null}
        </span>
      </p>
      <hr />
      <p>
        <span>
          {translateP (l10n) ("apspentonrace") (List (APCA.spentOnRace (ap), 80))}
        </span>
        {maybeRNull ((spentOnProfession: number) => (
                      <span>
                        {translateP (l10n) ("apspentonprofession") (List (spentOnProfession, 80))}
                      </span>
                    ))
                    (APCA.spentOnProfession (ap))}
        <span>
          {translateP (l10n)
                      ("apspentonattributes")
                      (List (APCA.spentOnAttributes (ap)))}
        </span>
        <span>
          {translateP (l10n)
                      ("apspentonskills")
                      (List (APCA.spentOnSkills (ap)))}
        </span>
        <span>
          {translateP (l10n)
                      ("apspentoncombattechniques")
                      (List (APCA.spentOnCombatTechniques (ap)))}
        </span>
        {isSpellcaster
          ? (
            <span>
              {translateP (l10n)
                          ("apspentonspells")
                          (List (APCA.spentOnSpells (ap)))}
            </span>
          )
          : null}
        {isSpellcaster
          ? (
            <span>
              {translateP (l10n)
                          ("apspentoncantrips")
                          (List (APCA.spentOnCantrips (ap)))}
            </span>
          )
          : null}
        {isBlessedOne
          ? (
            <span>
              {translateP (l10n)
                          ("apspentonliturgicalchants")
                          (List (APCA.spentOnLiturgicalChants (ap)))}
            </span>
          )
          : null}
        {isBlessedOne
          ? (
            <span>
              {translateP (l10n)
                          ("apspentonblessings")
                          (List (APCA.spentOnBlessings (ap)))}
            </span>
          )
          : null}
        <span>
          {translateP (l10n)
                      ("apspentonspecialabilities")
                      (List (APCA.spentOnSpecialAbilities (ap)))}
        </span>
        <span>
          {translateP (l10n)
                      ("apspentonenergies")
                      (List (APCA.spentOnEnergies (ap)))}
        </span>
      </p>
    </div>
  )
}
