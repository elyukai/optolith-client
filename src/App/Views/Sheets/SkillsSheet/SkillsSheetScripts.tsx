import * as React from "react";
import { ActivatableDependent, ActiveObject } from "../../../Models/Hero/heroTypeHelpers";
import { SpecialAbility } from "../../../Models/Wiki/wikiTypeHelpers";
import { getSelectOptionName } from "../../../Utilities/Activatable/selectionUtils";
import { translate, UIMessagesObject } from "../../../Utilities/I18n";
import { TextBox } from "../../Universal/TextBox";

export interface SkillsSheetScriptsProps {
  locale: UIMessagesObject
  scriptsStateEntry: Maybe<Record<ActivatableDependent>>
  scriptsWikiEntry: Maybe<Record<SpecialAbility>>
}

export function SkillsSheetScripts (props: SkillsSheetScriptsProps) {
  const {
    locale,
    scriptsStateEntry: maybeScriptsStateEntry,
    scriptsWikiEntry: maybeScriptsWikiEntry,
  } = props

  const scripts =
    sortStrings
      (locale .get ("id"))
      (
        Maybe.mapMaybe<Record<ActiveObject>, string>
          (activeObject => maybeScriptsWikiEntry .bind (
            wikiEntry => getSelectOptionName (wikiEntry, activeObject .lookup ("sid"))
          ))
          (Maybe.fromMaybe (List.empty<Record<ActiveObject>> ())
                           (maybeScriptsStateEntry
                             .fmap (stateEntry => stateEntry .get ("active"))))
      )

  return (
    <TextBox label={translate (locale, "charactersheet.gamestats.knownscripts.title")}>
      <div className="scripts-list">
        {scripts.intercalate (", ")}
      </div>
    </TextBox>
  )
}
