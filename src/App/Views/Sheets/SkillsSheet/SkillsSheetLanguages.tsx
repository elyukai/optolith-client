import * as React from "react";
import { flip } from "../../../../Data/Function";
import { fmap } from "../../../../Data/Functor";
import { compare } from "../../../../Data/Int";
import { List, map, toArray } from "../../../../Data/List";
import { bindF, fromMaybe, mapMaybe, Maybe } from "../../../../Data/Maybe";
import { reverseCompare } from "../../../../Data/Ord";
import { fromDefault, Record } from "../../../../Data/Record";
import { ActivatableDependent } from "../../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../../Models/ActiveEntries/ActiveObject";
import { L10n, L10nRecord } from "../../../Models/Wiki/L10n";
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility";
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption";
import { findSelectOption } from "../../../Utilities/Activatable/selectionUtils";
import { compareLocale, translate } from "../../../Utilities/I18n";
import { toRoman } from "../../../Utilities/NumberUtils";
import { pipe_ } from "../../../Utilities/pipe";
import { comparingR, sortRecordsBy } from "../../../Utilities/sortBy";
import { TextBox } from "../../Universal/TextBox";

export interface SkillsSheetLanguagesProps {
  languagesStateEntry: Maybe<Record<ActivatableDependent>>
  languagesWikiEntry: Maybe<Record<SpecialAbility>>
  l10n: L10nRecord
}

interface IdNameLevel {
  id: string | number
  name: string
  level: number
}

const IdNameLevel =
  fromDefault<IdNameLevel> ({
    id: 0,
    name: "",
    level: 0,
  })

export function SkillsSheetLanguages (props: SkillsSheetLanguagesProps) {
  const {
    languagesStateEntry: maybeLanguagesStateEntry,
    languagesWikiEntry: maybeLanguagesWikiEntry,
    l10n,
  } = props

  const languages = pipe_ (
    maybeLanguagesStateEntry,
    fmap (ActivatableDependent.A.active),
    fromMaybe (List<Record<ActiveObject>> ()),
    mapMaybe (activeObject => pipe_ (
      maybeLanguagesWikiEntry,
      bindF (flip (findSelectOption) (ActiveObject.A.sid (activeObject))),
      fmap (select_option => IdNameLevel ({
                               id: SelectOption.A.id (select_option),
                               name: SelectOption.A.name (select_option),
                               level: Maybe.sum (ActiveObject.A.tier (activeObject)),
                             }))
    )),
    sortRecordsBy ([
                    comparingR (IdNameLevel.A.level) (reverseCompare (compare)),
                    comparingR (IdNameLevel.A.name) (compareLocale (L10n.A.id (l10n))),
                  ])
  )

  return (
    <TextBox label={translate (l10n) ("languages")}>
      <table className="languages-list">
        <tbody>
          {pipe_ (
            languages,
            map (e => (
              <tr key={`lang-${IdNameLevel.A.id (e)}`}>
                <td>{IdNameLevel.A.name (e)}</td>
                <td>
                  {IdNameLevel.A.level (e) === 4
                    ? translate (l10n) ("nativetongue.short")
                    : toRoman (IdNameLevel.A.level (e))}
                </td>
              </tr>
            )),
            toArray
          )}
        </tbody>
      </table>
    </TextBox>
  )
}
