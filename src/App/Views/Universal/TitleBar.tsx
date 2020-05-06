import { remote } from "electron"
import * as React from "react"
import { TitleBarButton } from "./TitleBarButton"
import { TitleBarWrapper } from "./TitleBarWrapper"

interface Props {
  platform: string
  minimize (): void
  maximize (): void
  restore (): void
  close (): void
  enterFullscreen (): void
  leaveFullscreen (): void
}

const win = remote.getCurrentWindow ()

export const TitleBar: React.FC<Props> = props => {
  const {
    platform,
    maximize,
    minimize,
    restore,
    enterFullscreen,
    leaveFullscreen,
    close,
  } = props

  const [ isMaximized, setIsMaximized ] = React.useState (win .isMaximized ())
  const [ isFullScreen, setIsFullScreen ] = React.useState (win .isFullScreen ())
  const [ isFocused, setIsFocused ] = React.useState (win .isFocused ())

  const handleMaximized = React.useCallback (
    () => setIsMaximized (remote.getCurrentWindow () .isMaximized ()),
    []
  )

  const handleFullScreen = React.useCallback (
    () => setIsFullScreen (remote.getCurrentWindow () .isFullScreen ()),
    []
  )

  const handleFocused = React.useCallback (
    () => setIsFocused (remote.getCurrentWindow () .isFocused ()),
    []
  )

  React.useEffect (
    () => {
      remote.getCurrentWindow ()
        .addListener ("maximize", handleMaximized)
        .addListener ("unmaximize", handleMaximized)
        .addListener ("enter-full-screen", handleFullScreen)
        .addListener ("leave-full-screen", handleFullScreen)
        .addListener ("blur", handleFocused)
        .addListener ("focus", handleFocused)

      return () => {
        remote.getCurrentWindow ()
          .removeListener ("maximize", handleMaximized)
          .removeListener ("unmaximize", handleMaximized)
          .removeListener ("enter-full-screen", handleFullScreen)
          .removeListener ("leave-full-screen", handleFullScreen)
          .removeListener ("blur", handleFocused)
          .removeListener ("focus", handleFocused)
      }
    },
    [ handleMaximized, handleFullScreen, handleFocused ]
  )

  if (platform === "darwin") {
    return (
      <TitleBarWrapper isFocused={isFocused}>
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
    <TitleBarWrapper isFocused={isFocused}>
      <TitleBarButton icon="&#xE903;" onClick={minimize} className="minimize" />
      {isMaximized
        ? null
        : <TitleBarButton icon="&#xE901;" onClick={maximize} className="maximize" />}
      {isMaximized
        ? <TitleBarButton icon="&#xE902;" onClick={restore} className="restore" />
        : null}
      <TitleBarButton icon="&#xE900;" onClick={close} className="close" />
    </TitleBarWrapper>
  )
}
