import * as React from "react";
import { notP } from "../../../Data/Bool";
import { List, notNullStr } from "../../../Data/List";
import { all, any, ensure, fromMaybe, guardReplace, isJust, isNothing, Just, Maybe, Nothing, orN } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { fst, snd } from "../../../Data/Tuple";
import { AdvantageId, DisadvantageId } from "../../Constants/Ids";
import { ActivatableActivationOptions } from "../../Models/Actions/ActivatableActivationOptions";
import { HeroModel } from "../../Models/Hero/HeroModel";
import { InactiveActivatable } from "../../Models/View/InactiveActivatable";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { getIdSpecificAffectedAndDispatchProps, getInactiveActivatableControlElements, InactiveActivatableControlElements, insertFinalCurrentCost, PropertiesAffectedByState } from "../../Utilities/Activatable/activatableInactiveViewUtils";
import { classListMaybe } from "../../Utilities/CSS";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { renderMaybeWith } from "../../Utilities/ReactUtils";
import { isInteger } from "../../Utilities/RegexUtils";
import { Dialog } from "../Universal/DialogNew";
import { IconButton } from "../Universal/IconButton";
import { ListItem } from "../Universal/ListItem";
import { ListItemButtons } from "../Universal/ListItemButtons";
import { ListItemGroup } from "../Universal/ListItemGroup";
import { ListItemLeft } from "../Universal/ListItemLeft";
import { ListItemName } from "../Universal/ListItemName";
import { ListItemSeparator } from "../Universal/ListItemSeparator";
import { ListItemValues } from "../Universal/ListItemValues";
import { TextField } from "../Universal/TextField";

export interface ActivatableAddListItemOwnProps {
  item: Record<InactiveActivatable>
  isImportant?: boolean
  isTypical?: boolean
  isUntypical?: boolean
  hideGroup?: boolean
  l10n: L10nRecord
  selectedForInfo: Maybe<string>
  addToList (args: Record<ActivatableActivationOptions>): void
  selectForInfo (id: string): void
}

export interface ActivatableAddListItemStateProps {
  skills: Maybe<HeroModel["skills"]>
  wiki: WikiModelRecord
}

export interface ActivatableAddListItemDispatchProps { }

export type ActivatableAddListItemProps =
  ActivatableAddListItemStateProps
  & ActivatableAddListItemDispatchProps
  & ActivatableAddListItemOwnProps

export interface ActivatableAddListItemSelectedOptions {
  selected: Maybe<string | number>
  selected2: Maybe<string | number>
  selected3: Maybe<string | number>
  selectedTier: Maybe<number>
  input: Maybe<string>
  customCost: Maybe<string>
}

const IAA = InactiveActivatable.A
const IACEA = InactiveActivatableControlElements.A
const PABSA = PropertiesAffectedByState.A

export const ActivatableAddListItem: React.FC<ActivatableAddListItemProps> = props => {
  const {
    item,
    isImportant,
    isTypical,
    isUntypical,
    hideGroup,
    l10n,
    selectForInfo,
    selectedForInfo,
    wiki,
    addToList,
  } = props

  const id = IAA.id (item)

  const [mselected, setSelected] = React.useState<Maybe<string | number>> (Nothing)
  const [mselected2, setSelected2] = React.useState<Maybe<string | number>> (Nothing)
  const [mselected3, setSelected3] = React.useState<Maybe<string | number>> (Nothing)
  const [mselected_level, setSelectedLevel] = React.useState<Maybe<number>> (Nothing)
  const [minput, setInput] = React.useState<Maybe<string>> (Nothing)
  const [mcustom_cost, setCustomCost] = React.useState<Maybe<string>> (Nothing)
  const [mcustom_cost_preview, setCustomCostPreview] = React.useState<Maybe<string>> (Nothing)
  const [showCustomCostDialog, setShowCustomCostDialog] = React.useState<boolean> (false)

  const handleSelect =
    React.useCallback (
      (nextSelected: Maybe<string | number>) => {
        setSelected (nextSelected)
        setSelected2 (Nothing)
        setSelected3 (Nothing)
      },
      [setSelected, setSelected2, setSelected3]
    )

  const handleLevel =
    React.useCallback (
      (mlevel: Maybe<number>) => {
        if (isJust (mlevel)) {
          if (DisadvantageId.Principles === id || DisadvantageId.Obligations === id) {
            setSelectedLevel (mlevel)
            setSelected (Nothing)
          }
          else {
            setSelectedLevel (mlevel)
          }
        }
      },
      [setSelectedLevel, setSelected, id]
    )

  const handleInput =
    React.useCallback (
      (input: string) => setInput (ensure (notNullStr) (input)),
      [setInput]
    )

  const handleShowCustomCostDialog =
    React.useCallback (
      () => {
        setShowCustomCostDialog (orN (hideGroup))
        setCustomCostPreview (mcustom_cost)
      },
      [setShowCustomCostDialog, setCustomCostPreview, hideGroup, mcustom_cost]
    )

  const handleCloseCustomCostDialog =
    React.useCallback (
      () => setShowCustomCostDialog (false),
      [setShowCustomCostDialog]
    )

  const handleSetCustomCost =
    React.useCallback (
      () => setCustomCost (mcustom_cost_preview),
      [setCustomCost, mcustom_cost_preview]
    )

  const handleSetCustomCostPreview =
    React.useCallback (
      pipe (ensure (notNullStr), setCustomCostPreview),
      [setCustomCostPreview]
    )

  const handleDeleteCustomCost =
    React.useCallback (
      () => setCustomCost (Nothing),
      [setCustomCost]
    )

  const selectElementDisabled =
    ([
      AdvantageId.MagicalAttunement,
      DisadvantageId.AfraidOf,
      DisadvantageId.MagicalRestriction,
      DisadvantageId.Principles,
      DisadvantageId.BadHabit,
      DisadvantageId.Stigma,
      DisadvantageId.Obligations,
    ] as string[]) .includes (id)
    && any (notNullStr) (minput)

  const selectedOptions: ActivatableAddListItemSelectedOptions = {
    selected: mselected,
    selected2: mselected2,
    selected3: mselected3,
    selectedTier: mselected_level,
    input: minput,
    customCost: mcustom_cost,
  }

  const propsAndActivationArgs =
    getIdSpecificAffectedAndDispatchProps
      ({
        handleInput,
        handleSelect,
        selectElementDisabled,
      })
      (l10n)
      (wiki)
      (item)
      (selectedOptions)

  const finalProps = insertFinalCurrentCost (item) (selectedOptions) (propsAndActivationArgs)

  const controlElements =
    getInactiveActivatableControlElements
      ({
        handleInput,
        handleSelect,
        handleSecondSelect: setSelected2,
        handleLevel,
        selectElementDisabled,
      })
      (item)
      (selectedOptions)
      (finalProps)

  const mlevelElementBefore = IACEA.levelElementBefore (controlElements)
  const mlevelElementAfter = IACEA.levelElementAfter (controlElements)
  const mselectElement = IACEA.selectElement (controlElements)
  const msecondSelectElement = IACEA.secondSelectElement (controlElements)
  const mthirdSelectElement = IACEA.thirdSelectElement (controlElements)
  const minputElement = IACEA.inputElement (controlElements)
  const mdisabled = IACEA.disabled (controlElements)

  const handleAddToList =
    React.useCallback (
      () => {
        const args = fst (finalProps)

        addToList (args)

        if (isJust (mselected) || isJust (mselected_level) || isJust (minput)) {
          setInput (Nothing)
          setSelected (Nothing)
          setSelected2 (Nothing)
          setSelected3 (Nothing)
          setSelectedLevel (Nothing)
          setCustomCost (Nothing)
        }
      },
      [
        mselected,
        mselected_level,
        minput,
        setInput,
        setSelected,
        setSelected2,
        setSelected3,
        setSelectedLevel,
        setCustomCost,
        finalProps,
        addToList,
      ]
    )

  const handleSelectForInfo =
    React.useCallback (
      () => selectForInfo (id),
      [selectForInfo, id]
    )

  return (
    <ListItem
      important={isImportant}
      recommended={isTypical}
      unrecommended={isUntypical}
      active={Maybe.elem (IAA.id (item)) (selectedForInfo)}
      >
      <ListItemLeft>
        <ListItemName name={IAA.name (item)} />
        {fromMaybe (null as React.ReactNode) (mlevelElementBefore)}
        {fromMaybe (null as React.ReactNode) (mselectElement)}
        {fromMaybe (null as React.ReactNode) (msecondSelectElement)}
        {fromMaybe (null as React.ReactNode) (mthirdSelectElement)}
        {fromMaybe (null as React.ReactNode) (minputElement)}
        {fromMaybe (null as React.ReactNode) (mlevelElementAfter)}
      </ListItemLeft>
      <ListItemSeparator />
      {orN (hideGroup)
        ? null
        : (
          <ListItemGroup
            list={translate (l10n) ("specialabilitygroups")}
            index={pipe_ (item, IAA.wikiEntry, SpecialAbility.AL.gr)}
            />
        )}
      <ListItemValues>
        <div
          className={classListMaybe (List (
            Just ("cost"),
            guardReplace (orN (hideGroup)) ("value-btn"),
            guardReplace (isJust (mcustom_cost)) ("custom-cost")
          ))}
          onClick={handleShowCustomCostDialog}
          >
          {renderMaybeWith ((x: number | string) => IAA.isAutomatic (item) ? `(${x})` : x)
                           (PABSA.currentCost (snd (finalProps)))}
        </div>
        <Dialog
          id="custom-cost-dialog"
          close={handleCloseCustomCostDialog}
          isOpen={showCustomCostDialog}
          title={translate (l10n) ("customcost")}
          buttons={[
            {
              autoWidth: true,
              label: translate (l10n) ("done"),
              disabled: all (notP (isInteger)) (mcustom_cost_preview),
              onClick: handleSetCustomCost,
            },
            {
              autoWidth: true,
              label: translate (l10n) ("delete"),
              disabled: isNothing (mcustom_cost),
              onClick: handleDeleteCustomCost,
            },
          ]}
          >
          {translate (l10n) ("customcostfor")}
          {IAA.name (item)}
          <TextField
            value={mcustom_cost_preview}
            onChange={handleSetCustomCostPreview}
            fullWidth
            autoFocus
            />
        </Dialog>
      </ListItemValues>
      <ListItemButtons>
        <IconButton
          icon="&#xE916;"
          disabled={mdisabled}
          onClick={handleAddToList}
          flat
          />
        <IconButton
          icon="&#xE912;"
          onClick={handleSelectForInfo}
          flat
          />
      </ListItemButtons>
    </ListItem>
  )
}
