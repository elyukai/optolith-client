import type { ProgressInfo, UpdateDownloadedEvent, UpdateInfo } from "electron-updater"
import { FC, useEffect, useState } from "react"
import { Button } from "../shared/components/button/Button.tsx"
import { LoadingIndicator } from "../shared/components/loadingIndicator/LoadingIndicator.tsx"
import { ProgressBar } from "../shared/components/progressBar/ProgressBar.tsx"
import { TitleBar } from "../shared/components/titleBar/TitleBar.tsx"
import { useTranslate } from "../shared/hooks/translate.ts"
import { bytify } from "../shared/utils/translate.ts"
import { assertExhaustive } from "../shared/utils/typeSafety.ts"
import { ExternalAPI } from "./external.ts"
import "./root.scss"

type Props = {
  systemLocale: string
  locale: string | undefined
}

type UpdatePhase =
  | { type: "Checking" }
  | { type: "NoneAvailable" }
  | { type: "Available"; info: UpdateInfo }
  | { type: "Downloading"; info: ProgressInfo }
  | { type: "Downloaded"; info: UpdateDownloadedEvent }

// Inserting context bridge function directly into React components breaks.
const close = () => ExternalAPI.close()
const downloadUpdateLater = () => ExternalAPI.downloadUpdateLater()
const downloadUpdate = () => ExternalAPI.downloadUpdate()
const installUpdateLater = () => ExternalAPI.installUpdateLater()
const quitAndInstallUpdate = () => ExternalAPI.quitAndInstallUpdate()

/**
 * Root component for the updater window.
 */
export const Root: FC<Props> = props => {
  const { systemLocale, locale } = props

  const [phase, setPhase] = useState<UpdatePhase>({ type: "Checking" })

  const translate = useTranslate()

  const [prevPhase, setPrevPhase] = useState<UpdatePhase["type"] | undefined>()

  useEffect(() => {
    if (prevPhase !== phase.type) {
      if (prevPhase !== undefined) {
        document.documentElement.classList.remove(`phase--${prevPhase.toLowerCase()}`)
      }
      document.documentElement.classList.add(`phase--${phase.type.toLowerCase()}`)
      setPrevPhase(phase.type)
    }

    // const timer = setInterval(() => {
    //   // if (phase.type === "Checking") {
    //     // setPhase({ type: "NoneAvailable" })
    //   // }
    // //   else if (phase.type === "NoneAvailable") {
    //     setPhase({ type: "Available", info: {
    //       version: "1.2.3",
    //       files: [],
    //       path: "",
    //       releaseDate: "",
    //       sha512: "",
    //     } })
    // //   }
    // //   else if (phase.type === "Available") {
    //     // setPhase({ type: "Downloading", info: {
    //     //   bytesPerSecond: 12345,
    //     //   percent: 34.56,
    //     //   total: 210375942,
    //     //   transferred: 72705925.5552,
    //     //   delta: 137670016.4448,
    //     // } })
    // //   }
    // //   else if (phase.type === "Downloading") {
    // //     setPhase({ type: "Downloaded", info: {
    // //       downloadedFile: "",
    // //       files: [],
    // //       releaseDate: "",
    // //       version: "",
    // //       path: "",
    // //       sha512: "",
    // //     } })
    // //   }
    // //   else if (phase.type === "Downloaded") {
    //   // else {
    //     // setPhase({ type: "Checking" })
    //   // }
    // }, 1000)

    // return () => clearInterval(timer)

    const onUpdateAvailable = (info: UpdateInfo) => setPhase({ type: "Available", info })

    const onNoUpdateAvailable = () => setPhase({ type: "NoneAvailable" })

    const onUpdateDownloadProgress = (info: ProgressInfo) => setPhase({ type: "Downloading", info })

    const onUpdateDownloaded = (info: UpdateDownloadedEvent) =>
      setPhase({ type: "Downloaded", info })

    ExternalAPI.on("update-available", onUpdateAvailable)
    ExternalAPI.on("no-update-available", onNoUpdateAvailable)
    ExternalAPI.on("download-progress", onUpdateDownloadProgress)
    ExternalAPI.on("update-downloaded", onUpdateDownloaded)

    return () => {
      ExternalAPI.removeListener("update-available", onUpdateAvailable)
      ExternalAPI.removeListener("no-update-available", onNoUpdateAvailable)
      ExternalAPI.removeListener("download-progress", onUpdateDownloadProgress)
      ExternalAPI.removeListener("update-downloaded", onUpdateDownloaded)
    }
  }, [phase.type, prevPhase])

  const title = (() => {
    switch (phase.type) {
      case "Checking":
        return translate("Checking for updates …")
      case "NoneAvailable":
        return translate("No update available")
      case "Available":
        return translate("New version available")
      case "Downloading":
        return translate("Downloading update …")
      case "Downloaded":
        return translate("Update downloaded")
      default:
        return assertExhaustive(phase)
    }
  })()

  useEffect(() => ExternalAPI.setTitle(title), [title, translate])

  return (
    <>
      <TitleBar title={title} secondary platform={ExternalAPI.platform} onClose={close} />
      <main>
        {(() => {
          switch (phase.type) {
            case "Checking":
              return (
                <>
                  <LoadingIndicator />
                </>
              )
            case "NoneAvailable":
              return (
                <>
                  <p>{translate("You're running the latest version available.")}</p>
                  <div className="buttons">
                    <Button onClick={close}>{translate("Done")}</Button>
                  </div>
                </>
              )
            case "Available":
              return (
                <>
                  <p>
                    {translate(
                      "Version {0} is available! Do you wish to download and install?",
                      phase.info.version,
                    )}
                  </p>
                  <div className="buttons">
                    <Button onClick={downloadUpdate}>{translate("Download")}</Button>
                    <Button onClick={downloadUpdateLater}>{translate("Download Later")}</Button>
                  </div>
                </>
              )
            case "Downloading":
              return (
                <>
                  <div>
                    <div className="download-progress-info">
                      <div className="download-progress-info-size">
                        {bytify(phase.info.transferred, locale, systemLocale)}
                        {"/"}
                        {bytify(phase.info.total, locale, systemLocale)}
                      </div>
                      <div className="download-progress-info-speed">
                        {bytify(phase.info.bytesPerSecond, locale, systemLocale)}
                        {"/s"}
                      </div>
                    </div>
                    <ProgressBar orientation="horizontal" current={phase.info.percent} max={100} />
                  </div>
                  <div className="buttons">
                    <Button disabled>{translate("Quit and Install")}</Button>
                    <Button disabled>{translate("Install Later")}</Button>
                  </div>
                </>
              )
            case "Downloaded":
              return (
                <>
                  <div>
                    <div className="download-progress-info">
                      <div className="download-progress-info-size">
                        {translate("Update downloaded")}
                      </div>
                    </div>
                    <ProgressBar orientation="horizontal" current={100} max={100} />
                  </div>
                  <div className="buttons">
                    <Button onClick={quitAndInstallUpdate}>{translate("Quit and Install")}</Button>
                    <Button onClick={installUpdateLater}>{translate("Install Later")}</Button>
                  </div>
                </>
              )
            default:
              return assertExhaustive(phase)
          }
        })()}
      </main>
    </>
  )
}
