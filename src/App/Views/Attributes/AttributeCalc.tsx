import * as React from 'react';
import { SecondaryAttribute } from '../../App/Models/Hero/heroTypeHelpers';
import { UIMessagesObject } from '../../types/ui';
import { List, Record } from '../../Utilities/dataUtils';
import { AttributeCalcItem } from './AttributeCalcItem';

export interface AttributesCalcProps {
  derived: List<Record<SecondaryAttribute>>;
  locale: UIMessagesObject;
  isInCharacterCreation: boolean;
  isRemovingEnabled: boolean;
  addLifePoint (): void;
  addArcaneEnergyPoint (): void;
  addKarmaPoint (): void;
  removeLifePoint (): void;
  removeArcaneEnergyPoint (): void;
  removeKarmaPoint (): void;
}

export function AttributeCalc (props: AttributesCalcProps) {
  return (
    <div className="calculated">
      {
        props.derived
          .map (attribute => (
            <AttributeCalcItem
              {...props}
              key={attribute .get ('id')}
              attribute={attribute}
              />
          ))
          .toArray ()
      }
    </div>
  );
}
