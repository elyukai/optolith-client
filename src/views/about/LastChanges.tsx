import { remote } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';

export const LastChanges = () => (
  <Page id="last-changes">
    <Scroll className="text">
      <Markdown
        source={fs.readFileSync (path.join (remote.app.getAppPath (), 'CHANGELOG.md'), 'UTF-8')}
        />
    </Scroll>
  </Page>
);
