import { ActionCreatorWithPayload } from "@reduxjs/toolkit"
import { FC, useCallback } from "react"
import { TextFieldLazy } from "../../../../../shared/components/textField/TextFieldLazy.tsx"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { RootState } from "../../../../store.ts"

type Props = {
  label: string
  selector: (state: RootState) => string | undefined
  action: ActionCreatorWithPayload<string>
  validator?: (value: string | undefined) => boolean
}

/**
 * Returns a textfield for use with personal data.
 */
export const PersonalDataTextField: FC<Props> = props => {
  const { label, selector, action, validator } = props

  const dispatch = useAppDispatch()
  const value = useAppSelector(selector)

  const handleSetValue = useCallback(
    (newValue: string) => {
      dispatch(action(newValue))
    },
    [dispatch, action],
  )

  return (
    <div>
      <TextFieldLazy
        label={label}
        value={value}
        onChange={handleSetValue}
        valid={validator ? validator(value) : true}
      />
    </div>
  )
}
