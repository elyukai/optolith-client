import * as React from 'react';
import { AttributeWithRequirements } from '../../types/view';
import { List, Maybe, Record } from '../../utils/dataUtils';
import { AttributeListItem } from './AttributeListItem';

export interface AttributeListProps {
  attributes: List<Record<AttributeWithRequirements>>;
  isInCharacterCreation: boolean;
  isRemovingEnabled: boolean;
  maxTotalAttributeValues: Maybe<number>;
  sum: number;
  addPoint (id: string): void;
  removePoint (id: string): void;
}

export function AttributeList (props: AttributeListProps) {
  const { attributes, ...other } = props;

  return (
    <div className="main">
      {
        attributes
          .map (
            attribute => (
              <AttributeListItem
                {...other}
                key={attribute .get ('id')}
                attribute={attribute}
                />
            )
          )
          .toArray ()
      }
    </div>
  );
}
