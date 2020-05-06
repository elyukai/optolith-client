import * as React from "react"
import * as ReactDOM from "react-dom"
import { connect } from "react-redux"
import { List, notNullStrUndef } from "../../../Data/List"
import { guardReplace, Just, Maybe } from "../../../Data/Maybe"
import { abs, max } from "../../../Data/Num"
import { AppStateRecord } from "../../Models/AppState"
import { Theme } from "../../Models/Config"
import { getTheme } from "../../Selectors/uisettingsSelectors"
import { classListMaybe } from "../../Utilities/CSS"
import { DialogButtonProps } from "./DialogButton"
import { DialogButtons } from "./DialogButtons"

const modals_root = document.querySelector ("#modals-root")

export interface DialogOwnProps {
  isOpen: boolean
  buttons?: DialogButtonProps[]
  className?: string
  id?: string
  noCloseButton?: boolean
  title?: string
  close (canceled: boolean): void
  onClose? (): void
}

export interface DialogDispatchProps { }

export interface DialogStateProps {
  theme: Theme
}

type Props = DialogOwnProps & DialogDispatchProps & DialogStateProps

export const DialogComp: React.FC<Props> = props => {
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
    theme,
  } = props

  const element = React.useMemo (() => document.createElement ("div"), [])

  React.useEffect (
    () => {
      if (modals_root !== null) {
        modals_root.appendChild (element)

        return () => {
          modals_root.removeChild (element)
        }
      }

      return undefined
    },
    [ element ]
  )

  const handleButtonClick = React.useCallback (
    (f: () => void) => {
      if (typeof f === "function") {
        f ()
      }

      if (typeof onClose === "function") {
        onClose ()
      }

      close (false)
    },
    [ close, onClose ]
  )

  const contentStyle: React.CSSProperties = buttons.length === 0 ? { paddingBottom: 26 } : {}
  const height_diff_base = 77
  const height_diff_add = 33
  const padding_base = 55
  const button_count = buttons .length
  const more_button_space = max (0) (button_count - 1) * height_diff_add
  const height_diff = button_count > 2 ? height_diff_base - more_button_space : height_diff_base
  const height_diff_abs = abs (height_diff)
  const height_diff_sign = height_diff < 0 ? "+" : "-"
  contentStyle.paddingBottom = button_count > 2 ? padding_base + more_button_space : padding_base

  const handleCloseClick = React.useCallback (
    () => close (true),
    [ close ]
  )

  return isOpen
    ? ReactDOM.createPortal (
        <div
          className={
            classListMaybe (List (
              Just ("modal modal-backdrop"),
              Just (`theme-${theme}`),
              Maybe (className)
            ))
          }
          id={id}
          >
          <div
            className={
              classListMaybe (List (
                Just ("modal-container"),
                guardReplace (button_count > 2) ("more-buttons")
              ))
            }
            >
            {noCloseButton === true
              ? null
              : <div className="modal-close" onClick={handleCloseClick}><div>{"\uE5CD"}</div></div>}
            {notNullStrUndef (title)
              ? (
                <div className="modal-header">
                  <div className="modal-header-inner">{title}</div>
                </div>
              )
              : null}
            <div
              className="modal-content"
              style={{ height: `calc(100% ${height_diff_sign} ${height_diff_abs}px)` }}
              >
              <div className="modal-content-inner" style={contentStyle}>
                {children}
              </div>
            </div>
            {buttons.length > 0
              ? <DialogButtons list={buttons} onClickDefault={handleButtonClick} />
              : null}
          </div>
        </div>,
        element
      )
    : null
}

const mapStateToProps = (state: AppStateRecord) => ({
  theme: getTheme (state),
})

const connectDialog =
  connect<
    DialogStateProps,
    DialogDispatchProps,
    React.PropsWithChildren<DialogOwnProps>,
    AppStateRecord
  > (
    mapStateToProps
  )

export const Dialog = connectDialog (DialogComp)
