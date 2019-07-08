import * as React from "react";
import { intercalate, List } from "../../../../Data/List";
import { Maybe } from "../../../../Data/Maybe";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { renderMaybe } from "../../../Utilities/ReactUtils";

export interface SpellsSheetTraditionsPropertiesProps {
  l10n: L10nRecord
  magicalPrimary: List<string>
  magicalTradition: string
  properties: Maybe<string>
}

export function SpellsSheetTraditionsProperties (props: SpellsSheetTraditionsPropertiesProps) {
  const { magicalPrimary, magicalTradition, properties, l10n } = props

  return (
    <div className="tradition-properties">
      <div className="primary">
        <span className="label">
          {translate (l10n) ("primaryattribute")}
        </span>
        <span className="value">{intercalate ("/") (magicalPrimary)}</span>
      </div>
      <div className="properties">
        <span className="label">
          {translate (l10n) ("property")}
        </span>
        <span className="value">
          {renderMaybe (properties)}
        </span>
      </div>
      <div className="tradition">
        <span className="label">
          {translate (l10n) ("tradition")}
        </span>
        <span className="value">{magicalTradition}</span>
      </div>
    </div>
  )
}
