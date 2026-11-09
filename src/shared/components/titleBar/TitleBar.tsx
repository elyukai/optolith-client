import { type FC, useCallback, useEffect, useState } from "react"
import type { TypedEventEmitter } from "../../utils/events.ts"
import "./TitleBar.scss"
import { TitleBarButton } from "./TitleBarButton.tsx"
import { TitleBarTitle } from "./TitleBarTitle.tsx"
import { TitleBarWrapper } from "./TitleBarWrapper.tsx"

const useWindowState = (getWindowState?: () => Promise<boolean>) => {
  const [state, setState] = useState(false)

  useEffect(() => {
    const updateState = () => {
      getWindowState?.().then(setState).catch(console.error)
    }

    updateState()
  }, [getWindowState])

  const update = useCallback(() => {
    getWindowState?.().then(setState).catch(console.error)
  }, [getWindowState])

  return [state, update] as const
}

type Props = {
  title?: string
  secondary?: boolean
  externalAPI: {
    platform: NodeJS.Platform
    minimize?: () => void
    maximize?: () => void
    restore?: () => void
    close: () => void
    isMaximized?: () => Promise<boolean>
  } & TypedEventEmitter<{ maximize: []; unmaximize: [] }>
}

/**
 * The title bar for a window.
 */
export const TitleBar: FC<Props> = ({ title, secondary, externalAPI }) => {
  const [isMaximized, updateIsMaximized] = useWindowState(externalAPI.isMaximized)

  useEffect(() => {
    externalAPI.on("maximize", updateIsMaximized)
    externalAPI.on("unmaximize", updateIsMaximized)

    return () => {
      externalAPI.removeListener("maximize", updateIsMaximized)
      externalAPI.removeListener("unmaximize", updateIsMaximized)
    }
  }, [updateIsMaximized, externalAPI])

  if (externalAPI.platform === "darwin") {
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
        <TitleBarButton icon="&#xE903;" onClick={externalAPI.minimize} className="minimize" />
        {isMaximized ? (
          <TitleBarButton icon="&#xE902;" onClick={externalAPI.restore} className="restore" />
        ) : (
          <TitleBarButton icon="&#xE901;" onClick={externalAPI.maximize} className="maximize" />
        )}
        <TitleBarButton icon="&#xE900;" onClick={externalAPI.close} className="close" />
      </div>
    </TitleBarWrapper>
  )
}
