import { getSpellEntityDescription } from "@optolith/entity-descriptions/entities/spell"
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
 * Displays all information about a spell.
 */
export const InlineLibrarySpell: FC<Props> = ({ id }) => {
  const getAttributeById = useAppSelector(SelectGetById.Static.Attribute)
  const getDerivedCharacteristicById = useAppSelector(SelectGetById.Static.DerivedCharacteristic)
  const spirit = getDerivedCharacteristicById(DerivedCharacteristicIdentifier.Spirit)
  const toughness = getDerivedCharacteristicById(DerivedCharacteristicIdentifier.Toughness)
  const getSkillModificationLevelById = useAppSelector(SelectGetById.Static.SkillModificationLevel)
  const getTargetCategoryById = useAppSelector(SelectGetById.Static.TargetCategory)
  const getPropertyById = useAppSelector(SelectGetById.Static.Property)
  const getMagicalTraditionById = useAppSelector(SelectGetById.Static.MagicalTradition)
  const entry = useAppSelector(SelectGetById.Static.Spell)(id)

  const createEntityDescription: PartialEntityDescriptionCreator = useCallback(
    (defaultDatabaseAccessors, locale) =>
      getSpellEntityDescription(
        {
          ...defaultDatabaseAccessors,
          getAttributeById,
          getSpirit: () => spirit,
          getToughness: () => toughness,
          getSkillModificationLevelById,
          getTargetCategoryById,
          getPropertyById,
          getMagicalTraditionById,
        },
        locale,
        entry,
      ),
    [
      entry,
      getAttributeById,
      getMagicalTraditionById,
      getPropertyById,
      getSkillModificationLevelById,
      getTargetCategoryById,
      spirit,
      toughness,
    ],
  )

  return <LibraryEntry createEntityDescription={createEntityDescription} />
}
