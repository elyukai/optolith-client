import * as React from "react"
import { fmap } from "../../../Data/Functor"
import { bindF, fromMaybe, Maybe, maybeToUndefined } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { Purse } from "../../Models/Hero/Purse"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { toInt } from "../../Utilities/NumberUtils"
import { pipe_ } from "../../Utilities/pipe"
import { isEmptyOr, isNaturalNumber } from "../../Utilities/RegexUtils"
import { Dialog } from "../Universal/Dialog"
import { TextField } from "../Universal/TextField"

interface PurseAddRemoveMoneyProps {
  staticData: StaticDataRecord
  isOpen: boolean
  purse: Maybe<Record<Purse>>
  setMoney (d: number, s: number, h: number, k: number): void
  close (): void
}

const PA = Purse.A

const getCurrentValueAsInt = (s: string) => pipe_ (s, toInt, fromMaybe (0))

const setValueSafe = (setValue: (x: string) => void, currentValue: string, value: string) => {
  setValue (isEmptyOr (isNaturalNumber) (value) ? value : currentValue)
}

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
      setValueSafe (setValueD, valueD, value)
    },
    [ setValueD, valueD ]
  )

  const setValueSSafe = React.useCallback (
    (value: string) => {
      setValueSafe (setValueS, valueS, value)
    },
    [ setValueS, valueS ]
  )

  const setValueHSafe = React.useCallback (
    (value: string) => {
      setValueSafe (setValueH, valueH, value)
    },
    [ setValueH, valueH ]
  )

  const setValueKSafe = React.useCallback (
    (value: string) => {
      setValueSafe (setValueK, valueK, value)
    },
    [ setValueK, valueK ]
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
              valid={isNaturalNumber (valueD)}
              onChange={setValueDSafe}
              />
            <TextField
              label={translate (staticData) ("equipment.purse.silverthalers")}
              value={valueS}
              valid={isNaturalNumber (valueS)}
              onChange={setValueSSafe}
              />
            <TextField
              label={translate (staticData) ("equipment.purse.halers")}
              value={valueH}
              valid={isNaturalNumber (valueH)}
              onChange={setValueHSafe}
              />
            <TextField
              label={translate (staticData) ("equipment.purse.kreutzers")}
              value={valueK}
              valid={isNaturalNumber (valueK)}
              onChange={setValueKSafe}
              />
          </div>
        </div>
    </Dialog>
  )
}
