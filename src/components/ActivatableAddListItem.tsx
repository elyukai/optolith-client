import classNames = require('classnames');
import * as React from 'react';
import { ActivateArgs, DeactiveViewObject, HeroDependent, InputTextEvent } from '../types/data';
import { getIdSpecificAffectedAndDispatchProps, getInactiveActivatableControlElements, insertFinalCurrentCost } from '../utils/activatable/activatableInactiveViewUtils';
import { Maybe, Record, Tuple } from '../utils/dataUtils';
import { translate, UIMessagesObject } from '../utils/I18n';
import { isInteger } from '../utils/RegexUtils';
import { WikiAll } from '../utils/wikiData/wikiTypeHelpers';
import { Dialog } from './DialogNew';
import { IconButton } from './IconButton';
import { ListItem } from './ListItem';
import { ListItemButtons } from './ListItemButtons';
import { ListItemGroup } from './ListItemGroup';
import { ListItemLeft } from './ListItemLeft';
import { ListItemName } from './ListItemName';
import { ListItemSeparator } from './ListItemSeparator';
import { ListItemValues } from './ListItemValues';
import { TextField } from './TextField';

export interface ActivatableAddListItemOwnProps {
  item: Record<DeactiveViewObject>;
  isImportant?: boolean;
  isTypical?: boolean;
  isUntypical?: boolean;
  hideGroup?: boolean;
  locale: UIMessagesObject;
  addToList (args: ActivateArgs): void;
  selectForInfo (id: string): void;
}

export interface ActivatableAddListItemStateProps {
  skills: Maybe<HeroDependent['skills']>;
  wiki: Record<WikiAll>;
}

export interface ActivatableAddListItemDispatchProps { }

export type ActivatableAddListItemProps =
  ActivatableAddListItemStateProps
  & ActivatableAddListItemDispatchProps
  & ActivatableAddListItemOwnProps;

export interface ActivatableAddListItemState {
  selected?: string | number;
  selected2?: string | number;
  selectedTier?: number;
  input?: string;
  input2?: string;
  customCost?: string;
  customCostPreview?: string;
  showCustomCostDialog: boolean;
}

export class ActivatableAddListItem extends
  React.Component<ActivatableAddListItemProps, ActivatableAddListItemState> {
  state: ActivatableAddListItemState = {
    showCustomCostDialog: false,
  };

  handleSelect = (selected: Maybe<string | number>) => {
    this.setState (() => ({
      selected: Maybe.isJust (selected) ? Maybe.fromJust (selected) : undefined,
      selected2: undefined,
    }));
  }

  handleSelect2 = (selected2: Maybe<string | number>) => {
    this.setState ({
      selected2: Maybe.isJust (selected2) ? Maybe.fromJust (selected2) : undefined,
    });
  };

  handleLevel = (maybeLevel: Maybe<number>) => {
    if (Maybe.isJust (maybeLevel)) {
      const level = Maybe.fromJust (maybeLevel);

      if (['DISADV_34', 'DISADV_50'].includes (this.props.item .get ('id'))) {
        this.setState ({ selectedTier: level, selected: undefined });
      }
      else {
        this.setState ({ selectedTier: level });
      }
    }
  }

  handleInput = (input: string) =>
    this.setState ({ input: input || undefined });

  handleSecondInput = (event: InputTextEvent) =>
    this.setState ({ input2: event.target.value || undefined });

  showCustomCostDialog = () => this.setState ({
    showCustomCostDialog: !!this.props.hideGroup,
    customCostPreview: this.state.customCost,
  });

  closeCustomCostDialog = () => this.setState ({ showCustomCostDialog: false });

  setCustomCost = () => this.setState ({ customCost: this.state.customCostPreview });

  setCustomCostPreview = (event: InputTextEvent) =>
    this.setState ({ customCostPreview: event.target.value || undefined });

  deleteCustomCost = () => this.setState ({ customCost: undefined });

  addToList = (args: ActivateArgs) => {
    this.props.addToList (args);

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
      });
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
      locale,
      selectForInfo,
      wiki,
    } = this.props;

    const {
      customCost,
      customCostPreview,
      input: inputText,
      showCustomCostDialog,
    } = this.state;

    let disabled = false;

    const selectElementDisabled =
      [
        'ADV_32',
        'DISADV_1',
        'DISADV_24',
        'DISADV_34',
        'DISADV_36',
        'DISADV_45',
        'DISADV_50',
      ].includes (item .get ('id'))
      && typeof inputText === 'string'
      && inputText.length > 0;

    const propsAndActivationArgs =
      getIdSpecificAffectedAndDispatchProps
        ({
          handleInput: this.handleInput,
          handleSelect: this.handleSelect,
          selectElementDisabled,
        })
        (locale)
        (wiki)
        (item)
        (this.state);

    const finalProps = insertFinalCurrentCost (item) (this.state) (propsAndActivationArgs);

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
        (finalProps);

    return (
      <ListItem important={isImportant} recommended={isTypical} unrecommended={isUntypical}>
        <ListItemLeft>
          <ListItemName name={item .get ('name')} />
          {Maybe.fromMaybe (<></>) (controlElements .lookup ('levelElementBefore'))}
          {Maybe.fromMaybe (<></>) (controlElements .lookup ('selectElement'))}
          {Maybe.fromMaybe (<></>) (controlElements .lookup ('secondSelectElement'))}
          {Maybe.fromMaybe (<></>) (controlElements .lookup ('inputElement'))}
          {Maybe.fromMaybe (<></>) (controlElements .lookup ('levelElementAfter'))}
        </ListItemLeft>
        <ListItemSeparator/>
        {!hideGroup && (
          <ListItemGroup
            list={translate (locale, 'specialabilities.view.groups')}
            index={item .get ('wikiEntry') .lookup ('gr') as Maybe<number>}
            />
        )}
        <ListItemValues>
          <div
            className={
              classNames (
                'cost',
                hideGroup && 'value-btn',
                typeof customCost === 'string' && 'custom-cost'
              )
            }
            onClick={this.showCustomCostDialog}
            >
            {Maybe.fromMaybe<string | number> ('') (Tuple.snd (finalProps) .lookup ('currentCost'))}
          </div>
          <Dialog
            id="custom-cost-dialog"
            close={this.closeCustomCostDialog}
            isOpened={showCustomCostDialog}
            title={translate (locale, 'customcost.title')}
            buttons={[
              {
                autoWidth: true,
                label: translate (locale, 'actions.done'),
                disabled: typeof customCostPreview === 'string' && !isInteger (customCostPreview),
                onClick: this.setCustomCost,
              },
              {
                autoWidth: true,
                label: translate (locale, 'actions.delete'),
                disabled: customCost === undefined,
                onClick: this.deleteCustomCost,
              },
            ]}
            >
            {translate (locale, 'customcost.message')}{item .get ('name')}
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
            onClick={this.addToList.bind (null, Tuple.fst (finalProps) .toObject ())}
            flat
            />
          <IconButton
            icon="&#xE912;"
            disabled={!selectForInfo}
            onClick={() => selectForInfo (item .get ('id'))}
            flat
            />
        </ListItemButtons>
      </ListItem>
    );
  }
}
