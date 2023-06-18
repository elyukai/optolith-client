import type { UpdateInfo } from "electron-updater"
import { Locale } from "optolith-database-schema/types/Locale"
import { UI } from "optolith-database-schema/types/UI"
import { FC, useEffect, useMemo, useState } from "react"
import { TitleBar } from "../shared/components/titleBar/TitleBar.tsx"
import { createTranslate } from "../shared/utils/translate.ts"
import { ExternalAPI } from "./external.ts"

type Props = {
  translations: Record<string, UI>
  locales: Record<string, Locale>
  systemLocale: string
  locale: string | undefined
}

type CheckResult =
  | { type: "available"; info: UpdateInfo }
  | { type: "none" }

export const Root: FC<Props> = props => {
  const { translations, locales, systemLocale, locale } = props

  const [ updateInfo, setUpdateInfo ] = useState<CheckResult | undefined>()

  const translate = useMemo(
    () => createTranslate(
      translations,
      locales,
      locale,
      systemLocale
    ),
    [ locale, locales, systemLocale, translations ]
  )

  useEffect(() => {
    const onUpdateAvailable = (newUpdateInfo: UpdateInfo) =>
      setUpdateInfo({ type: "available", info: newUpdateInfo })

    const onNoUpdateAvailable = () =>
      setUpdateInfo({ type: "none" })

    ExternalAPI.on("update-available", onUpdateAvailable)
    ExternalAPI.on("no-update-available", onNoUpdateAvailable)

    return () => {
      ExternalAPI.removeListener("update-available", onUpdateAvailable)
      ExternalAPI.removeListener("no-update-available", onNoUpdateAvailable)
    }
  }, [])

  const title =
    updateInfo === undefined
    ? "Searching for update …"
    : updateInfo.type === "none"
    ? translate("No Update Available")
    : translate("New Version Available")

  useEffect(() => ExternalAPI.setTitle(title), [ title, translate ])

  return (
    <>
      <TitleBar
        title={title}
        secondary
        platform={ExternalAPI.platform}
        onClose={ExternalAPI.close}
        />
      <main>
        <h1>{title}</h1>
      </main>
    </>
  )
}
