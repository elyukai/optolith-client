import * as React from 'react';
import { translate, UIMessagesObject } from '../utils/I18n';

export interface RecommendedReferenceProps {
  locale: UIMessagesObject;
}

export function RecommendedReference (props: RecommendedReferenceProps) {
  return (
    <div className="recommended-ref">
      <div className="rec">
        <div className="icon"></div>
        <div className="name">{translate (props.locale, 'view.commoninculture')}</div>
      </div>
      <div className="unrec">
        <div className="icon"></div>
        <div className="name">{translate (props.locale, 'view.uncommoninculture')}</div>
      </div>
    </div>
  );
}
