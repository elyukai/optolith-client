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
  setPurseContent (ducates: number, silverthalers: number, hellers: number, kreutzers: number): void
  close (): void
}

const PA = Purse.A

export const PurseAddRemoveMoney: React.FC<PurseAddRemoveMoneyProps> = props => {
  const { setPurseContent, purse, staticData, isOpen, close } = props

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

  const calculateSafeInt = (value : string) => {
    return pipe_ (value, toInt, fromMaybe (0), abs)
  }

  const setValueDSafe  = (value : string) => setValueD(calculateSafeInt(value).toString())
  const setValueSSafe  = (value : string) => setValueS(calculateSafeInt(value).toString())
  const setValueHSafe  = (value : string) => setValueH(calculateSafeInt(value).toString())
  const setValueKSafe  = (value : string) => setValueK(calculateSafeInt(value).toString())

  const getCurrentNumber = 
    (f: (p: Record<Purse>) => string) => 
    (p: Maybe<Record<Purse>>) => 
      pipe_ (p, fmap (f), bindF (toInt), fromMaybe (0))

  const computeCurrentPurseSum = () => {
    const numberCurrentD = getCurrentNumber (PA.d) (purse)
    const numberCurrentS = getCurrentNumber (PA.s) (purse)
    const numberCurrentH = getCurrentNumber (PA.h) (purse)
    const numberCurrentK = getCurrentNumber (PA.k) (purse)

    return numberCurrentK + (numberCurrentH * 10) + (numberCurrentS * 100) + (numberCurrentD * 1000)
  }

  const getCurrentPurseSum  =
   React.useMemo (
     () => computeCurrentPurseSum(),
    [ purse ]
  )

  const getCurrentValueAsInt = (s: string) => {
    return pipe_ (s, toInt, fromMaybe (0))
  }

  const computeCurrentDeltaSum = () => {
    const nvalueD = getCurrentValueAsInt (valueD)
    const nvalueS = getCurrentValueAsInt (valueS)
    const nvalueH = getCurrentValueAsInt (valueH)
    const nvalueK = getCurrentValueAsInt (valueK)
    
    return nvalueK + (nvalueH * 10) + (nvalueS * 100) + (nvalueD * 1000)
  }

  const getCurrentDeltaSum  =
    React.useMemo (
      () => computeCurrentDeltaSum(),
      [ valueD, valueS, valueH, valueK ]
  )

  const computeIsCalculatedDifferencePositive = () => {
    const purseSum = getCurrentPurseSum
    const deltaSum = getCurrentDeltaSum

    return (purseSum - deltaSum) >= 0
  }

  const isCalculatedDifferencePositive  =
  React.useMemo (
    () => computeIsCalculatedDifferencePositive(),
    [ valueD, valueS, valueH, valueK, purse ]
  )

  const addMoney = () => {
    const purseSum = getCurrentPurseSum
    const deltaSum = getCurrentDeltaSum
    const resultSum = purseSum + deltaSum

    const nEqualizedD = Math.floor(resultSum / 1000)
    const nEqualizedS = Math.floor((resultSum - nEqualizedD * 1000) /  100)
    const nEqualizedH = Math.floor((resultSum - nEqualizedD * 1000 - nEqualizedS * 100) /  10)
    const nEqualizedK = resultSum %  10

    setPurseContent(nEqualizedD,nEqualizedS,nEqualizedH,nEqualizedK)
  }

  const removeMoney = () => {
    const purseSum = getCurrentPurseSum
    const deltaSum = getCurrentDeltaSum
    const resultSum = purseSum - deltaSum

    const nEqualizedD = Math.floor(resultSum / 1000)
    const nEqualizedS = Math.floor((resultSum - nEqualizedD * 1000) /  100)
    const nEqualizedH = Math.floor((resultSum - nEqualizedD * 1000 - nEqualizedS * 100) /  10)
    const nEqualizedK = resultSum %  10
    
    if (resultSum >= 0) {
      setPurseContent(nEqualizedD,nEqualizedS,nEqualizedH,nEqualizedK)
    }
  }

  return (
    <Dialog
      id="Purse-addremove-money"
      title={translate (staticData) ("equipment.purse.earnpay")}
      buttons={[
        {
          disabled: !(isNaturalNumber (valueD) && isNaturalNumber (valueS) && isNaturalNumber (valueH) && isNaturalNumber (valueK)),
          label: translate (staticData) ("equipment.purse.earn"),
          onClick: addMoney,
        },
        {
          disabled: !(isCalculatedDifferencePositive && isNaturalNumber (valueD) && isNaturalNumber (valueS) && isNaturalNumber (valueH) && isNaturalNumber (valueK)),
          label: translate (staticData) ("equipment.purse.pay"),
          onClick: removeMoney,
        },
      ]}
      close={close}
      isOpen={isOpen}
      >
        <div id="equipment">
          <div className="purse">
            <div>
              <label>{translate (staticData) ("equipment.purse.notefirst")}</label>
              <label>{translate (staticData) ("equipment.purse.notesecond")}</label>
            </div>
            <div><h3>{translate (staticData) ("equipment.purse.currentcredit")}</h3></div>
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
            <div><h3>{translate (staticData) ("equipment.purse.amount")}</h3></div>
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
        </div>
    </Dialog>
  )
}
