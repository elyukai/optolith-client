import * as React from "react"
import { isString } from "util"
import { equals, notEquals } from "../../../Data/Eq"
import { onF } from "../../../Data/Function"
import { fmap, mapReplace } from "../../../Data/Functor"
import { cons, flength, List } from "../../../Data/List"
import { any, bindF, ensure, fromJust, fromMaybe, guard, INTERNAL_shallowEquals, isJust, Just, liftM2, listToMaybe, Maybe, maybe, orN } from "../../../Data/Maybe"
import { max, min } from "../../../Data/Num"
import { lookup } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { SpecialAbilityId } from "../../Constants/Ids"
import { ActivatableDeactivationOptions } from "../../Models/Actions/ActivatableDeactivationOptions"
import { NumIdName } from "../../Models/NumIdName"
import { ActiveActivatable, ActiveActivatableA_ } from "../../Models/View/ActiveActivatable"
import { DropdownOption } from "../../Models/View/DropdownOption"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import {
  isCustomActivatableId
} from "../../Utilities/Activatable/checkActivatableUtils"
import { classListMaybe } from "../../Utilities/CSS"
import { translate } from "../../Utilities/I18n"
import { getLevelElementsWithMin } from "../../Utilities/levelUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { renderMaybe } from "../../Utilities/ReactUtils"
import { WikiInfoSelector } from "../InlineWiki/WikiInfo"
import { Dropdown } from "../Universal/Dropdown"
import { IconButton } from "../Universal/IconButton"
import { ListItem } from "../Universal/ListItem"
import { ListItemButtons } from "../Universal/ListItemButtons"
import { ListItemGroup } from "../Universal/ListItemGroup"
import { ListItemName } from "../Universal/ListItemName"
import { ListItemSelections } from "../Universal/ListItemSelections"
import { ListItemSeparator } from "../Universal/ListItemSeparator"
import { ListItemValues } from "../Universal/ListItemValues"

export interface ActivatableRemoveListItemProps {
  item: Record<ActiveActivatable>
  staticData: StaticDataRecord
  isRemovingEnabled: boolean
  hideGroup?: boolean
  isImportant?: boolean
  isTypical?: boolean
  isUntypical?: boolean
  selectedForInfo: Maybe<WikiInfoSelector>
  setLevel (id: string, index: number, level: number): void
  removeFromList (args: Record<ActivatableDeactivationOptions>): void
  selectForInfo (selector: WikiInfoSelector): void
}

const AAA = ActiveActivatable.A
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
    staticData,
    selectForInfo,
    selectedForInfo,
    removeFromList,
    setLevel,
  } = props

  const id = AAA_.id (item)
  const index = AAA_.index (item)

  const handleSelectTier = React.useCallback (
    (mlevel: Maybe<number>) => {
      if (isJust (mlevel)) {
        const level = fromJust (mlevel)

        setLevel (id, index, level)
      }
    },
    [ item, setLevel, id, index ]
  )

  const handleRemove = React.useCallback (
    () => removeFromList (pipe_ (
                           item,
                           AAA_.finalCost,
                           cost => ActivatableDeactivationOptions ({
                                     id,
                                     index,
                                     cost,
                                   })
                         )),
    [ item, removeFromList, id, index ]
  )

  const handleSelectForInfo =
    React.useCallback (
      () => selectForInfo ({
        currentId: id,
        index,
        item,
      }),
      [ selectForInfo, id, index, item ]
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
                     name: translate (staticData) ("specialabilities.nativetonguelevel"),
                   }))
            : levelOptions

        return flength (levelOptionsWithMotherTongue) > 1
          ? (
            <Dropdown
              className="tiers"
              value={Just (level)}
              onChange={handleSelectTier}
              options={levelOptionsWithMotherTongue}
              />
          )
          : pipe_ (
              levelOptions,
              listToMaybe,
              fmap ((o: Record<DropdownOption<number>>) => ` ${DOA.name (o)}`),
              renderMaybe
            )
      })
      (AAA_.levels (item))
      (AAA_.level (item))

  const baseName = AAA_.baseName (item)

  let active = false
  if (isJust (selectedForInfo)) {
    active = id === selectedForInfo.value.currentId

    if (isCustomActivatableId (id)) {
      active &&= index === selectedForInfo.value.index
    }
  }

  return (
    <ListItem
      important={isImportant}
      recommended={isTypical}
      unrecommended={isUntypical}
      active={active}
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
        onClick={handleSelectForInfo}
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
            text={pipe_ (
              staticData,
              StaticData.A.specialAbilityGroups,
              lookup (pipe_ (item, AAA.wikiEntry, SpecialAbility.AL.gr)),
              maybe ("") (NumIdName.A.name)
            )}
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

      return onF (AAA_.level) (equals) (curr_item) (next_item)
        && onF (AAA_.finalCost) (equals) (curr_item) (next_item)
        && prevProps.isRemovingEnabled === nextProps.isRemovingEnabled
        && onF (AAA_.minLevel) (equals) (curr_item) (next_item)
        && onF (AAA_.maxLevel) (equals) (curr_item) (next_item)
        && onF (AAA_.name) (equals) (curr_item) (next_item)
        && onF (AAA_.disabled) (equals) (curr_item) (next_item)
        && INTERNAL_shallowEquals (prevProps.selectedForInfo) (nextProps.selectedForInfo)
    }
  )

export { ActivatableRemoveListItemM as ActivatableRemoveListItem }
