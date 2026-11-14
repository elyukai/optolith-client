import { classList } from "@elyukai/utils/classList"
import { identity } from "@elyukai/utils/function"
import { range } from "@elyukai/utils/range"
import { romanize } from "@elyukai/utils/roman"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { ActivatableIdentifier } from "@optolith/database-schema/gen"
import { renderActivatableNameChunk } from "@optolith/entity-descriptions/entities/partial/activatableNameChunks"
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
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"

type Props<K extends ActivatableIdentifier["kind"]> = {
  activatable: DisplayedActiveActivatable<K>
  isCustomCostAvailable?: boolean
}

const getLevelKey = (option: DropdownOption<number>) => option.id

/**
 * Displays an activatable entry that is currently active.
 */
export const ActiveActivatableListItem = observer(
  <K extends ActivatableIdentifier["kind"]>(props: Props<K>): ReactNode => {
    const { activatable, isCustomCostAvailable = false } = props

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
      addNativeTongueLevel,
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

    const { displayInlineLibraryEntry, isActiveInInlineLibrary } = useInlineLibrary(type, id)

    const handleRemove = useCallback(() => {
      actions.removeActivatable(activatable.type, id, instanceIndex)
    }, [activatable, id, instanceIndex])

    const levelElement =
      levels === undefined || instance?.level === undefined || maxLevel === minLevel ? null : (
        <Dropdown
          className="level"
          options={range([
            minLevel ?? 1,
            (maxLevel ?? levels) + (addNativeTongueLevel ? 1 : 0),
          ]).map((l, i, arr) =>
            addNativeTongueLevel && i === arr.length - 1
              ? {
                  id: l,
                  name: translate("NT"),
                }
              : {
                  id: l,
                  name: romanize(l),
                },
          )}
          getKey={getLevelKey}
          value={instance.level}
          onChange={handleLevel}
        />
      )

    const costStr = (() => {
      const wrapInParens = cost.isAutomatic ? (x: string) => `(${x})` : identity
      switch (cost.type) {
        case "Fixed":
          return wrapInParens(cost.value.toString())
        case "Range":
          return wrapInParens(`${cost.min}–${cost.max}`)
        default:
          return assertExhaustive(cost)
      }
    })()

    const groupNameKey: (typeof activatableGroupTranslationKeys)[ActivatableIdentifier["kind"]] =
      activatableGroupTranslationKeys[type]

    return (
      <ListItem active={isActiveInInlineLibrary}>
        <ListItemLeft>
          <ListItemName
            name={renderActivatableNameChunk(
              translateMap,
              levelElement === null ? name.full : name.fullWithoutLevel[0],
            )}
            onClick={displayInlineLibraryEntry}
          />
          {levelElement}
          {levelElement !== null && name.fullWithoutLevel[1] ? (
            <ListItemName
              name={renderActivatableNameChunk(translateMap, name.fullWithoutLevel[1])}
              onClick={displayInlineLibraryEntry}
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
            onClick={displayInlineLibraryEntry}
            flat
            label={translate("Show details")}
          />
        </ListItemButtons>
      </ListItem>
    )
  },
)
