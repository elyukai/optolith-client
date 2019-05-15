import * as React from "react";
import { fmap } from "../../../../Data/Functor";
import { intercalate, List, map } from "../../../../Data/List";
import { Maybe, maybeToNullable } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { BlessingCombined, BlessingCombinedA_ } from "../../../Models/View/BlessingCombined";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { sortStrings } from "../../../Utilities/sortBy";
import { TextBox } from "../../Universal/TextBox";

export interface LiturgicalChantSheetBlessingsProps {
  blessings: Maybe<List<Record<BlessingCombined>>>
  l10n: L10nRecord
}

export function LiturgicalChantsSheetBlessings (props: LiturgicalChantSheetBlessingsProps) {
  const { blessings, l10n } = props

  return (
    <TextBox
      label={translate (l10n) ("blessings")}
      className="blessings activatable-list"
      >
      <div className="list">
        {pipe_ (
          blessings,
          fmap (pipe (
            map (BlessingCombinedA_.name),
            sortStrings (l10n),
            intercalate (", ")
          )),
          maybeToNullable
        )}
      </div>
    </TextBox>
  )
}
