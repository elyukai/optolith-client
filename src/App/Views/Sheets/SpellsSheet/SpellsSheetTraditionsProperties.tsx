import * as React from "react";
import { translate, UIMessagesObject } from "../../../Utilities/I18n";

export interface SpellsSheetTraditionsPropertiesProps {
  locale: UIMessagesObject
  magicalPrimary: Maybe<string>
  magicalTradition: Maybe<string>
  properties: Maybe<List<string>>
}

export function SpellsSheetTraditionsProperties (props: SpellsSheetTraditionsPropertiesProps) {
  const { magicalPrimary, magicalTradition, properties, locale } = props

  return (
    <div className="tradition-properties">
      <div className="primary">
        <span className="label">
          {translate (l10n) ("charactersheet.spells.traditionsproperties.labels.primaryattribute")}
        </span>
        <span className="value">{Maybe.fromMaybe ("") (magicalPrimary)}</span>
      </div>
      <div className="properties">
        <span className="label">
          {translate (l10n) ("charactersheet.spells.traditionsproperties.labels.properties")}
        </span>
        <span className="value">
          {Maybe.fromMaybe ("") (properties .fmap (List.intercalate (", ")))}
        </span>
      </div>
      <div className="tradition">
        <span className="label">
          {translate (l10n) ("charactersheet.spells.traditionsproperties.labels.tradition")}
        </span>
        <span className="value">{Maybe.fromMaybe ("") (magicalTradition)}</span>
      </div>
    </div>
  )
}
