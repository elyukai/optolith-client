import * as React from "react";
import { isString } from "util";
import { notEquals } from "../../../Data/Eq";
import { onF } from "../../../Data/Function";
import { fmap, mapReplace } from "../../../Data/Functor";
import { cons, flength, List } from "../../../Data/List";
import { any, bindF, ensure, fromJust, fromMaybe, guard, INTERNAL_shallowEquals, isJust, Just, liftM2, listToMaybe, Maybe, maybe } from "../../../Data/Maybe";
import { max, min } from "../../../Data/Num";
import { Record } from "../../../Data/Record";
import { ActivatableDeactivationOptions } from "../../Models/Actions/ActivatableDeactivationOptions";
import { ActiveActivatable, ActiveActivatableA_ } from "../../Models/View/ActiveActivatable";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { classListMaybe } from "../../Utilities/CSS";
import { translate } from "../../Utilities/I18n";
import { getLevelElementsWithMin } from "../../Utilities/levelUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { renderMaybe } from "../../Utilities/ReactUtils";
import { Dropdown, DropdownOption } from "../Universal/Dropdown";
import { IconButton } from "../Universal/IconButton";
import { ListItem } from "../Universal/ListItem";
import { ListItemButtons } from "../Universal/ListItemButtons";
import { ListItemGroup } from "../Universal/ListItemGroup";
import { ListItemName } from "../Universal/ListItemName";
import { ListItemSelections } from "../Universal/ListItemSelections";
import { ListItemSeparator } from "../Universal/ListItemSeparator";
import { ListItemValues } from "../Universal/ListItemValues";
import { SpecialAbilityId } from "../../Constants/Ids";

export interface ActivatableRemoveListItemProps {
  item: Record<ActiveActivatable>
  l10n: L10nRecord
  isRemovingEnabled: boolean
  hideGroup?: boolean
  isImportant?: boolean
  isTypical?: boolean
  isUntypical?: boolean
  selectedForInfo: Maybe<string>
  setLevel (id: string, index: number, level: number): void
  removeFromList (args: Record<ActivatableDeactivationOptions>): void
  selectForInfo (id: string): void
}

const AAA_ = ActiveActivatableA_
const DOA = DropdownOption.A

export class ActivatableRemoveListItem extends React.Component<ActivatableRemoveListItemProps> {
  handleSelectTier = (maybeLevel: Maybe<number>) => {
    if (isJust (maybeLevel)) {
      const level = fromJust (maybeLevel)

      this.props.setLevel (AAA_.id (this.props.item), AAA_.index (this.props.item), level)
    }
  }

  shouldComponentUpdate (nextProps: ActivatableRemoveListItemProps) {
    const curr_item = this.props.item
    const next_item = nextProps.item

    return onF (AAA_.level) (notEquals) (curr_item) (next_item)
      || onF (AAA_.finalCost) (notEquals) (curr_item) (next_item)
      || this.props.isRemovingEnabled === !nextProps.isRemovingEnabled
      || onF (AAA_.minLevel) (notEquals) (curr_item) (next_item)
      || onF (AAA_.maxLevel) (notEquals) (curr_item) (next_item)
      || onF (AAA_.name) (notEquals) (curr_item) (next_item)
      || onF (AAA_.disabled) (notEquals) (curr_item) (next_item)
      || !INTERNAL_shallowEquals (this.props.selectedForInfo) (nextProps.selectedForInfo)
  }

  render () {
    const {
      isRemovingEnabled,
      hideGroup,
      item,
      isImportant,
      isTypical,
      isUntypical,
      l10n,
      selectForInfo,
      selectedForInfo,
      removeFromList,
    } = this.props

    const mlevel_element =
      liftM2<number, number, JSX.Element | string>
        (levels => level => {
          const curr_min =
            !isRemovingEnabled
              ? level
              : pipe_ (item, AAA_.minLevel, maybe (1) (max (1)))

          const curr_max = pipe_ (item, AAA_.maxLevel, maybe (levels) (min (levels)))

          const levelOptions = getLevelElementsWithMin (curr_min) (curr_max)

          const levelOptionsWithMotherTongue =
            AAA_.id (item) === SpecialAbilityId.Language
            && (level === 4 || isRemovingEnabled)
              ? cons (levelOptions)
                     (DropdownOption ({
                       id: Just (4),
                       name: translate (l10n) ("nativetongue.short"),
                     }))
              : levelOptions

          return flength (levelOptions) > 1
            ? (
              <Dropdown
                className="tiers"
                value={Just (level)}
                onChange={this.handleSelectTier}
                options={levelOptionsWithMotherTongue}
                />
            )
            : pipe_ (levelOptions, listToMaybe, fmap (o => ` ${DOA.name (o)}`), renderMaybe)
        })
        (AAA_.levels (item))
        (AAA_.level (item))

    const options =
      pipe_ (
        item,
        AAA_.finalCost,
        cost => ActivatableDeactivationOptions ({
                  id: AAA_.id (item),
                  index: AAA_.index (item),
                  cost,
                })
      )

    const baseName = AAA_.baseName (item)

    return (
      <ListItem
        important={isImportant}
        recommended={isTypical}
        unrecommended={isUntypical}
        active={Maybe.elem (AAA_.id (item)) (selectedForInfo)}
        >
        <ListItemName
          name={
            any ((x: string | JSX.Element) => !isString (x)) (mlevel_element)
              ? maybe (baseName)
                      ((add_str: string) =>
                        `${baseName} (${add_str})`)
                      (AAA_.addName (item))
              : AAA_.name (item)
          }
          />
        <ListItemSelections>
          {pipe_ (
            mlevel_element,
            bindF (ensure ((l): l is JSX.Element => !isString (l))),
            fromMaybe (<></>)
          )}
        </ListItemSelections>
        <ListItemSeparator/>
        {hideGroup !== true
          ? (
            <ListItemGroup
              list={translate (l10n) ("specialabilitygroups")}
              index={AAA_.gr (item)}
              />
          )
        : null}
        <ListItemValues>
          <div
            className={classListMaybe (List (
              Just ("cost"),
              pipe_ (
                item,
                AAA_.customCost,
                bindF (pipe (notEquals (0), guard)),
                mapReplace ("custom-cost")
              )
            ))}
            >
            {AAA_.isAutomatic (item) ? `(${AAA_.finalCost (item)})` : AAA_.finalCost (item)}
          </div>
        </ListItemValues>
        <ListItemButtons>
          {isRemovingEnabled
            ? (
                <IconButton
                  icon="&#xE90b;"
                  onClick={() => removeFromList (options)}
                  disabled={AAA_.disabled (item)}
                  flat
                  />
              )
            : null}
          <IconButton icon="&#xE912;" onClick={() => selectForInfo (AAA_.id (item))} flat />
        </ListItemButtons>
      </ListItem>
    )
  }
}
