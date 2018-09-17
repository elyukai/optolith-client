import * as React from 'react';
import { UIMessagesObject } from '../../types/ui';
import { AttributeCombined } from '../../types/view';
import { List, Record } from '../../utils/dataUtils';
import { HeaderValue, SheetHeader } from './SheetHeader';

export interface SheetProps {
  addHeaderInfo?: List<Record<HeaderValue>>;
  attributes: List<Record<AttributeCombined>>;
  children?: React.ReactNode;
  id: string;
  locale: UIMessagesObject;
  title: string;
}

export const Sheet = (props: SheetProps) => {
  const { addHeaderInfo, attributes, children, id, locale, title } = props;

  return (
    <div className="sheet" id={id}>
      <SheetHeader
        title={title}
        add={addHeaderInfo}
        attributes={attributes}
        locale={locale}
        />
      {children}
    </div>
  );
};
