import * as React from 'react';
import { ActiveViewObject, UIMessagesObject } from '../App/Models/Hero/heroTypeHelpers';
import { compressList } from '../Utilities/Activatable/activatableNameUtils';
import { List, Record } from '../Utilities/dataUtils';

interface ActivatableTextListProps {
  list: List<Record<ActiveViewObject> | string>;
  locale: UIMessagesObject;
}

export const ActivatableTextList = (props: ActivatableTextListProps) => (
  <div className="list">
    {compressList (props.list, props.locale)}
  </div>
);
