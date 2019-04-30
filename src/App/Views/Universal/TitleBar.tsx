import { remote } from "electron";
import * as React from "react";
import { TitleBarButton } from "./TitleBarButton";
import { TitleBarWrapper } from "./TitleBarWrapper";

export interface TitleBarProps {
  platform: string
  minimize (): void
  maximize (): void
  restore (): void
  close (): void
  enterFullscreen (): void
  leaveFullscreen (): void
}

export interface TitleBarState {
  isMaximized: boolean
  isFullScreen: boolean
  isFocused: boolean
}

export class TitleBar extends React.Component<TitleBarProps, TitleBarState> {
  state = {
    isMaximized: remote.getCurrentWindow ().isMaximized (),
    isFullScreen: remote.getCurrentWindow ().isFullScreen (),
    isFocused: remote.getCurrentWindow ().isFocused (),
  }

  componentDidMount () {
    const win = remote.getCurrentWindow ()
    win
      .addListener ("maximize", this.updateState)
      .addListener ("unmaximize", this.updateState)
      .addListener ("enter-full-screen", this.updateState)
      .addListener ("leave-full-screen", this.updateState)
      .addListener ("blur", this.updateState)
      .addListener ("focus", this.updateState)
  }

  componentWillUnmount () {
    const win = remote.getCurrentWindow ()
    win
      .removeListener ("maximize", this.updateState)
      .removeListener ("unmaximize", this.updateState)
      .removeListener ("enter-full-screen", this.updateState)
      .removeListener ("leave-full-screen", this.updateState)
      .removeListener ("blur", this.updateState)
      .removeListener ("focus", this.updateState)
  }

  render () {
    const {
      close,
      platform,
      maximize,
      minimize,
      restore,
      enterFullscreen,
      leaveFullscreen,
    } = this.props

    const { isMaximized, isFullScreen } = this.state

    if (platform === "darwin") {
      return (
        <TitleBarWrapper {...this.state}>
          <div className="macos-hover-area">
            <TitleBarButton icon="&#xE900;" onClick={close} className="close" />
            <TitleBarButton icon="&#xE903;" onClick={minimize} className="minimize" />
            {
              isFullScreen
              ? <TitleBarButton icon="&#xE902;" onClick={leaveFullscreen} className="fullscreen" />
              : <TitleBarButton icon="&#xE901;" onClick={enterFullscreen} className="fullscreen" />
            }
          </div>
        </TitleBarWrapper>
      )
    }

    return (
      <TitleBarWrapper {...this.state}>
        <TitleBarButton icon="&#xE903;" onClick={minimize} className="minimize" />
        {!isMaximized
          ? <TitleBarButton icon="&#xE901;" onClick={maximize} className="maximize" />
          : null}
        {isMaximized
          ? <TitleBarButton icon="&#xE902;" onClick={restore} className="restore" />
          : null}
        <TitleBarButton icon="&#xE900;" onClick={close} className="close" />
      </TitleBarWrapper>
    )
  }

  private readonly updateState = () => {
    this.setState ({
      isMaximized: remote.getCurrentWindow ().isMaximized (),
      isFullScreen: remote.getCurrentWindow ().isFullScreen (),
      isFocused: remote.getCurrentWindow ().isFocused (),
    })
  }
}
