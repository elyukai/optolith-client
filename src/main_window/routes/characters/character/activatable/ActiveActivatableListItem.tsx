import { classList } from "@elyukai/utils/classList"
import { range } from "@elyukai/utils/range"
import { romanize } from "@elyukai/utils/roman"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { ActivatableIdentifier } from "@optolith/database-schema/gen"
import { renderActivatableNameChunk } from "@optolith/entity-descriptions/entities/partial/activatableNameChunks"
// import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { observer } from "mobx-react-lite"
import { useCallback, type ReactNode } from "react"
import { Dropdown } from "../../../../../shared/components/dropdown/Dropdown.tsx"
import type { DropdownOption } from "../../../../../shared/components/dropdown/DropdownItem.tsx"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemButtons } from "../../../../../shared/components/list/ListItemButtons.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemLeft } from "../../../../../shared/components/list/ListItemLeft.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import {
  activatableGroupTranslationKeys,
  type DisplayedActiveActivatable,
} from "../../../../../shared/domain/activatable/activatable.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import {
  InlineLibraryManager,
  type DisplayableMainIdentifier,
} from "../../../../inlineLibrary/InlineLibrary.tsx"

type Props<K extends ActivatableIdentifier["kind"]> = {
  activatable: DisplayedActiveActivatable<K>
  isCustomCostAvailable?: boolean
  selectedInlineLibraryEntryId?: DisplayableMainIdentifier
}

const getLevelKey = (option: DropdownOption<number>) => option.id

/**
 * Displays an activatable entry that is currently active.
 */
export const ActiveActivatablesListItem = observer(
  <K extends ActivatableIdentifier["kind"]>(props: Props<K>): ReactNode => {
    const { activatable, isCustomCostAvailable = false, selectedInlineLibraryEntryId } = props

    const {
      type,
      id,
      instance,
      instanceIndex,
      isRemovable,
      cost,
      name,
      minLevel,
      maxLevel,
      levels,
    } = activatable

    const translate = useTranslate()
    const translateMap = useTranslateMap()
    const actions = useCharacterActions()

    const handleLevel = useCallback(
      (level: number) => {
        actions.setActivatableLevel(activatable.type, id, instanceIndex, level)
      },
      [activatable, id, instanceIndex],
    )

    const handleSelectForInfo = useCallback(
      () => InlineLibraryManager.instance.goTo([activatable.type, id]),
      [activatable.type],
    )

    const handleRemove = useCallback(() => {
      actions.removeActivatable(activatable.type, id, instanceIndex)
    }, [activatable, id, instanceIndex])

    const levelElement =
      levels === undefined || instance?.level === undefined || maxLevel === minLevel ? null : (
        <Dropdown
          className="level"
          options={range([minLevel ?? 1, maxLevel ?? levels]).map(l => ({
            id: l,
            name: romanize(l),
          }))}
          getKey={getLevelKey}
          value={instance.level}
          onChange={handleLevel}
        />
      )

    const costStr = (() => {
      // TODO
      // renderMaybeWith((x: number | string) => (IAA.isAutomatic(item) ? `(${x})` : x))(
      //   PABSA.currentCost(snd(finalProps)),
      // )
      switch (cost.kind) {
        case "Fixed":
          return cost.Fixed.toString()
        case "Range":
          return `${cost.Range.min}–${cost.Range.max}`
        default:
          return assertExhaustive(cost)
      }
    })()

    const groupNameKey: (typeof activatableGroupTranslationKeys)[ActivatableIdentifier["kind"]] =
      activatableGroupTranslationKeys[type]

    return (
      <ListItem
        active={
          selectedInlineLibraryEntryId?.[0] === type && selectedInlineLibraryEntryId[1] === id
        }
      >
        <ListItemLeft>
          <ListItemName
            name={renderActivatableNameChunk(
              translateMap,
              levelElement === null ? name.full : name.fullWithoutLevel[0],
            )}
            onClick={handleSelectForInfo}
          />
          {levelElement}
          {levelElement !== null && name.fullWithoutLevel[1] ? (
            <ListItemName
              name={renderActivatableNameChunk(translateMap, name.fullWithoutLevel[1])}
              onClick={handleSelectForInfo}
            />
          ) : null}
        </ListItemLeft>
        <ListItemSeparator />
        {groupNameKey === undefined ? null : <ListItemGroup text={translate(groupNameKey)} />}
        <ListItemValues>
          {isCustomCostAvailable ? (
            <button
              className={classList("cost", {
                "custom-cost": instance.customAdventurePointsValue !== undefined,
              })}
            >
              {costStr}
            </button>
          ) : (
            <div className="cost">{costStr}</div>
          )}
        </ListItemValues>
        <ListItemButtons>
          <IconButton
            icon="&#xE90b;"
            disabled={!isRemovable}
            onClick={handleRemove}
            flat
            label={translate("Remove")}
          />
          <IconButton
            icon="&#xE912;"
            onClick={handleSelectForInfo}
            flat
            label={translate("Show details")}
          />
        </ListItemButtons>
      </ListItem>
    )
  },
)
