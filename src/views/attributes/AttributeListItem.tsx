import * as R from 'ramda';
import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { NumberBox } from '../../components/NumberBox';
import { Maybe, Record } from '../../utils/dataUtils';
import { AttributeWithRequirements } from '../../utils/viewData/viewTypeHelpers';
import { AttributeBorder } from './AttributeBorder';

export interface AttributeListItemProps {
  attribute: Record<AttributeWithRequirements>;
  isInCharacterCreation: boolean;
  isRemovingEnabled: boolean;
  maxTotalAttributeValues: Maybe<number>;
  sum: number;
  addPoint (id: string): void;
  removePoint (id: string): void;
}

export class AttributeListItem extends React.Component<AttributeListItemProps, {}> {
  render () {
    const {
      attribute,
      maxTotalAttributeValues,
      isInCharacterCreation,
      isRemovingEnabled,
      sum,
    } = this.props;

    const id = attribute .get ('id');
    const value = attribute .get ('value');
    const max = attribute .lookup ('max');

    const valueHeader = isInCharacterCreation ? `${value} / ${Maybe.fromMaybe (0) (max)}` : value;

    return (
      <AttributeBorder
        className={id}
        label={attribute .get ('short')}
        value={value}
        tooltip={
          <div className="calc-attr-overlay">
            <h4><span>{attribute .get ('name')}</span><span>{valueHeader}</span></h4>
          </div>
        }
        tooltipMargin={11}
        >
        {isInCharacterCreation && <NumberBox max={Maybe.fromMaybe (0) (max)} />}
        <IconButton
          className="add"
          icon="&#xE908;"
          onClick={this.props.addPoint.bind (null, id)}
          disabled={
            isInCharacterCreation && sum >= Maybe.fromMaybe (0) (maxTotalAttributeValues)
            || Maybe.elem (true) (max .fmap (R.gte (value)))
          }
          />
        {isRemovingEnabled && <IconButton
          className="remove"
          icon="&#xE909;"
          onClick={this.props.removePoint.bind (null, id)}
          disabled={value <= attribute .get ('min')}
          />}
      </AttributeBorder>
    );
  }
}
