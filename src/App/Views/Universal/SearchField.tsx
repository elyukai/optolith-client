import * as React from "react"
import { Maybe } from "../../../Data/Maybe"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { translate } from "../../Utilities/I18n"
import { TextField } from "./TextField"

interface Props {
  autoFocus?: boolean | Maybe<boolean>
  className?: string
  countCurrent?: number
  countMax?: number
  disabled?: boolean
  fullWidth?: boolean
  l10n: L10nRecord
  onChange (newText: string): void
  value?: string | number | Maybe<string | number>
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
    l10n,
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
      everyKeyDown
      hint={translate (l10n) ("search")}
      />
  )
}
