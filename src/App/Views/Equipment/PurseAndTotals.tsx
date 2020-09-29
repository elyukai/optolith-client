import * as React from "react"
import { fmap } from "../../../Data/Functor"
import { List } from "../../../Data/List"
import { fromMaybe, isJust, Maybe, maybeToUndefined } from "../../../Data/Maybe"
import { abs } from "../../../Data/Num"
import { Record } from "../../../Data/Record"
import { Purse } from "../../Models/Hero/Purse"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { localizeNumber, localizeWeight, translate, translateP } from "../../Utilities/I18n"
import { toInt } from "../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { isEmptyOr, isNaturalNumber } from "../../Utilities/RegexUtils"
import { Button } from "../Universal/Button"
import { TextFieldLazy } from "../Universal/TextFieldLazy"

export interface PurseAndTotalsProps {
  carryingCapacity: number
  hasNoAddedAP: boolean
  initialStartingWealth: number
  staticData: StaticDataRecord
  purse: Maybe<Record<Purse>>
  totalPrice: Maybe<number>
  totalWeight: Maybe<number>
  setDucates (value: string): void
  setSilverthalers (value: string): void
  setHellers (value: string): void
  setKreutzers (value: string): void
  openAddRemoveMoney (): void
}

const PA = Purse.A

const calculateSafeInt = (value: string) => pipe_ (value, toInt, fromMaybe (0), abs)

export const PurseAndTotals: React.FC<PurseAndTotalsProps> = props => {
  const {
    carryingCapacity,
    hasNoAddedAP,
    initialStartingWealth,
    staticData,
    purse,
    totalPrice,
    totalWeight,
    setDucates,
    setSilverthalers,
    setHellers,
    setKreutzers,
    openAddRemoveMoney,
  } = props

  const formatWeight = pipe (localizeWeight (staticData), localizeNumber (staticData))

  const formatWeightM = pipe (fromMaybe (0), formatWeight)

  const formatPrice = localizeNumber (staticData)

  const formatPriceM = pipe (fromMaybe (0), formatPrice)

  const total_price = translateP (staticData)
                                 ("general.pricevalue")
                                 (List (formatPriceM (totalPrice)))

  const total_weight = translateP (staticData)
                                  ("general.weightvalue")
                                  (List (formatWeightM (totalWeight)))

  const init_wealth = translateP (staticData)
                                 ("general.pricevalue")
                                 (List (formatPrice (initialStartingWealth)))

  const carring_capacity = translateP (staticData)
                                      ("general.pricevalue")
                                      (List (formatWeight (carryingCapacity)))

  const setDucatesSafe = React.useCallback (
    (value: string) => {
      setDucates (calculateSafeInt (value).toString ())
    },
    [ setDucates ]
  )

  const setSilverthalersSafe = React.useCallback (
    (value: string) => {
      setSilverthalers (calculateSafeInt (value).toString ())
    },
    [ setSilverthalers ]
  )

  const setHellersSafe = React.useCallback (
    (value: string) => {
      setHellers (calculateSafeInt (value).toString ())
    },
    [ setHellers ]
  )

  const setKreutzersSafe = React.useCallback (
    (value: string) => {
      setKreutzers (calculateSafeInt (value).toString ())
    },
    [ setKreutzers ]
  )

  return (
    <>
      <div className="purse">
        <div>
          <h4>{translate (staticData) ("equipment.purse.title")}</h4>
          <div className="fields">
            <TextFieldLazy
              label={translate (staticData) ("equipment.purse.ducats")}
              value={pipe_ (purse, fmap (PA.d), maybeToUndefined)}
              type="number"
              min="0"
              onChange={setDucatesSafe}
              checkDirectInput={isEmptyOr (isNaturalNumber)}
              />
            <TextFieldLazy
              label={translate (staticData) ("equipment.purse.silverthalers")}
              value={pipe_ (purse, fmap (PA.s), maybeToUndefined)}
              type="number"
              min="0"
              onChange={setSilverthalersSafe}
              checkDirectInput={isEmptyOr (isNaturalNumber)}
              />
            <TextFieldLazy
              label={translate (staticData) ("equipment.purse.halers")}
              value={pipe_ (purse, fmap (PA.h), maybeToUndefined)}
              type="number"
              min="0"
              onChange={setHellersSafe}
              checkDirectInput={isEmptyOr (isNaturalNumber)}
              />
            <TextFieldLazy
              label={translate (staticData) ("equipment.purse.kreutzers")}
              type="number"
              min="0"
              value={pipe_ (purse, fmap (PA.k), maybeToUndefined)}
              onChange={setKreutzersSafe}
              checkDirectInput={isEmptyOr (isNaturalNumber)}
              />
          </div>
        </div>
        <div>
          <Button onClick={openAddRemoveMoney}>
            {translate (staticData) ("equipment.purse.earnpay")}
          </Button>
        </div>
      </div>
      <div className="total-points">
        <h4>
          {hasNoAddedAP
            ? translate (staticData) ("equipment.purse.initialstartingwealthandcarryingcapacity")
            : translate (staticData) ("equipment.purse.carryingcapacity")}
        </h4>
        <div className="fields">
          {hasNoAddedAP && isJust (totalPrice)
            ? (
              <div>
                {translateP (staticData)
                            ("general.pricevalue")
                            (List (
                              `${total_price} / ${init_wealth}`
                            ))}
              </div>
            )
            : null}
          <div>
            {translateP (staticData)
                        ("general.weightvalue")
                        (List (
                          `${total_weight} / ${carring_capacity}`
                        ))}
          </div>
        </div>
      </div>
    </>
  )
}
