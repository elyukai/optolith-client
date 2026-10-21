import { isSupportedEntity, type AvailableCreatorEntity } from "@optolith/entity-descriptions"
import type { EntityDescription } from "@optolith/entity-descriptions/description"
import { observer } from "mobx-react"
import { FC } from "react"
import type { Env } from "../../shared/components/markdown/Markdown.tsx"
import { InlineLibraryManager } from "./InlineLibrary.tsx"
import { InlineLibraryTabularDescription } from "./InlineLibraryTabularDescription.tsx"
import { InlineLibraryTextDescription } from "./InlineLibraryTextDescription.tsx"

type Props = {
  description: EntityDescription<AvailableCreatorEntity, string>
  specialTag: string | undefined
}

/**
 * Displays all information about a selected entry in a sidebar.
 */
export const InlineLibraryContent: FC<Props> = observer(({ description, specialTag }) => {
  if (Array.isArray(description)) {
    return (
      <>
        {description.map((element, elementIndex) => (
          <InlineLibraryContent key={elementIndex} description={element} specialTag={specialTag} />
        ))}
      </>
    )
  }

  const env: Env = {
    attributed: attributes => {
      const { entity, instance } = attributes
      if (
        typeof entity === "string" &&
        isSupportedEntity(entity) &&
        typeof instance === "string" &&
        instance !== description.instanceId
      ) {
        return () => {
          InlineLibraryManager.instance.goTo([entity, instance])
        }
      }
      return undefined
    },
  }

  switch (description.type) {
    case "tabular":
      return <InlineLibraryTabularDescription description={description} env={env} />
    case "text":
    case undefined:
      return (
        <InlineLibraryTextDescription description={description} env={env} specialTag={specialTag} />
      )
    default:
      return null
  }
})
