import { on } from "@elyukai/utils/function"
import { renderActivatableNameChunk } from "@optolith/entity-descriptions/entities/partial/activatableNameChunks"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import type { DisplayedActiveActivatable } from "../../../../../shared/domain/activatable/activatable.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useInlineLibrarySelect } from "../../../../hooks/inlineLibrary.ts"
import "./ActivatableList.css"

type Props = { label: string; list: DisplayedActiveActivatable[] }

export const ActivatableList: FC<Props> = observer(function ActivatableList({ label, list }) {
  const translateMap = useTranslateMap()
  const compare = useLocaleCompare()
  const displayInlineLibraryEntry = useInlineLibrarySelect()

  return (
    <div className="activatable-list">
      <h3 className="activatable-list-title">{label}</h3>
      <span className="activatable-list-content">
        {list
          .toSorted(on(entry => renderActivatableNameChunk(translateMap, entry.name.full), compare))
          .map((entry, index) => (
            <>
              <span
                key={index}
                className="activatable-list-entry has-sheet-inline-info"
                onClick={() => displayInlineLibraryEntry(entry.type, entry.id)}
              >
                {renderActivatableNameChunk(translateMap, entry.name.full)}
              </span>
              {index < list.length - 1 ? ", " : ""}
            </>
          ))}
      </span>
    </div>
  )
})
