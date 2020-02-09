import * as React from "react"
import { fmapF } from "../../../Data/Functor"
import { fromJust, isJust, Maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { Purse } from "../../Models/Hero/Purse"
import { L10n, L10nRecord } from "../../Models/Wiki/L10n"
import { localizeNumber, localizeWeight, translate, translateP } from "../../Utilities/I18n"
import { TextField } from "../Universal/TextField"

export interface PurseAndTotalsProps {
  carryingCapacity: number
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

export const PurseAndTotals: React.FC<PurseAndTotalsProps> = props => {
  const {
    carryingCapacity,
    hasNoAddedAP,
    initialStartingWealth,
    l10n,
    purse,
    totalPrice,
    totalWeight,
    setDucates,
    setSilverthalers,
    setHellers,
    setKreutzers,
  } = props

  const l10n_id = L10n.A.id (l10n)

  return (
    <>
      <div className="purse">
        <h4>{translate (l10n) ("equipment.purse.title")}</h4>
        <div className="fields">
          <TextField
            label={translate (l10n) ("equipment.purse.ducates")}
            value={fmapF (purse) (PA.d)}
            onChange={setDucates}
            />
          <TextField
            label={translate (l10n) ("equipment.purse.silverthalers")}
            value={fmapF (purse) (PA.s)}
            onChange={setSilverthalers}
            />
          <TextField
            label={translate (l10n) ("equipment.purse.halers")}
            value={fmapF (purse) (PA.h)}
            onChange={setHellers}
            />
          <TextField
            label={translate (l10n) ("equipment.purse.kreutzers")}
            value={fmapF (purse) (PA.k)}
            onChange={setKreutzers}
            />
        </div>
      </div>
      <div className="total-points">
        <h4>
          {hasNoAddedAP
            ? translate (l10n) ("equipment.purse.initialstartingwealthandcarryingcapacity")
            : translate (l10n) ("equipment.purse.carryingcapacity")}
        </h4>
        <div className="fields">
          {hasNoAddedAP && isJust (totalPrice)
            ? (
              <div>
                {translateP (l10n)
                            ("general.pricevalue")
                            (`${localizeNumber (l10n_id) (fromJust (totalPrice))} / ${localizeNumber (l10n_id) (initialStartingWealth)}`)}
              </div>
            )
            : null}
          <div>
            {translateP (l10n)
                        ("general.weightvalue")
                        (`${localizeNumber (l10n_id) (localizeWeight (l10n_id) (totalWeight))} / ${localizeNumber (l10n_id) (localizeWeight (l10n_id) (carryingCapacity))}`)}
          </div>
        </div>
      </div>
    </>
  )
}
