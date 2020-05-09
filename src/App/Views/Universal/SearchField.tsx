import * as React from "react"
import { Maybe } from "../../../Data/Maybe"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { TextField } from "./TextField"

interface Props {
  autoFocus?: boolean | Maybe<boolean>
  className?: string
  countCurrent?: number
  countMax?: number
  disabled?: boolean
  fullWidth?: boolean
  staticData: StaticDataRecord
  onChange (newText: string): void
  value?: string
  valid?: boolean
}

export const SearchField: React.FC<Props> = props => {
  const {
    autoFocus,
    className,
    countCurrent,
    countMax,
    disabled,
    fullWidth,
    onChange,
    valid,
    value,
    staticData,
  } = props

  return (
    <TextField
      autoFocus={autoFocus}
      className={className}
      countCurrent={countCurrent}
      countMax={countMax}
      disabled={disabled}
      fullWidth={fullWidth}
      onChange={onChange}
      type="text"
      valid={valid}
      value={value}
      hint={translate (staticData) ("general.filters.searchfield.placeholder")}
      />
  )
}
