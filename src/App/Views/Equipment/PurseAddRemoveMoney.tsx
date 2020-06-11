import * as React from "react"
import { maybeToUndefined, Maybe, fromMaybe, bindF } from "../../../Data/Maybe"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { toInt } from "../../Utilities/NumberUtils"
import { Dialog } from "../Universal/Dialog"
import { fmap } from "../../../Data/Functor"
import { pipe_ } from "../../Utilities/pipe"
import { Record } from "../../../Data/Record"
import { Purse } from "../../Models/Hero/Purse"
import { isNaturalNumber } from "../../Utilities/RegexUtils"
import { TextField } from "../Universal/TextField"
import { abs } from "../../../Data/Num"

interface PurseAddRemoveMoneyProps {
  staticData: StaticDataRecord
  isOpen: boolean
  purse: Maybe<Record<Purse>>
  setMoney (d: number, s: number, h: number, k: number): void
  close (): void
}

const PA = Purse.A

const calculateSafeInt = (value: string) => pipe_ (value, toInt, fromMaybe (0), abs)

const getCurrentValueAsInt = (s: string) => pipe_ (s, toInt, fromMaybe (0))

export const PurseAddRemoveMoney: React.FC<PurseAddRemoveMoneyProps> = props => {
  const { setMoney, purse, staticData, isOpen, close } = props

  const [ valueD, setValueD ] = React.useState ("")
  const [ valueS, setValueS ] = React.useState ("")
  const [ valueH, setValueH ] = React.useState ("")
  const [ valueK, setValueK ] = React.useState ("")
  const [ prevIsOpen, setPrevIsOpen ] = React.useState (false)

  if (prevIsOpen !== isOpen) {
    setValueD ("0")
    setValueS ("0")
    setValueH ("0")
    setValueK ("0")
    setPrevIsOpen (isOpen)
  }

  const setValueDSafe = React.useCallback (
    (value: string) => {
      setValueD (calculateSafeInt (value).toString ())
    },
    [ setValueD ]
  )

  const setValueSSafe = React.useCallback (
    (value: string) => {
      setValueS (calculateSafeInt (value).toString ())
    },
    [ setValueS ]
  )

  const setValueHSafe = React.useCallback (
    (value: string) => {
      setValueH (calculateSafeInt (value).toString ())
    },
    [ setValueH ]
  )

  const setValueKSafe = React.useCallback (
    (value: string) => {
      setValueK (calculateSafeInt (value).toString ())
    },
    [ setValueK ]
  )

  const getCurrentNumber =
    (f: (p: Record<Purse>) => string) =>
    (p: Maybe<Record<Purse>>) =>
      pipe_ (p, fmap (f), bindF (toInt), fromMaybe (0))

  const getCurrentPurseSum =
    React.useMemo (
      () => {
      const nCurrentD = getCurrentNumber (PA.d) (purse)
      const nCurrentS = getCurrentNumber (PA.s) (purse)
      const nCurrentH = getCurrentNumber (PA.h) (purse)
      const nCurrentK = getCurrentNumber (PA.k) (purse)

      return nCurrentK + (nCurrentH * 10) + (nCurrentS * 100) + (nCurrentD * 1000)
    },
    [ purse ]
  )

  const getCurrentDeltaSum =
    React.useMemo (
      () => {
        const nvalueD = getCurrentValueAsInt (valueD)
        const nvalueS = getCurrentValueAsInt (valueS)
        const nvalueH = getCurrentValueAsInt (valueH)
        const nvalueK = getCurrentValueAsInt (valueK)

        return nvalueK + (nvalueH * 10) + (nvalueS * 100) + (nvalueD * 1000)
      },
      [ valueD, valueS, valueH, valueK ]
    )

  const isCalculatedDifferencePositive =
    React.useMemo (
      () => {
        const purseSum = getCurrentPurseSum
        const deltaSum = getCurrentDeltaSum

        return (purseSum - deltaSum) >= 0
      },
      [ getCurrentPurseSum, getCurrentDeltaSum ]
  )

  const addMoney =
    React.useCallback (
      () => {
        const purseSum = getCurrentPurseSum
        const deltaSum = getCurrentDeltaSum
        const resultSum = purseSum + deltaSum

        const nEqualizedD = Math.floor (resultSum / 1000)
        const nEqualizedS = Math.floor ((resultSum - nEqualizedD * 1000) / 100)
        const nEqualizedH = Math.floor ((resultSum - nEqualizedD * 1000 - nEqualizedS * 100) / 10)
        const nEqualizedK = resultSum % 10

        setMoney (nEqualizedD, nEqualizedS, nEqualizedH, nEqualizedK)
      },
      [ getCurrentPurseSum, getCurrentDeltaSum, setMoney ]
   )

  const removeMoney =
    React.useCallback (
      () => {
        const purseSum = getCurrentPurseSum
        const deltaSum = getCurrentDeltaSum
        const resultSum = purseSum - deltaSum

        const nEqualizedD = Math.floor (resultSum / 1000)
        const nEqualizedS = Math.floor ((resultSum - nEqualizedD * 1000) / 100)
        const nEqualizedH = Math.floor ((resultSum - nEqualizedD * 1000 - nEqualizedS * 100) / 10)
        const nEqualizedK = resultSum % 10

        if (resultSum >= 0) {
          setMoney (nEqualizedD, nEqualizedS, nEqualizedH, nEqualizedK)
        }
      },
      [ getCurrentPurseSum, getCurrentDeltaSum, setMoney ]
    )

  return (
    <Dialog
      id="purse-addremove-money"
      title={translate (staticData) ("equipment.purse.earnpay")}
      buttons={[
        {
          disabled: !(isNaturalNumber (valueD)
                    && isNaturalNumber (valueS)
                    && isNaturalNumber (valueH)
                    && isNaturalNumber (valueK)),
          label: translate (staticData) ("equipment.purse.earn"),
          onClick: addMoney,
        },
        {
          disabled: !(isCalculatedDifferencePositive
                    && isNaturalNumber (valueD)
                    && isNaturalNumber (valueS)
                    && isNaturalNumber (valueH)
                    && isNaturalNumber (valueK)),
          label: translate (staticData) ("equipment.purse.pay"),
          onClick: removeMoney,
        },
      ]}
      close={close}
      isOpen={isOpen}
      >
        <div className="purse">
          <label>
            {translate (staticData) ("equipment.purse.notefirst")}
            <br />
            {translate (staticData) ("equipment.purse.notesecond")}
          </label>
          <h3>{translate (staticData) ("equipment.purse.currentcredit")}</h3>
          <div className="flexrow">
            <div className="textfield">
              <label>{translate (staticData) ("equipment.purse.ducats")}</label>
              <div className="purseValue">{pipe_ (purse, fmap (PA.d), maybeToUndefined)}</div>
            </div>
            <div className="textfield">
              <label>{translate (staticData) ("equipment.purse.silverthalers")}</label>
              <div className="purseValue">{pipe_ (purse, fmap (PA.s), maybeToUndefined)}</div>
            </div>
            <div className="textfield">
              <label>{translate (staticData) ("equipment.purse.halers")}</label>
              <div className="purseValue">{pipe_ (purse, fmap (PA.h), maybeToUndefined)}</div>
            </div>
            <div className="textfield">
              <label>{translate (staticData) ("equipment.purse.kreutzers")}</label>
              <div className="purseValue">{pipe_ (purse, fmap (PA.k), maybeToUndefined)}</div>
            </div>
          </div>
          <h3>{translate (staticData) ("equipment.purse.amount")}</h3>
          <div className="flexrow" >
            <TextField
              label={translate (staticData) ("equipment.purse.ducats")}
              value={valueD}
              type="number"
              min="0"
              valid={isNaturalNumber (valueD)}
              onChange={setValueDSafe}
              />
            <TextField
              label={translate (staticData) ("equipment.purse.silverthalers")}
              value={valueS}
              type="number"
              min="0"
              valid={isNaturalNumber (valueS)}
              onChange={setValueSSafe}
              />
            <TextField
              label={translate (staticData) ("equipment.purse.halers")}
              value={valueH}
              type="number"
              min="0"
              valid={isNaturalNumber (valueH)}
              onChange={setValueHSafe}
              />
            <TextField
              label={translate (staticData) ("equipment.purse.kreutzers")}
              value={valueK}
              type="number"
              min="0"
              valid={isNaturalNumber (valueK)}
              onChange={setValueKSafe}
              />
          </div>
        </div>
    </Dialog>
  )
}
