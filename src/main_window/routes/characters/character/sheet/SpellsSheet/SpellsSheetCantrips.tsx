import { on } from "@elyukai/utils/function"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { useLocaleCompare } from "../../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../../shared/hooks/translate.ts"
import { useCharacterState } from "../../../../../hooks/characterState.ts"
import { useInlineLibrarySelect } from "../../../../../hooks/inlineLibrary.ts"

export const SpellsSheetCantrips: FC = observer(function SpellsSheetCantrips() {
  const translate = useTranslate()
  const compare = useLocaleCompare()
  const displayInlineLibraryEntry = useInlineLibrarySelect()
  const { activeCantrips } = useCharacterState()

  return (
    <div className="activatable-list">
      <h3 className="activatable-list-title">{translate("Cantrips")}</h3>
      <span className="activatable-list-content">
        {activeCantrips.toSorted(on(entry => entry.name, compare)).map((entry, index) => (
          <>
            <span
              key={index}
              className="activatable-list-entry has-sheet-inline-info"
              onClick={() => displayInlineLibraryEntry(entry.type, entry.id)}
            >
              {entry.name}
            </span>
            {index < activeCantrips.length - 1 ? ", " : ""}
          </>
        ))}
      </span>
    </div>
  )
})
