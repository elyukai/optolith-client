import * as React from "react";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";

export interface RecommendedReferenceProps {
  l10n: L10nRecord;
  strongly?: boolean
  unfamiliarSpells?: boolean
}

export function RecommendedReference (props: RecommendedReferenceProps) {
  const { l10n, strongly, unfamiliarSpells } = props

  if (unfamiliarSpells === true) {
    return (
      <div className="recommended-ref">
        <div className="unrec">
          <div className="icon"></div>
          <div className="name">{translate (l10n) ("unfamiliarspells")}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="recommended-ref">
      {strongly === true
        ? (
          <div className="strongly-recommended">
            <div className="icon"></div>
            <div className="name">{translate (l10n) ("stronglyrecommended")}</div>
          </div>
        )
        : null}
      <div className="rec">
        <div className="icon"></div>
        <div className="name">{translate (l10n) ("common")}</div>
      </div>
      <div className="unrec">
        <div className="icon"></div>
        <div className="name">{translate (l10n) ("uncommon")}</div>
      </div>
    </div>
  )
}
