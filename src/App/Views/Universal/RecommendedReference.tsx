import * as React from "react";
import { orN } from "../../../Data/Maybe";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";

interface Props {
  l10n: L10nRecord;
  strongly?: boolean
  unfamiliarSpells?: boolean
}

export const RecommendedReference: React.FC<Props> = props => {
  const { l10n, strongly, unfamiliarSpells } = props

  if (orN (unfamiliarSpells)) {
    return (
      <div className="recommended-ref">
        <div className="unrec">
          <div className="icon" />
          <div className="name">{translate (l10n) ("unfamiliarspells")}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="recommended-ref">
      {orN (strongly)
        ? (
          <div className="strongly-recommended">
            <div className="icon" />
            <div className="name">{translate (l10n) ("stronglyrecommended")}</div>
          </div>
        )
        : null}
      <div className="rec">
        <div className="icon" />
        <div className="name">{translate (l10n) ("common")}</div>
      </div>
      <div className="unrec">
        <div className="icon" />
        <div className="name">{translate (l10n) ("uncommon")}</div>
      </div>
    </div>
  )
}
