import { getLiturgicalChantEntityDescription } from "@optolith/entity-descriptions/entities/liturgicalChant"
import { FC, useCallback } from "react"
import {
  LibraryEntry,
  PartialEntityDescriptionCreator,
} from "../../../shared/components/libraryEntry/LibraryEntry.tsx"
import { DerivedCharacteristicIdentifier } from "../../../shared/domain/identifier.ts"
import { useAppSelector } from "../../hooks/redux.ts"
import { SelectGetById } from "../../selectors/basicCapabilitySelectors.ts"

type Props = {
  id: number
}

/**
 * Displays all information about a liturgical chant.
 */
export const InlineLibraryLiturgicalChant: FC<Props> = ({ id }) => {
  const getAttributeById = useAppSelector(SelectGetById.Static.Attribute)
  const getDerivedCharacteristicById = useAppSelector(SelectGetById.Static.DerivedCharacteristic)
  const spirit = getDerivedCharacteristicById(DerivedCharacteristicIdentifier.Spirit)
  const toughness = getDerivedCharacteristicById(DerivedCharacteristicIdentifier.Toughness)
  const getSkillModificationLevelById = useAppSelector(SelectGetById.Static.SkillModificationLevel)
  const getTargetCategoryById = useAppSelector(SelectGetById.Static.TargetCategory)
  const getBlessedTraditionById = useAppSelector(SelectGetById.Static.BlessedTradition)
  const getAspectById = useAppSelector(SelectGetById.Static.Aspect)
  const entry = useAppSelector(SelectGetById.Static.LiturgicalChant)(id)

  const createEntityDescription: PartialEntityDescriptionCreator = useCallback(
    (defaultDatabaseAccessors, locale) =>
      getLiturgicalChantEntityDescription(
        {
          ...defaultDatabaseAccessors,
          getAttributeById,
          getSpirit: () => spirit,
          getToughness: () => toughness,
          getSkillModificationLevelById,
          getTargetCategoryById,
          getBlessedTraditionById,
          getAspectById,
        },
        locale,
        entry,
      ),
    [
      entry,
      getAspectById,
      getAttributeById,
      getBlessedTraditionById,
      getSkillModificationLevelById,
      getTargetCategoryById,
      spirit,
      toughness,
    ],
  )

  return <LibraryEntry createEntityDescription={createEntityDescription} />
}
