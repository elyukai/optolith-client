import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { NumberBox } from '../../components/NumberBox';
import { AttributeWithRequirements } from '../../types/view';
import { AttributeBorder } from './AttributeBorder';

export interface AttributeListItemProps {
  attribute: AttributeWithRequirements;
  isInCharacterCreation: boolean;
  isRemovingEnabled: boolean;
  maxTotalAttributeValues: number;
  sum: number;
  addPoint(id: string): void;
  removePoint(id: string): void;
}

export class AttributeListItem extends React.Component<AttributeListItemProps, {}> {
  render() {
    const { attribute, maxTotalAttributeValues, isInCharacterCreation, isRemovingEnabled, sum } = this.props;
    const { id, short, name, value, max, min } = attribute;

    const valueHeader = isInCharacterCreation ? `${value} / ${max}` : value;

    return (
      <AttributeBorder className={id} label={short} value={value} tooltip={<div className="calc-attr-overlay">
          <h4><span>{name}</span><span>{valueHeader}</span></h4>
        </div>} tooltipMargin={11}>
        {isInCharacterCreation && <NumberBox max={max || 0} />}
        <IconButton
          className="add"
          icon="&#xE908;"
          onClick={this.props.addPoint.bind(null, id)}
          disabled={isInCharacterCreation && sum >= maxTotalAttributeValues || typeof max === 'number' && value >= max}
          />
        {isRemovingEnabled && <IconButton
          className="remove"
          icon="&#xE909;"
          onClick={this.props.removePoint.bind(null, id)}
          disabled={value <= min}
          />}
      </AttributeBorder>
    );
  }
}
