import * as React from "react"
import { fmapF } from "../../../../Data/Functor"
import { List, map, toArray } from "../../../../Data/List"
import { fromMaybe, Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { fst, snd } from "../../../../Data/Tuple"
import { DCId } from "../../../Constants/Ids"
import { DerivedCharacteristicValues } from "../../../Models/View/DerivedCharacteristicCombined"
import { DerivedCharacteristic } from "../../../Models/Wiki/DerivedCharacteristic"
import { Race } from "../../../Models/Wiki/Race"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { DCPair } from "../../../Selectors/derivedCharacteristicsSelectors"
import { translate } from "../../../Utilities/I18n"
import { pipe_ } from "../../../Utilities/pipe"
import { MainSheetAttributesItem } from "./MainSheetAttributesItem"
import { MainSheetFatePoints } from "./MainSheetFatePoints"

interface Props {
  attributes: List<DCPair>
  fatePointsModifier: number
  staticData: StaticDataRecord
  race: Maybe<Record<Race>>
}

const DCA = DerivedCharacteristic.A
const DCVA = DerivedCharacteristicValues.A

export const MainSheetAttributes: React.FC<Props> = props => {
  const { attributes, fatePointsModifier, race, staticData } = props

  return (
    <div className="calculated">
      <div className="calc-header">
        <div>
          {translate (staticData) ("sheets.mainsheet.derivedcharacteristics.labels.value")}
        </div>
        <div>
          {translate (staticData) ("sheets.mainsheet.derivedcharacteristics.labels.bonuspenalty")}
        </div>
        <div>
          {translate (staticData) ("sheets.mainsheet.derivedcharacteristics.labels.bought")}
        </div>
        <div>
          {translate (staticData) ("sheets.mainsheet.derivedcharacteristics.labels.max")}
        </div>
      </div>
      {pipe_ (
        attributes,
        map (attribute => (
          <MainSheetAttributesItem
            key={DCA.id (fst (attribute))}
            label={DCA.name (fst (attribute))}
            calc={fromMaybe (DCA.calc (fst (attribute))) (DCVA.calc (snd (attribute)))}
            base={DCVA.base (snd (attribute))}
            max={DCVA.value (snd (attribute))}
            add={DCVA.mod (snd (attribute))}
            purchased={DCVA.currentAdd (snd (attribute))}
            subLabel={(() => {
              switch (DCA.id (fst (attribute))) {
                case DCId.LP:
                case DCId.SPI:
                case DCId.TOU:
                case DCId.MOV:
                  return Just (
                    translate (staticData)
                              ("sheets.mainsheet.derivedcharacteristics.labels.basestat")
                  )

                case DCId.AE:
                case DCId.KP:
                  return Just (
                    translate (staticData)
                              // eslint-disable-next-line max-len
                              ("sheets.mainsheet.derivedcharacteristics.labels.permanentlylostboughtback")
                  )

                default:
                  return Nothing
              }
            }) ()}
            subArray={(() => {
              switch (DCA.id (fst (attribute))) {
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
                      Maybe.sum (DCVA.permanentLost (snd (attribute))),
                      Maybe.sum (DCVA.permanentRedeemed (snd (attribute)))
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
              switch (DCA.id (fst (attribute))) {
                case DCId.AE:
                case DCId.KP:
                  return Just (Maybe.isNothing (DCVA.value (snd (attribute))))

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
        staticData={staticData}
        />
    </div>
  )
}
