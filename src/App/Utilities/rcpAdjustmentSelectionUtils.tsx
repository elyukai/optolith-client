import * as React from "react"
import { flip } from "../../Data/Function"
import { fmap, fmapF } from "../../Data/Functor"
import { any, List } from "../../Data/List"
import { bindF, fromMaybe, guard, Just, listToMaybe, mapMaybe, Maybe, maybeToNullable, Nothing } from "../../Data/Maybe"
import { lookup, lookupF } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { fst, Pair, snd } from "../../Data/Tuple"
import { SpecialAbilityId } from "../Constants/Ids"
import { DropdownOption } from "../Models/View/DropdownOption"
import { Culture } from "../Models/Wiki/Culture"
import { ProfessionRequireActivatable } from "../Models/Wiki/prerequisites/ActivatableRequirement"
import { Profession } from "../Models/Wiki/Profession"
import { SpecialAbility } from "../Models/Wiki/SpecialAbility"
import { SelectOption } from "../Models/Wiki/sub/SelectOption"
import { StaticData, StaticDataRecord } from "../Models/Wiki/WikiModel"
import { ProfessionPrerequisite } from "../Models/Wiki/wikiTypeHelpers"
import { Checkbox } from "../Views/Universal/Checkbox"
import { Dropdown } from "../Views/Universal/Dropdown"
import { findSelectOption } from "./Activatable/selectionUtils"
import { translate } from "./I18n"
import { pipe } from "./pipe"

const SDA = StaticData.A
const CA = Culture.A
const PA = Profession.A
const SOA = SelectOption.A

export const getBuyScriptElement =
  (staticData: StaticDataRecord) =>
  (culture: Record<Culture>) =>
  (isScriptSelectionNeeded: Pair<boolean, boolean>) =>
  (isBuyingMainScriptEnabled: boolean) =>
  (isAnyLanguageOrScriptSelected: boolean) =>
  (switchIsBuyingMainScriptEnabled: () => void) =>
    fst (isScriptSelectionNeeded)
      ? Just (
          (() => {
            const selectionItem =
              pipe (
                     SDA.specialAbilities,
                     lookup<string> (SpecialAbilityId.Literacy),
                     bindF (flip (findSelectOption)
                                 (listToMaybe (Culture.AL.scripts (culture))))
                   )
                   (staticData)

            const selectionItemName =
              fromMaybe ("") (fmap (SOA.name) (selectionItem))

            const selectionItemCost =
              fromMaybe (0) (bindF (SOA.cost) (selectionItem))

            return (
              <Checkbox
                checked={isBuyingMainScriptEnabled}
                onClick={switchIsBuyingMainScriptEnabled}
                disabled={isAnyLanguageOrScriptSelected}
                >
                {translate (staticData) ("rcpselectoptions.buyscript")}
                {
                  !snd (isScriptSelectionNeeded)
                  && Maybe.isJust (selectionItem)
                  ? ` (${selectionItemName}, ${selectionItemCost} AP)`
                  : null
                }
              </Checkbox>
            )
          }) ()
        )
      : Nothing

export const getMotherTongueSelectionElement =
  (staticData: StaticDataRecord) =>
  (culture: Record<Culture>) =>
  (isMotherTongueSelectionNeeded: boolean) =>
  (motherTongue: number) =>
  (isAnyLanguageOrScriptSelected: boolean) =>
  (setMotherTongue: (option: number) => void) =>
    pipe (
           bindF (() => lookupF (SDA.specialAbilities (staticData)) (SpecialAbilityId.Language)),
           fmap ((wikiEntry: Record<SpecialAbility>) => (
                  <Dropdown
                    hint={translate (staticData) ("rcpselectoptions.nativetongue.placeholder")}
                    value={motherTongue}
                    onChangeJust={setMotherTongue}
                    options={
                      Maybe.mapMaybe<number, Record<DropdownOption>>
                        (pipe (
                          Just,
                          findSelectOption (wikiEntry),
                          fmap (option => DropdownOption ({
                                 id: Just (SOA.id (option)),
                                 name: SOA.name (option),
                               }))
                        ))
                        (CA.languages (culture))
                    }
                    disabled={isAnyLanguageOrScriptSelected}
                    />
                )),
           maybeToNullable
         )
         (guard (isMotherTongueSelectionNeeded))

export const getMainScriptSelectionElement =
  (staticData: StaticDataRecord) =>
  (culture: Record<Culture>) =>
  (isScriptSelectionNeeded: Pair<boolean, boolean>) =>
  (mainScript: number) =>
  (isAnyLanguageOrScriptSelected: boolean) =>
  (isBuyingMainScriptEnabled: boolean) =>
  (setMainCulturalLiteracy: (option: number) => void) =>
    pipe (
           bindF (() => lookupF (SDA.specialAbilities (staticData)) (SpecialAbilityId.Literacy)),
           fmap ((wikiEntry: Record<SpecialAbility>) => (
                  <Dropdown
                    hint={translate (staticData) ("rcpselectoptions.script.placeholder")}
                    value={mainScript}
                    onChangeJust={setMainCulturalLiteracy}
                    options={
                      mapMaybe<number, Record<DropdownOption>>
                        (pipe (
                          Just,
                          findSelectOption (wikiEntry),
                          bindF<Record<SelectOption>, Record<DropdownOption>> (
                            option => fmap ((_cost: number) =>
                                             DropdownOption ({
                                               id: Just (SOA.id (option)),
                                               name: `${SOA.name (option)} (${_cost} AP)`,
                                             }))
                                           (SOA.cost (option))
                          )
                        ))
                        (CA.scripts (culture))
                    }
                    disabled={!isBuyingMainScriptEnabled || isAnyLanguageOrScriptSelected}
                    />
                 )),
           maybeToNullable
         )
         (guard (snd (isScriptSelectionNeeded)))

export const getGuildMageUnfamiliarSpellSelectionElement =
  (staticData: StaticDataRecord) =>
  (mspells: Maybe<List<Record<DropdownOption>>>) =>
  (selected: Maybe<string>) =>
  (setGuildMageUnfamiliarSpell: (id: string) => void) =>
  (profession: Record<Profession>) =>
    any ((x: ProfessionPrerequisite) => ProfessionRequireActivatable.is (x)
                                        && ProfessionRequireActivatable.A.id (x)
                                          === SpecialAbilityId.TraditionGuildMages)
        (PA.prerequisites (profession))
      ? fmapF (mspells)
              (spells => (
                <div className="unfamiliar-spell">
                  <h4>
                    {translate (staticData)
                               ("rcpselectoptions.unfamiliarspellselectionfortraditionguildmage")}
                  </h4>
                  <Dropdown<string | number>
                    hint={translate (staticData) ("rcpselectoptions.unfamiliarspell.placeholder")}
                    value={selected}
                    onChangeJust={setGuildMageUnfamiliarSpell}
                    options={spells}
                    />
                </div>
              ))
      : Nothing
