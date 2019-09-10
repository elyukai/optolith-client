import * as React from "react";
import { bool_ } from "../../../Data/Bool";
import { equals, notEquals } from "../../../Data/Eq";
import { Functn, ident } from "../../../Data/Function";
import { fmap, fmapF } from "../../../Data/Functor";
import { over, set } from "../../../Data/Lens";
import { countWith, elemF, filter, find, flength, foldr, imap, isList, List, map, notElem, notElemF, notNull, subscript, subscriptF, sum, take } from "../../../Data/List";
import { alt, altF, altF_, any, bind, bindF, ensure, fromJust, fromMaybe, guard, isJust, isNothing, join, joinMaybeList, Just, liftM2, mapMaybe, Maybe, maybe, Nothing, or, then, thenF } from "../../../Data/Maybe";
import { dec, gte, max, min, multiply, negate } from "../../../Data/Num";
import { lookupF } from "../../../Data/OrderedMap";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { bimap, first, Pair, second, snd } from "../../../Data/Tuple";
import { AdvantageId, DisadvantageId, SpecialAbilityId } from "../../Constants/Ids";
import { ActivatableActivationOptions, ActivatableActivationOptionsL } from "../../Models/Actions/ActivatableActivationOptions";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { InactiveActivatable, InactiveActivatableA_ } from "../../Models/View/InactiveActivatable";
import { Disadvantage } from "../../Models/Wiki/Disadvantage";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Skill } from "../../Models/Wiki/Skill";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { Application } from "../../Models/Wiki/sub/Application";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Activatable } from "../../Models/Wiki/wikiTypeHelpers";
import { ActivatableAddListItemSelectedOptions } from "../../Views/Activatable/ActivatableAddListItem";
import { Dropdown, DropdownOption } from "../../Views/Universal/Dropdown";
import { TextField } from "../../Views/Universal/TextField";
import { getActiveWithNoCustomCost } from "../AdventurePoints/activatableCostUtils";
import { translate } from "../I18n";
import { prefixSkill } from "../IDUtils";
import { getLevelElementsWithMin } from "../levelUtils";
import { toInt } from "../NumberUtils";
import { pipe, pipe_ } from "../pipe";
import { isNumber, misNumberM, misStringM } from "../typeCheckUtils";
import { getWikiEntry, isSkillishWikiEntry } from "../WikiUtils";
import { getActiveSelectionsMaybe, getSelectOptionCost } from "./selectionUtils";

interface PropertiesAffectedByState {
  "@@name": "PropertiesAffectedByState"
  currentCost: Maybe<number | string>
  disabled: Maybe<boolean>
  selectElement: Maybe<JSX.Element>
  firstSelectOptions: Maybe<List<Record<SelectOption>>>
  secondSelectOptions: Maybe<List<Record<SelectOption>>>
  thirdSelectOptions: Maybe<List<Record<SelectOption>>>
  inputElement: Maybe<JSX.Element>
  inputDescription: Maybe<string>
}

export const PropertiesAffectedByState =
  fromDefault ("PropertiesAffectedByState") <PropertiesAffectedByState> ({
                currentCost: Nothing,
                disabled: Nothing,
                selectElement: Nothing,
                firstSelectOptions: Nothing,
                secondSelectOptions: Nothing,
                thirdSelectOptions: Nothing,
                inputElement: Nothing,
                inputDescription: Nothing,
              })

const PropertiesAffectedByStateL = makeLenses (PropertiesAffectedByState)

interface InactiveActivatableControlElements {
  "@@name": "InactiveActivatableControlElements"
  disabled: Maybe<boolean>
  selectElement: Maybe<JSX.Element>
  secondSelectElement: Maybe<JSX.Element>
  thirdSelectElement: Maybe<JSX.Element>
  inputElement: Maybe<JSX.Element>
  levelElementBefore: Maybe<JSX.Element>
  levelElementAfter: Maybe<JSX.Element>
}

export const InactiveActivatableControlElements =
  fromDefault ("InactiveActivatableControlElements") <InactiveActivatableControlElements> ({
                disabled: Nothing,
                selectElement: Nothing,
                secondSelectElement: Nothing,
                thirdSelectElement: Nothing,
                inputElement: Nothing,
                levelElementBefore: Nothing,
                levelElementAfter: Nothing,
              })

const InactiveActivatableControlElementsL = makeLenses (InactiveActivatableControlElements)

const WA = WikiModel.A
const IAA = InactiveActivatable.A
const IAA_ = InactiveActivatableA_
const SAAL = SpecialAbility.AL
const ADA = ActivatableDependent.A
const SOA = SelectOption.A
const SkA = Skill.A
const SkAL = Skill.AL
const AOA = ActiveObject.A
const AA = Application.A
const AAOL = ActivatableActivationOptionsL
const PABYA = PropertiesAffectedByState.A
const PABYL = PropertiesAffectedByStateL
const IACEL = InactiveActivatableControlElementsL

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
  (selectedOptions: ActivatableAddListItemSelectedOptions): IdSpecificAffectedAndDispatchProps => {
    const id = IAA.id (entry)
    const mselected = selectedOptions.selected
    const mselected2 = selectedOptions.selected2
    const mselected3 = selectedOptions.selected3
    const minput_text = selectedOptions.input
    const mselected_level = selectedOptions.selectedTier

    switch (id) {
      // Entry with Skill selection (string id)
      case AdvantageId.Aptitude:
      case AdvantageId.ExceptionalSkill:
      case AdvantageId.ExceptionalCombatTechnique:
      case AdvantageId.WeaponAptitude:
      case DisadvantageId.Incompetent:
      case SpecialAbilityId.AdaptionZauber:
      case SpecialAbilityId.Lieblingszauber:
      case SpecialAbilityId.Forschungsgebiet:
      case SpecialAbilityId.Expertenwissen:
      case SpecialAbilityId.Wissensdurst:
      case SpecialAbilityId.Recherchegespuer:
      case SpecialAbilityId.Lieblingsliturgie: {
        return getPropsForEntryWithSkillSel (misStringM)
                                            (wiki)
                                            (mselected)
                                            (entry)
                                            (id)
      }

      // Entry with Skill selection (numeric id)
      case SpecialAbilityId.WegDerGelehrten:
      case SpecialAbilityId.Handwerkskunst:
      case SpecialAbilityId.KindDerNatur:
      case SpecialAbilityId.KoerperlichesGeschick:
      case SpecialAbilityId.SozialeKompetenz:
      case SpecialAbilityId.Universalgenie: {
        return getPropsForEntryWithSkillSel (pipe (misNumberM, fmap (prefixSkill)))
                                            (wiki)
                                            (mselected)
                                            (entry)
                                            (id)
      }

      case AdvantageId.ImmunityToPoison:
      case AdvantageId.ImmunityToDisease:
      case DisadvantageId.NegativeTrait:
      case DisadvantageId.Maimed: {
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

      case DisadvantageId.AfraidOf: {
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

      case DisadvantageId.Principles:
      case DisadvantageId.Obligations: {
        const active_selections =
          joinMaybeList (getActiveSelectionsMaybe (IAA.heroEntry (entry)))

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

      case AdvantageId.MagicalAttunement:
      case DisadvantageId.MagicalRestriction: {
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

      case AdvantageId.HatredOf: {
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

      case DisadvantageId.PersonalityFlaw: {
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
                  disabled={!is_text_input_required}
                  />
              ),
          })
        )
      }

      case DisadvantageId.BadHabit:
      case DisadvantageId.Stigma: {
        return Pair (
          ActivatableActivationOptions ({
            id,
            selectOptionId1: mselected,
            input: minput_text,
            cost: Nothing,
          }),
          PropertiesAffectedByState ({
            currentCost:
              id === DisadvantageId.BadHabit
                ? pipe_ (
                    entry,
                    IAA.heroEntry,
                    maybe (false)
                          (pipe (
                            ADA.active,
                            getActiveWithNoCustomCost,
                            flength,
                            gte (3)
                          )),
                    bool_ (() => getPlainCostFromEntry (entry)) (() => Just (0))
                  )
                : getPlainCostFromEntry (entry),
            disabled: Just (isNothing (mselected) && isNothing (minput_text)),
          })
        )
      }

      case SpecialAbilityId.SkillSpecialization: {
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

      case SpecialAbilityId.Language: {
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
                              (getPlainCostFromEntry (entry)))
              ),
          })
        )
      }

      case SpecialAbilityId.TraditionZauberbarden: {
        return getIdSpecificAffectedAndDispatchPropsForMusicTraditions (l10n)
                                                                       (entry)
                                                                       (List (1, 2, 3))
                                                                       (mselected)
      }

      case SpecialAbilityId.TraditionZaubertaenzer: {
        return getIdSpecificAffectedAndDispatchPropsForMusicTraditions (l10n)
                                                                       (entry)
                                                                       (List (4, 5, 6, 7))
                                                                       (mselected)
      }

      case SpecialAbilityId.LanguageSpecializations: {
        const moption = getCurrentSelectOption (entry) (mselected)

        const mspec_input = bind (moption) (SOA.specializationInput)

        return Pair (
          ActivatableActivationOptions ({
            id,
            selectOptionId1: mselected,
            selectOptionId2: isJust (mspec_input) ? minput_text : mselected2,
            cost: Nothing,
          }),
          PropertiesAffectedByState ({
            currentCost:
              pipe_ (
                moption,
                bindF (SOA.cost),
                altF_ (() => getPlainCostFromEntry (entry))
              ),
            inputDescription: mspec_input,
            secondSelectOptions:
              pipe_ (
                moption,
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

      case SpecialAbilityId.Fachwissen: {
        const getApps =
          (mother_id: Maybe<string | number>) =>
            pipe_ (
              mselected,
              bindF (pipe (
                prefixSkill,
                lookupF (WA.skills (wiki))
              )),
              fmap (SkA.applications),
              joinMaybeList,
              maybe (ident as ident<List<Record<Application>>>)
                    ((other_id: string | number) => filter (pipe (AA.id, notEquals (other_id))))
                    (mother_id),
              ensure (notNull),
              fmap (map (e => SelectOption ({
                                id: AA.id (e),
                                name: AA.name (e),
                                src: IAA_.src (entry),
                              })))
            )

        return Pair (
          ActivatableActivationOptions ({
            id,
            selectOptionId1: mselected,
            selectOptionId2: mselected2,
            selectOptionId3: mselected3,
            cost: Nothing,
          }),
          PropertiesAffectedByState ({
            currentCost:
              pipe_ (
                mselected,
                misStringM,
                bindF (getWikiEntry (wiki)),
                bindF (ensure (isSkillishWikiEntry)),
                bindF (pipe (
                  SkAL.ic,
                  dec,
                  i => pipe_ (entry, IAA.cost, bindF (ensure (isList)), bindF (subscriptF (i)))
                ))
              ),
            secondSelectOptions: getApps (mselected3),
            thirdSelectOptions: getApps (mselected2),
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

        const has_input = isJust (pipe_ (entry, IAA.wikiEntry, SAAL.input))

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
                isJust (mselect_options) ? set (AAOL.selectOptionId1) (mselected) : ident,
                has_input ? set (AAOL.input) (minput_text) : ident
              ))
            )

        const fillPairForNoLevel: ident<IdSpecificAffectedAndDispatchProps> =
          isJust (IAA.cost (entry))
            ? bimap (pipe (
                      isJust (mselect_options)
                        ? set (AAOL.selectOptionId1) (mselected)
                        : ident as ident<Record<ActivatableActivationOptions>>,
                      has_input
                        ? set (AAOL.input) (minput_text)
                        : ident as ident<Record<ActivatableActivationOptions>>
                    ))
                    (set (PABYL.currentCost) (getPlainCostFromEntry (entry)))
            : (() => {
                if (isJust (mselect_options)) {
                  const setSelectOptionId = set (AAOL.selectOptionId1) (mselected)

                  const mselected_option =
                    bind (mselected) (sel => find (pipe (SOA.id, equals (sel)))
                                                  (fromJust (mselect_options)))

                  const mselected_cost = bind (mselected_option) (SOA.cost)

                  if (isJust (mselected_cost)) {
                    return bimap (pipe (
                                   setSelectOptionId,
                                   has_input ? set (AAOL.input) (minput_text) : ident
                                 ))
                                 (set (PABYL.currentCost) (mselected_cost))
                  }
                  else {
                    return first (pipe (
                                   setSelectOptionId,
                                   has_input ? set (AAOL.input) (minput_text) : ident
                                 ))
                  }
                }
                else if (has_input) {
                  return first (set (AAOL.input) (minput_text))
                }
                else {
                  return ident
                }
              }) ()

        return fromMaybe (fillPairForNoLevel)
                         (pipe_ (mlevels, thenF (mselected_level), fmap (fillPairForActiveLevel)))
                         (base_pair)
      }
    }
  }

export const insertFinalCurrentCost =
  (entry: Record<InactiveActivatable>) =>
  (selectedOptions: ActivatableAddListItemSelectedOptions):
  ident<IdSpecificAffectedAndDispatchProps> => {
    const mcustom_cost =
      pipe_ (
        selectedOptions.customCost,
        bindF (toInt),
        fmap (Math.abs)
      )

    return pipe (
      x => second (over (PABYL.currentCost)
                        (pipe (
                          misNumberM,
                          alt (mcustom_cost),
                          Disadvantage.is (IAA.wikiEntry (entry)) ? fmap (negate) : ident
                        )))
                  (x),
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
  (selectedOptions: ActivatableAddListItemSelectedOptions) =>
  (props: IdSpecificAffectedAndDispatchProps): Record<InactiveActivatableControlElements> => {
    const mselected = selectedOptions.selected
    const mselected2 = selectedOptions.selected2
    const minput_text = selectedOptions.input
    const mselected_level = selectedOptions.selectedTier

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
                  set (([DisadvantageId.Principles, DisadvantageId.Obligations] as string[])
                        .includes (IAA.id (entry))
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
          guard (notElem (IAA.id (entry))
                         (List (DisadvantageId.Principles, DisadvantageId.Obligations))),
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
                        disabled={inputHandlers.selectElementDisabled}
                        />
                    )
                  )
          ))
        )),
      (
        (isJust (msels) && isNothing (mselected))
        || (isJust (minput_desc) && isNothing (minput_text))
      )
      && notElem (IAA.id (entry))
                 (List<string> (AdvantageId.MagicalAttunement,
                                DisadvantageId.AfraidOf,
                                DisadvantageId.MagicalRestriction,
                                DisadvantageId.Principles,
                                DisadvantageId.BadHabit,
                                DisadvantageId.Stigma,
                                DisadvantageId.Obligations))
        ? set (IACEL.disabled) (Just (true))
        : ident,
      fromMaybe
        (ident as ident<Record<InactiveActivatableControlElements>>)
        (pipe_ (
          guard (notElem (IAA.id (entry))
                         (List (AdvantageId.ImmunityToPoison, AdvantageId.ImmunityToDisease))),
          thenF (minput_desc),
          fmap (
            input =>
              set (IACEL.inputElement)
                  (
                    Just (
                      <TextField
                        hint={input}
                        value={minput_text}
                        onChangeString={inputHandlers.handleInput}
                        />
                    )
                  )
          )
        )),
      IAA.id (entry) === SpecialAbilityId.SkillSpecialization
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

const getPropsForEntryWithSkillSel =
  (ensureId: (x: Maybe<number | string>) => Maybe<string>) =>
  (wiki: WikiModelRecord) =>
  (mselected: Maybe<string | number>) =>
  (entry: Record<InactiveActivatable>) =>
  (id: string) =>
    Pair (
      ActivatableActivationOptions ({
        id,
        selectOptionId1: mselected,
        cost: Nothing,
      }),
      PropertiesAffectedByState ({
        currentCost:
          pipe_ (
            mselected,
            ensureId,
            bindF (getWikiEntry (wiki)),
            bindF (ensure (isSkillishWikiEntry)),
            bindF (pipe (
              SkAL.ic,
              dec,
              i => pipe_ (entry, IAA.cost, bindF (ensure (isList)), bindF (subscriptF (i)))
            ))
          ),
      })
    )
