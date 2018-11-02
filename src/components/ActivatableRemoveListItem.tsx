import classNames = require('classnames');
import * as R from 'ramda';
import * as React from 'react';
import { isString } from 'util';
import { ActiveViewObject, DeactivateArgs, UIMessagesObject } from '../types/data';
import { Just, List, Maybe, Nothing, Record, Tuple } from '../utils/dataUtils';
import { translate } from '../utils/I18n';
import { getRoman } from '../utils/NumberUtils';
import { Dropdown, DropdownOption } from './Dropdown';
import { IconButton } from './IconButton';
import { ListItem } from './ListItem';
import { ListItemButtons } from './ListItemButtons';
import { ListItemGroup } from './ListItemGroup';
import { ListItemName } from './ListItemName';
import { ListItemSelections } from './ListItemSelections';
import { ListItemSeparator } from './ListItemSeparator';
import { ListItemValues } from './ListItemValues';

export interface ActivatableRemoveListItemProps {
  item: Record<ActiveViewObject>;
  locale: UIMessagesObject;
  isRemovingEnabled: boolean;
  hideGroup?: boolean;
  isImportant?: boolean;
  isTypical?: boolean;
  isUntypical?: boolean;
  setLevel (id: string, index: number, level: number): void;
  removeFromList (args: DeactivateArgs): void;
  selectForInfo (id: string): void;
}

export class ActivatableRemoveListItem extends React.Component<ActivatableRemoveListItemProps> {
  handleSelectTier = (maybeLevel: Maybe<number>) => {
    if (Maybe.isJust (maybeLevel)) {
      const level = Maybe.fromJust (maybeLevel);

      this.props.setLevel (this.props.item .get ('id'), this.props.item .get ('index'), level);
    }
  }

  removeFromList = (args: DeactivateArgs) => this.props.removeFromList (args);

  shouldComponentUpdate (nextProps: ActivatableRemoveListItemProps) {
    return this.props.item .lookup ('tier') .notEquals (nextProps.item .lookup ('tier'))
      || this.props.item .lookup ('cost') .notEquals (nextProps.item .lookup ('cost'))
      || this.props.isRemovingEnabled === !nextProps.isRemovingEnabled
      || this.props.item .lookup ('minTier') .notEquals (nextProps.item .lookup ('minTier'))
      || this.props.item .lookup ('maxTier') .notEquals (nextProps.item .lookup ('maxTier'))
      || this.props.item .get ('name') !== nextProps.item .get ('name')
      || this.props.item .get ('disabled') !== nextProps.item .get ('disabled');
  }

  render () {
    const {
      isRemovingEnabled,
      hideGroup,
      item,
      isImportant,
      isTypical,
      isUntypical,
      locale,
      selectForInfo,
    } = this.props;

    const maybeLevelElement =
      Maybe.liftM2<number, number, JSX.Element | string>
        (levels => level => {
          const min = !isRemovingEnabled
            ? level
            : Maybe.fromMaybe (1)
                              (item .lookup ('minTier') .fmap (R.max<number> (1)));

          const max = Maybe.fromMaybe (levels)
                                      (item .lookup ('maxTier') .fmap (R.min (levels)));

          const length = max - min + 1;

          const levelOptions =
            List.unfoldr<Record<DropdownOption>, number>
              (index => index < length
                ? Just (
                  Tuple.of<Record<DropdownOption>, number>
                    (Record.of<DropdownOption> ({
                      id: index + min,
                      name: getRoman (index + min),
                    }))
                    (index + 1)
                )
                : Nothing ())
              (0);

          const levelOptionsWithMotherTongue =
            item .get ('id') === 'SA_29' && (level === 4 || isRemovingEnabled)
              ? levelOptions .append (Record.of<DropdownOption> ({
                id: 4,
                name: translate (locale, 'mothertongue.short'),
              }))
              : levelOptions;

          return levelOptions .length () > 1
            ? (
              <Dropdown
                className="tiers"
                value={Just (level)}
                onChange={this.handleSelectTier}
                options={levelOptionsWithMotherTongue}
                />
            )
            : Maybe.fromMaybe ('')
                              (Maybe.listToMaybe (levelOptions)
                                .fmap (option => ` ${option .get ('name')}`))
        })
        (item .get ('wikiEntry') .lookup ('tiers'))
        (item .lookup ('tier'));

    const maybeArgs = item .lookup ('finalCost')
      .fmap (
        cost => Record.of<DeactivateArgs> ({
          id: item .get ('id'),
          index: item .get ('index'),
          cost,
        })
      );

    return (
      <ListItem important={isImportant} recommended={isTypical} unrecommended={isUntypical}>
        <ListItemName
          name={
            Maybe.fromMaybe
              (item .get ('name'))
              (maybeLevelElement
                .bind (Maybe.ensure (isString))
                .fmap (level => item .get ('name') + level))
          }
          />
        <ListItemSelections>
          {
            Maybe.fromMaybe
              (<></>)
              (maybeLevelElement
                .bind (
                  Maybe.ensure (
                    (levelElement): levelElement is JSX.Element => typeof levelElement !== 'string')
                  )
                )
          }
        </ListItemSelections>
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
                Maybe.elem (true) (item .lookup ('customCost')) && 'custom-cost'
              )
            }
            >
            {Maybe.fromMaybe<string | number> ('') (item .lookup ('finalCost'))}
          </div>
        </ListItemValues>
        <ListItemButtons>
          {isRemovingEnabled && Maybe.fromMaybe
            (<></>)
            (maybeArgs .fmap (
              args => (
                <IconButton
                  icon="&#xE90b;"
                  onClick={() => this.removeFromList (args .toObject ())}
                  disabled={item .get ('disabled')}
                  flat
                  />
              )
            ))}
          <IconButton icon="&#xE912;" onClick={() => selectForInfo (item .get ('id'))} flat />
        </ListItemButtons>
      </ListItem>
    );
  }
}
