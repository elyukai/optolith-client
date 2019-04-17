import * as React from "react";
import { translate, UIMessagesObject } from "../../../Utilities/I18n";

export interface LiturgicalChantsSheetTraditionsAspectsProps {
  aspects: Maybe<List<string>>
  blessedPrimary: Maybe<string>
  blessedTradition: Maybe<string>
  locale: UIMessagesObject
}

export function LiturgicalChantsSheetTraditionsAspects (
  props: LiturgicalChantsSheetTraditionsAspectsProps
) {
  const { aspects, blessedPrimary, blessedTradition, locale } = props

  return (
    <div className="tradition-aspects">
      <div className="primary">
        <span className="label">
          {translate (locale, "charactersheet.chants.traditionsaspects.labels.primaryattribute")}
        </span>
        <span className="value">{Maybe.fromMaybe ("") (blessedPrimary)}</span>
      </div>
      <div className="aspects">
        <span className="label">
          {translate (locale, "charactersheet.chants.traditionsaspects.labels.aspects")}
        </span>
        <span className="value">
          {Maybe.fromMaybe ("") (aspects .fmap (List.intercalate (", ")))}
        </span>
      </div>
      <div className="tradition">
        <span className="label">
          {translate (locale, "charactersheet.chants.traditionsaspects.labels.tradition")}
        </span>
        <span className="value">{Maybe.fromMaybe ("") (blessedTradition)}</span>
      </div>
    </div>
  )
}
