import * as React from "react"
import { fmapF } from "../../../../Data/Functor"
import { List, map, toArray } from "../../../../Data/List"
import { Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { DCId } from "../../../Constants/Ids"
import { DerivedCharacteristic } from "../../../Models/View/DerivedCharacteristic"
import { L10nRecord } from "../../../Models/Wiki/L10n"
import { Race } from "../../../Models/Wiki/Race"
import { translate } from "../../../Utilities/I18n"
import { pipe_ } from "../../../Utilities/pipe"
import { MainSheetAttributesItem } from "./MainSheetAttributesItem"
import { MainSheetFatePoints } from "./MainSheetFatePoints"

interface Props {
  attributes: List<Record<DerivedCharacteristic>>
  fatePointsModifier: number
  l10n: L10nRecord
  race: Maybe<Record<Race>>
}

const DCA = DerivedCharacteristic.A

export const MainSheetAttributes: React.FC<Props> = props => {
  const { attributes, fatePointsModifier, race, l10n } = props

  return (
    <div className="calculated">
      <div className="calc-header">
        <div>
          {translate (l10n) ("sheets.mainsheet.derivedcharacteristics.labels.value")}
        </div>
        <div>
          {translate (l10n) ("sheets.mainsheet.derivedcharacteristics.labels.bonuspenalty")}
        </div>
        <div>
          {translate (l10n) ("sheets.mainsheet.derivedcharacteristics.labels.bought")}
        </div>
        <div>
          {translate (l10n) ("sheets.mainsheet.derivedcharacteristics.labels.max")}
        </div>
      </div>
      {pipe_ (
        attributes,
        map (attribute => (
          <MainSheetAttributesItem
            key={DCA.id (attribute)}
            label={DCA.name (attribute)}
            calc={DCA.calc (attribute)}
            base={DCA.base (attribute)}
            max={DCA.value (attribute)}
            add={DCA.mod (attribute)}
            purchased={DCA.currentAdd (attribute)}
            subLabel={(() => {
              switch (DCA.id (attribute)) {
                case DCId.LP:
                case DCId.SPI:
                case DCId.TOU:
                case DCId.MOV:
                  return Just (
                    translate (l10n)
                              ("sheets.mainsheet.derivedcharacteristics.labels.basestat")
                  )

                case DCId.AE:
                case DCId.KP:
                  return Just (
                    translate (l10n)
                              // eslint-disable-next-line max-len
                              ("sheets.mainsheet.derivedcharacteristics.labels.permanentlylostboughtback")
                  )

                default:
                  return Nothing
              }
            }) ()}
            subArray={(() => {
              switch (DCA.id (attribute)) {
                case DCId.LP:
                  return Just (
                    List (
                      Maybe.sum (fmapF (race) (Race.A.lp))
                    )
                  )

                case DCId.AE:
                case DCId.KP:
                  return Just (
                    List (
                      Maybe.sum (DCA.permanentLost (attribute)),
                      Maybe.sum (DCA.permanentRedeemed (attribute))
                    )
                  )

                case DCId.SPI:
                  return Just (
                    List (
                      Maybe.sum (fmapF (race) (Race.A.spi))
                    )
                  )

                case DCId.TOU:
                  return Just (
                    List (
                      Maybe.sum (fmapF (race) (Race.A.tou))
                    )
                  )

                case DCId.MOV:
                  return Just (
                    List (
                      Maybe.sum (fmapF (race) (Race.A.mov))
                    )
                  )

                default:
                  return Nothing
              }
            }) ()}
            empty={(() => {
              switch (DCA.id (attribute)) {
                case DCId.AE:
                case DCId.KP:
                  return Just (Maybe.isNothing (DCA.value (attribute)))

                default:
                  return Nothing
              }
            }) ()}
            />
        )),
        toArray
      )}
      <MainSheetFatePoints
        fatePointsModifier={fatePointsModifier}
        l10n={l10n}
        />
    </div>
  )
}
