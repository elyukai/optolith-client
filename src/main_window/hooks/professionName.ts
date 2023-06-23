import { useMemo } from "react"
import { FullProfessionNameParts, getFullProfessionNameParts } from "../../shared/domain/profession.ts"
import { useTranslateMap } from "../../shared/hooks/translateMap.ts"
import { selectCurrentProfession, selectCurrentProfessionVariant } from "../selectors/professionSelectors.ts"
import { selectCustomProfessionName, selectSex } from "../slices/characterSlice.ts"
import { useAppSelector } from "./redux.ts"

export const useProfessionName = (): FullProfessionNameParts | undefined => {
  const translateMap = useTranslateMap()
  const sex = useAppSelector(selectSex)
  const profession = useAppSelector(selectCurrentProfession)
  const professionVariant = useAppSelector(selectCurrentProfessionVariant)
  const customName = useAppSelector(selectCustomProfessionName)

  return useMemo(() => {
    if (profession === undefined) {
      return undefined
    }

    return getFullProfessionNameParts(
      translateMap,
      sex,
      profession,
      professionVariant,
      customName,
    )
  }, [ customName, profession, professionVariant, sex, translateMap ])
}
