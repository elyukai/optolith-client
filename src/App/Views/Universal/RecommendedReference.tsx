import * as React from "react";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";

export interface RecommendedReferenceProps {
  l10n: L10nRecord;
}

export function RecommendedReference (props: RecommendedReferenceProps) {
  return (
    <div className="recommended-ref">
      <div className="rec">
        <div className="icon"></div>
        <div className="name">{translate (props.l10n) ("common")}</div>
      </div>
      <div className="unrec">
        <div className="icon"></div>
        <div className="name">{translate (props.l10n) ("uncommon")}</div>
      </div>
    </div>
  );
}
