import * as React from "react";
import { isString } from "util";
import { notEquals } from "../../../Data/Eq";
import { onF } from "../../../Data/Function";
import { fmap, mapReplace } from "../../../Data/Functor";
import { cons, flength, List } from "../../../Data/List";
import { any, bindF, ensure, fromJust, fromMaybe, guard, INTERNAL_shallowEquals, isJust, Just, liftM2, listToMaybe, Maybe, maybe, orN } from "../../../Data/Maybe";
import { max, min } from "../../../Data/Num";
import { Record } from "../../../Data/Record";
import { SpecialAbilityId } from "../../Constants/Ids";
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

const ActivatableRemoveListItem: React.FC<ActivatableRemoveListItemProps> = props => {
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
    setLevel,
  } = props

  const id = AAA_.id (item)

  const handleSelectTier = React.useCallback (
    (mlevel: Maybe<number>) => {
      if (isJust (mlevel)) {
        const level = fromJust (mlevel)

        setLevel (id, AAA_.index (item), level)
      }
    },
    [ item, setLevel, id ]
  )

  const handleRemove = React.useCallback (
    () => removeFromList (pipe_ (
                           item,
                           AAA_.finalCost,
                           cost => ActivatableDeactivationOptions ({
                                     id,
                                     index: AAA_.index (item),
                                     cost,
                                   })
                         )),
    [ item, removeFromList, id ]
  )

  const handleSelectForInfo =
    React.useCallback (
      () => selectForInfo (id),
      [ selectForInfo, id ]
    )

  const mlevel_element =
    liftM2<number, number, JSX.Element | string>
      (levels => level => {
        const curr_min =
          isRemovingEnabled
            ? pipe_ (item, AAA_.minLevel, maybe (1) (max (1)))
            : level

        const curr_max = pipe_ (item, AAA_.maxLevel, maybe (levels) (min (levels)))

        const levelOptions = getLevelElementsWithMin (curr_min) (curr_max)

        const levelOptionsWithMotherTongue =
          id === SpecialAbilityId.Language
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
              onChange={handleSelectTier}
              options={levelOptionsWithMotherTongue}
              />
          )
          : pipe_ (levelOptions, listToMaybe, fmap (o => ` ${DOA.name (o)}`), renderMaybe)
      })
      (AAA_.levels (item))
      (AAA_.level (item))

  const baseName = AAA_.baseName (item)

  return (
    <ListItem
      important={isImportant}
      recommended={isTypical}
      unrecommended={isUntypical}
      active={Maybe.elem (id) (selectedForInfo)}
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
      <ListItemSeparator />
      {orN (hideGroup)
        ? null
        : (
          <ListItemGroup
            list={translate (l10n) ("specialabilitygroups")}
            index={AAA_.gr (item)}
            />
        )}
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
                onClick={handleRemove}
                disabled={AAA_.disabled (item)}
                flat
                />
            )
          : null}
        <IconButton icon="&#xE912;" onClick={handleSelectForInfo} flat />
      </ListItemButtons>
    </ListItem>
  )
}

const ActivatableRemoveListItemM =
  React.memo (
    ActivatableRemoveListItem,
    (prevProps, nextProps) => {
      const curr_item = prevProps.item
      const next_item = nextProps.item

      return onF (AAA_.level) (notEquals) (curr_item) (next_item)
        || onF (AAA_.finalCost) (notEquals) (curr_item) (next_item)
        || prevProps.isRemovingEnabled === !nextProps.isRemovingEnabled
        || onF (AAA_.minLevel) (notEquals) (curr_item) (next_item)
        || onF (AAA_.maxLevel) (notEquals) (curr_item) (next_item)
        || onF (AAA_.name) (notEquals) (curr_item) (next_item)
        || onF (AAA_.disabled) (notEquals) (curr_item) (next_item)
        || !INTERNAL_shallowEquals (prevProps.selectedForInfo) (nextProps.selectedForInfo)
    }
  )

export { ActivatableRemoveListItemM as ActivatableRemoveListItem };
