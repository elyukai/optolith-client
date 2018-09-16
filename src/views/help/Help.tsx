import { remote } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { UIMessagesObject } from '../../utils/I18n';

export interface HelpOwnProps {
  locale: UIMessagesObject;
}

export interface HelpStateProps {
}

export interface HelpDispatchProps {
}

export type HelpProps = HelpStateProps & HelpDispatchProps & HelpOwnProps;

export const Help = (props: HelpProps) => {
  const { locale } = props;
  const text = fs.readFileSync (
    path.join (remote.app.getAppPath (), 'app', 'docs', `FAQ.${locale.get ('id')}.md`),
    'UTF-8'
  );

  return (
    <Page id="help">
      <Scroll>
        <Markdown source={text} />
      </Scroll>
    </Page>
  );
};
