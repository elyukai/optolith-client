import { Attribute } from "optolith-database-schema/types/Attribute"
import { SkillCheck, SkillCheckPenalty } from "optolith-database-schema/types/_SkillCheck"
import { Translate, TranslateMap } from "../../utils/translate.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { GetById } from "../getTypes.ts"
import { getSingleHighestPair, IdValuePair } from "../idValue.ts"
import { DerivedCharacteristicIdentifier } from "../identifier.ts"
import { LibraryEntryContent } from "../libraryEntry.ts"
import { responsive, ResponsiveTextSize } from "../libraryEntry/responsiveText.ts"
import { getAttributeValue } from "./attribute.ts"
import { Rated } from "./ratedEntry.ts"

type Triple<T> = [T, T, T]

const zipTriple = <T, U, V>(
  [a, b, c]: Triple<T>,
  [x, y, z]: Triple<U>,
  f: (x: T, y: U) => V,
): Triple<V> => [f(a, x), f(b, y), f(c, z)]

type SkillCheckAttributes = Triple<Attribute>
type SkillCheckValues = Triple<number>
type SkillCheckValuesWithId = Triple<IdValuePair>
type DisplayedSkillCheck = Triple<{ attribute: Attribute; value: number }>

/**
 * Returns the static attributes of a skill check.
 */
export const getSkillCheckAttributes = (
  getStaticAttribute: (id: number) => Attribute | undefined,
  check: SkillCheck,
): SkillCheckAttributes => [
  getStaticAttribute(check[0].id.attribute)!,
  getStaticAttribute(check[1].id.attribute)!,
  getStaticAttribute(check[2].id.attribute)!,
]

/**
 * Returns the attribute values of a skill check.
 */
export const getSkillCheckValues = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  check: SkillCheck,
): SkillCheckValues => [
  getAttributeValue(getDynamicAttribute(check[0].id.attribute)),
  getAttributeValue(getDynamicAttribute(check[1].id.attribute)),
  getAttributeValue(getDynamicAttribute(check[2].id.attribute)),
]

/**
 * Returns the attributes of a skill check, paired with their attribute
 * identifiers.
 */
export const getSkillCheckWithId = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  check: SkillCheck,
): SkillCheckValuesWithId =>
  zipTriple(check, getSkillCheckValues(getDynamicAttribute, check), (ref, value) => ({
    id: ref.id.attribute,
    value,
  }))

/**
 * Returns the attributes of a skill check, paired with their values.
 */
export const getDisplayedSkillCheck = (
  getStaticAttribute: (id: number) => Attribute | undefined,
  getDynamicAttribute: (id: number) => Rated | undefined,
  check: SkillCheck,
): DisplayedSkillCheck =>
  zipTriple(
    getSkillCheckAttributes(getStaticAttribute, check),
    getSkillCheckValues(getDynamicAttribute, check),
    (attribute, value) => ({ attribute, value }),
  )

/**
 * Returns the single highest attribute identifier from a skill check.
 */
export const getSingleHighestCheckAttributeId = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  check: SkillCheck,
): number | undefined => getSingleHighestPair(getSkillCheckWithId(getDynamicAttribute, check))?.id

/**
 * Returns the single highest attribute value from a skill check.
 */
export const getHighestCheckAttributeValue = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  check: SkillCheck,
): number => Math.max(8, ...getSkillCheckValues(getDynamicAttribute, check))

/**
 * Returns the skill check as an inline library property.
 */
export const getTextForCheck = (
  deps: {
    translate: Translate
    translateMap: TranslateMap
    getAttributeById: GetById.Static.Attribute
  },
  check: SkillCheck,
  checkPenalty?: {
    value: SkillCheckPenalty | undefined
    responsiveText: ResponsiveTextSize
    getDerivedCharacteristicById: GetById.Static.DerivedCharacteristic
  },
): LibraryEntryContent => ({
  label: deps.translate("Check"),
  value:
    check
      .map(
        ({ id: { attribute: id } }) =>
          deps.translateMap(deps.getAttributeById(id)?.translations)?.abbreviation ?? "??",
      )
      .join("/") +
    (() => {
      if (checkPenalty?.value === undefined) {
        return ""
      }

      const { responsiveText, getDerivedCharacteristicById } = checkPenalty

      const getDerivedCharacteristicTranslation = (id: DerivedCharacteristicIdentifier) =>
        deps.translateMap(getDerivedCharacteristicById(id)?.translations)

      const getSpiritTranslation = () =>
        getDerivedCharacteristicTranslation(DerivedCharacteristicIdentifier.Spirit)

      const getToughnessTranslation = () =>
        getDerivedCharacteristicTranslation(DerivedCharacteristicIdentifier.Toughness)

      const penalty = (() => {
        switch (checkPenalty.value) {
          case "Spirit": {
            const translation = getSpiritTranslation()
            return translation === undefined
              ? ""
              : responsive(
                  responsiveText,
                  () => translation.name,
                  () => translation.abbreviation,
                )
          }

          case "HalfOfSpirit": {
            const translation = getSpiritTranslation()
            return translation === undefined
              ? ""
              : responsive(
                  responsiveText,
                  () => `${translation.name}/2`,
                  () => `${translation.abbreviation}/2`,
                )
          }

          case "Toughness": {
            const translation = getToughnessTranslation()
            return translation === undefined
              ? ""
              : responsive(
                  responsiveText,
                  () => `${translation.name}/2`,
                  () => `${translation.abbreviation}/2`,
                )
          }

          case "HigherOfSpiritAndToughness": {
            const spiritTranslation = getSpiritTranslation()
            const toughnessTranslation = getToughnessTranslation()
            return spiritTranslation === undefined || toughnessTranslation === undefined
              ? ""
              : responsive(
                  responsiveText,
                  () =>
                    deps.translate(
                      "{0} or {1}, depending on which value is higher",
                      spiritTranslation.abbreviation,
                      toughnessTranslation.abbreviation,
                    ),
                  () => `${spiritTranslation.abbreviation}/${toughnessTranslation.abbreviation}`,
                )
          }

          case "SummoningDifficulty":
            return responsive(
              responsiveText,
              () => deps.translate("Invocation Difficulty"),
              () => deps.translate("ID"),
            )

          case "CreationDifficulty":
            return responsive(
              responsiveText,
              () => deps.translate("Creation Difficulty"),
              () => deps.translate("CD"),
            )

          default:
            return assertExhaustive(checkPenalty.value)
        }
      })()

      return responsive(
        responsiveText,
        () => deps.translate(" (modified by {0})", penalty),
        () => deps.translate(" (− {0})", penalty),
      )
    })(),
})
