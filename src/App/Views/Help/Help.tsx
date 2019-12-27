import * as fs from "fs";
import * as path from "path";
import * as React from "react";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { app_path } from "../../Selectors/envSelectors";
import { Markdown } from "../Universal/Markdown";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";

const getPath =
  (l10n: L10nRecord) =>
    path.join (app_path, "app", "Database", L10n.A.id (l10n), `FAQ.md`)

export interface HelpOwnProps {
  l10n: L10nRecord
}

export interface HelpStateProps {
}

export interface HelpDispatchProps {
}

export type HelpProps = HelpStateProps & HelpDispatchProps & HelpOwnProps

export const Help: React.FC<HelpProps> = ({ l10n }) => {
  const [ text, setText ] = React.useState<string> ("...")

  React.useEffect (
    () => {
      fs.promises.readFile (getPath (l10n), "utf-8")
        .then (setText)
        .catch (err => {
          console.error (err)
          setText ("Last Changes could not be loaded")
        })
    },
    [ l10n ]
  )

  return (
    <Page id="last-changes">
      <Scroll className="text">
        <Markdown source={text} />
      </Scroll>
    </Page>
  )
}
