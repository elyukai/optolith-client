import * as fs from "fs"
import * as path from "path"
import * as React from "react"
import { L10n } from "../../Models/Wiki/L10n"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { app_path } from "../../Selectors/envSelectors"
import { Markdown } from "../Universal/Markdown"
import { Page } from "../Universal/Page"
import { Scroll } from "../Universal/Scroll"

const getPath =
  (staticData: StaticDataRecord) =>
    path.join (
      app_path,
      "app",
      "Docs",
      L10n.A.id (StaticData.A.ui (staticData)),
      "CHANGELOG.md"
    )

interface LastChangesProps {
  staticData: StaticDataRecord
}

export const LastChanges: React.FC<LastChangesProps> = ({ staticData }) => {
  const [ text, setText ] = React.useState<string> ("...")

  React.useEffect (
    () => {
      fs.promises.readFile (getPath (staticData), "utf-8")
        .then (setText)
        .catch (err => {
          console.error (err)
          setText ("Changelog could not be loaded")
        })
    },
    [ staticData ]
  )

  return (
    <Page id="last-changes">
      <Scroll className="text">
        <Markdown source={text} />
      </Scroll>
    </Page>
  )
}
