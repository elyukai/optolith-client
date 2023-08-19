import { useCallback } from "react"
import { createPortal } from "react-dom"
import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"
import "./Dialog.scss"
import { DialogButtonProps } from "./DialogButton.tsx"
import { DialogButtons } from "./DialogButtons.tsx"

type Props = {
  isOpen: boolean
  buttons?: DialogButtonProps[]
  className?: string
  id?: string
  noCloseButton?: boolean
  title?: string
  close(canceled: boolean): void
  onClose?(): void
}

export const Dialog: FCC<Props> = props => {
  const {
    buttons = [],
    className,
    close,
    noCloseButton,
    title,
    onClose,
    children,
    isOpen,
    id,
  } = props

  const handleButtonClick = useCallback(
    (f: () => void) => {
      if (typeof f === "function") {
        f()
      }

      if (typeof onClose === "function") {
        onClose()
      }

      close(false)
    },
    [close, onClose],
  )

  const contentStyle: React.CSSProperties = buttons.length === 0 ? { paddingBottom: 26 } : {}
  const height_diff_base = 77
  const height_diff_add = 33
  const padding_base = 55
  const button_count = buttons.length
  const more_button_space = Math.max(0, button_count - 1) * height_diff_add
  const height_diff = button_count > 2 ? height_diff_base - more_button_space : height_diff_base
  const height_diff_abs = Math.abs(height_diff)
  const height_diff_sign = height_diff < 0 ? "+" : "-"
  contentStyle.paddingBottom = button_count > 2 ? padding_base + more_button_space : padding_base

  const handleCloseClick = useCallback(() => close(true), [close])

  return isOpen
    ? createPortal(
        <div className={classList("modal", "modal-backdrop", className)} id={id}>
          <div className={classList("modal-container", { "more-buttons": button_count > 2 })}>
            {noCloseButton === true ? null : (
              <div className="modal-close" onClick={handleCloseClick}>
                <div>{"\uE5CD"}</div>
              </div>
            )}
            {title !== undefined && title.length > 0 ? (
              <div className="modal-header">
                <div className="modal-header-inner">{title}</div>
              </div>
            ) : null}
            <div
              className="modal-content"
              style={{ height: `calc(100% ${height_diff_sign} ${height_diff_abs}px)` }}
            >
              <div className="modal-content-inner" style={contentStyle}>
                {children}
              </div>
            </div>
            {buttons.length > 0 ? (
              <DialogButtons list={buttons} onClickDefault={handleButtonClick} />
            ) : null}
          </div>
        </div>,
        document.body,
      )
    : null
}
