import { useCallback } from "react"
import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"

type Props = {
  active: boolean
  className?: string
  disabled?: boolean
  value?: string | number
  onClick(value: string | number | undefined): void
}

/**
 * A clickable element that can be activated.
 */
export const Activate: FCC<Props> = props => {
  const { active, className, disabled, onClick, value, children } = props

  const onClickEval = useCallback(() => {
    if (disabled !== true) {
      onClick(value)
    }
  }, [disabled, onClick, value])

  return (
    <div className={classList(className, { active, disabled })} onClick={onClickEval}>
      {children}
    </div>
  )
}
