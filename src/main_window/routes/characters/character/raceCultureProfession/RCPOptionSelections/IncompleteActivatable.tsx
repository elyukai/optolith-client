import { romanize } from "@elyukai/utils/roman"
import { action } from "mobx"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import type { DisplayedActivatableEntrySelectOption } from "../../../../../../shared/domain/profession.ts"
import { InactiveActivatableListItemOption } from "../../activatable/InactiveActivatableListItemOption.tsx"
import type { SelectedOther } from "./SelectedRCPOptions.ts"

type Props = {
  state: SelectedOther
  config: DisplayedActivatableEntrySelectOption
  optionIndex: number
  optionOptionIndex: number
}

export const IncompleteActivatable: FC<Props> = observer(function IncompleteActivatable({
  state,
  config,
  optionIndex,
  optionOptionIndex,
}) {
  return (
    <div className="incomplete-activatable">
      <span className="name">{config.name}</span>
      {config.level?.placement === "before" ? (
        <>
          {" "}
          <span className="level">{romanize(config.level.value)}</span>
        </>
      ) : null}
      {" ("}
      {config.options.map((option, optionOptionOptionIndex) =>
        option.kind === "preset" ? (
          <span className="option">{option.text}</span>
        ) : (
          <InactiveActivatableListItemOption
            key={`${optionIndex}-${optionOptionIndex}-${optionOptionOptionIndex}`}
            index={optionOptionOptionIndex}
            onChange={action(newValue =>
              state.setActivatableOption(
                optionIndex,
                optionOptionIndex,
                optionOptionOptionIndex,
                newValue,
              ),
            )}
            values={state.getActivatableOptions(optionIndex, 0)}
            option={option}
            value={state.getActivatableOption(optionIndex, 0, optionOptionOptionIndex)}
          />
        ),
      )}
      {")"}
      {config.level?.placement === "after" ? (
        <>
          {" "}
          <span className="level">{romanize(config.level.value)}</span>
        </>
      ) : null}
    </div>
  )
})
