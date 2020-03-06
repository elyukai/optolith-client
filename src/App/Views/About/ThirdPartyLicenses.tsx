import * as fs from "fs"
import * as path from "path"
import * as React from "react"
import { app_path, current_version } from "../../Selectors/envSelectors"
import { Page } from "../Universal/Page"
import { Scroll } from "../Universal/Scroll"

export const ThirdPartyLicenses = () => {
  const [ text, setText ] = React.useState<string> ("...")

  React.useEffect (
    () => {
      fs.promises.readFile (path.join (app_path, "LICENSE"), "utf-8")
        .then (setText)
        .catch (err => {
          console.error (err)
          setText ("Third-party licenses could not be loaded")
        })
    },
    []
  )

  return (
    <Page id="last-changes">
      <Scroll className="text">
        <h2>
          {"Optolith Desktop Client v"}
          {current_version}
        </h2>
        <p>{"Third Party Software and Content Licenses"}</p>
        <pre className="third-party-software-body">
          {text}
        </pre>
      </Scroll>
    </Page>
  )
}
