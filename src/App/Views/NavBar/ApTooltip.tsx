import * as React from "react"
import { List } from "../../../Data/List"
import { Maybe, maybeRNull } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate, translateP } from "../../Utilities/I18n"

interface Props {
  staticData: StaticDataRecord
  adventurePoints: Record<AdventurePointsCategories>
  maximumForMagicalAdvantagesDisadvantages: Maybe<number>
  isSpellcaster: boolean
  isBlessedOne: boolean
}

const APCA = AdventurePointsCategories.A

export const ApTooltip: React.FC<Props> = props => {
  const {
    staticData,
    adventurePoints: ap,
    maximumForMagicalAdvantagesDisadvantages,
    isSpellcaster,
    isBlessedOne,
  } = props

  return (
    <div className="ap-details">
      <h4>{translate (staticData) ("header.aptooltip.title")}</h4>
      <p className="general">
        <span>{translateP (staticData) ("header.aptooltip.total") (List (APCA.total (ap)))}</span>
        <span>{translateP (staticData) ("header.aptooltip.spent") (List (APCA.spent (ap)))}</span>
      </p>
      <hr />
      <p>
        <span>
          {translateP (staticData)
                      ("header.aptooltip.spentonadvantages")
                      (List (APCA.spentOnAdvantages (ap), 80))}
        </span>
        <span>
          {APCA.spentOnMagicalAdvantages (ap) > 0
            ? translateP (staticData)
                         ("header.aptooltip.spentonmagicadvantages")
                         (List (
                           APCA.spentOnMagicalAdvantages (ap),
                           Maybe.sum (maximumForMagicalAdvantagesDisadvantages)
                         ))
            : null}
        </span>
        <span>
          {APCA.spentOnBlessedAdvantages (ap) > 0
            ? translateP (staticData)
                         ("header.aptooltip.spentonblessedadvantages")
                         (List (APCA.spentOnBlessedAdvantages (ap), 50))
            : null}
        </span>
        <span>
          {translateP (staticData)
                      ("header.aptooltip.spentondisadvantages")
                      (List (APCA.spentOnDisadvantages (ap), 80))}
        </span>
        <span>
          {APCA.spentOnMagicalDisadvantages (ap) > 0
            ? translateP (staticData)
                         ("header.aptooltip.spentonmagicdisadvantages")
                         (List (
                           APCA.spentOnMagicalDisadvantages (ap),
                           Maybe.sum (maximumForMagicalAdvantagesDisadvantages)
                         ))
            : null}
        </span>
        <span>
          {APCA.spentOnBlessedDisadvantages (ap) > 0
            ? translateP (staticData)
                         ("header.aptooltip.spentonblesseddisadvantages")
                         (List (APCA.spentOnBlessedDisadvantages (ap), 50))
            : null}
        </span>
      </p>
      <hr />
      <p>
        <span>
          {translateP (staticData)
                      ("header.aptooltip.spentonrace")
                      (List (APCA.spentOnRace (ap), 80))}
        </span>
        {maybeRNull ((spentOnProfession: number) => (
                      <span>
                        {translateP (staticData)
                                    ("header.aptooltip.spentonprofession")
                                    (List (spentOnProfession, 80))}
                      </span>
                    ))
                    (APCA.spentOnProfession (ap))}
        <span>
          {translateP (staticData)
                      ("header.aptooltip.spentonattributes")
                      (List (APCA.spentOnAttributes (ap)))}
        </span>
        <span>
          {translateP (staticData)
                      ("header.aptooltip.spentonskills")
                      (List (APCA.spentOnSkills (ap)))}
        </span>
        <span>
          {translateP (staticData)
                      ("header.aptooltip.spentoncombattechniques")
                      (List (APCA.spentOnCombatTechniques (ap)))}
        </span>
        {isSpellcaster
          ? (
            <span>
              {translateP (staticData)
                          ("header.aptooltip.spentonspells")
                          (List (APCA.spentOnSpells (ap)))}
            </span>
          )
          : null}
        {isSpellcaster
          ? (
            <span>
              {translateP (staticData)
                          ("header.aptooltip.spentoncantrips")
                          (List (APCA.spentOnCantrips (ap)))}
            </span>
          )
          : null}
        {isBlessedOne
          ? (
            <span>
              {translateP (staticData)
                          ("header.aptooltip.spentonliturgicalchants")
                          (List (APCA.spentOnLiturgicalChants (ap)))}
            </span>
          )
          : null}
        {isBlessedOne
          ? (
            <span>
              {translateP (staticData)
                          ("header.aptooltip.spentonblessings")
                          (List (APCA.spentOnBlessings (ap)))}
            </span>
          )
          : null}
        <span>
          {translateP (staticData)
                      ("header.aptooltip.spentonspecialabilities")
                      (List (APCA.spentOnSpecialAbilities (ap)))}
        </span>
        <span>
          {translateP (staticData)
                      ("header.aptooltip.spentonenergies")
                      (List (APCA.spentOnEnergies (ap)))}
        </span>
      </p>
    </div>
  )
}
