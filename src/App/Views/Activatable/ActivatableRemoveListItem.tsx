import classNames = require("classnames")
import * as React from "react";
import { isString } from "util";
import { notEquals } from "../../../Data/Eq";
import { onF } from "../../../Data/Function";
import { fmap, fmapF } from "../../../Data/Functor";
import { cons, flength } from "../../../Data/List";
import { bindF, ensure, fromJust, fromMaybe, isJust, Just, liftM2, listToMaybe, Maybe, maybe, or } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { ActivatableDeactivationOptions } from "../../Models/Actions/ActivatableDeactivationOptions";
import { ActiveActivatable, ActiveActivatableA_ } from "../../Models/View/ActiveActivatable";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { getLevelElementsWithMin } from "../../Utilities/levelUtils";
import { max, min } from "../../Utilities/mathUtils";
import { pipe_ } from "../../Utilities/pipe";
import { misStringM } from "../../Utilities/typeCheckUtils";
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
  }

  render () {
    const {
      isRemovingEnabled,
      hideGroup,
      item,
      isImportant,
      isTypical,
      isUntypical,
      l10n: locale,
      selectForInfo,
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
            AAA_.id (item) === "SA_29"
            && (level === 4 || isRemovingEnabled)
              ? cons (levelOptions)
                     (DropdownOption ({
                       id: Just (4),
                       name: translate (locale) ("nativetongue.short"),
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
            : pipe_ (levelOptions, listToMaybe, fmap (o => ` ${DOA.name (o)}`), fromMaybe (""))
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

    return (
      <ListItem important={isImportant} recommended={isTypical} unrecommended={isUntypical}>
        <ListItemName
          name={pipe_ (mlevel_element, misStringM, maybe (AAA_.name (item))
                                                         (l => `${AAA_.name (item)}${l}`))}
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
              list={translate (locale) ("specialabilitygroups")}
              index={AAA_.gr (item)}
              />
          )
        : null}
        <ListItemValues>
          <div
            className={
              classNames (
                "cost",
                or (fmapF (AAA_.customCost (item)) (notEquals (0))) ? "custom-cost" : undefined
              )
            }
            >
            {AAA_.finalCost (item)}
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
