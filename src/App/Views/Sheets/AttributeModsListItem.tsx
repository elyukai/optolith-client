import * as React from 'react';
import { AttributeCombined } from '../../App/Models/View/viewTypeHelpers';
import { Record } from '../../Utilities/dataUtils';

interface AttributeModsListItemProps {
  attribute: Record<AttributeCombined>;
}

export function AttributeModsListItem (props: AttributeModsListItemProps) {
  return (
    <tr className={props.attribute .get ('id')}>
      <td className="name">{props.attribute .get ('short')}</td>
      <td>{props.attribute .get ('value') - 3}</td>
      <td>{props.attribute .get ('value') - 2}</td>
      <td>{props.attribute .get ('value') - 1}</td>
      <td className="null">{props.attribute .get ('value')}</td>
      <td>{props.attribute .get ('value') + 1}</td>
      <td>{props.attribute .get ('value') + 2}</td>
      <td>{props.attribute .get ('value') + 3}</td>
    </tr>
  );
}
