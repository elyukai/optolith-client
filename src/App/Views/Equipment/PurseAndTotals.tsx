import * as React from "react";
import { fmapF } from "../../../Data/Functor";
import { fromJust, isJust, Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { Purse } from "../../Models/Hero/Purse";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { localizeNumber, localizeWeight, translate } from "../../Utilities/I18n";
import { TextField } from "../Universal/TextField";

export interface PurseAndTotalsProps {
  carryingCapacity: Maybe<number>
  hasNoAddedAP: boolean
  initialStartingWealth: number
  l10n: L10nRecord
  purse: Maybe<Record<Purse>>
  totalPrice: Maybe<number>
  totalWeight: Maybe<number>
  setDucates (value: string): void
  setSilverthalers (value: string): void
  setHellers (value: string): void
  setKreutzers (value: string): void
}

const PA = Purse.A

export function PurseAndTotals (props: PurseAndTotalsProps) {
  const {
    carryingCapacity,
    hasNoAddedAP,
    initialStartingWealth,
    l10n,
    purse,
    totalPrice,
    totalWeight,
  } = props

  const l10n_id = L10n.A.id (l10n)

  return (
    <>
      <div className="purse">
        <h4>{translate (l10n) ("purse")}</h4>
        <div className="fields">
          <TextField
            label={translate (l10n) ("ducats")}
            value={fmapF (purse) (PA.d)}
            onChange={props.setDucates}
            />
          <TextField
            label={translate (l10n) ("silverthalers")}
            value={fmapF (purse) (PA.s)}
            onChange={props.setSilverthalers}
            />
          <TextField
            label={translate (l10n) ("halers")}
            value={fmapF (purse) (PA.h)}
            onChange={props.setHellers}
            />
          <TextField
            label={translate (l10n) ("kreutzers")}
            value={fmapF (purse) (PA.k)}
            onChange={props.setKreutzers}
            />
        </div>
      </div>
      <div className="total-points">
        <h4>
          {hasNoAddedAP ? `${translate (l10n) ("initialstartingwealth")} & ` : ""}
          {translate (l10n) ("carryingcapacity")}
        </h4>
        <div className="fields">
          {hasNoAddedAP && isJust (totalPrice)
            ? (
              <div>
                {localizeNumber (l10n_id) (fromJust (totalPrice))}
                {" / "}
                {localizeNumber (l10n_id) (initialStartingWealth)}
                {" "}
                {translate (l10n) ("priceunit")}
              </div>
            )
            : null}
          <div>
            {localizeNumber (l10n_id) (localizeWeight (l10n_id) (totalWeight))}
            {" / "}
            {localizeNumber (l10n_id) (localizeWeight (l10n_id) (carryingCapacity))}
            {" "}
            {translate (l10n) ("weightunit.short")}
          </div>
        </div>
      </div>
    </>
  )
}
