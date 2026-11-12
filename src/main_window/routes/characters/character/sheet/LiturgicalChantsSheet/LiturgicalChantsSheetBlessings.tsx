import { on } from "@elyukai/utils/function"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { useLocaleCompare } from "../../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../../shared/hooks/translate.ts"
import { useCharacterState } from "../../../../../hooks/characterState.ts"
import { useInlineLibrarySelect } from "../../../../../hooks/inlineLibrary.ts"

export const LiturgicalChantsSheetBlessings: FC = observer(
  function LiturgicalChantsSheetBlessings() {
    const translate = useTranslate()
    const compare = useLocaleCompare()
    const displayInlineLibraryEntry = useInlineLibrarySelect()
    const { activeBlessings } = useCharacterState()

    return (
      <div className="activatable-list">
        <h3 className="activatable-list-title">{translate("Blessings")}</h3>
        <span className="activatable-list-content">
          {activeBlessings.toSorted(on(entry => entry.name, compare)).map((entry, index) => (
            <>
              <span
                key={index}
                className="activatable-list-entry has-sheet-inline-info"
                onClick={() => displayInlineLibraryEntry(entry.type, entry.id)}
              >
                {entry.name}
              </span>
              {index < activeBlessings.length - 1 ? ", " : ""}
            </>
          ))}
        </span>
      </div>
    )
  },
)
