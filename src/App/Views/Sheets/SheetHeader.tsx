import * as React from 'react';
import { AttributeCombined } from '../../App/Models/View/viewTypeHelpers';
import { translate, UIMessagesObject } from '../../App/Utils/I18n';
import { List, Record } from '../../Utilities/dataUtils';
import { SheetHeaderAttribute } from './SheetHeaderAttribute';

export interface HeaderValue {
  id: string;
  short: string;
  value?: number | string;
}

export interface SheetHeaderProps {
  add?: List<Record<HeaderValue>>;
  attributes: List<Record<AttributeCombined>>;
  locale: UIMessagesObject;
  title: string;
}

export function SheetHeader (props: SheetHeaderProps) {
  const { add = List.empty<Record<HeaderValue>> (), attributes, locale, title } = props;
  const list: List<Record<HeaderValue>> = (attributes as any).mappend (add);

  return (
    <div className="sheet-header">
      <div className="sheet-title">
        <h1>{translate (locale, 'charactersheet.title')}</h1>
        <p>{title}</p>
        <img src="images/icon.svg" alt="" />
      </div>
      <div className="sheet-attributes">
        {
          list
            .map (
              attr => (
                <SheetHeaderAttribute
                  key={attr.get ('id')}
                  id={attr.get ('id')}
                  label={attr.get ('short')}
                  value={attr.lookup ('value')}
                  />
              )
            )
            .toArray ()
        }
      </div>
    </div>
  );
}
