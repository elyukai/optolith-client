import * as React from "react";
import { List } from "../../../Data/List";
import { fromMaybe, Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translateP } from "../../Utilities/I18n";

export interface AdvantagesDisadvantagesAdventurePointsProps {
  ap: Record<AdventurePointsCategories>
  magicalMax: Maybe<number>
  l10n: L10nRecord
}

const APCA = AdventurePointsCategories.A

export function AdvantagesDisadvantagesAdventurePoints (
  props: AdvantagesDisadvantagesAdventurePointsProps
) {
  const {
    ap,
    magicalMax,
    l10n,
  } = props

  const adv_total = APCA.spentOnAdvantages (ap)
  const adv_blessed = APCA.spentOnBlessedAdvantages (ap)
  const adv_magical = APCA.spentOnMagicalAdvantages (ap)
  const dis_total = APCA.spentOnDisadvantages (ap)
  const dis_blessed = APCA.spentOnBlessedDisadvantages (ap)
  const dis_magical = APCA.spentOnMagicalDisadvantages (ap)

  return (
    <>
      <p>
        {translateP (l10n)
                    ("apspentonadvantages")
                    (List (adv_total, 80))}<br/>
        {
          adv_magical > 0
            ? translateP (l10n)
                         ("apspentonmagicadvantages")
                         (List (adv_magical, fromMaybe (50) (magicalMax)))
            : null
        }
        {adv_magical > 0 && adv_blessed > 0 ? <br/> : null}
        {
          adv_blessed > 0
            ? translateP (l10n)
                         ("apspentonblessedadvantages")
                         (List (adv_blessed, 50))
            : null
        }
      </p>
      <p>
        {translateP (l10n)
                    ("apspentondisadvantages")
                    (List (dis_total, 80))}<br/>
        {
          dis_magical > 0
            ? translateP (l10n)
                         ("apspentonmagicdisadvantages")
                         (List (dis_magical, fromMaybe (50) (magicalMax)))
            : null
        }
        {dis_magical > 0 && dis_blessed > 0 ? <br/> : null}
        {
          dis_blessed > 0
            ? translateP (l10n)
                         ("apspentonblesseddisadvantages")
                         (List (dis_blessed, 50))
            : null
        }
      </p>
    </>
  )
}
