import * as React from "react"
import { List, map, toArray } from "../../../Data/List"
import { Record } from "../../../Data/Record"
import { DerivedCharacteristic } from "../../Models/View/DerivedCharacteristic"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { pipe_ } from "../../Utilities/pipe"
import { AttributeCalcItem } from "./AttributeCalcItem"

export interface AttributesCalcProps {
  derived: List<Record<DerivedCharacteristic>>
  staticData: StaticDataRecord
  isInCharacterCreation: boolean
  isRemovingEnabled: boolean
  addLifePoint (): void
  addArcaneEnergyPoint (): void
  addKarmaPoint (): void
  removeLifePoint (): void
  removeArcaneEnergyPoint (): void
  removeKarmaPoint (): void
}

export const AttributeCalc: React.FC<AttributesCalcProps> = props => {
  const {
    derived,
    staticData,
    isInCharacterCreation,
    isRemovingEnabled,
    addLifePoint,
    addArcaneEnergyPoint,
    addKarmaPoint,
    removeLifePoint,
    removeArcaneEnergyPoint,
    removeKarmaPoint,
  } = props

  return (
    <div className="calculated">
      {pipe_ (
        derived,
        map (attribute => (
          <AttributeCalcItem
            key={DerivedCharacteristic.A.id (attribute)}
            attribute={attribute}
            staticData={staticData}
            isInCharacterCreation={isInCharacterCreation}
            isRemovingEnabled={isRemovingEnabled}
            addLifePoint={addLifePoint}
            addArcaneEnergyPoint={addArcaneEnergyPoint}
            addKarmaPoint={addKarmaPoint}
            removeLifePoint={removeLifePoint}
            removeArcaneEnergyPoint={removeArcaneEnergyPoint}
            removeKarmaPoint={removeKarmaPoint}
            />
        )),
        toArray
      )}
    </div>
  )
}
