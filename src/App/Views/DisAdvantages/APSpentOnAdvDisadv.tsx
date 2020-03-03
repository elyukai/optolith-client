import * as React from "react"
import { List } from "../../../Data/List"
import { fromMaybe, Maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translateP } from "../../Utilities/I18n"

export interface APSpentOnAdvDisadvProps {
  ap: Record<AdventurePointsCategories>
  magicalMax: Maybe<number>
  staticData: StaticDataRecord
}

const APCA = AdventurePointsCategories.A

export const APSpentOnAdvDisadv: React.FC<APSpentOnAdvDisadvProps> = props => {
  const {
    ap,
    magicalMax,
    staticData,
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
        {translateP (staticData)
                    ("advantagesdisadvantages.apspent.spentonadvantages")
                    (List (adv_total, 80))}
        <br />
        {
          adv_magical > 0
            ? translateP (staticData)
                         ("advantagesdisadvantages.apspent.spentonmagicadvantages")
                         (List (adv_magical, fromMaybe (50) (magicalMax)))
            : null
        }
        {adv_magical > 0 && adv_blessed > 0 ? <br /> : null}
        {
          adv_blessed > 0
            ? translateP (staticData)
                         ("advantagesdisadvantages.apspent.spentonblessedadvantages")
                         (List (adv_blessed, 50))
            : null
        }
      </p>
      <p>
        {translateP (staticData)
                    ("advantagesdisadvantages.apspent.spentondisadvantages")
                    (List (dis_total, 80))}
        <br />
        {
          dis_magical > 0
            ? translateP (staticData)
                         ("advantagesdisadvantages.apspent.spentonmagicdisadvantages")
                         (List (dis_magical, fromMaybe (50) (magicalMax)))
            : null
        }
        {dis_magical > 0 && dis_blessed > 0 ? <br /> : null}
        {
          dis_blessed > 0
            ? translateP (staticData)
                         ("advantagesdisadvantages.apspent.spentonblesseddisadvantages")
                         (List (dis_blessed, 50))
            : null
        }
      </p>
    </>
  )
}
