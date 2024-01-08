import { ActionCreatorWithPayload } from "@reduxjs/toolkit"
import { FC, useCallback } from "react"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { InputButtonGroup } from "../../../../../shared/components/inputButtonGroup/InputButtonGroup.tsx"
import { TextFieldLazy } from "../../../../../shared/components/textField/TextFieldLazy.tsx"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { RootState } from "../../../../store.ts"

type Props = {
  label: string
  rerollLabel: string
  selector: (state: RootState) => string | undefined
  action: ActionCreatorWithPayload<string>
  onReroll: () => void
  validator?: (value: string | undefined) => boolean
}

/**
 * Returns a textfield with a reroll option for use with personal data.
 */
export const PersonalDataTextFieldWithReroll: FC<Props> = props => {
  const { label, rerollLabel, selector, action, onReroll, validator } = props

  const dispatch = useAppDispatch()
  const value = useAppSelector(selector)

  const handleSetValue = useCallback(
    (newValue: string) => {
      dispatch(action(newValue))
    },
    [dispatch, action],
  )

  return (
    <InputButtonGroup className="reroll">
      <TextFieldLazy
        label={label}
        value={value}
        onChange={handleSetValue}
        valid={validator ? validator(value) : true}
      />
      <IconButton icon="&#xE913;" label={rerollLabel} onClick={onReroll} />
    </InputButtonGroup>
  )
}
