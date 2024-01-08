import { ActionCreatorWithPayload } from "@reduxjs/toolkit"
import { FC, useCallback } from "react"
import { Dropdown } from "../../../../../shared/components/dropdown/Dropdown.tsx"
import { DropdownOption } from "../../../../../shared/components/dropdown/DropdownItem.tsx"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { RootState } from "../../../../store.ts"

type Props = {
  label: string
  selector: (state: RootState) => number | undefined
  options: DropdownOption<number>[]
  action: ActionCreatorWithPayload<number>
}

/**
 * Returns a dropdown for use with personal data.
 */
export const PersonalDataDropdown: FC<Props> = props => {
  const { label, selector, options, action } = props

  const dispatch = useAppDispatch()
  const value = useAppSelector(selector)

  const handleSetValue = useCallback(
    (newValue: number) => {
      dispatch(action(newValue))
    },
    [dispatch, action],
  )

  return (
    <div>
      <Dropdown
        label={label}
        value={value}
        onChange={handleSetValue}
        options={options}
        disabled={options.length === 1 && value === options[0]!.id}
      />
    </div>
  )
}
