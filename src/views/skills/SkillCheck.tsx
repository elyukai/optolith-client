import * as React from 'react';
import { AttributeInstance, SecondaryAttribute } from '../../types/data.d';
import { DCIds } from '../../utils/derivedCharacteristics';

export interface SkillCheckProps {
  attributes: Map<string, AttributeInstance>;
  check?: string[];
  checkDisabled?: boolean;
  checkmod?: 'SPI' | 'TOU';
  derivedCharacteristics?: Map<DCIds, SecondaryAttribute>;
}

export function SkillCheck(props: SkillCheckProps) {
  const {
    attributes,
    check,
    checkDisabled,
    checkmod,
    derivedCharacteristics: derived,
  } = props;

  if (!checkDisabled && check) {
    return (
      <>
        {check.map((id, index) => {
          const attribute = attributes.get(id)!;
          return (
            <div key={id + index} className={'check ' + id}>
              <span className="short">{attribute.short}</span>
              <span className="value">{attribute.value}</span>
            </div>
          );
        })}
        {checkmod && derived && derived.has(checkmod) && (
          <div className="check mod">
            +{derived.get(checkmod)!.short}
          </div>
        )}
      </>
    );
  }

  return null;
}
