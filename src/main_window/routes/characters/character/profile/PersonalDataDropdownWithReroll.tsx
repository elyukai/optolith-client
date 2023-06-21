import { ActionCreatorWithPayload } from "@reduxjs/toolkit"
import { FC, useCallback } from "react"
import { Dropdown } from "../../../../../shared/components/dropdown/Dropdown.tsx"
import { DropdownOption } from "../../../../../shared/components/dropdown/DropdownItem.tsx"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { InputButtonGroup } from "../../../../../shared/components/inputButtonGroup/InputButtonGroup.tsx"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { RootState } from "../../../../store.ts"

export type Props = {
  label: string
  rerollLabel: string
  selector: (state: RootState) => number | undefined
  options: DropdownOption<number>[]
  action: ActionCreatorWithPayload<number>
  onReroll: () => void
}

export const PersonalDataDropdownWithReroll: FC<Props> = props => {
  const {
    label,
    rerollLabel,
    selector,
    options,
    action,
    onReroll,
  } = props

  const dispatch = useAppDispatch()
  const value = useAppSelector(selector)

  const handleSetValue = useCallback(
    (newValue: number) => {
      dispatch(action(newValue))
    },
    [ dispatch, action ]
  )

  return (
    <InputButtonGroup className="reroll">
      <Dropdown
        label={label}
        value={value}
        onChange={handleSetValue}
        options={options}
        disabled={options.length === 1 && value === options[0]!.id}
        />
      <IconButton
        icon="&#xE913;"
        label={rerollLabel}
        onClick={onReroll}
        disabled={options.length === 1}
        />
    </InputButtonGroup>
  )
}
