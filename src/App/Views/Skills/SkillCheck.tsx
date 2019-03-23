import * as React from 'react';
import { SecondaryAttribute } from '../../App/Models/Hero/heroTypeHelpers';
import { AttributeCombined } from '../../App/Models/View/viewTypeHelpers';
import { DCIds } from '../../App/Selectors/derivedCharacteristicsSelectors';
import { List, Maybe, OrderedMap, Record } from '../../Utilities/dataUtils';

export interface SkillCheckProps {
  attributes: List<Record<AttributeCombined>>;
  check?: List<string>;
  checkDisabled?: boolean;
  checkmod?: Maybe<'SPI' | 'TOU'>;
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
            (checkmod
              .bind (key => OrderedMap.lookup<DCIds, Record<SecondaryAttribute>> (key) (derived))
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
