import { FC, useCallback, useEffect, useState } from "react"
import { preloadApi } from "../../preloadApi.ts"
import "./TitleBar.scss"
import { TitleBarButton } from "./TitleBarButton.tsx"
import { TitleBarWrapper } from "./TitleBarWrapper.tsx"

const useWindowState = (stateKey: "isMaximized" | "isFullScreen" | "isFocused") => {
  const [ state, setState ] = useState(false)

  useEffect(() => {
    const updateState = () => {
      preloadApi[stateKey]()
        .then(setState)
        .catch(console.error)
    }

    updateState()
  }, [ stateKey ])

  const update = useCallback(() => {
    preloadApi[stateKey]()
      .then(setState)
      .catch(console.error)
  }, [ stateKey ])

  return [ state, update ] as const
}

const handleMinimize = preloadApi.minimize
const handleLeaveFullScreen = preloadApi.leaveFullScreen
const handleEnterFullScreen = preloadApi.enterFullScreen
const handleMaximize = preloadApi.maximize
const handleRestore = preloadApi.restore
const handleClose = preloadApi.close

export const TitleBar: FC = () => {
  const [ isMaximized, updateIsMaximized ] = useWindowState("isMaximized")
  const [ isFullScreen, updateIsFullScreen ] = useWindowState("isFullScreen")
  const [ isFocused, updateIsFocused ] = useWindowState("isFocused")

  useEffect(
    () => {
      preloadApi.on("maximize", updateIsMaximized)
      preloadApi.on("unmaximize", updateIsMaximized)
      preloadApi.on("enter-full-screen", updateIsFullScreen)
      preloadApi.on("leave-full-screen", updateIsFullScreen)
      preloadApi.on("blur", updateIsFocused)
      preloadApi.on("focus", updateIsFocused)

      return () => {
        preloadApi.removeListener("maximize", updateIsMaximized)
        preloadApi.removeListener("unmaximize", updateIsMaximized)
        preloadApi.removeListener("enter-full-screen", updateIsFullScreen)
        preloadApi.removeListener("leave-full-screen", updateIsFullScreen)
        preloadApi.removeListener("blur", updateIsFocused)
        preloadApi.removeListener("focus", updateIsFocused)
      }
    },
    [ updateIsFocused, updateIsFullScreen, updateIsMaximized ]
  )

  if (preloadApi.platform === "darwin") {
    return (
      <TitleBarWrapper isFocused={isFocused}>
        <div className="macos-hover-area">
          <TitleBarButton icon="&#xE900;" onClick={handleClose} className="close" />
          <TitleBarButton icon="&#xE903;" onClick={handleMinimize} className="minimize" />
          {
            isFullScreen
            ? (
              <TitleBarButton
                icon="&#xE902;"
                onClick={handleLeaveFullScreen}
                className="fullscreen"
                />
            )
            : (
              <TitleBarButton
                icon="&#xE901;"
                onClick={handleEnterFullScreen}
                className="fullscreen"
                />
            )
          }
        </div>
      </TitleBarWrapper>
    )
  }

  return (
    <TitleBarWrapper isFocused={isFocused}>
      <TitleBarButton icon="&#xE903;" onClick={handleMinimize} className="minimize" />
      {isMaximized
        ? null
        : <TitleBarButton icon="&#xE901;" onClick={handleMaximize} className="maximize" />}
      {isMaximized
        ? <TitleBarButton icon="&#xE902;" onClick={handleRestore} className="restore" />
        : null}
      <TitleBarButton icon="&#xE900;" onClick={handleClose} className="close" />
    </TitleBarWrapper>
  )
}
