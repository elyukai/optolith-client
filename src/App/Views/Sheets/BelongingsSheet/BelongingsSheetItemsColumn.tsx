import * as React from "react";
import { Textfit } from "react-textfit";
import { fmap } from "../../../../Data/Functor";
import { flength, List, map, replicateR, toArray } from "../../../../Data/List";
import { bindF, ensure } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { ItemForView } from "../../../Models/View/ItemForView";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { localizeNumber, localizeWeight, translate } from "../../../Utilities/I18n";
import { gt } from "../../../Utilities/mathUtils";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { renderMaybe, renderMaybeWith } from "../../../Utilities/ReactUtils";

export interface BelongingsSheetItemsColumnProps {
  columnSize: number
  items: List<Record<ItemForView>>
  l10n: L10nRecord
}

const IFVA = ItemForView.A

export function BelongingsSheetItemsColumn (props: BelongingsSheetItemsColumnProps) {
  const { columnSize, l10n, items } = props

  return (
    <table>
      <thead>
        <tr>
          <th className="name">
            {translate (l10n) ("item")}
          </th>
          <th className="amount">
            {translate (l10n) ("number")}
          </th>
          <th className="price">
            {translate (l10n) ("price")}
          </th>
          <th className="weight">
            {translate (l10n) ("weight")}
          </th>
          <th className="where">
            {translate (l10n) ("carriedwhere")}
          </th>
        </tr>
      </thead>
      <tbody>
        {pipe_ (
          items,
          map (e => (
            <tr key={IFVA.id (e)}>
              <td className="name">
                <Textfit max={11} min={7} mode="single">{IFVA.name (e)}</Textfit>
              </td>
              <td className="amount">{renderMaybe (ensure (gt (1)) (IFVA.amount (e)))}</td>
              <td className="price">
                {pipe_ (
                  e,
                  IFVA.price,
                  bindF (ensure (gt (0))),
                  renderMaybeWith (localizeNumber (l10n))
                )}
              </td>
              <td className="weight">
                  {pipe_ (
                    e,
                    IFVA.weight,
                    fmap (pipe (
                      localizeWeight (l10n),
                      localizeNumber (l10n)
                    )),
                    renderMaybe
                  )}
              </td>
              <td className="where">
                <Textfit max={11} min={7} mode="single">
                  {renderMaybe (IFVA.where (e))}
                </Textfit>
              </td>
            </tr>
          )),
          toArray
        )}
        {replicateR (columnSize - flength (items))
                    (index => (
                      <tr key={`undefined-${index}`}>
                        <td className="name"></td>
                        <td className="amount"></td>
                        <td className="price"></td>
                        <td className="weight"></td>
                        <td className="where"></td>
                      </tr>
                    ))}
      </tbody>
    </table>
  )
}
