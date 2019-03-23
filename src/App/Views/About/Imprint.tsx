import * as React from 'react';
import { translate } from '../../App/Utils/I18n';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { UIMessagesObject } from '../../types/ui';

export interface ImprintProps {
  locale: UIMessagesObject;
}

export const Imprint = (props: ImprintProps) => {
  const { locale } = props;

  return (
    <Page id="imprint">
      <Scroll className="text">
        <h2>{translate (locale, 'imprint.title')}</h2>

        <h3>Lukas Obermann</h3>
        <p>
          Ballastbrücke 29<br/>
          24937 Flensburg<br/>
          Germany<br/>
          <a href="mailto:support@optolith.app">support@optolith.app</a>
        </p>

        <h3>Thore Schuchardt</h3>
        <p>
          Lehmberg 7b<br/>
          24361 Groß Wittensee<br/>
          Germany
        </p>
      </Scroll>
    </Page>
  );
};