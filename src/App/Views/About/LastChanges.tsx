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
    path.join (app_path, "app", "Database", L10n.A.id (l10n),  "CHANGELOG.md")

export const LastChanges = (props: { l10n: L10nRecord }) => (
  <Page id="last-changes">
    <Scroll className="text">
      <Markdown source={fs.readFileSync (getPath (props.l10n), "UTF-8")} />
    </Scroll>
  </Page>
)
