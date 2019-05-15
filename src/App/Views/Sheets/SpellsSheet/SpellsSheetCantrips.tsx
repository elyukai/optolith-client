import * as React from "react";
import { CantripCombined } from "../../../Models/View/viewTypeHelpers";
import { translate, UIMessagesObject } from "../../../Utilities/I18n";
import { TextBox } from "../../Universal/TextBox";

export interface SpellsSheetCantripsProps {
  cantrips: Maybe<List<Record<CantripCombined>>>
  locale: UIMessagesObject
}

export function SpellsSheetCantrips (props: SpellsSheetCantripsProps) {
  const { cantrips, locale } = props

  return (
    <TextBox
      label={translate (l10n) ("charactersheet.spells.cantrips.title")}
      className="cantrips activatable-list"
      >
      <div className="list">
        {
          Maybe.maybeToReactNode (
            cantrips
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
