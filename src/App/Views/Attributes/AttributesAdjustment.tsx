import * as React from 'react';
import { AttributeWithRequirements } from '../../App/Models/View/viewTypeHelpers';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { sign } from '../../App/Utils/NumberUtils';
import { Dropdown, DropdownOption } from '../../components/Dropdown';
import { List, Maybe, Record } from '../../utils/dataUtils';

export interface AttributesAdjustmentProps {
  adjustmentValue: Maybe<number>;
  attributes: List<Record<AttributeWithRequirements>>;
  availableAttributeIds: Maybe<List<string>>;
  currentAttributeId: Maybe<string>;
  locale: UIMessagesObject;
  setAdjustmentId (id: Maybe<string>): void;
}

export function AttributesAdjustment (props: AttributesAdjustmentProps) {
  const {
    attributes,
    locale,
    currentAttributeId,
    adjustmentValue: maybeAdjustmentValue,
    availableAttributeIds: maybeAvailableAttributeIds,
    setAdjustmentId,
  } = props;

  return (
    <div className="attribute-adjustment">
      <span className="label">{translate (locale, 'attributeadjustmentselection')}</span>
      {Maybe.fromMaybe
        (<></>)
        (Maybe.liftM2<List<string>, number, JSX.Element>
          (availableAttributeIds => adjustmentValue => (
            <Dropdown
              options={
                attributes
                  .filter (e => availableAttributeIds.elem (e .get ('id')))
                  .map (e => Record.of<DropdownOption> ({
                    id: e .get ('id'),
                    name: `${e .get ('name')} ${sign (adjustmentValue)}`,
                  }))
              }
              value={currentAttributeId}
              onChange={setAdjustmentId}
              disabled={
                Maybe.isNothing (currentAttributeId)
                || availableAttributeIds.length () === 1
              }
              />
          ))
          (maybeAvailableAttributeIds)
          (maybeAdjustmentValue))}
    </div>
  );
}
