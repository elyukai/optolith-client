import { observer } from "mobx-react-lite"
import { type FC, useCallback } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import type { CharacterOptionalRuleOverview } from "../../../../../shared/domain/rules.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"

type Props = {
  optionalRule: CharacterOptionalRuleOverview
  hideInfo?: boolean
}

// const getKey = (option: DropdownOption<number>) => option.id

/**
 * Returns a single optional rule item.
 */
export const OptionalRulesItem: FC<Props> = observer(props => {
  const {
    optionalRule: { id, name, active, disabled },
    hideInfo,
  } = props

  const translate = useTranslate()
  const actions = useCharacterActions()
  const handleSwitch = useCallback(() => actions.toggleOptionalRule(id), [id])
  const { displayInlineLibraryEntry } = useInlineLibrary("OptionalRule", id)

  // const handleChangeOption = useCallback(
  //   (option: number) =>
  //     dispatch(
  //       changeOptionalRuleOption({
  //         id: optionalRule.id,
  //         option,
  //       }),
  //     ),
  //   [dispatch, optionalRule.id],
  // )

  // const isActive = isOptionalRuleActive(getDynamicOptionalRuleById, optionalRule.id)

  return (
    <li>
      <Checkbox checked={active} onClick={handleSwitch} label={name} disabled={disabled} />
      {/* TODO: optionalRule.id === OptionalRuleIdentifier.HigherDefenseStats ? (
        <Dropdown
          options={[
            { id: 2, name: "+2" },
            { id: 4, name: "+4" },
          ]}
          value={getDynamicOptionalRuleById(optionalRule.id)?.options?.[0] ?? 2}
          onChange={handleChangeOption}
          disabled={!isActive}
          getKey={getKey}
        />
      ) : null */}
      {hideInfo === true ? null : (
        <IconButton
          icon="&#xE912;"
          label={translate("Show details")}
          onClick={displayInlineLibraryEntry}
          flat
        />
      )}
    </li>
  )
})
