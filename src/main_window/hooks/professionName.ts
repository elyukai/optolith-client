import { useMemo } from "react"
import { ProfessionIdentifier } from "../../shared/domain/identifier.ts"
import { professionNameToString } from "../../shared/domain/profession.ts"
import { isNotNullish } from "../../shared/utils/nullable.ts"
import { selectCurrentProfession, selectCurrentProfessionVariant } from "../selectors/professionSelectors.ts"
import { selectCustomProfessionName, selectSex } from "../slices/characterSlice.ts"
import { useAppSelector } from "./redux.ts"
import { useTranslateMap } from "./translateMap.ts"

type DisplayedProfessionName = {
  name: string
  subName?: string
  variantName?: string
  fullName: string
}

export const useProfessionName = (): DisplayedProfessionName => {
  const translateMap = useTranslateMap()
  const sex = useAppSelector(selectSex)
  const profession = useAppSelector(selectCurrentProfession)
  const professionVariant = useAppSelector(selectCurrentProfessionVariant)
  const customName = useAppSelector(selectCustomProfessionName)

  return useMemo(() => {
    if (profession?.profession.id === ProfessionIdentifier.OwnProfession) {
      const name = customName
        ?? professionNameToString(sex, translateMap(profession.professionTranslations)?.name)
        ?? ""

      return {
        name,
        fullName: name,
      }
    }

    const professionName =
      professionNameToString(sex, translateMap(profession?.professionTranslations)?.name)
    const professionSubName =
      professionNameToString(sex, translateMap(profession?.professionTranslations)?.specification)
    const professionVariantName =
      professionNameToString(sex, translateMap(professionVariant?.translations)?.name)

    if (professionSubName !== undefined || professionVariantName !== undefined) {
      const specifications = [ professionSubName, professionVariantName ]
        .filter(isNotNullish)
        .join(", ")

      return {
        name: professionName ?? "",
        subName: professionSubName,
        variantName: professionVariantName,
        fullName: `${professionName ?? ""} (${specifications})`,
      }
    }
    else {
      return {
        name: professionName ?? "",
        fullName: professionName ?? "",
      }
    }
  }, [
    customName,
    profession?.profession.id,
    profession?.professionTranslations,
    professionVariant?.translations,
    sex,
    translateMap,
  ])
}
