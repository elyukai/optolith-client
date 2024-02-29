import { UI } from "optolith-database-schema/types/UI"
import { AdventurePointsValue } from "optolith-database-schema/types/_Activatable"
import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { LocaleMap } from "optolith-database-schema/types/_LocaleMap"
import { ReactNode, memo, useCallback, useMemo, useState } from "react"
import { BasicInputDialog } from "../../../../../shared/components/basicInputDialog/BasicInputDialog.tsx"
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
import { getCostOfInstance } from "../../../../../shared/domain/activatable/activatableActive.ts"
import {
  ActivatableInstance,
  ActivatableOption,
} from "../../../../../shared/domain/activatable/activatableEntry.ts"
import {
  DisplayedInactiveActivatable,
  getSelectOptionFromDisplayedOption,
} from "../../../../../shared/domain/activatable/activatableInactive.ts"
import { AdvantageIdentifier, equalsIdentifier } from "../../../../../shared/domain/identifier.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { classList } from "../../../../../shared/utils/classList.ts"
import { parseInt } from "../../../../../shared/utils/math.ts"
import { ensure, isNotNullish } from "../../../../../shared/utils/nullable.ts"
import { range } from "../../../../../shared/utils/range.ts"
import { romanize } from "../../../../../shared/utils/roman.ts"
import { isNonEmptyString } from "../../../../../shared/utils/string.ts"
import { PickOfType } from "../../../../../shared/utils/type.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { useModalState } from "../../../../hooks/modalState.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import {
  changeInlineLibraryEntry,
  selectInlineLibraryEntryId,
} from "../../../../slices/inlineWikiSlice.ts"
import { InactiveActivatableListItemOption } from "./InactiveActivatableListItemOption.tsx"

type Props<T> = {
  activatable: DisplayedInactiveActivatable<T>
  groupNameKey?: PickOfType<UI, string>
  isCustomCostAvailable?: boolean
  add: (parameters: { id: number; instance: ActivatableInstance }, cost: number) => void
  createActivatableIdentifierObject: (id: number) => ActivatableIdentifier
}

const getLevelKey = (option: DropdownOption<number>) => option.id

const InactiveActivatablesListItem = <
  T extends {
    id: number
    ap_value: AdventurePointsValue
    translations: LocaleMap<{ name: string }>
  },
>(
  props: Props<T>,
): ReactNode => {
  const {
    activatable: {
      static: { id, ap_value, translations },
      dynamic,
      isAvailable,
      options,
      level,
    },
    groupNameKey,
    isCustomCostAvailable = false,
    add,
    createActivatableIdentifierObject,
  } = props

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const inlineLibraryEntryId = useAppSelector(selectInlineLibraryEntryId)

  const { name = "" } = translateMap(translations) ?? {}

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

  const idObject = useMemo(
    () => createActivatableIdentifierObject(id),
    [createActivatableIdentifierObject, id],
  )

  const handleSelectForInfo = useCallback(
    () => dispatch(changeInlineLibraryEntry(idObject)),
    [dispatch, idObject],
  )

  const cost = useMemo(
    () =>
      getCostOfInstance(
        idObject,
        ap_value,
        dynamic?.instances ?? [],
        {
          level: selectedLevel,
          options: selectedOptions.filter(isNotNullish),
          customAdventurePointsValue: customCost,
        },
        optionId => getSelectOptionFromDisplayedOption(options, optionId),
        true,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ap_value, customCost, options, selectedLevel, selectedOptions],
  )

  const handleAdd = useCallback(() => {
    add(
      {
        id,
        instance: {
          level: selectedLevel,
          options: selectedOptions.filter(isNotNullish),
          customAdventurePointsValue: customCost,
        },
      },
      cost ?? 0,
    )
    setSelectedLevel(undefined)
    setSelectedOptions([])
  }, [add, cost, customCost, id, selectedLevel, selectedOptions])

  if (equalsIdentifier({ tag: "Advantage", advantage: AdvantageIdentifier.HatredOf }, idObject)) {
    console.log("cost", cost)
    console.log("options", options)
  }

  const isAddDisabled = useMemo(
    () =>
      !isAvailable ||
      selectedOptions.filter(isNotNullish).length !==
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

  return (
    <ListItem
      active={
        inlineLibraryEntryId !== undefined && equalsIdentifier(inlineLibraryEntryId, idObject)
      }
      disabled={!isAvailable}
    >
      <ListItemLeft>
        <ListItemName name={name} onClick={handleSelectForInfo} />
        {level?.placement === "after" ? levelElement : null}
        {isAvailable
          ? options.map((option, index) => (
              <InactiveActivatableListItemOption
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                index={index}
                onChange={handleChangeOption}
                option={option}
                value={selectedOptions[index]}
              />
            ))
          : null}
        {level?.placement === "before" ? levelElement : null}
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
          description={translate("AP Cost for {0}", name)}
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
          onClick={handleSelectForInfo}
          flat
          label={translate("Show details")}
        />
      </ListItemButtons>
    </ListItem>
  )
}

/**
 * Displays an activatable entry that is currently inactive.
 */
const MemoInactiveActivatablesListItem = memo(InactiveActivatablesListItem)

export { MemoInactiveActivatablesListItem as InactiveActivatablesListItem }
