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
    path.join (app_path, "app", "Database", L10n.A.id (l10n), "CHANGELOG.md")

interface LastChangesProps {
  l10n: L10nRecord
}

export const LastChanges: React.FC<LastChangesProps> = ({ l10n }) => (
  <Page id="last-changes">
    <Scroll className="text">
      <Markdown source={fs.readFileSync (getPath (l10n), "UTF-8")} />
    </Scroll>
  </Page>
)
