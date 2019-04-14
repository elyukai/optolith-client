import classNames = require("classnames")
import * as React from "react";
import { connect } from "react-redux";
import { AppStateRecord } from "../../Reducers/appReducer";
import { getTheme } from "../../Selectors/uisettingsSelectors";
import { close, createOverlay } from "../../Utilities/createOverlay";
import { Overlay } from "./Overlay";

export interface TooltipToggleOwnProps {
  content: React.ReactNode
  margin?: number
  small?: boolean
  position?: "top" | "bottom" | "left" | "right"
}

export interface TooltipToggleStateProps {
  theme: string
}

export interface TooltipToggleDispatchProps {
}

export type TooltipToggleProps =
  TooltipToggleStateProps
  & TooltipToggleDispatchProps
  & TooltipToggleOwnProps

export class TooltipToggleWrapped extends React.Component<TooltipToggleProps, {}> {
  node?: HTMLElement

  componentWillUnmount () {
    if (this.node) {
      close (this.node)
    }
  }

  open = (event: React.MouseEvent<HTMLElement>) => {
    const { content, margin, position = "top", small, theme } = this.props

    this.node = createOverlay (
      <Overlay
        className={
          classNames (
            "tooltip",
            `theme-${theme}`,
            small === true ? "tooltip-small" : undefined
          )
        }
        position={position}
        trigger={event.currentTarget}
        margin={margin}
        >
        {content}
      </Overlay>
    )
  }

  close = () => {
    if (this.node) {
      close (this.node)
      this.node = undefined
    }
  }

  render () {
    const { children } = this.props

    return React.cloneElement (
      React.Children.only (children) as any,
      {
        onMouseOver: this.open,
        onMouseOut: this.close,
      }
    )
  }
}

const mapStateToProps = (state: AppStateRecord): TooltipToggleStateProps => ({
  theme: getTheme (state),
})

const connectTooltipToggle =
  connect<
    TooltipToggleStateProps,
    TooltipToggleDispatchProps,
    TooltipToggleOwnProps,
    AppStateRecord
  > (
    mapStateToProps
  )

export const TooltipToggle = connectTooltipToggle (TooltipToggleWrapped)
