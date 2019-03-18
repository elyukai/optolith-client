import { pipe } from "ramda";
import * as React from "react";
import { isNumber, isString } from "util";
import { List } from "../../../Data/List";
import { bindF, ensure, Maybe, Nothing } from "../../../Data/Maybe";
import { Pair } from "../../../Data/Pair";
import { Omit, Record } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { ActivatableActivationOptions } from "../../Models/Actions/ActivatableActivationOptions";
import { InactiveActivatable } from "../../Models/View/InactiveActivatable";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { Activatable } from "../../Models/Wiki/wikiTypeHelpers";
import { ActivatableAddListItemState } from "../../Views/Activatable/ActivatableAddListItem";
import { Dropdown, DropdownOption } from "../../Views/Universal/Dropdown";
import { TextField } from "../../Views/Universal/TextField";
import { getActiveWithNoCustomCost } from "../AdventurePoints/activatableCostUtils";
import { translate } from "../I18n";
import { match } from "../match";
import { toRoman, unsafeToInt } from "../NumberUtils";
import { isInteger } from "../RegexUtils";
import { getActiveSelectionsMaybe, getSelectOptionCost } from "./selectionUtils";

const { id, cost } = InactiveActivatable.A

interface PropertiesAffectedByState {
  currentCost?: number | string
  /**
   * @default false
   */
  disabled?: boolean
  selectElement?: JSX.Element
  firstSelectOptions?: List<Record<SelectOption>>
  secondSelectOptions?: List<Record<SelectOption>>
  inputElement?: JSX.Element
  inputDescription?: string
}

type SelectedOptions =
  Partial<Omit<ActivatableAddListItemState, "showCustomCostDialog" | "customCostPreview">>

type RecordAffectedByState = Record<PropertiesAffectedByState>

/**
 * @default Pair (Record ({ id, cost: 0 }), Record ())
 */
type IdSpecificAffectedAndDispatchProps =
  Pair<Record<ActivatableActivationOptions>, Record<PropertiesAffectedByState>>

const getPlainCostFromEntry = pipe (cost, bindF (ensure (isNumber)))

const getIdSpecificAffectedAndDispatchPropsForMusicTraditions =
  (l10n: L10nRecord) =>
  (inactive_entry: Record<InactiveActivatable>) =>
  (music_tradition_ids: List<number>) =>
  (mselect_option_id: Maybe<string | number>) =>
    Pair (
      ActivatableActivationOptions ({
        id: id (inactive_entry),
        selectOptionId1: mselect_option_id,
        cost: Nothing,
      }),
      Record.ofMaybe<PropertiesAffectedByState> ({
        currentCost: getPlainCostFromEntry (inactive_entry),
        firstSelectOptions: Maybe.mapMaybe
          ((id: number) => R.pipe (
            R.dec,
            List.subscript (translate (l10n, "musictraditions")),
            Maybe.fmap (name => Record.of<SelectOption> ({ id, name }))
          ) (id))
          (music_tradition_ids),
      })
    )

const getCurrentSelectOption =
  (entry: Record<DeactiveViewObject>) =>
    (selected: Maybe<number | string>) =>
      selected
        .bind (
          currentSelectOptionId => entry .lookup ("sel")
            .bind (
              selectOptions => selectOptions .find (
                e => e .get ("id") === currentSelectOptionId
              )
            )
        )

interface IdSpecificAffectedAndDispatchPropsInputHandlers {
  handleSelect (option: Maybe<string | number>): void
  handleInput (text: string): void
  selectElementDisabled: boolean
}

export const getIdSpecificAffectedAndDispatchProps =
  (inputHandlers: IdSpecificAffectedAndDispatchPropsInputHandlers) =>
    (locale: UIMessagesObject) =>
      (wiki: Record<WikiAll>) =>
        (entry: Record<DeactiveViewObject>) =>
          (selectedOptions: SelectedOptions) => {
            const selected = Maybe.fromNullable (selectedOptions.selected)
            const selected2 = Maybe.fromNullable (selectedOptions.selected2)
            const inputText = Maybe.fromNullable (selectedOptions.input)
            const maybeSelectedLevel = Maybe.fromNullable (selectedOptions.selectedTier)

            return match<string, IdSpecificAffectedAndDispatchProps>
              (entry .get ("id"))
              .on (
                List.elem_ (List.of (
                  "ADV_4",
                  "ADV_16",
                  "ADV_17",
                  "ADV_47",
                  "DISADV_48",
                  "SA_231",
                  "SA_250",
                  "SA_569",
                  "SA_472",
                  "SA_473",
                  "SA_531",
                  "SA_533"
                )),
                () => Pair.of<DispatchRecord, RecordAffectedByState>
                  (Record.ofMaybe<DispatchProps> ({
                    sel: selected,
                  }))
                  (Record.ofMaybe<PropertiesAffectedByState> ({
                    currentCost: selected
                      .bind (Maybe.ensure (isString))
                      .bind (id => OrderedMap.lookup<string, Record<Skill>> (id)
                                                                            (wiki .get ("skills")))
                      .fmap (R.pipe (
                        Record.get<Skill, "ic"> ("ic"),
                        R.dec
                      ))
                      .bind (
                        index => entry .lookup ("cost")
                          .bind (
                            Maybe.ensure ((cost): cost is List<number> => cost instanceof List)
                          )
                          .bind (List.subscript_ (index))
                      ),
                  }))
              )
              .on (
                List.elem_ (List.of (
                  "ADV_28",
                  "ADV_29"
                )),
                () => Pair.of<DispatchRecord, RecordAffectedByState>
                  (Record.ofMaybe<DispatchProps> ({
                    sel: selected,
                  }))
                  (Record.ofMaybe<PropertiesAffectedByState> ({
                    currentCost:
                      getSelectOptionCost (entry .get ("wikiEntry") as Activatable)
                                          (selected),
                  }))
              )
              .on (
                "DISADV_1",
                () => Pair.of<DispatchRecord, RecordAffectedByState>
                  (Record.ofMaybe<DispatchProps> ({
                    sel: selected,
                    input: inputText,
                    tier: maybeSelectedLevel,
                  }))
                  (Record.ofMaybe<PropertiesAffectedByState> ({
                    currentCost: maybeSelectedLevel
                      .bind (
                        level => entry .lookup ("cost")
                          .bind (Maybe.ensure (isNumber))
                          .fmap (R.multiply (level))
                      ),
                    disabled: Maybe.isNothing (selected) && Maybe.isNothing (inputText),
                  }))
              )
              .on (
                List.elem_ (List.of (
                  "DISADV_34",
                  "DISADV_50"
                )),
                () => {
                  const activeSelections = Maybe.fromMaybe<List<string | number>>
                    (List.empty ())
                    (getActiveSelectionsMaybe (entry .lookup ("stateEntry")))

                  const filteredSelectOptions = entry
                    .lookup ("sel")
                    .fmap (List.filter (e => activeSelections .notElem (e .get ("id"))))

                  return Pair.of<DispatchRecord, RecordAffectedByState>
                    (Record.ofMaybe<DispatchProps> ({
                      sel: filteredSelectOptions .then (selected),
                      input: filteredSelectOptions .then (inputText),
                      tier: filteredSelectOptions .then (maybeSelectedLevel),
                    }))
                    (Record.ofMaybe<PropertiesAffectedByState> ({
                      currentCost: maybeSelectedLevel
                        .bind (
                          level => entry .lookup ("cost")
                            .bind (Maybe.ensure (isNumber))
                            .fmap (
                              cost => {
                                const maxCurrentLevel =
                                  Maybe.fromMaybe
                                    (0)
                                    (entry .lookup ("stateEntry")
                                      .fmap (Record.get<ActivatableDependent, "active"> ("active"))
                                      .fmap (
                                        List.foldr<Record<ActiveObject>, number>
                                          (R.pipe (
                                            Record.lookup<ActiveObject, "tier"> ("tier"),
                                            m => (b: number) =>
                                              Maybe.fromMaybe (b) (m .fmap (a => Math.max (a, b)))
                                          ))
                                          (0)
                                      ))

                                return maxCurrentLevel >= level
                                  ? 0
                                  : cost * (level - maxCurrentLevel)
                              }
                            )
                        ),
                      disabled: filteredSelectOptions
                        .then (Just (Maybe.isNothing (selected) && Maybe.isNothing (inputText))),
                      selectElement: filteredSelectOptions
                        .fmap (
                          selectOptions => (
                            <Dropdown
                              value={selected}
                              onChange={inputHandlers.handleSelect}
                              options={selectOptions as List<Record<DropdownOption>>}
                              disabled={inputHandlers.selectElementDisabled}
                              />
                          )
                        ),
                    }))
                }
              )
              .on (
                List.elem_ (List.of (
                  "ADV_32",
                  "DISADV_24"
                )),
                () => Pair.of<DispatchRecord, RecordAffectedByState>
                  (Record.ofMaybe<DispatchProps> ({
                    sel: selected,
                    input: inputText,
                  }))
                  (Record.ofMaybe<PropertiesAffectedByState> ({
                    currentCost: getPlainCostFromEntry (entry),
                    disabled: Maybe.isNothing (selected) && Maybe.isNothing (inputText),
                  }))
              )
              .on (
                "ADV_68",
                () => Pair.of<DispatchRecord, RecordAffectedByState>
                  (Record.ofMaybe<DispatchProps> ({
                    sel: selected,
                    input: inputText,
                  }))
                  (Record.ofMaybe<PropertiesAffectedByState> ({
                    currentCost:
                      getSelectOptionCost (entry .get ("wikiEntry") as Activatable)
                                          (selected),
                  }))
              )
              .on (
                List.elem_ (List.of (
                  "DISADV_33",
                  "DISADV_37",
                  "DISADV_51"
                )),
                id => {
                  const optionWithTextInput = selected
                    .bind (
                      Maybe.ensure (
                        option => typeof option === "number" && List.of (7, 8) .elem (option)
                      )
                    )

                  const isMaxActiveSelections = (sid: number) => (max: number) =>
                    Maybe.elem<string | number> (sid) (selected)
                    && Maybe.elem
                      (true)
                      (entry .lookup ("stateEntry")
                        .fmap (
                          stateEntry => stateEntry
                            .get ("active")
                            .findIndices (R.pipe (
                              Record.lookup<ActiveObject, "sid"> ("sid"),
                              Maybe.elem<string | number> (sid)
                            ))
                            .length () >= max
                        ))

                  return Pair.of<DispatchRecord, RecordAffectedByState>
                    (Record.ofMaybe<DispatchProps> ({
                      sel: selected,
                      input: id === "DISADV_33"
                        ? optionWithTextInput .then (inputText)
                        : Nothing (),
                    }))
                    (Record.ofMaybe<PropertiesAffectedByState> ({
                      currentCost:
                        id === "DISADV_33"
                        && (isMaxActiveSelections (7) (1) || isMaxActiveSelections (8) (2))
                          ? 0
                          : getSelectOptionCost (entry .get ("wikiEntry") as Activatable)
                                                (selected),
                      inputElement:
                        id === "DISADV_33"
                          ? Just (
                            <TextField
                              value={inputText}
                              onChangeString={inputHandlers.handleInput}
                              disabled={Maybe.isNothing (optionWithTextInput)} />
                          )
                          : Nothing (),
                    }))
                }
              )
              .on (
                List.elem_ (List.of (
                  "DISADV_36",
                  "DISADV_45"
                )),
                id => Pair.of<DispatchRecord, RecordAffectedByState>
                  (Record.ofMaybe<DispatchProps> ({
                    sel: selected,
                    input: inputText,
                  }))
                  (Record.ofMaybe<PropertiesAffectedByState> ({
                    currentCost:
                      id === "DISADV_36"
                        ? entry
                          .lookup ("stateEntry")
                          .bind (Record.lookup<ActivatableDependent, "active"> ("active"))
                          .bind (
                            Maybe.ensure (
                              R.pipe (
                                getActiveWithNoCustomCost,
                                List.lengthL,
                                R.gt (2)
                              )
                            )
                          )
                          .then (Just (0))
                          .alt (getPlainCostFromEntry (entry))
                        : getPlainCostFromEntry (entry),
                    disabled: Maybe.isNothing (selected) && Maybe.isNothing (inputText),
                  }))
              )
              .on (
                "SA_9",
                () => {
                  const currentSelectOption = getCurrentSelectOption (entry) (selected)

                  return Pair.of<DispatchRecord, RecordAffectedByState>
                    (Record.ofMaybe<DispatchProps> ({
                      sel: selected,
                      sel2: selected2,
                      input: inputText,
                    }))
                    (Record.ofMaybe<PropertiesAffectedByState> ({
                      currentCost:
                        currentSelectOption .bind (
                          Record.lookup<SelectOption, "cost"> ("cost")
                        ),
                      secondSelectOptions:
                        currentSelectOption .bind (
                          Record.lookup<SelectOption, "applications"> ("applications") as
                            (x: Record<SelectOption>) => Maybe<List<Record<SelectOption>>>
                        ),
                      inputDescription:
                        currentSelectOption .bind (
                          Record.lookup<SelectOption, "applicationsInput"> ("applicationsInput")
                        ),
                    }))
                }
              )
              .on (
                "SA_29",
                () => Pair.of<DispatchRecord, RecordAffectedByState>
                  (Record.ofMaybe<DispatchProps> ({
                    sel: selected,
                    tier: maybeSelectedLevel,
                  }))
                  (Record.ofMaybe<PropertiesAffectedByState> ({
                    currentCost:
                      selected
                        .bind (Maybe.ensure (isNumber))
                        .then (
                          Maybe.liftM2<number, number, number>
                            (currentSelectedLevel => currentCost =>
                              currentSelectedLevel === 4 ? 0 : currentCost * currentSelectedLevel)
                            (maybeSelectedLevel)
                            (getPlainCostFromEntry (entry))
                        )
                      ,
                  }))
              )
              .on (
                "SA_677",
                () => getIdSpecificAffectedAndDispatchPropsForMusicTraditions
                  (locale)
                  (entry)
                  (selected)
                  (List.of (1, 2, 3))
              )
              .on (
                "SA_678",
                () => getIdSpecificAffectedAndDispatchPropsForMusicTraditions
                  (locale)
                  (entry)
                  (selected)
                  (List.of (4, 5, 6, 7))
              )
              .on (
                "SA_699",
                () => {
                  const currentSelectOption = getCurrentSelectOption (entry) (selected)

                  const specInput = currentSelectOption
                    .bind (Record.lookup<SelectOption, "specInput"> ("specInput"))

                  return Pair.of<DispatchRecord, RecordAffectedByState>
                    (Record.ofMaybe<DispatchProps> ({
                      sel: selected,
                      sel2: Maybe.isJust (specInput) ? inputText : selected2,
                    }))
                    (Record.ofMaybe<PropertiesAffectedByState> ({
                      currentCost: currentSelectOption
                        .bind (Record.lookup<SelectOption, "cost"> ("cost"))
                        .alt (getPlainCostFromEntry (entry)),
                      inputDescription: specInput,
                      secondSelectOptions: currentSelectOption
                        .bind (Record.lookup<SelectOption, "spec"> ("spec"))
                        .fmap (
                          List.imap (
                            index => name => Record.of<SelectOption> ({ id: index + 1, name })
                          )
                        ),
                    }))
                }
              )
              .otherwise (() => {
                const maybeLevels = entry .get ("wikiEntry") .lookup ("tiers")
                const maybeSelectOptions = entry .lookup ("sel")

                const basePair = Pair.of<DispatchRecord, RecordAffectedByState>
                  (Record.empty<DispatchProps> ())
                  (Record.empty<PropertiesAffectedByState> ())

                const fillPairForActiveLevel = (selectedLevel: number) =>
                  R.pipe (
                    (pair: IdSpecificAffectedAndDispatchProps) =>
                      Maybe.fromMaybe
                        (pair)
                        (entry .lookup ("cost")
                          .bind (
                            Maybe.ensure (
                              (cost): cost is number | List<number> =>
                               selectedLevel > 0
                               && (typeof cost === "number" || cost instanceof List)
                            )
                          )
                          .fmap<IdSpecificAffectedAndDispatchProps> (
                            cost =>
                              Pair.second<DispatchRecord, RecordAffectedByState>
                                (Record.insert<PropertiesAffectedByState, "currentCost">
                                  ("currentCost")
                                  (cost instanceof List
                                    ? cost .take (selectedLevel) .sum ()
                                    : cost * selectedLevel))
                                (pair)
                          )),
                    Pair.first (R.pipe (
                      Record.insert<Partial<ActivateArgs>, "tier"> ("tier") (selectedLevel),
                      Maybe.elem<string | number | List<number>> ("sel") (entry .lookup ("cost"))
                      && Maybe.isJust (maybeSelectOptions)
                        ? Record.insertMaybe<Partial<ActivateArgs>, "sel"> ("sel") (selected)
                        : Maybe.isJust (entry .get ("wikiEntry") .lookup ("input"))
                        ? Record.insertMaybe<Partial<ActivateArgs>, "input"> ("input") (inputText)
                        : R.identity
                    ))
                  )

                const fillPairForNoLevel =
                  Maybe.elem<string | number | List<number>> ("sel") (entry .lookup ("cost"))
                    ? Pair.first<DispatchRecord, RecordAffectedByState>
                      (Record.insertMaybe<Partial<ActivateArgs>, "sel"> ("sel") (selected))
                    : Pair.bimap<DispatchRecord, RecordAffectedByState>
                      (Maybe.isJust (maybeSelectOptions)
                        ? Record.insertMaybe<Partial<ActivateArgs>, "sel"> ("sel") (selected)
                        : Maybe.isJust (entry .get ("wikiEntry") .lookup ("input"))
                        ? Record.insertMaybe<Partial<ActivateArgs>, "input"> ("input") (inputText)
                        : R.identity)
                      (Record.insertMaybe <PropertiesAffectedByState, "currentCost">
                        ("currentCost")
                        (getPlainCostFromEntry (entry)))

                return Maybe.fromMaybe
                  (fillPairForNoLevel)
                  (maybeLevels .then (maybeSelectedLevel .fmap (fillPairForActiveLevel)))
                  (basePair)
              })
          }

export const insertFinalCurrentCost =
  (entry: Record<DeactiveViewObject>) =>
    (selectedOptions: SelectedOptions) => {
      const maybeSelected = Maybe.fromNullable (selectedOptions.selected)

      const maybeCustomCost = Maybe.fromNullable (selectedOptions.customCost)
        .bind (Maybe.ensure (isInteger))
        .fmap (R.pipe (
          unsafeToInt,
          Math.abs
        ))

      return R.pipe (
        Pair.second<DispatchRecord, RecordAffectedByState>
          (Record.alter<PropertiesAffectedByState, "currentCost">
            (R.pipe (
              Maybe.bind_ (Maybe.ensure (isNumber)),
              currentCost => currentCost .alt (
                getSelectOptionCost
                  (entry .get ("wikiEntry") as Activatable)
                  (maybeSelected
                    .bind (
                      Maybe.ensure (
                        () => Maybe.elem<string | number | List<number>> ("sel")
                                                                        (entry .lookup ("cost"))
                      )
                    )
                    .fmap (
                      selected => typeof selected === "string"
                        ? unsafeToInt (selected)
                        : selected
                    ))
              ),
              Maybe.alt (maybeCustomCost),
              entry .get ("wikiEntry") .get ("category") === Categories.DISADVANTAGES
                ? Maybe.fmap (R.negate)
                : R.identity
            ))
            ("currentCost")),
        pair => Pair.first<DispatchRecord, RecordAffectedByState>
          (R.pipe (
            Record.insertMaybe<DispatchProps, "cost">
              ("cost")
              (Pair.snd (pair) .lookup ("currentCost") .bind (Maybe.ensure (isNumber))),
            Record.insertMaybe<DispatchProps, "customCost">
              ("customCost")
              (Pair.snd (pair) .lookup ("currentCost") .then (maybeCustomCost))
          ))
          (pair),
        Pair.first<DispatchRecord, RecordAffectedByState, Record<ActivateArgs>>
          (Record.merge<ActivateArgs, Partial<ActivateArgs>> (
            Record.of ({ id: entry .get ("id"), cost: 0 })
          ))
      )
    }

interface InactiveActivatableControlElements {
  disabled?: boolean
  selectElement?: JSX.Element
  secondSelectElement?: JSX.Element
  inputElement?: JSX.Element
  levelElementBefore?: JSX.Element
  levelElementAfter?: JSX.Element
}

interface InactiveActivatableControlElementsInputHandlers {
  handleSelect (option: Maybe<string | number>): void
  handleSecondSelect (option: Maybe<string | number>): void
  handleLevel (option: Maybe<number>): void
  handleInput (text: string): void
  selectElementDisabled: boolean
}

export const getInactiveActivatableControlElements =
  (inputHandlers: InactiveActivatableControlElementsInputHandlers) =>
    (entry: Record<DeactiveViewObject>) =>
      (selectedOptions: SelectedOptions) =>
        (props: Pair<Record<ActivateArgs>, RecordAffectedByState>) => {
          const maybeSelected = Maybe.fromNullable (selectedOptions.selected)
          const maybeSelected2 = Maybe.fromNullable (selectedOptions.selected2)
          const maybeInputText = Maybe.fromNullable (selectedOptions.input)
          const maybeSelectedLevel = Maybe.fromNullable (selectedOptions.selectedTier)

          const maybeSel =
            Pair.snd (props)
              .lookup ("firstSelectOptions")
              .alt (entry .lookup ("sel"))

          const maybeSel2 =
            Pair.snd (props)
              .lookup ("secondSelectOptions")

          const maybeInputDescription =
            Pair.snd (props)
              .lookup ("inputDescription")
              .alt (entry .get ("wikiEntry") .lookup ("input"))

          const buildElements = R.pipe (
            (elements: Record<InactiveActivatableControlElements>) =>
              Maybe.maybe<number, Record<InactiveActivatableControlElements>>
                (elements)
                (levels => {
                  const min = Maybe.fromMaybe (1)
                                              (entry .lookup ("minTier") .fmap (R.max<number> (1)))

                  const max = Maybe.fromMaybe (levels)
                                              (entry .lookup ("maxTier") .fmap (R.min (levels)))

                  const length = max - min + 1

                  const levelOptions =
                    List.unfoldr<Record<DropdownOption>, number>
                      (index => index < length
                        ? Just (
                          Pair.of<Record<DropdownOption>, number>
                            (Record.of<DropdownOption> ({
                              id: index + min,
                              name: toRoman (index + min),
                            }))
                            (index + 1)
                        )
                        : Nothing ())
                      (0)

                  return elements
                    .insert
                      (
                        ["DISADV_34", "DISADV_50"].includes (entry .get ("id"))
                          ? "levelElementBefore"
                          : "levelElementAfter"
                      )
                      (
                        <Dropdown
                          className="tiers"
                          value={maybeSelectedLevel}
                          onChange={inputHandlers.handleLevel}
                          options={levelOptions} />
                      )
                    .alter<"disabled">
                      (Maybe.isNothing (maybeSelectedLevel)
                        ? () => Just (true)
                        : R.identity)
                      ("disabled")
                })
                (entry .get ("wikiEntry") .lookup ("tiers")),
            elements => Maybe.fromMaybe
              (elements)
              (maybeSel
                .bind (
                  Maybe.ensure (
                    () => List.of ("DISADV_34", "DISADV_50") .notElem (entry .get ("id"))
                  )
                )
                .fmap (
                  sel => elements .insert
                    ("selectElement")
                    (
                      <Dropdown
                        value={maybeSelected}
                        onChange={inputHandlers.handleSelect}
                        options={sel as List<Record<DropdownOption>>}
                        disabled={inputHandlers.selectElementDisabled} />
                    )
                )),
            Record.alter<InactiveActivatableControlElements, "disabled">
              (
                Maybe.isJust (maybeSel)
                && Maybe.isNothing (maybeSelected)
                && List.of (
                  "ADV_32",
                  "DISADV_1",
                  "DISADV_24",
                  "DISADV_34",
                  "DISADV_36",
                  "DISADV_45",
                  "DISADV_50"
                ) .notElem (entry .get ("id"))
                  ? () => Just (true)
                  : R.identity)
              ("disabled"),
            elements => Maybe.fromMaybe
              (elements)
              (maybeInputDescription
                .bind (
                  Maybe.ensure (
                    () => List.of ("ADV_28", "ADV_29") .notElem (entry .get ("id"))
                  )
                )
                .fmap (
                  input => elements .insert
                    ("inputElement")
                    (
                      <TextField
                        hint={input}
                        value={maybeInputText}
                        onChangeString={inputHandlers.handleInput} />
                    )
                )),
            Record.alter<InactiveActivatableControlElements, "disabled">
              (
                Maybe.isJust (maybeInputText)
                && Maybe.isNothing (maybeSelected)
                && List.of (
                  "ADV_32",
                  "DISADV_1",
                  "DISADV_24",
                  "DISADV_34",
                  "DISADV_36",
                  "DISADV_45",
                  "DISADV_50"
                ) .notElem (entry .get ("id"))
                  ? () => Just (true)
                  : R.identity)
              ("disabled"),
            elements => {
              if (entry .get ("id") === "SA_9") {
                return elements
                  .insert
                    ("inputElement")
                    (
                      <TextField
                        hint={Maybe.fromMaybe ("") (maybeInputDescription)}
                        value={maybeInputText}
                        onChangeString={inputHandlers.handleInput}
                        disabled={Maybe.isNothing (maybeInputDescription)} />
                    )
                  .insertMaybe
                    ("secondSelectElement")
                    (maybeSel2 .fmap (
                      secondSelectOptions => (
                        <Dropdown
                          value={maybeSelected2}
                          onChange={inputHandlers.handleSecondSelect}
                          options={secondSelectOptions as List<Record<DropdownOption>>}
                          disabled={Maybe.isJust (maybeInputText) || Maybe.isJust (maybeSelected)}
                          />
                      )
                    ))
                  .insert
                    ("disabled")
                    (Maybe.isNothing (maybeSelected2) && Maybe.isNothing (maybeInputText))
              }

              return Maybe.fromMaybe
                (elements)
                (maybeSel2 .fmap (
                  secondSelectOptions => elements
                    .insert
                      ("secondSelectElement")
                      (
                        <Dropdown
                          value={maybeSelected2}
                          onChange={inputHandlers.handleSecondSelect}
                          options={secondSelectOptions as List<Record<DropdownOption>>}
                          disabled={Maybe.isNothing (maybeSelected)}
                          />
                      )
                    .alter<"disabled">
                      (Maybe.isNothing (maybeSelected2)
                        ? () => Just (true)
                        : R.identity)
                      ("disabled")
                ))
            }
          )

          return buildElements (
            Record.ofMaybe<InactiveActivatableControlElements> ({
              disabled: Pair.snd (props) .lookup ("disabled"),
            })
          )
        }
