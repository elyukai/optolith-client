import * as fs from "fs";
import * as path from "path";
import * as React from "react";
import { app_path } from "../../Selectors/envSelectors";
import { Markdown } from "../Universal/Markdown";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";

export const LastChanges = () => (
  <Page id="last-changes">
    <Scroll className="text">
      <Markdown source={fs.readFileSync (path.join (app_path, "CHANGELOG.md"), "UTF-8")} />
    </Scroll>
  </Page>
)
