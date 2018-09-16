import * as React from 'react';
import { Attribute, UIMessages } from '../../types/view';
import { translate } from '../../utils/I18n';
import { SheetHeaderAttribute } from './SheetHeaderAttribute';

export interface HeaderValue {
  id: string;
  short: string;
  value?: number | string;
}

export interface SheetHeaderProps {
  add?: HeaderValue[];
  attributes: Attribute[];
  locale: UIMessages;
  title: string;
}

export function SheetHeader(props: SheetHeaderProps) {
  const { add = [], attributes, locale, title } = props;
  const array: HeaderValue[] = [ ...attributes, ...add ];

  return (
    <div className="sheet-header">
      <div className="sheet-title">
        <h1>{translate(locale, 'charactersheet.title')}</h1>
        <p>{title}</p>
        <img src="images/icon.svg" alt="" />
      </div>
      <div className="sheet-attributes">
        {
          array.map(attr => <SheetHeaderAttribute key={attr.id} id={attr.id} label={attr.short} value={attr.value} />)
        }
      </div>
    </div>
  );
}
