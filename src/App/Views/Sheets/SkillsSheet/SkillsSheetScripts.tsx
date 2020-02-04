import * as React from "react";
import { flip } from "../../../../Data/Function";
import { fmap } from "../../../../Data/Functor";
import { intercalate, List } from "../../../../Data/List";
import { bindF, fromMaybe, mapMaybe, Maybe } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { ActivatableDependent } from "../../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../../Models/ActiveEntries/ActiveObject";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility";
import { getSelectOptionName } from "../../../Utilities/Activatable/selectionUtils";
import { translate } from "../../../Utilities/I18n";
import { pipe_ } from "../../../Utilities/pipe";
import { sortStrings } from "../../../Utilities/sortBy";
import { TextBox } from "../../Universal/TextBox";

interface Props {
  l10n: L10nRecord
  scriptsStateEntry: Maybe<Record<ActivatableDependent>>
  scriptsWikiEntry: Maybe<Record<SpecialAbility>>
}

export const SkillsSheetScripts: React.FC<Props> = props => {
  const {
    l10n,
    scriptsStateEntry: maybeScriptsStateEntry,
    scriptsWikiEntry: maybeScriptsWikiEntry,
  } = props

  const scripts = pipe_ (
    maybeScriptsStateEntry,
    fmap (ActivatableDependent.A.active),
    fromMaybe (List<Record<ActiveObject>> ()),
    mapMaybe (activeObject => bindF (flip (getSelectOptionName) (ActiveObject.A.sid (activeObject)))
                                    (maybeScriptsWikiEntry)),
    sortStrings (l10n),
    intercalate (", ")
  )

  return (
    <TextBox label={translate (l10n) ("knownscripts")}>
      <div className="scripts-list">
        {scripts}
      </div>
    </TextBox>
  )
}
