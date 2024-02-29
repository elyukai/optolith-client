import { FC, useCallback } from "react"
import { Dialog } from "../../shared/components/dialog/Dialog.tsx"
import { useTranslate } from "../../shared/hooks/translate.ts"
import { useAppDispatch, useAppSelector } from "../hooks/redux.ts"
import { dismissAlert, selectCurrentAlert } from "../slices/alertsSlice.ts"

/**
 * Displays the current alert, if any.
 */
export const Alerts: FC = () => {
  const dispatch = useAppDispatch()
  const translate = useTranslate()
  const currentAlert = useAppSelector(selectCurrentAlert)
  const close = useCallback(() => {
    dispatch(dismissAlert())
  }, [dispatch])

  if (currentAlert === undefined) {
    return null
  }

  return (
    <Dialog close={close} isOpen title={currentAlert.title} buttons={[{ label: translate("OK") }]}>
      {currentAlert.description}
    </Dialog>
  )
}
