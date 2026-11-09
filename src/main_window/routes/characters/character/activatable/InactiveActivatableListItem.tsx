import { ensureNonEmpty } from "@elyukai/utils/array/nonEmpty"
import { classList } from "@elyukai/utils/classList"
import { ensure, isNotNullish } from "@elyukai/utils/nullable"
import { range } from "@elyukai/utils/range"
import { romanize } from "@elyukai/utils/roman"
import { isNonEmptyString } from "@elyukai/utils/string"
import { parseInt } from "@elyukai/utils/string/number"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { ActivatableIdentifier } from "@optolith/database-schema/gen"
import { observer } from "mobx-react-lite"
import { useCallback, useMemo, useState, type ReactNode } from "react"
import { BasicInputDialog } from "../../../../../shared/components/basicInputDialog/BasicInputDialog.tsx"
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
  getAdventurePointsForInactiveActivatableInstance,
  type ActivatableOption,
  type DisplayedInactiveActivatable,
} from "../../../../../shared/domain/activatable/activatable.ts"
import { getSelectOptionFromDisplayedOption } from "../../../../../shared/domain/activatable/activatableInactive.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"
import { useModalState } from "../../../../hooks/modalState.ts"
import { InactiveActivatableListItemOption } from "./InactiveActivatableListItemOption.tsx"

type Props<K extends ActivatableIdentifier["kind"]> = {
  activatable: DisplayedInactiveActivatable<K>
  isCustomCostAvailable?: boolean
}

const getLevelKey = (option: DropdownOption<number>) => option.id

/**
 * Displays an activatable entry that is currently inactive.
 */
export const InactiveActivatablesListItem = observer(function InactiveActivatablesListItem<
  K extends ActivatableIdentifier["kind"],
>(props: Props<K>): ReactNode {
  const { activatable, isCustomCostAvailable = false } = props
  const { type, id, name, instances, isAvailable, options, level, apValue } = activatable

  const translate = useTranslate()
  const actions = useCharacterActions()

  const [selectedLevel, setSelectedLevel] = useState(() => (level === undefined ? undefined : 1))
  const [selectedOptions, setSelectedOptions] = useState<(ActivatableOption | undefined)[]>([])
  const [customCost, setCustomCost] = useState<number | undefined>()
  const [customCostPreview, setCustomCostPreview] = useState<string>()

  const {
    isOpen: showCustomCostDialog,
    open: openCustomCostDialog,
    close: closeCustomCostDialog,
  } = useModalState()

  const handleChangeOption = useCallback((option: ActivatableOption | undefined, index: number) => {
    setSelectedOptions(oldSelectedOptions => {
      const newSelectedOptions = [...oldSelectedOptions]
      // TODO: Reset options with higher indices?
      // const newSelectedOptions = oldSelectedOptions.slice(0, index)
      newSelectedOptions[index] = option
      // reset child options if parent option is changed
      const indicesToReset = options
        .map((o, i) => (o.kind === "choice" && o.parentIndex === index ? i : undefined))
        .filter(isNotNullish)
      for (const i of indicesToReset) {
        newSelectedOptions[i] = undefined
      }
      return newSelectedOptions
    })
  }, [])

  const handleChangeLevel = useCallback((newLevel: number) => {
    setSelectedLevel(newLevel)
    // TODO: Reset options for specific entries?
    // if (DisadvantageIdentifier.Principles === id || DisadvantageIdentifier.Obligations === id) {
    //   setSelectedOptions([])
    // }
  }, [])

  const handleShowCustomCostDialog = useCallback(() => {
    if (isCustomCostAvailable) {
      openCustomCostDialog()
      setCustomCostPreview(customCost?.toString())
    }
  }, [isCustomCostAvailable, openCustomCostDialog, customCost])

  const handleSetCustomCost = useCallback(
    () => setCustomCost(customCostPreview === undefined ? undefined : parseInt(customCostPreview)),
    [customCostPreview],
  )

  const handleSetCustomCostPreview = useCallback(
    (newCustomCostPreview: string) =>
      setCustomCostPreview(ensure(newCustomCostPreview, isNonEmptyString)),
    [setCustomCostPreview],
  )

  const handleDeleteCustomCost = useCallback(() => setCustomCost(undefined), [setCustomCost])

  const { displayInlineLibraryEntry, isActiveInInlineLibrary } = useInlineLibrary(type, id)

  const cost = useMemo(
    () =>
      getAdventurePointsForInactiveActivatableInstance(
        apValue,
        {
          level: selectedLevel,
          options: selectedOptions.filter(isNotNullish),
          customAdventurePointsValue: customCost,
        },
        optionId => getSelectOptionFromDisplayedOption(options, optionId),
      ),
    [apValue, instances, customCost, options, selectedLevel, selectedOptions],
  )

  const handleAdd = useCallback(() => {
    // TODO: Check AP
    actions.addActivatable(activatable.type, id, {
      level: selectedLevel,
      options: ensureNonEmpty(selectedOptions.filter(isNotNullish)),
      customAdventurePointsValue: customCost,
    })
    setSelectedLevel(undefined)
    setSelectedOptions([])
  }, [cost, customCost, id, selectedLevel, selectedOptions])

  const isAddDisabled = useMemo(
    () =>
      !isAvailable ||
      selectedOptions.filter(o => isNotNullish(o) && (o.type !== "Custom" || o.value.length > 0))
        .length !==
        options.reduce((optionsSum, option) => {
          switch (option.kind) {
            case "choice":
              return optionsSum + (option.count ?? 1)
            case "choiceOrCustomizableText":
            case "text":
              return optionsSum + 1
            default:
              return assertExhaustive(option)
          }
        }, 0) ||
      (level === undefined) !== (selectedLevel === undefined) ||
      cost === undefined,
    [cost, isAvailable, level, options, selectedLevel, selectedOptions],
  )

  const levelElement =
    level === undefined || !isAvailable ? null : level.maximum > 1 ? (
      <Dropdown
        className="level"
        options={range([1, level.maximum]).map(l => ({ id: l, name: romanize(l) }))}
        getKey={getLevelKey}
        value={selectedLevel}
        onChange={handleChangeLevel}
      />
    ) : (
      <span className="level title">{romanize(1)}</span>
    )

  const groupNameKey: (typeof activatableGroupTranslationKeys)[ActivatableIdentifier["kind"]] =
    activatableGroupTranslationKeys[type]

  return (
    <ListItem active={isActiveInInlineLibrary} disabled={!isAvailable}>
      <ListItemLeft>
        <ListItemName name={name} onClick={displayInlineLibraryEntry} />
        {level?.placement === "before" ? levelElement : null}
        {options.map((option, index) => (
          <InactiveActivatableListItemOption
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            index={index}
            onChange={handleChangeOption}
            values={selectedOptions}
            option={option}
            value={selectedOptions[index]}
            disabled={!isAvailable}
          />
        ))}
        {level?.placement === "after" ? levelElement : null}
      </ListItemLeft>
      <ListItemSeparator />
      {groupNameKey === undefined ? null : <ListItemGroup text={translate(groupNameKey)} />}
      <ListItemValues>
        {isCustomCostAvailable ? (
          <button
            className={classList("cost", {
              "custom-cost": customCost !== undefined,
            })}
            onClick={handleShowCustomCostDialog}
          >
            {cost ?? null}
          </button>
        ) : (
          <div className="cost">{cost ?? null}</div>
        )}
        <BasicInputDialog
          id="custom-cost-dialog"
          isOpen={showCustomCostDialog}
          title={translate("Custom AP Cost")}
          description={translate("AP Cost for {$category}", { category: name })}
          value={customCostPreview}
          acceptLabel={translate("Done")}
          rejectLabel={translate("Delete")}
          rejectDisabled={customCost === undefined}
          onClose={closeCustomCostDialog}
          onAccept={handleSetCustomCost}
          onReject={handleDeleteCustomCost}
          onChange={handleSetCustomCostPreview}
        />
      </ListItemValues>
      <ListItemButtons>
        <IconButton
          icon="&#xE916;"
          disabled={isAddDisabled}
          onClick={handleAdd}
          flat
          label={translate("Add")}
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
})
