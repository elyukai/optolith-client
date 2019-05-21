import classNames = require("classnames")
import * as React from "react";
import { notNullStrUndef } from "../../../Data/List";
import { fromJust, fromMaybe, fromMaybeR, isJust, Maybe, maybeToUndefined, or } from "../../../Data/Maybe";
import { fst, snd } from "../../../Data/Pair";
import { Record } from "../../../Data/Record";
import { ActivatableActivationOptions } from "../../Models/Actions/ActivatableActivationOptions";
import { HeroModel } from "../../Models/Hero/HeroModel";
import { InputTextEvent } from "../../Models/Hero/heroTypeHelpers";
import { InactiveActivatable } from "../../Models/View/InactiveActivatable";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { getIdSpecificAffectedAndDispatchProps, getInactiveActivatableControlElements, InactiveActivatableControlElements, insertFinalCurrentCost, PropertiesAffectedByState } from "../../Utilities/Activatable/activatableInactiveViewUtils";
import { translate } from "../../Utilities/I18n";
import { pipe_ } from "../../Utilities/pipe";
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

export interface ActivatableAddListItemState {
  selected?: string | number
  selected2?: string | number
  selectedTier?: number
  input?: string
  input2?: string
  customCost?: string
  customCostPreview?: string
  showCustomCostDialog: boolean
}

const IAA = InactiveActivatable.A
const IACEA = InactiveActivatableControlElements.A
const PABSA = PropertiesAffectedByState.A

export class ActivatableAddListItem extends
  React.Component<ActivatableAddListItemProps, ActivatableAddListItemState> {
  state: ActivatableAddListItemState = {
    showCustomCostDialog: false,
  }

  handleSelect = (selected: Maybe<string | number>) => {
    this.setState (() => ({
      selected: maybeToUndefined (selected),
      selected2: undefined,
    }))
  }

  handleSelect2 = (selected2: Maybe<string | number>) => {
    this.setState ({
      selected2: maybeToUndefined (selected2),
    })
  }

  handleLevel = (maybeLevel: Maybe<number>) => {
    if (isJust (maybeLevel)) {
      const level = fromJust (maybeLevel)

      if (["DISADV_34", "DISADV_50"].includes (IAA.id (this.props.item))) {
        this.setState ({ selectedTier: level, selected: undefined })
      }
      else {
        this.setState ({ selectedTier: level })
      }
    }
  }

  handleInput = (input: string) =>
    this.setState ({ input: notNullStrUndef (input) ? input :  undefined })

  handleSecondInput = (event: InputTextEvent) => {
    const input2 = event.target.value
    this.setState ({ input2: notNullStrUndef (input2) ? input2 : undefined })
  }

  showCustomCostDialog = () => this.setState ({
    showCustomCostDialog: this.props.hideGroup === true,
    customCostPreview: this.state.customCost,
  })

  closeCustomCostDialog = () => this.setState ({ showCustomCostDialog: false })

  setCustomCost = () => this.setState ({ customCost: this.state.customCostPreview })

  setCustomCostPreview = (event: InputTextEvent) => {
    const custom_cost = event.target.value
    this.setState ({ customCostPreview: notNullStrUndef (custom_cost) ? custom_cost : undefined })
  }

  deleteCustomCost = () => this.setState ({ customCost: undefined })

  addToList = (args: Record<ActivatableActivationOptions>) => {
    this.props.addToList (args)

    if (
      this.state.selected !== undefined
      || this.state.selectedTier !== undefined
      || this.state.input !== undefined
    ) {
      this.setState ({
        input: undefined,
        input2: undefined,
        selected: undefined,
        selected2: undefined,
        selectedTier: undefined,
        customCost: undefined,
      })
    }
  }

  // tslint:disable-next-line:cyclomatic-complexity
  render () {
    const {
      item,
      isImportant,
      isTypical,
      isUntypical,
      hideGroup,
      l10n,
      selectForInfo,
      wiki,
    } = this.props

    const {
      customCost,
      customCostPreview,
      input: inputText,
      showCustomCostDialog,
    } = this.state

    const selectElementDisabled =
      [
        "ADV_32",
        "DISADV_1",
        "DISADV_24",
        "DISADV_34",
        "DISADV_36",
        "DISADV_45",
        "DISADV_50",
      ].includes (IAA.id (item))
      && notNullStrUndef (inputText)

    const propsAndActivationArgs =
      getIdSpecificAffectedAndDispatchProps
        ({
          handleInput: this.handleInput,
          handleSelect: this.handleSelect,
          selectElementDisabled,
        })
        (l10n)
        (wiki)
        (item)
        (this.state)

    const finalProps = insertFinalCurrentCost (item) (this.state) (propsAndActivationArgs)

    const controlElements =
      getInactiveActivatableControlElements
        ({
          handleInput: this.handleInput,
          handleSelect: this.handleSelect,
          handleSecondSelect: this.handleSelect2,
          handleLevel: this.handleLevel,
          selectElementDisabled,
        })
        (item)
        (this.state)
        (finalProps)

    const levelElementBefore = IACEA.levelElementBefore (controlElements)
    const levelElementAfter = IACEA.levelElementAfter (controlElements)
    const selectElement = IACEA.selectElement (controlElements)
    const secondSelectElement = IACEA.secondSelectElement (controlElements)
    const inputElement = IACEA.inputElement (controlElements)
    const disabled = or (IACEA.disabled (controlElements))

    return (
      <ListItem important={isImportant} recommended={isTypical} unrecommended={isUntypical}>
        <ListItemLeft>
          <ListItemName name={IAA.name (item)} />
          {fromMaybeR (null) (levelElementBefore)}
          {fromMaybeR (null) (selectElement)}
          {fromMaybeR (null) (secondSelectElement)}
          {fromMaybeR (null) (inputElement)}
          {fromMaybeR (null) (levelElementAfter)}
        </ListItemLeft>
        <ListItemSeparator/>
        {hideGroup !== true
          ? (
            <ListItemGroup
              list={translate (l10n) ("specialabilitygroups")}
              index={pipe_ (item, IAA.wikiEntry, SpecialAbility.AL.gr)}
              />
          )
        : null}
        <ListItemValues>
          <div
            className={
              classNames (
                "cost",
                hideGroup === true ? "value-btn" : undefined,
                typeof customCost === "string" ? "custom-cost" : undefined
              )
            }
            onClick={this.showCustomCostDialog}
            >
            {fromMaybe<string | number> ("") (PABSA.currentCost (snd (finalProps)))}
          </div>
          <Dialog
            id="custom-cost-dialog"
            close={this.closeCustomCostDialog}
            isOpen={showCustomCostDialog}
            title={translate (l10n) ("customcost")}
            buttons={[
              {
                autoWidth: true,
                label: translate (l10n) ("done"),
                disabled: typeof customCostPreview === "string" && !isInteger (customCostPreview),
                onClick: this.setCustomCost,
              },
              {
                autoWidth: true,
                label: translate (l10n) ("delete"),
                disabled: customCost === undefined,
                onClick: this.deleteCustomCost,
              },
            ]}
            >
            {translate (l10n) ("customcostfor")}{IAA.name (item)}
            <TextField
              value={customCostPreview}
              onChange={this.setCustomCostPreview}
              fullWidth
              autoFocus
              />
          </Dialog>
        </ListItemValues>
        <ListItemButtons>
          <IconButton
            icon="&#xE916;"
            disabled={disabled}
            onClick={this.addToList.bind (null, fst (finalProps))}
            flat
            />
          <IconButton
            icon="&#xE912;"
            onClick={() => selectForInfo (IAA.id (item))}
            flat
            />
        </ListItemButtons>
      </ListItem>
    )
  }
}
