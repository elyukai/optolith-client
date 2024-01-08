import { FC, useEffect, useState } from "react"
import { Main } from "../../../shared/components/main/Main.tsx"
import { Page } from "../../../shared/components/page/Page.tsx"
import { Scroll } from "../../../shared/components/scroll/Scroll.tsx"
import { ExternalAPI } from "../../external.ts"
import "./ThirdPartyLicenses.scss"

let savedVersion: string | undefined = undefined
let savedText: string | undefined = undefined

/**
 * Returns a page that shows licenses of third-party software.
 */
export const ThirdPartyLicenses: FC = () => {
  const [version, setVersion] = useState(savedVersion ?? "0.0.0")
  const [text, setText] = useState(savedText ?? "...")

  useEffect(() => {
    if (savedText === undefined) {
      ExternalAPI.getLicense()
        .then(loadedText => {
          setText(loadedText)
          savedText = loadedText
        })
        .catch(err => {
          console.error(err)
          setText("Third-party licenses could not be loaded")
        })
    }

    if (savedVersion === undefined) {
      ExternalAPI.getVersion()
        .then(loadedVersion => {
          setVersion(loadedVersion)
          savedVersion = loadedVersion
        })
        .catch(console.error)
    }
  }, [])

  return (
    <Page id="third-party-licenses">
      <Main>
        <Scroll className="text">
          <h2>
            {"Optolith Desktop Client v"}
            {version}
          </h2>
          <p>{"Third Party Software and Content Licenses"}</p>
          <pre className="third-party-software-body">{text}</pre>
        </Scroll>
      </Main>
    </Page>
  )
}
