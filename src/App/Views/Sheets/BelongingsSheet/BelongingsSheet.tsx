import * as React from "react";
import { equals } from "../../../../Data/Eq";
import { fmap, fmapF } from "../../../../Data/Functor";
import { filter, find, flength, intercalate, List, map, splitAt } from "../../../../Data/List";
import { fromMaybe, fromMaybeR, Just, Maybe, Nothing } from "../../../../Data/Maybe";
import { divideBy, max, multiply } from "../../../../Data/Num";
import { Record } from "../../../../Data/Record";
import { fst, snd } from "../../../../Data/Tuple";
import { AttrId } from "../../../Constants/Ids";
import { Pet } from "../../../Models/Hero/Pet";
import { Purse } from "../../../Models/Hero/Purse";
import { AttributeCombined, AttributeCombinedA_ } from "../../../Models/View/AttributeCombined";
import { ItemForView } from "../../../Models/View/ItemForView";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { localizeNumber, localizeWeight, translate } from "../../../Utilities/I18n";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { renderMaybe } from "../../../Utilities/ReactUtils";
import { LabelBox } from "../../Universal/LabelBox";
import { Options } from "../../Universal/Options";
import { TextBox } from "../../Universal/TextBox";
import { Sheet } from "../Sheet";
import { SheetWrapper } from "../SheetWrapper";
import { BelongingsSheetItemsColumn } from "./BelongingsSheetItemsColumn";
import { BelongingsSheetPet } from "./BelongingsSheetPet";

export interface BelongingsSheetProps {
  attributes: List<Record<AttributeCombined>>
  items: Maybe<List<Record<ItemForView>>>
  l10n: L10nRecord
  pet: Maybe<Record<Pet>>
  purse: Maybe<Record<Purse>>
  totalPrice: Maybe<number>
  totalWeight: Maybe<number>
}

export function BelongingsSheet (props: BelongingsSheetProps) {
  const {
    attributes,
    items: mitems,
    l10n,
    purse,
    totalPrice: maybeTotalPrice,
    totalWeight: maybeTotalWeight,
  } = props

  const strength =
    pipe_ (
      attributes,
      find (pipe (AttributeCombinedA_.id, equals<string> (AttrId.Strength))),
      fmap (AttributeCombinedA_.value),
      Maybe.sum
    )

  const columnSize =
    pipe_ (
      mitems,
      fmap (pipe (
        flength,
        divideBy (2),
        Math.round,
        max (33)
      )),
      fromMaybe (33)
    )

  const maybeColumns = fmapF (mitems) (splitAt (columnSize))

  return (
    <SheetWrapper>
      <Options />
      <Sheet
        id="belongings"
        title={translate (l10n) ("belongings")}
        attributes={attributes}
        l10n={l10n}
        >
        <div className="upper">
          <TextBox
            label={translate (l10n) ("equipment")}
            className="equipment"
            >
            {pipe_ (
              maybeColumns,
              fmap (columns => (
                <div>
                  <BelongingsSheetItemsColumn
                    items={fst (columns)}
                    columnSize={columnSize}
                    l10n={l10n}
                    />
                  <BelongingsSheetItemsColumn
                    items={snd (columns)}
                    columnSize={columnSize}
                    l10n={l10n}
                    />
                </div>
              )),
              fromMaybeR (<div />)
            )}
            <div className="total">
              <label>
                {translate (l10n) ("total")}
              </label>
              <span>
                {pipe_ (
                  maybeTotalPrice,
                  fmap (pipe (
                    multiply (100),
                    Math.round,
                    divideBy (100),
                    localizeNumber (l10n)
                  )),
                  renderMaybe
                )}
              </span>
              <span>
                {pipe_ (
                  maybeTotalWeight,
                  fmap (pipe (
                    multiply (100),
                    Math.round,
                    divideBy (100),
                    localizeWeight (l10n),
                    localizeNumber (l10n)
                  )),
                  renderMaybe
                )}
              </span>
            </div>
          </TextBox>
          <TextBox
            label={translate (l10n) ("purse")}
            className="purse"
            >
            <div className="top">
              <LabelBox
                className="money"
                label={translate (l10n) ("ducates.short")}
                value={fmapF (purse) (Purse.A.d)}
                />
              <LabelBox
                className="money"
                label={translate (l10n) ("silverthalers.short")}
                value={fmapF (purse) (Purse.A.s)}
                />
              <LabelBox
                className="money"
                label={translate (l10n) ("halers.short")}
                value={fmapF (purse) (Purse.A.h)}
                />
              <LabelBox
                className="money"
                label={translate (l10n) ("kreutzers.short")}
                value={fmapF (purse) (Purse.A.k)}
                />
              <LabelBox
                className="specifics"
                label={translate (l10n) ("gems")}
                value={fmapF (mitems)
                             (pipe (
                               filter (pipe (ItemForView.A.gr, equals (16))),
                               map (ItemForView.A.name),
                               intercalate (", ")
                             ))}
                />
              <LabelBox
                className="specifics"
                label={translate (l10n) ("jewelry")}
                value={fmapF (mitems)
                             (pipe (
                               filter (pipe (ItemForView.A.gr, equals (15))),
                               map (ItemForView.A.name),
                               intercalate (", ")
                             ))}
                />
              <LabelBox
                className="specifics"
                label={translate (l10n) ("other")}
                value={Nothing}
                />
            </div>
            <div className="fill" />
            <div className="carrying-capacity">
              <div className="left">
                <h3>{translate (l10n) ("carryingcapacity")}</h3>
                <p>{translate (l10n) ("carryingcapacitycalc")}</p>
              </div>
              <LabelBox
                label={translate (l10n) ("carryingcapacitylabel")}
                value={Just (localizeWeight (l10n) (strength * 2))}
                />
            </div>
          </TextBox>
        </div>
        <div className="fill" />
        <BelongingsSheetPet {...props} />
      </Sheet>
    </SheetWrapper>
  )
}
