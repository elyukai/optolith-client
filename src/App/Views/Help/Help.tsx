import * as fs from "fs";
import * as path from "path";
import * as React from "react";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { app_path } from "../../Selectors/envSelectors";
import { Markdown } from "../Universal/Markdown";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";

export interface HelpOwnProps {
  l10n: L10nRecord
}

export interface HelpStateProps {
}

export interface HelpDispatchProps {
}

export type HelpProps = HelpStateProps & HelpDispatchProps & HelpOwnProps

export const Help = (props: HelpProps) => {
  const { l10n } = props
  const text = fs.readFileSync (
    path.join (app_path, "app", "Database", L10n.A.id (l10n), `FAQ.md`),
    "UTF-8"
  )

  return (
    <Page id="help">
      <Scroll>
        <Markdown source={text} />
      </Scroll>
    </Page>
  )
}
