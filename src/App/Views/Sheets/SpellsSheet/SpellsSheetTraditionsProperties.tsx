import * as React from "react";
import { intercalate, List } from "../../../../Data/List";
import { Maybe } from "../../../../Data/Maybe";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { renderMaybe, renderMaybeWith } from "../../../Utilities/ReactUtils";

export interface SpellsSheetTraditionsPropertiesProps {
  l10n: L10nRecord
  magicalPrimary: Maybe<string>
  magicalTradition: string
  properties: Maybe<List<string>>
}

export function SpellsSheetTraditionsProperties (props: SpellsSheetTraditionsPropertiesProps) {
  const { magicalPrimary, magicalTradition, properties, l10n } = props

  return (
    <div className="tradition-properties">
      <div className="primary">
        <span className="label">
          {translate (l10n) ("primaryattribute")}
        </span>
        <span className="value">{renderMaybe (magicalPrimary)}</span>
      </div>
      <div className="properties">
        <span className="label">
          {translate (l10n) ("property")}
        </span>
        <span className="value">
          {renderMaybeWith (intercalate (", ")) (properties)}
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
