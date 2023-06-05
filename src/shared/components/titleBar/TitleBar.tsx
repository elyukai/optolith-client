import { FC, useCallback, useEffect, useState } from "react"
import { TypedEventEmitterForEvent } from "../../utils/events.ts"
import "./TitleBar.scss"
import { TitleBarButton } from "./TitleBarButton.tsx"
import { TitleBarWrapper } from "./TitleBarWrapper.tsx"

const useWindowState = (getWindowState: () => Promise<boolean>) => {
  const [ state, setState ] = useState(false)

  useEffect(() => {
    const updateState = () => {
      getWindowState()
        .then(setState)
        .catch(console.error)
    }

    updateState()
  }, [ getWindowState ])

  const update = useCallback(() => {
    getWindowState()
      .then(setState)
      .catch(console.error)
  }, [ getWindowState ])

  return [ state, update ] as const
}

type Props = {
  platform: NodeJS.Platform
  windowEvents:
    & TypedEventEmitterForEvent<"maximize", []>
    & TypedEventEmitterForEvent<"unmaximize", []>
    & TypedEventEmitterForEvent<"blur", []>
    & TypedEventEmitterForEvent<"focus", []>
  onMinimize: () => void
  onMaximize: () => void
  onRestore: () => void
  onClose: () => void
  isMaximized: () => Promise<boolean>
  isFocused: () => Promise<boolean>
}

export const TitleBar: FC<Props> = props => {
  const {
    platform,
    windowEvents,
    onMinimize,
    onMaximize,
    onRestore,
    onClose,
    isMaximized: getIsMaximized,
    isFocused: getIsFocused,
  } = props

  const [ isMaximized, updateIsMaximized ] = useWindowState(getIsMaximized)
  const [ isFocused, updateIsFocused ] = useWindowState(getIsFocused)

  useEffect(
    () => {
      windowEvents.on("maximize", updateIsMaximized)
      windowEvents.on("unmaximize", updateIsMaximized)
      windowEvents.on("blur", updateIsFocused)
      windowEvents.on("focus", updateIsFocused)

      return () => {
        windowEvents.removeListener("maximize", updateIsMaximized)
        windowEvents.removeListener("unmaximize", updateIsMaximized)
        windowEvents.removeListener("blur", updateIsFocused)
        windowEvents.removeListener("focus", updateIsFocused)
      }
    },
    [ updateIsFocused, updateIsMaximized, windowEvents ]
  )

  if (platform === "darwin") {
    return (
      <TitleBarWrapper isFocused={isFocused}>
        <div className="macos-hover-area" />
      </TitleBarWrapper>
    )
  }

  return (
    <TitleBarWrapper isFocused={isFocused}>
      <TitleBarButton icon="&#xE903;" onClick={onMinimize} className="minimize" />
      {isMaximized
        ? null
        : <TitleBarButton icon="&#xE901;" onClick={onMaximize} className="maximize" />}
      {isMaximized
        ? <TitleBarButton icon="&#xE902;" onClick={onRestore} className="restore" />
        : null}
      <TitleBarButton icon="&#xE900;" onClick={onClose} className="close" />
    </TitleBarWrapper>
  )
}
