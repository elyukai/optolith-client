import * as React from 'react';
import { SecondaryAttribute } from '../../types/data';
import { UIMessages } from '../../types/ui';
import { AttributeCalcItem } from './AttributeCalcItem';

export interface AttributesCalcProps {
  derived: SecondaryAttribute[];
  locale: UIMessages;
  isInCharacterCreation: boolean;
  isRemovingEnabled: boolean;
  addLifePoint(): void;
  addArcaneEnergyPoint(): void;
  addKarmaPoint(): void;
  removeLifePoint(): void;
  removeArcaneEnergyPoint(): void;
  removeKarmaPoint(): void;
}

export function AttributeCalc(props: AttributesCalcProps) {
  return (
    <div className="calculated">
      {
        props.derived.map(attribute => (
          <AttributeCalcItem
            {...props}
            key={attribute.id}
            attribute={attribute}
            />
        ))
      }
    </div>
  );
}
