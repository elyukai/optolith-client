import * as React from "react";
import { List, map, toArray } from "../../../Data/List";
import { Record } from "../../../Data/Record";
import { DerivedCharacteristic } from "../../Models/View/DerivedCharacteristic";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { pipe_ } from "../../Utilities/pipe";
import { AttributeCalcItem } from "./AttributeCalcItem";

export interface AttributesCalcProps {
  derived: List<Record<DerivedCharacteristic>>
  l10n: L10nRecord
  isInCharacterCreation: boolean
  isRemovingEnabled: boolean
  addLifePoint (): void
  addArcaneEnergyPoint (): void
  addKarmaPoint (): void
  removeLifePoint (): void
  removeArcaneEnergyPoint (): void
  removeKarmaPoint (): void
}

export function AttributeCalc (props: AttributesCalcProps) {
  return (
    <div className="calculated">
      {pipe_ (
        props.derived,
        map (attribute => (
          <AttributeCalcItem
            {...props}
            key={DerivedCharacteristic.A.id (attribute)}
            attribute={attribute}
            />
        )),
        toArray
      )}
    </div>
  )
}
