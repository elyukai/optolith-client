import * as React from "react";
import { equals } from "../../../Data/Eq";
import { cnst, Functn, ident } from "../../../Data/Function";
import { fmap, fmapF } from "../../../Data/Functor";
import { over, set } from "../../../Data/Lens";
import { countWith, elemF, filter, find, flength, foldr, imap, isList, List, map, notElem, notElemF, subscript, subscriptF, sum, take } from "../../../Data/List";
import { alt, altF, altF_, any, bind, bindF, ensure, fromJust, fromMaybe, fromMaybeNil, guard, isJust, isNothing, join, Just, liftM2, mapMaybe, Maybe, maybe, maybe_, Nothing, or, then, thenF } from "../../../Data/Maybe";
import { lookupF } from "../../../Data/OrderedMap";
import { bimap, first, Pair, second, snd } from "../../../Data/Pair";
import { fromDefault, makeLenses, Omit, Record } from "../../../Data/Record";
import { ActivatableActivationOptions, ActivatableActivationOptionsL } from "../../Models/Actions/ActivatableActivationOptions";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { InactiveActivatable } from "../../Models/View/InactiveActivatable";
import { Disadvantage } from "../../Models/Wiki/Disadvantage";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Skill } from "../../Models/Wiki/Skill";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { Application } from "../../Models/Wiki/sub/Application";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Activatable } from "../../Models/Wiki/wikiTypeHelpers";
import { ActivatableAddListItemState } from "../../Views/Activatable/ActivatableAddListItem";
import { Dropdown, DropdownOption } from "../../Views/Universal/Dropdown";
import { TextField } from "../../Views/Universal/TextField";
import { getActiveWithNoCustomCost } from "../AdventurePoints/activatableCostUtils";
import { translate } from "../I18n";
import { getLevelElementsWithMin } from "../levelUtils";
import { dec, gte, lt, max, min, multiply, negate } from "../mathUtils";
import { toInt } from "../NumberUtils";
import { pipe, pipe_ } from "../pipe";
import { isNumber, misNumberM, misStringM } from "../typeCheckUtils";
import { getActiveSelectionsMaybe, getSelectOptionCost } from "./selectionUtils";

interface PropertiesAffectedByState {
  currentCost: Maybe<number | string>
  /**
   * @default false
   */
  disabled: Maybe<boolean>
  selectElement: Maybe<JSX.Element>
  firstSelectOptions: Maybe<List<Record<SelectOption>>>
  secondSelectOptions: Maybe<List<Record<SelectOption>>>
  inputElement: Maybe<JSX.Element>
  inputDescription: Maybe<string>
}

export const PropertiesAffectedByState =
  fromDefault<PropertiesAffectedByState> ({
    currentCost: Nothing,
    disabled: Nothing,
    selectElement: Nothing,
    firstSelectOptions: Nothing,
    secondSelectOptions: Nothing,
    inputElement: Nothing,
    inputDescription: Nothing,
  })

const PropertiesAffectedByStateL = makeLenses (PropertiesAffectedByState)

interface InactiveActivatableControlElements {
  disabled: Maybe<boolean>
  selectElement: Maybe<JSX.Element>
  secondSelectElement: Maybe<JSX.Element>
  inputElement: Maybe<JSX.Element>
  levelElementBefore: Maybe<JSX.Element>
  levelElementAfter: Maybe<JSX.Element>
}

export const InactiveActivatableControlElements =
  fromDefault<InactiveActivatableControlElements> ({
    disabled: Nothing,
    selectElement: Nothing,
    secondSelectElement: Nothing,
    inputElement: Nothing,
    levelElementBefore: Nothing,
    levelElementAfter: Nothing,
  })

const InactiveActivatableControlElementsL = makeLenses (InactiveActivatableControlElements)

const WA = WikiModel.A
const IAA = InactiveActivatable.A
const SAAL = SpecialAbility.AL
const ADA = ActivatableDependent.A
const SOA = SelectOption.A
const SkA = Skill.A
const AOA = ActiveObject.A
const AA = Application.A
const AAOL = ActivatableActivationOptionsL
const PABYA = PropertiesAffectedByState.A
const PABYL = PropertiesAffectedByStateL
const IACEL = InactiveActivatableControlElementsL

type SelectedOptions =
  Partial<Omit<ActivatableAddListItemState, "showCustomCostDialog" | "customCostPreview">>

/**
 * @default Pair (Record ({ id, cost: 0 }), Record ())
 */
type IdSpecificAffectedAndDispatchProps =
  Pair<Record<ActivatableActivationOptions>, Record<PropertiesAffectedByState>>

const getPlainCostFromEntry = pipe (IAA.cost, bindF (ensure (isNumber)))

const getIdSpecificAffectedAndDispatchPropsForMusicTraditions =
  (l10n: L10nRecord) =>
  (inactive_entry: Record<InactiveActivatable>) =>
  (music_tradition_ids: List<number>) =>
  (mselect_option_id: Maybe<string | number>) =>
    Pair (
      ActivatableActivationOptions ({
        id: IAA.id (inactive_entry),
        selectOptionId1: mselect_option_id,
        cost: Nothing,
      }),
      PropertiesAffectedByState ({
        currentCost: getPlainCostFromEntry (inactive_entry),
        firstSelectOptions:
          Just (mapMaybe ((id: number) => pipe_ (
                           id,
                           dec,
                           subscript (translate (l10n) ("musictraditions")),
                           fmap (name =>
                                  SelectOption ({
                                    id,
                                    name,
                                    src: pipe_ (inactive_entry, IAA.wikiEntry, SAAL.src),
                                  }))
                         ))
                         (music_tradition_ids)),
      })
    )

const getCurrentSelectOption =
  (entry: Record<InactiveActivatable>) =>
  (mselected: Maybe<number | string>) =>
    pipe_ (
      IAA.selectOptions (entry),
      liftM2 ((selected_id: string | number) => find (pipe (SOA.id, equals (selected_id))))
             (mselected),
      join
    )

const selectToDropdownOption =
  (x: Record<SelectOption>) =>
    DropdownOption ({
      id: Just (SOA.id (x)),
      name: SOA.name (x),
    })

interface IdSpecificAffectedAndDispatchPropsInputHandlers {
  handleSelect (option: Maybe<string | number>): void
  handleInput (text: string): void
  selectElementDisabled: boolean
}

export const getIdSpecificAffectedAndDispatchProps =
  (inputHandlers: IdSpecificAffectedAndDispatchPropsInputHandlers) =>
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (entry: Record<InactiveActivatable>) =>
  // tslint:disable-next-line: cyclomatic-complexity
  (selectedOptions: SelectedOptions): IdSpecificAffectedAndDispatchProps => {
    const id = IAA.id (entry)
    const mselected = Maybe (selectedOptions.selected)
    const mselected2 = Maybe (selectedOptions.selected2)
    const minput_text = Maybe (selectedOptions.input)
    const mselected_level = Maybe (selectedOptions.selectedTier)

    switch (id) {
      // Entry with Skill selection
      case "ADV_4":
      case "ADV_16":
      case "ADV_17":
      case "ADV_47":
      case "DISADV_48":
      case "SA_231":
      case "SA_250":
      case "SA_569":
      case "SA_472":
      case "SA_473":
      case "SA_531":
      case "SA_533": {
        return Pair (
          ActivatableActivationOptions ({
            id,
            selectOptionId1: mselected,
            cost: Nothing,
          }),
          PropertiesAffectedByState ({
            currentCost:
              pipe_ (
                mselected,
                misStringM,
                bindF (lookupF (WA.skills (wiki))),
                bindF (pipe (
                  SkA.ic,
                  dec,
                  i => pipe_ (entry, IAA.cost, bindF (ensure (isList)), bindF (subscriptF (i)))
                ))
              ),
          })
        )
      }

      // Immunity to (Poison)
      case "ADV_28":
      // Immunity to (Disease)
      case "ADV_29":
      // Negative Trait
      case "DISADV_37":
      // Maimed
      case "DISADV_51": {
        return Pair (
          ActivatableActivationOptions ({
            id,
            selectOptionId1: mselected,
            cost: Nothing,
          }),
          PropertiesAffectedByState ({
            currentCost: getSelectOptionCost (IAA.wikiEntry (entry) as Activatable)
                                             (mselected),
          })
        )
      }

      // Afraid of ...
      case "DISADV_1": {
        return Pair (
          ActivatableActivationOptions ({
            id,
            selectOptionId1: mselected,
            input: minput_text,
            level: mselected_level,
            cost: Nothing,
          }),
          PropertiesAffectedByState ({
            currentCost: liftM2 (multiply)
                                (mselected_level)
                                (pipe_ (entry, IAA.cost, misNumberM)),
            disabled: Just (isNothing (mselected) && isNothing (minput_text)),
          })
        )
      }

      // Principles
      case "DISADV_34":
      // Obligations
      case "DISADV_50": {
        const active_selections =
          fromMaybeNil (getActiveSelectionsMaybe (IAA.heroEntry (entry)))

        const mfiltered_select_options =
          pipe_ (
            entry,
            IAA.selectOptions,
            fmap (filter (pipe (SOA.id, notElemF (active_selections))))
          )

        return Pair (
          ActivatableActivationOptions ({
            id,
            selectOptionId1: then (mfiltered_select_options) (mselected),
            input: then (mfiltered_select_options) (minput_text),
            level: then (mfiltered_select_options) (mselected_level),
            cost: Nothing,
          }),
          PropertiesAffectedByState ({
            currentCost: liftM2 ((l: number) => (c: number) => {
                                  const max_l =
                                    Maybe.sum (pipe_ (
                                      entry,
                                      IAA.heroEntry,
                                      fmap (pipe (
                                        ADA.active,
                                        foldr (pipe (AOA.tier, maybe<ident<number>> (ident) (max)))
                                              (0)
                                      ))
                                    ))

                                  return max_l >= l
                                    ? 0
                                    : c * (l - max_l)
                                })
                                (mselected_level)
                                (pipe_ (entry, IAA.cost, misNumberM)),
            disabled: then (mfiltered_select_options)
                           (Just (isNothing (mselected) && isNothing (minput_text))),
            selectElement:
              fmapF (mfiltered_select_options)
                    (pipe (
                      map (selectToDropdownOption),
                      options => (
                        <Dropdown
                          value={mselected}
                          onChange={inputHandlers.handleSelect}
                          options={options}
                          disabled={inputHandlers.selectElementDisabled}
                          />
                      )
                    )),
          })
        )
      }

      // Magical Attunement
      case "ADV_32":
      // Magical Restriction
      case "DISADV_24": {
        return Pair (
          ActivatableActivationOptions ({
            id,
            selectOptionId1: mselected,
            input: minput_text,
            cost: Nothing,
          }),
          PropertiesAffectedByState ({
            currentCost: getPlainCostFromEntry (entry),
            disabled: Just (isNothing (mselected) && isNothing (minput_text)),
          })
        )
      }

      // Hatred of ...
      case "ADV_68": {
        return Pair (
          ActivatableActivationOptions ({
            id,
            selectOptionId1: mselected,
            input: minput_text,
            cost: Nothing,
          }),
          PropertiesAffectedByState ({
            currentCost: getSelectOptionCost (IAA.wikiEntry (entry) as Activatable)
                                             (mselected),
            disabled: Just (isNothing (mselected) || isNothing (minput_text)),
          })
        )
      }

      // Personality Flaw
      case "DISADV_33": {
        const is_text_input_required = any (elemF (List<string | number> (7, 8))) (mselected)

        const isMaxActiveSelections =
          (sid: number) => (max_count: number) =>
            Maybe.elem<string | number> (sid) (mselected)
            && or (fmapF (IAA.heroEntry (entry))
                          (pipe (
                            ADA.active,
                            countWith (pipe (AOA.sid, Maybe.elem<string | number> (sid))),
                            gte (max_count)
                          )))

        return Pair (
          ActivatableActivationOptions ({
            id,
            selectOptionId1: mselected,
            input: is_text_input_required ? minput_text : Nothing,
            cost: Nothing,
          }),
          PropertiesAffectedByState ({
            currentCost:
              isMaxActiveSelections (7) (1)
              || isMaxActiveSelections (8) (2)
                ? Just (0)
                : getSelectOptionCost (IAA.wikiEntry (entry) as Activatable)
                                      (mselected),
            inputElement:
              Just (
                <TextField
                  value={minput_text}
                  onChangeString={inputHandlers.handleInput}
                  disabled={!is_text_input_required} />
              ),
          })
        )
      }

      // Bad Habit
      case "DISADV_36":
      // Stigma
      case "DISADV_45": {
        return Pair (
          ActivatableActivationOptions ({
            id,
            selectOptionId1: mselected,
            input: minput_text,
            cost: Nothing,
          }),
          PropertiesAffectedByState ({
            currentCost:
              id === "DISADV_36"
                ? pipe_ (
                    entry,
                    IAA.heroEntry,
                    bindF (pipe (
                      ADA.active,
                      ensure (pipe (
                        getActiveWithNoCustomCost,
                        flength,
                        lt (2)
                      ))
                    )),
                    maybe_ (() => getPlainCostFromEntry (entry))
                           (cnst (Just (0)))
                  )
                : getPlainCostFromEntry (entry),
            disabled: Just (isNothing (mselected) && isNothing (minput_text)),
          })
        )
      }

      // Skill Specialization
      case "SA_9": {
        const x = getCurrentSelectOption (entry) (mselected)

        const src = pipe_ (entry, IAA.wikiEntry, SAAL.src)

        return Pair (
          ActivatableActivationOptions ({
            id,
            selectOptionId1: mselected,
            selectOptionId2: mselected2,
            input: minput_text,
            cost: Nothing,
          }),
          PropertiesAffectedByState ({
            currentCost: bind (x) (SOA.cost),
            secondSelectOptions:
              pipe_ (
                x,
                bindF (SOA.applications),
                fmap (map (a => SelectOption ({
                                  id: AA.id (a),
                                  name: AA.name (a),
                                  src,
                                })))
              ),
            inputDescription: bind (x) (SOA.applicationInput),
          })
        )
      }

      // Languages
      case "SA_29": {
        return Pair (
          ActivatableActivationOptions ({
            id,
            selectOptionId1: mselected,
            level: mselected_level,
            cost: Nothing,
          }),
          PropertiesAffectedByState ({
            currentCost:
              pipe_ (
                mselected,
                misNumberM,
                thenF (liftM2 ((l: number) => (c: number) => l === 4 ? 0 : c * l)
                              (mselected_level)
                              (getPlainCostFromEntry (entry)))),
          })
        )
      }

      // Tradition (Zauberbarde)
      case "SA_677": {
        return getIdSpecificAffectedAndDispatchPropsForMusicTraditions (l10n)
                                                                       (entry)
                                                                       (List (1, 2, 3))
                                                                       (mselected)
      }

      // Tradition (Zaubertänzer)
      case "SA_678": {
        return getIdSpecificAffectedAndDispatchPropsForMusicTraditions (l10n)
                                                                       (entry)
                                                                       (List (4, 5, 6, 7))
                                                                       (mselected)
      }

      // Language Specializations
      case "SA_699": {
        const currentSelectOption = getCurrentSelectOption (entry) (mselected)

        const spec_input = bind (currentSelectOption) (SOA.specializationInput)

        return Pair (
          ActivatableActivationOptions ({
            id,
            selectOptionId1: mselected,
            selectOptionId2: isJust (spec_input) ? minput_text : mselected2,
            cost: Nothing,
          }),
          PropertiesAffectedByState ({
            currentCost:
              pipe_ (
                currentSelectOption,
                bindF (SOA.cost),
                altF_ (() => getPlainCostFromEntry (entry))
              ),
            inputDescription: spec_input,
            secondSelectOptions:
              pipe_ (
                currentSelectOption,
                bindF (SOA.specializations),
                fmap (imap (i => name => SelectOption ({
                                           id: i + 1,
                                           name,
                                           src: pipe_ (entry, IAA.wikiEntry, SAAL.src),
                                         })))
              ),
          })
        )
      }

      default: {
        const mlevels = pipe_ (entry, IAA.wikiEntry, SAAL.tiers)
        const mselect_options = IAA.selectOptions (entry)

        const base_pair =
          Pair (
            ActivatableActivationOptions ({ id, cost: Nothing }),
            PropertiesAffectedByState ({ })
          )

        const fillPairForActiveLevel =
          (selectedLevel: number) =>
            pipe (
              (pair: IdSpecificAffectedAndDispatchProps) =>
                fromMaybe (pair)
                          (pipe_ (
                            entry,
                            IAA.cost,
                            bindF (ensure ((c): c is number | List<number> =>
                                            selectedLevel > 0
                                            && (isNumber (c) || isList (c)))),
                            fmap (cost => second (set (PABYL.currentCost)
                                                      (Just (isList (cost)
                                                        ? pipe_ (cost, take (selectedLevel), sum)
                                                        : cost * selectedLevel)))
                                                 (pair))
                          )),
              first (pipe (
                set (AAOL.level) (Just (selectedLevel)),
                isNothing (IAA.cost (entry)) && isJust (mselect_options)
                  ? set (AAOL.selectOptionId1) (mselected)
                  : isJust (pipe_ (entry, IAA.wikiEntry, SAAL.input))
                  ? set (AAOL.input) (minput_text)
                  : ident
              ))
            )

        const fillPairForNoLevel =
          isNothing (IAA.cost (entry))
            ? first (set (AAOL.selectOptionId1) (mselected))
            : bimap ((aao: Record<ActivatableActivationOptions>) => {
                      if (isJust (mselect_options)) {
                        const setSelectOptionId = set (AAOL.selectOptionId1) (mselected)

                        const mselected_cost =
                          pipe_ (
                            mselected,
                            bindF (sel => find (pipe (SOA.id, equals (sel)))
                                               (fromJust (mselect_options))),
                            bindF (SOA.cost)
                          )

                        if (isJust (mselected_cost)) {
                          return pipe_ (
                            aao,
                            setSelectOptionId,
                            set (AAOL.cost) (fromJust (mselected_cost))
                          )
                        }
                        else {
                          return setSelectOptionId (aao)
                        }
                      }
                      else if (isJust (pipe_ (entry, IAA.wikiEntry, SAAL.input))) {
                        return set (AAOL.input) (minput_text) (aao)
                      }
                      else {
                        return aao
                      }
                    })
                    (set (PABYL.currentCost) (getPlainCostFromEntry (entry)))

        return fromMaybe (fillPairForNoLevel)
                         (pipe_ (mlevels, thenF (mselected_level), fmap (fillPairForActiveLevel)))
                         (base_pair)
      }
    }
  }

export const insertFinalCurrentCost =
  (entry: Record<InactiveActivatable>) =>
  (selectedOptions: SelectedOptions): ident<IdSpecificAffectedAndDispatchProps> => {
    const mselected = Maybe (selectedOptions.selected)

    const mcustom_cost =
      pipe_ (
        Maybe (selectedOptions.customCost),
        bindF (toInt),
        fmap (Math.abs)
      )

    type Cost = string | number | List<number>

    return pipe (
      second (over (PABYL.currentCost)
                   (pipe (
                     misNumberM,
                     alt (mcustom_cost),
                     altF_ (() => getSelectOptionCost (IAA.wikiEntry (entry) as Activatable)
                                                      (pipe_ (
                                                        guard (
                                                          Maybe.elem<Cost> ("sel")
                                                                           (IAA.cost (entry))),
                                                        thenF (mselected),
                                                        fmap (sel =>
                                                          isNumber (sel)
                                                            ? sel
                                                            : Maybe.sum (toInt (sel)))
                                                      ))),
                     Disadvantage.is (IAA.wikiEntry (entry)) ? fmap (negate) : ident
                   ))),
      Functn.join (pair => first (pipe (
                                   pipe_ (
                                     pair,
                                     snd,
                                     PABYA.currentCost,
                                     misNumberM,
                                     maybe<ident<Record<ActivatableActivationOptions>>>
                                       (ident)
                                       (set (AAOL.cost))
                                   ),
                                   set (AAOL.customCost)
                                       (pipe_ (
                                         pair,
                                         snd,
                                         PABYA.currentCost,
                                         thenF (mcustom_cost)
                                       ))
                                 )))
    )
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
  (entry: Record<InactiveActivatable>) =>
  (selectedOptions: SelectedOptions) =>
  (props: IdSpecificAffectedAndDispatchProps): Record<InactiveActivatableControlElements> => {
    const mselected = Maybe (selectedOptions.selected)
    const mselected2 = Maybe (selectedOptions.selected2)
    const minput_text = Maybe (selectedOptions.input)
    const mselected_level = Maybe (selectedOptions.selectedTier)

    const msels = pipe_ (props, snd, PABYA.firstSelectOptions, altF (IAA.selectOptions (entry)))

    const msels2 = pipe_ (props, snd, PABYA.secondSelectOptions)

    const minput_desc =
      pipe_ (
        props,
        snd,
        PABYA.inputDescription,
        altF_ (() => pipe_ (entry, IAA.wikiEntry, SAAL.input))
      )

    return pipe_ (
      InactiveActivatableControlElements ({
        disabled: pipe_ (props, snd, PABYA.disabled),
        selectElement: PABYA.selectElement (snd (props)),
        inputElement: PABYA.inputElement (snd (props)),
      }),
      (elements: Record<InactiveActivatableControlElements>) =>
        maybe (elements)
              ((levels: number) => {
                const min_level =
                  fromMaybe (1) (pipe_ (entry, IAA.minLevel, fmap (max (1))))

                const max_level =
                  fromMaybe (levels) (pipe_ (entry, IAA.maxLevel, fmap (min (levels))))

                const levelOptions = getLevelElementsWithMin (min_level) (max_level)

                return pipe_ (
                  elements,
                  set (["DISADV_34", "DISADV_50"].includes (IAA.id (entry))
                        ? IACEL.levelElementBefore
                        : IACEL.levelElementAfter)
                      (
                        Just (
                          <Dropdown
                            className="tiers"
                            value={mselected_level}
                            onChange={inputHandlers.handleLevel}
                            options={levelOptions}
                            />
                        )
                      ),
                  isNothing (mselected_level)
                    ? set (IACEL.disabled) (Just (true))
                    : ident as ident<Record<InactiveActivatableControlElements>>
                )
              })
              (pipe_ (entry, IAA.wikiEntry, SAAL.tiers)),
      fromMaybe
        (ident as ident<Record<InactiveActivatableControlElements>>)
        (pipe_ (
          guard (notElem (IAA.id (entry)) (List ("DISADV_34", "DISADV_50"))),
          thenF (msels),
          fmap (pipe (
            map (selectToDropdownOption),
            sel =>
              set (IACEL.selectElement)
                  (
                    Just (
                      <Dropdown
                        value={mselected}
                        onChange={inputHandlers.handleSelect}
                        options={sel}
                        disabled={inputHandlers.selectElementDisabled} />
                    )
                  )
          ))
        )),
      (
        isJust (msels) && isNothing (mselected)
        || isJust (minput_desc) && isNothing (minput_text)
      )
      && notElem (IAA.id (entry))
                 (List ("ADV_32",
                        "DISADV_1",
                        "DISADV_24",
                        "DISADV_34",
                        "DISADV_36",
                        "DISADV_45",
                        "DISADV_50"))
        ? set (IACEL.disabled) (Just (true))
        : ident,
      fromMaybe
        (ident as ident<Record<InactiveActivatableControlElements>>)
        (pipe_ (
          guard (notElem (IAA.id (entry)) (List ("ADV_28", "ADV_29"))),
          thenF (minput_desc),
          fmap (
            input =>
              set (IACEL.inputElement)
                  (
                    Just (
                      <TextField
                        hint={input}
                        value={minput_text}
                        onChangeString={inputHandlers.handleInput} />
                    )
                  )
          ))),
      IAA.id (entry) === "SA_9"
        ? pipe (
            set (IACEL.inputElement)
                (Just (
                  <TextField
                    hint={fromMaybe ("") (minput_desc)}
                    value={minput_text}
                    onChangeString={inputHandlers.handleInput}
                    disabled={isNothing (minput_desc)}
                    />
                )),
            set (IACEL.secondSelectElement)
                (fmapF (msels2)
                       (pipe (
                         map (selectToDropdownOption),
                         sels2 => (
                           <Dropdown
                             value={mselected2}
                             onChange={inputHandlers.handleSecondSelect}
                             options={sels2}
                             disabled={isJust (minput_text) || isNothing (mselected)}
                             />
                         )
                       ))),
            set (IACEL.disabled) (Just (isNothing (mselected2) && isNothing (minput_text)))
          )
        : maybe (ident as ident<Record<InactiveActivatableControlElements>>)
                (pipe (
                  map (selectToDropdownOption),
                  sels2 =>
                    set (IACEL.secondSelectElement)
                        (Just (
                          <Dropdown
                            value={mselected2}
                            onChange={inputHandlers.handleSecondSelect}
                            options={sels2}
                            disabled={isNothing (mselected)}
                            />
                        )),
                  f => pipe (
                    f,
                    isNothing (mselected2)
                      ? set (IACEL.disabled) (Just (true))
                      : ident
                  )
                ))
                (msels2)
    )
  }
