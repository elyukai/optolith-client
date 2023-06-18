import { FC, useCallback, useEffect, useState } from "react"
import { TypedEventEmitterForEvent } from "../../utils/events.ts"
import "./TitleBar.scss"
import { TitleBarButton } from "./TitleBarButton.tsx"
import { TitleBarTitle } from "./TitleBarTitle.tsx"
import { TitleBarWrapper } from "./TitleBarWrapper.tsx"

const useWindowState = (getWindowState?: () => Promise<boolean>) => {
  const [ state, setState ] = useState(false)

  useEffect(() => {
    const updateState = () => {
      getWindowState?.()
        .then(setState)
        .catch(console.error)
    }

    updateState()
  }, [ getWindowState ])

  const update = useCallback(() => {
    getWindowState?.()
      .then(setState)
      .catch(console.error)
  }, [ getWindowState ])

  return [ state, update ] as const
}

type Props = {
  title?: string
  secondary?: boolean
  platform: NodeJS.Platform
  maximizeEvents?:
    & TypedEventEmitterForEvent<"maximize", []>
    & TypedEventEmitterForEvent<"unmaximize", []>
  onMinimize?: () => void
  onMaximize?: () => void
  onRestore?: () => void
  onClose: () => void
  isMaximized?: () => Promise<boolean>
}

export const TitleBar: FC<Props> = props => {
  const {
    title,
    secondary,
    platform,
    maximizeEvents,
    onMinimize,
    onMaximize,
    onRestore,
    onClose,
    isMaximized: getIsMaximized,
  } = props

  const [ isMaximized, updateIsMaximized ] = useWindowState(getIsMaximized)

  useEffect(
    () => {
      maximizeEvents?.on("maximize", updateIsMaximized)
      maximizeEvents?.on("unmaximize", updateIsMaximized)

      return () => {
        maximizeEvents?.removeListener("maximize", updateIsMaximized)
        maximizeEvents?.removeListener("unmaximize", updateIsMaximized)
      }
    },
    [ updateIsMaximized, maximizeEvents ]
  )

  if (platform === "darwin") {
    return (
      <TitleBarWrapper secondary={secondary}>
        <div className="macos-hover-area" />
        <TitleBarTitle title={title} />
      </TitleBarWrapper>
    )
  }

  return (
    <TitleBarWrapper secondary={secondary}>
      <TitleBarTitle title={title} />
      <div>
        <TitleBarButton icon="&#xE903;" onClick={onMinimize} className="minimize" />
        {isMaximized
          ? <TitleBarButton icon="&#xE902;" onClick={onRestore} className="restore" />
          : <TitleBarButton icon="&#xE901;" onClick={onMaximize} className="maximize" />}
        <TitleBarButton icon="&#xE900;" onClick={onClose} className="close" />
      </div>
    </TitleBarWrapper>
  )
}
