import * as React from "react"
import { elem, flength, List } from "../../../Data/List"
import { fromMaybe, isNothing, joinMaybeList, Just, liftM2, mapMaybe, Maybe, Nothing } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { AttributeWithRequirements, AttributeWithRequirementsA_ } from "../../Models/View/AttributeWithRequirements"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { sign } from "../../Utilities/NumberUtils"
import { pipe_ } from "../../Utilities/pipe"
import { Dropdown } from "../Universal/Dropdown"

export interface AttributesAdjustmentProps {
  adjustmentValue: Maybe<number>
  attributes: Maybe<List<Record<AttributeWithRequirements>>>
  availableAttributeIds: Maybe<List<string>>
  currentAttributeId: Maybe<string>
  staticData: StaticDataRecord
  setAdjustmentId (id: Maybe<string>): void
}

const AWRA_ = AttributeWithRequirementsA_

export const AttributesAdjustment: React.FC<AttributesAdjustmentProps> = props => {
  const {
    attributes: mattributes,
    staticData,
    currentAttributeId,
    adjustmentValue: madjustment,
    availableAttributeIds: mavailable_attr_ids,
    setAdjustmentId,
  } = props

  return (
    <div className="attribute-adjustment">
      <span className="label">
        {translate (staticData) ("attributes.attributeadjustmentselection")}
      </span>
      {fromMaybe
        (<></>)
        (liftM2 ((available_attr_ids: List<string>) => (adjustment: number) => (
                  <Dropdown
                    options={
                      pipe_ (
                        mattributes,
                        joinMaybeList,
                        mapMaybe (x => elem (AWRA_.id (x)) (available_attr_ids)
                                         ? Just (DropdownOption ({
                                                  id: Just (AWRA_.id (x)),
                                                  name: `${AWRA_.name (x)} ${sign (adjustment)}`,
                                                }))
                                         : Nothing)
                      )
                    }
                    value={currentAttributeId}
                    onChange={setAdjustmentId}
                    disabled={isNothing (currentAttributeId) || flength (available_attr_ids) === 1}
                    />
                ))
                (mavailable_attr_ids)
                (madjustment))}
    </div>
  )
}
