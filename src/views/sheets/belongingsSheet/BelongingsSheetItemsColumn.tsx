import * as R from 'ramda';
import * as React from 'react';
import { Textfit } from 'react-textfit';
import { Item } from '../../../App/Models/View/viewTypeHelpers';
import { localizeNumber, localizeWeight, translate, UIMessagesObject } from '../../../App/Utils/I18n';
import { Just, List, Maybe, Nothing, Record, Tuple } from '../../../utils/dataUtils';

export interface BelongingsSheetItemsColumnProps {
  columnSize: number;
  items: List<Record<Item>>;
  locale: UIMessagesObject;
}

export function BelongingsSheetItemsColumn (props: BelongingsSheetItemsColumnProps) {
  const { columnSize, locale, items } = props;

  return (
    <table>
      <thead>
        <tr>
          <th className="name">
            {translate (locale, 'charactersheet.belongings.equipment.headers.item')}
          </th>
          <th className="amount">
            {translate (locale, 'charactersheet.belongings.equipment.headers.number')}
          </th>
          <th className="price">
            {translate (locale, 'charactersheet.belongings.equipment.headers.price')}
          </th>
          <th className="weight">
            {translate (locale, 'charactersheet.belongings.equipment.headers.weight')}
          </th>
          <th className="where">
            {translate (locale, 'charactersheet.belongings.equipment.headers.carriedwhere')}
          </th>
        </tr>
      </thead>
      <tbody>
        {items
          .map (e => (
            <tr key={e .get ('id')}>
              <td className="name">
                <Textfit max={11} min={7} mode="single">{e .get ('name')}</Textfit>
              </td>
              <td className="amount">{e .get ('amount') > 1 && e.get ('amount')}</td>
              <td className="price">
                {e .get ('price') > 0 && localizeNumber (locale .get ('id')) (e .get ('price'))}
              </td>
              <td className="weight">
                {Maybe.fromMaybe<string | number>
                  ('')
                  (e .lookup ('weight') .fmap (
                    weight => localizeNumber (locale .get ('id'))
                                             (localizeWeight (locale .get ('id')) (weight))
                  ))}
              </td>
              <td className="where">
                <Textfit max={11} min={7} mode="single">
                  {e .lookupWithDefault<'where'> ('') ('where')}
                </Textfit>
              </td>
            </tr>
          ))
          .toArray ()}
        {List.unfoldr<JSX.Element, number>
          (x => x >= columnSize
            ? Nothing ()
            : Just (
              Tuple.of<JSX.Element, number>
                (
                  <tr key={`undefined${columnSize - 1 - x}`}>
                    <td className="name"></td>
                    <td className="amount"></td>
                    <td className="price"></td>
                    <td className="weight"></td>
                    <td className="where"></td>
                  </tr>
                )
                (R.inc (x))
            )
          )
          (items.length ())}
      </tbody>
    </table>
  );
}
