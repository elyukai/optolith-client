import * as React from 'react';
import { ActiveViewObject, UIMessages } from '../types/data';
import { compressList } from '../utils/activatableNameUtils';

interface ActivatableTextListProps {
  list: (ActiveViewObject | string)[];
  locale: UIMessages;
}

export function ActivatableTextList(props: ActivatableTextListProps) {
  return (
    <div className="list">{compressList(props.list, props.locale)}</div>
  );
}
