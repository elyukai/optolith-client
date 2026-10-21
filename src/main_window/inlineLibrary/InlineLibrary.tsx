import type { AvailableCreatorEntity } from "@optolith/entity-descriptions"
import type { EntityDescription } from "@optolith/entity-descriptions/description"
import { action, computed, observable } from "mobx"
import { observer } from "mobx-react"
import { FC, useEffect, useState } from "react"
import "../../database/contents/assets/core.css"
import { Aside } from "../../shared/components/aside/Aside.tsx"
import { Button } from "../../shared/components/button/Button.tsx"
import { Scroll } from "../../shared/components/scroll/Scroll.tsx"
import { ExternalAPI } from "../external.ts"
import "./InlineLibrary.scss"
import { InlineLibraryContent } from "./InlineLibraryContent.tsx"
import { InlineLibraryPlaceholder } from "./InlineLibraryPlaceholder.tsx"

export type DisplayableMainIdentifier = [entity: AvailableCreatorEntity, id: string]

export class InlineLibraryManager {
  @observable accessor #history:
    | {
        previous: DisplayableMainIdentifier[]
        current: DisplayableMainIdentifier
        next: DisplayableMainIdentifier[]
      }
    | undefined

  private constructor() {
    this.#history = undefined
  }

  static readonly instance: InlineLibraryManager = new InlineLibraryManager()

  @computed
  get hasPrevious() {
    return (this.#history?.previous.length ?? 0) > 0
  }

  @computed
  get hasNext() {
    return (this.#history?.next.length ?? 0) > 0
  }

  @computed
  get current() {
    return this.#history?.current
  }

  @action
  goTo(identifier: DisplayableMainIdentifier) {
    if (this.#history === undefined) {
      this.#history = {
        previous: [],
        current: identifier,
        next: [],
      }
    } else {
      this.#history.previous.push(this.#history.current)
      this.#history.current = identifier
      this.#history.next = []
    }
  }

  @action
  goBack() {
    if (this.hasPrevious && this.#history !== undefined) {
      const previous = this.#history.previous.pop()!
      this.#history.next.unshift(this.#history.current)
      this.#history.current = previous
    }
  }

  @action
  goForward() {
    if (this.hasNext && this.#history !== undefined) {
      const next = this.#history.next.shift()!
      this.#history.previous.push(this.#history.current)
      this.#history.current = next
    }
  }
}

/**
 * Displays all information about a selected entry in a sidebar.
 */
export const InlineLibrary: FC = observer(() => {
  const { current } = InlineLibraryManager.instance

  const [description, setDescription] =
    useState<[EntityDescription<AvailableCreatorEntity, string> | undefined, string | undefined]>()

  useEffect(() => {
    if (current !== undefined) {
      const publications: string[] = []
      ExternalAPI.getEntityDescription(
        current[0],
        current[1],
        /* TODO */ {
          publications,
          onlyCompletePublications: false,
          onlyShowReferencesToIncludedPublications: true,
          changeHandling: "latestOnly",
          showPublicationGroups: publications.length === 0 ? "all" : "none",
        },
      )
        .then(setDescription)
        .catch(error => {
          console.error("Failed to get entity description:", error)
        })
    }
  }, [current?.[0], current?.[1]])

  return (
    <Aside className="inline-library">
      <Scroll>
        <div className="inline-library__nav">
          <Button
            disabled={!InlineLibraryManager.instance.hasPrevious}
            onClick={() => InlineLibraryManager.instance.goBack()}
          >
            Back
          </Button>
          <Button
            disabled={!InlineLibraryManager.instance.hasNext}
            onClick={() => InlineLibraryManager.instance.goForward()}
          >
            Forward
          </Button>
        </div>
        {description?.[0] === undefined ? (
          <InlineLibraryPlaceholder />
        ) : (
          <div className="tde-official-style">
            <InlineLibraryContent description={description[0]} specialTag={description[1]} />
          </div>
        )}
      </Scroll>
    </Aside>
  )
})
