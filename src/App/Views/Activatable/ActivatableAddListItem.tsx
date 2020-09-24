import * as React from "react"
import { List, notNullStr } from "../../../Data/List"
import { any, ensure, fromMaybe, guardReplace, isJust, isNothing, Just, Maybe, maybe, maybeToUndefined, Nothing, orN } from "../../../Data/Maybe"
import { lookup } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { fst, snd } from "../../../Data/Tuple"
import { AdvantageId, DisadvantageId, SpecialAbilityId } from "../../Constants/Ids"
import { ActivatableActivationOptions } from "../../Models/Actions/ActivatableActivationOptions"
import { HeroModel } from "../../Models/Hero/HeroModel"
import { NumIdName } from "../../Models/NumIdName"
import { InactiveActivatable } from "../../Models/View/InactiveActivatable"
import { Advantage } from "../../Models/Wiki/Advantage"
import { Disadvantage } from "../../Models/Wiki/Disadvantage"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { getIdSpecificAffectedAndDispatchProps, getInactiveActivatableControlElements, InactiveActivatableControlElements, insertFinalCurrentCost, PropertiesAffectedByState } from "../../Utilities/Activatable/activatableInactiveViewUtils"
import { classListMaybe } from "../../Utilities/CSS"
import { translate, translateP } from "../../Utilities/I18n"
import { pipe_ } from "../../Utilities/pipe"
import { renderMaybeWith } from "../../Utilities/ReactUtils"
import { BasicInputDialog } from "../Universal/BasicInputDialog"
import { IconButton } from "../Universal/IconButton"
import { ListItem } from "../Universal/ListItem"
import { ListItemButtons } from "../Universal/ListItemButtons"
import { ListItemGroup } from "../Universal/ListItemGroup"
import { ListItemLeft } from "../Universal/ListItemLeft"
import { ListItemName } from "../Universal/ListItemName"
import { ListItemSeparator } from "../Universal/ListItemSeparator"
import { ListItemValues } from "../Universal/ListItemValues"

export interface ActivatableAddListItemOwnProps {
  item: Record<InactiveActivatable>
  isImportant?: boolean
  isTypical?: boolean
  isUntypical?: boolean
  hideGroup?: boolean
  selectedForInfo: Maybe<string>
  addToList (args: Record<ActivatableActivationOptions>): void
  selectForInfo (id: string): void
}

export interface ActivatableAddListItemStateProps {
  skills: Maybe<HeroModel["skills"]>
  staticData: StaticDataRecord
  isEditingAllowed: boolean
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
    selectForInfo,
    selectedForInfo,
    staticData,
    addToList,
    isEditingAllowed,
  } = props

  const id = IAA.id (item)

  const [ mselected, setSelected ] = React.useState<Maybe<string | number>> (Nothing)
  const [ mselected2, setSelected2 ] = React.useState<Maybe<string | number>> (Nothing)
  const [ mselected3, setSelected3 ] = React.useState<Maybe<string | number>> (Nothing)
  const [ mselected_level, setSelectedLevel ] = React.useState<Maybe<number>> (Nothing)
  const [ minput, setInput ] = React.useState<Maybe<string>> (Nothing)
  const [ mcustom_cost, setCustomCost ] = React.useState<Maybe<string>> (Nothing)
  const [ mcustom_cost_preview, setCustomCostPreview ] = React.useState<Maybe<string>> (Nothing)
  const [ showCustomCostDialog, setShowCustomCostDialog ] = React.useState<boolean> (false)

  const isCustomCostAvailable = React.useMemo (
    () => {
      const staticEntry = IAA.wikiEntry (item)

      return Advantage.is (staticEntry)
        || Disadvantage.is (staticEntry)
        || id === SpecialAbilityId.CustomSpecialAbility
    },
    [ item, id ]
  )

  const handleSelect =
    React.useCallback (
      (nextSelected: Maybe<string | number>) => {
        setSelected (nextSelected)
        setSelected2 (Nothing)
        setSelected3 (Nothing)
      },
      [ setSelected, setSelected2, setSelected3 ]
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
      [ setSelectedLevel, setSelected, id ]
    )

  const handleInput =
    React.useCallback (
      (input: string) => setInput (ensure (notNullStr) (input)),
      [ setInput ]
    )

  const handleShowCustomCostDialog =
    React.useCallback (
      () => {
        if (isCustomCostAvailable) {
          setShowCustomCostDialog (true)
          setCustomCostPreview (mcustom_cost)
        }
      },
      [ setShowCustomCostDialog, setCustomCostPreview, isCustomCostAvailable, mcustom_cost ]
    )

  const handleCloseCustomCostDialog =
    React.useCallback (
      () => setShowCustomCostDialog (false),
      [ setShowCustomCostDialog ]
    )

  const handleSetCustomCost =
    React.useCallback (
      () => setCustomCost (mcustom_cost_preview),
      [ setCustomCost, mcustom_cost_preview ]
    )

  const handleSetCustomCostPreview =
    React.useCallback (
      (customCostStr: string) => pipe_ (customCostStr, ensure (notNullStr), setCustomCostPreview),
      [ setCustomCostPreview ]
    )

  const handleDeleteCustomCost =
    React.useCallback (
      () => setCustomCost (Nothing),
      [ setCustomCost ]
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
    getIdSpecificAffectedAndDispatchProps ({
                                            handleInput,
                                            handleSelect,
                                            selectElementDisabled,
                                          })
                                          (staticData)
                                          (item)
                                          (selectedOptions)

  const finalProps = insertFinalCurrentCost (item)
                                            (selectedOptions)
                                            (propsAndActivationArgs)

  const controlElements =
    getInactiveActivatableControlElements (staticData)
                                          (isEditingAllowed)
                                          ({
                                            handleInput,
                                            handleSelect,
                                            handleSecondSelect: setSelected2,
                                            handleThirdSelect: setSelected3,
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
      [ selectForInfo, id ]
    )

  return (
    <ListItem
      important={isImportant}
      recommended={isTypical}
      unrecommended={isUntypical}
      active={Maybe.elem (IAA.id (item)) (selectedForInfo)}
      >
      <ListItemLeft>
        <ListItemName name={IAA.name (item)} onClick={handleSelectForInfo} />
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
            text={pipe_ (
              staticData,
              StaticData.A.specialAbilityGroups,
              lookup (pipe_ (item, IAA.wikiEntry, SpecialAbility.AL.gr)),
              maybe ("") (NumIdName.A.name)
            )}
            />
        )}
      <ListItemValues>
        <div
          className={classListMaybe (List (
            Just ("cost"),
            guardReplace (isCustomCostAvailable) ("value-btn"),
            guardReplace (isJust (mcustom_cost)) ("custom-cost")
          ))}
          onClick={handleShowCustomCostDialog}
          >
          {renderMaybeWith ((x: number | string) => IAA.isAutomatic (item) ? `(${x})` : x)
                           (PABSA.currentCost (snd (finalProps)))}
        </div>
      <BasicInputDialog
        id="custom-cost-dialog"
        isOpen={showCustomCostDialog}
        title={translate (staticData) ("advantagesdisadvantages.dialogs.customcost.title")}
        description={
          translateP (staticData)
                     ("advantagesdisadvantages.dialogs.customcost.for")
                     (List (IAA.name (item)))
        }
        value={maybeToUndefined (mcustom_cost_preview)}
        acceptLabel={translate (staticData) ("general.dialogs.donebtn")}
        rejectLabel={translate (staticData) ("general.dialogs.deletebtn")}
        rejectDisabled={isNothing (mcustom_cost)}
        onClose={handleCloseCustomCostDialog}
        onAccept={handleSetCustomCost}
        onReject={handleDeleteCustomCost}
        onChange={handleSetCustomCostPreview}
        />
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
