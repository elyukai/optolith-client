import { UI } from "optolith-database-schema/types/UI"
import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { LocaleMap } from "optolith-database-schema/types/_LocaleMap"
import { ReactNode, memo, useCallback, useState } from "react"
import { Dropdown } from "../../../../../shared/components/dropdown/Dropdown.tsx"
import { DropdownOption } from "../../../../../shared/components/dropdown/DropdownItem.tsx"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemButtons } from "../../../../../shared/components/list/ListItemButtons.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemLeft } from "../../../../../shared/components/list/ListItemLeft.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import {
  DisplayedActiveActivatable,
  nameChunkToString,
} from "../../../../../shared/domain/activatable/activatableActive.ts"
import { equalsIdentifier } from "../../../../../shared/domain/identifier.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { classList } from "../../../../../shared/utils/classList.ts"
import { range } from "../../../../../shared/utils/range.ts"
import { romanize } from "../../../../../shared/utils/roman.ts"
import { PickOfType } from "../../../../../shared/utils/type.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import {
  changeInlineLibraryEntry,
  selectInlineLibraryEntryId,
} from "../../../../slices/inlineWikiSlice.ts"

type Props<K extends string, T> = {
  activatable: DisplayedActiveActivatable<K, T>
  groupNameKey?: PickOfType<UI, string>
  isCustomCostAvailable?: boolean
  changeLevel: (
    parameters: { id: number; index: number; level: number },
    activeEntry: DisplayedActiveActivatable<K, T>,
  ) => boolean
  remove: (
    parameters: { id: number; index: number },
    activeEntry: DisplayedActiveActivatable<K, T>,
  ) => void
  createActivatableIdentifierObject: (id: number) => ActivatableIdentifier
}

const getLevelKey = (option: DropdownOption<number>) => option.id

const ActiveActivatablesListItem = <
  K extends string,
  T extends {
    id: number
    levels?: number
    translations: LocaleMap<{ name: string }>
  },
>(
  props: Props<K, T>,
): ReactNode => {
  const {
    activatable,
    groupNameKey,
    isCustomCostAvailable = false,
    changeLevel,
    remove,
    createActivatableIdentifierObject,
  } = props

  const {
    static: { id, levels },
    dynamic,
    instanceIndex,
    isRemovable,
    cost,
    name,
    minLevel,
    maxLevel,
  } = activatable

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const inlineLibraryEntryId = useAppSelector(selectInlineLibraryEntryId)

  const [selectedLevel, setSelectedLevel] = useState(dynamic.instances[instanceIndex]!.level)

  const handleLevel = useCallback(
    (level: number) => {
      if (changeLevel({ id, index: instanceIndex, level }, activatable)) {
        setSelectedLevel(level)
      }
    },
    [activatable, changeLevel, id, instanceIndex],
  )

  const identifierObject = createActivatableIdentifierObject(id)

  const handleSelectForInfo = useCallback(
    () => dispatch(changeInlineLibraryEntry(identifierObject)),
    [dispatch, identifierObject],
  )

  const handleRemove = useCallback(() => {
    remove({ id, index: instanceIndex }, activatable)
  }, [activatable, id, instanceIndex, remove])

  const levelElement =
    levels === undefined || selectedLevel === undefined || maxLevel === minLevel ? null : (
      <Dropdown
        className="level"
        options={range([minLevel ?? 1, maxLevel ?? levels]).map(l => ({
          id: l,
          name: romanize(l),
        }))}
        getKey={getLevelKey}
        value={selectedLevel}
        onChange={handleLevel}
      />
    )

  const costStr = (() => {
    // TODO
    // renderMaybeWith((x: number | string) => (IAA.isAutomatic(item) ? `(${x})` : x))(
    //   PABSA.currentCost(snd(finalProps)),
    // )
    switch (cost.kind) {
      case "fix":
        return cost.fix.toString()
      case "variable":
        return `${cost.range[0]}–${cost.range[1]}`
      default:
        return assertExhaustive(cost)
    }
  })()

  return (
    <ListItem
      active={
        inlineLibraryEntryId !== undefined &&
        equalsIdentifier(inlineLibraryEntryId, identifierObject)
      }
    >
      <ListItemLeft>
        <ListItemName
          name={nameChunkToString(
            levelElement === null
              ? name.full
              : Array.isArray(name.fullWithoutLevel)
              ? name.fullWithoutLevel[0]
              : name.fullWithoutLevel,
            translate,
            translateMap,
          )}
          onClick={handleSelectForInfo}
        />
        {levelElement}
        {levelElement !== null && Array.isArray(name.fullWithoutLevel) ? (
          <ListItemName
            name={nameChunkToString(name.fullWithoutLevel[1], translate, translateMap)}
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
              "custom-cost":
                dynamic.instances[instanceIndex]!.customAdventurePointsValue !== undefined,
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
}

/**
 * Displays an activatable entry that is currently active.
 */
const MemoActiveActivatablesListItem = memo(
  ActiveActivatablesListItem,
) as typeof ActiveActivatablesListItem

export { MemoActiveActivatablesListItem as ActiveActivatablesListItem }
