import * as React from 'react';
import { Attribute, UIMessages } from '../../types/view';
import { HeaderValue, SheetHeader } from './SheetHeader';

export interface SheetProps {
  addHeaderInfo?: HeaderValue[];
  attributes: Attribute[];
  children?: React.ReactNode;
  id: string;
  locale: UIMessages;
  title: string;
}

export function Sheet(props: SheetProps) {
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
}
