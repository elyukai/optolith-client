import * as React from 'react';
import { DCIds } from '../../selectors/derivedCharacteristicsSelectors';
import { SecondaryAttribute } from '../../types/data';
import { AttributeCombined } from '../../types/view';
import { List, Maybe, OrderedMap, Record } from '../../utils/dataUtils';

export interface SkillCheckProps {
  attributes: List<Record<AttributeCombined>>;
  check?: List<string>;
  checkDisabled?: boolean;
  checkmod?: 'SPI' | 'TOU';
  derivedCharacteristics?: OrderedMap<DCIds, Record<SecondaryAttribute>>;
}

export function SkillCheck (props: SkillCheckProps) {
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
        {
          Maybe.imapMaybe<string, JSX.Element>
            (index => id => attributes
              .find (attr => attr .get ('id') === id)
              .fmap (attr => (
                <div key={id + index} className={`check ${id}`}>
                  <span className="short">{attr .get ('short')}</span>
                  <span className="value">{attr .get ('value')}</span>
                </div>
              )))
            (check)
            .toArray ()
        }
        {
          checkmod
          && derived
          && Maybe.fromMaybe
            (<></>)
            (derived
              .lookup (checkmod)
              .fmap (
                characteristic => (
                  <div className="check mod">
                    +{characteristic .get ('short')}
                  </div>
                )
              ))
        }
      </>
    );
  }

  return null;
}
