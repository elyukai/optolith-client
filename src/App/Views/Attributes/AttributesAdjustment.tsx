import * as React from "react";
import { elem, flength, List } from "../../../Data/List";
import { fromMaybe, isNothing, joinMaybeList, Just, liftM2, mapMaybe, Maybe, Nothing } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { AttributeWithRequirements, AttributeWithRequirementsA_ } from "../../Models/View/AttributeWithRequirements";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { sign } from "../../Utilities/NumberUtils";
import { pipe_ } from "../../Utilities/pipe";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";

export interface AttributesAdjustmentProps {
  adjustmentValue: Maybe<number>
  attributes: Maybe<List<Record<AttributeWithRequirements>>>
  availableAttributeIds: Maybe<List<string>>
  currentAttributeId: Maybe<string>
  l10n: L10nRecord
  setAdjustmentId (id: Maybe<string>): void
}

const AWRA_ = AttributeWithRequirementsA_

export function AttributesAdjustment (props: AttributesAdjustmentProps) {
  const {
    attributes: mattributes,
    l10n,
    currentAttributeId,
    adjustmentValue: madjustment,
    availableAttributeIds: mavailable_attr_ids,
    setAdjustmentId,
  } = props

  return (
    <div className="attribute-adjustment">
      <span className="label">{translate (l10n) ("attributeadjustmentselection")}</span>
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
