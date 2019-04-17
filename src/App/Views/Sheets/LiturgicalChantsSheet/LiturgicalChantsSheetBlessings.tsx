import * as React from "react";
import { BlessingCombined } from "../../../Models/View/viewTypeHelpers";
import { translate, UIMessagesObject } from "../../../Utilities/I18n";
import { TextBox } from "../../Universal/TextBox";

export interface LiturgicalChantSheetBlessingsProps {
  blessings: Maybe<List<Record<BlessingCombined>>>
  locale: UIMessagesObject
}

export function LiturgicalChantsSheetBlessings (props: LiturgicalChantSheetBlessingsProps) {
  const { blessings, locale } = props

  return (
    <TextBox
      label={translate (locale, "charactersheet.chants.blessings.title")}
      className="blessings activatable-list"
      >
      <div className="list">
        {
          Maybe.maybeToReactNode (
            blessings
              .fmap (
                R.pipe (
                  List.map (e => e .get ("name")),
                  sortStrings (locale .get ("id")),
                  List.intercalate (", ")
                )
              )
          )
        }
      </div>
    </TextBox>
  )
}
