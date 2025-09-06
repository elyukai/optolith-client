import * as React from "react"
import { Either, eitherToMaybe, invertEither, Left, Right } from "../../../Data/Either"
import { cnst, flip, ident, join } from "../../../Data/Function"
import { fmap, fmapF } from "../../../Data/Functor"
import { rangeN } from "../../../Data/Ix"
import { over, set } from "../../../Data/Lens"
import { any, append, appendStr, consF, elem, fnull, head, ifoldr, imap, intercalate, intersperse, isList, List, map, notNull, notNullStr, snoc, snocF, toArray } from "../../../Data/List"
import { bind, bindF, catMaybes, ensure, fromJust, fromMaybe, isJust, isNothing, joinMaybeList, Just, liftM2, mapMaybe, maybe, Maybe, maybeRNull, maybeRNullF, Nothing } from "../../../Data/Maybe"
import { negate } from "../../../Data/Num"
import { isOrderedMap, lookup, lookupF, notMember } from "../../../Data/OrderedMap"
import { Record, RecordI } from "../../../Data/Record"
import { Category } from "../../Constants/Categories"
import { SpecialAbilityGroup } from "../../Constants/Groups"
import { AdvantageId, SpecialAbilityId } from "../../Constants/Ids"
import { ActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId"
import { NumIdName } from "../../Models/NumIdName"
import { ActivatableNameCost, ActivatableNameCostA_ } from "../../Models/View/ActivatableNameCost"
import { ActivatablePrerequisiteText } from "../../Models/View/ActivatablePrerequisiteText"
import { ActivatablePrerequisiteObjects, ActivatableStringObject, CategorizedPrerequisites, CategorizedPrerequisitesL, IncreasablePrerequisiteObjects, PrimaryAttributePrerequisiteObjects, RacePrerequisiteObjects, RCPPrerequisiteObjects, ReplacedPrerequisite, SocialPrerequisiteObjects } from "../../Models/View/CategorizedPrerequisites"
import { Advantage } from "../../Models/Wiki/Advantage"
import { Attribute } from "../../Models/Wiki/Attribute"
import { RequireActivatable } from "../../Models/Wiki/prerequisites/ActivatableRequirement"
import { RequireIncreasable } from "../../Models/Wiki/prerequisites/IncreasableRequirement"
import { RequirePrimaryAttribute } from "../../Models/Wiki/prerequisites/PrimaryAttributeRequirement"
import { RaceRequirement } from "../../Models/Wiki/prerequisites/RaceRequirement"
import { SocialPrerequisite } from "../../Models/Wiki/prerequisites/SocialPrerequisite"
import { Profession } from "../../Models/Wiki/Profession"
import { Race } from "../../Models/Wiki/Race"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { SelectOption } from "../../Models/Wiki/sub/SelectOption"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { Activatable, AllRequirements } from "../../Models/Wiki/wikiTypeHelpers"
import { getNameCostForWiki } from "../../Utilities/Activatable/activatableActiveUtils"
import { getName } from "../../Utilities/Activatable/activatableNameUtils"
import { isCustomActivatable } from "../../Utilities/Activatable/checkActivatableUtils"
import { isExtendedSpecialAbility } from "../../Utilities/Activatable/checkStyleUtils"
import { isBlessedTradId, isMagicalTradId } from "../../Utilities/Activatable/traditionUtils"
import { putLevelName } from "../../Utilities/AdventurePoints/activatableCostUtils"
import { nbsp } from "../../Utilities/Chars"
import { localizeOrList, translate, translateP } from "../../Utilities/I18n"
import { getCategoryById } from "../../Utilities/IDUtils"
import { toRoman, toRomanFromIndex } from "../../Utilities/NumberUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { renderMaybe } from "../../Utilities/ReactUtils"
import { sortRecordsByName, sortStrings } from "../../Utilities/sortBy"
import { isNumber, isString, misNumberM, misStringM } from "../../Utilities/typeCheckUtils"
import { getWikiEntry } from "../../Utilities/WikiUtils"
import { Markdown } from "../Universal/Markdown"
import { WikiCombatTechniques } from "./Elements/WikiCombatTechniques"
import { WikiSource } from "./Elements/WikiSource"
import { WikiBoxTemplate } from "./WikiBoxTemplate"
import { WikiInfoSelector } from "./WikiInfo"
import { WikiInfoCustomRuleContainer } from "./WikiInfoCustomRuleContainer"
import { WikiProperty } from "./WikiProperty"

const CIA = CategorizedPrerequisites.A
const CIL = CategorizedPrerequisitesL
const APTA = ActivatablePrerequisiteText.A
const SDA = StaticData.A
const AcA = { ...Advantage.AL, ...SpecialAbility.AL }
const SAA = SpecialAbility.A
const RAA = RequireActivatable.A
const RAAL = RequireActivatable.AL
const RIA = RequireIncreasable.A
const RPAA = RequirePrimaryAttribute.A
const AAL = Advantage.AL
const SPA = SocialPrerequisite.A

const getCost =
  (staticData: StaticDataRecord) =>
  (x: Activatable) => {
    const apValue = AcA.apValue (x)
    const apValueAppend = AcA.apValueAppend (x)
    const mcost = AcA.cost (x)

    return pipe_ (
      `**${translate (staticData) ("inlinewiki.apvalue")}:** `,
      str => {
        if (isJust (apValue)) {
          return `${str}${fromJust (apValue)}`
        }

        const ap_str = translate (staticData) ("inlinewiki.adventurepoints")

        if (isJust (mcost)) {
          const cost = fromJust (mcost)

          if (isList (cost)) {
            const abs_cost =
              AcA.category (x) === Category.DISADVANTAGES
                ? map (negate) (cost)
                : cost

            const level_str = translate (staticData) ("inlinewiki.level")

            const level_nums =
              pipe_ (abs_cost, imap (pipe (toRomanFromIndex, cnst)), intercalate ("/"))

            const level_costs = intercalate ("/") (abs_cost)

            return `${str}${level_str} ${level_nums}: ${level_costs} ${ap_str}`
          }

          const abs_cost = AcA.category (x) === Category.DISADVANTAGES ? -cost : cost

          const plain_str = `${str}${abs_cost} ${ap_str}`

          return isJust (AcA.tiers (x))
            ? `${plain_str} ${translate (staticData) ("inlinewiki.perlevel")}`
            : plain_str
        }

        return str
      },
      maybe (ident as ident<string>)
            ((str: string) => flip (appendStr) (` ${str}`))
            (apValueAppend)
    )
  }

const isCasterOrBlessedOneId =
  (x: string) => x === AdvantageId.Blessed || x === AdvantageId.Spellcaster

const isTraditionId = (x: string) => isMagicalTradId (x) || isBlessedTradId (x)

const getActivatablePrerequisite =
  (index_special: Maybe<string | false>) =>
  (e: Record<RequireActivatable>) =>
    fromMaybe<ActivatablePrerequisiteObjects> (e)
                                              (liftM2 ((safe_id: string) =>
                                                       (value: string): ActivatableStringObject =>
                                                         ({
                                                           id: safe_id,
                                                           active: RAA.active (e),
                                                           value,
                                                         }))
                                                      (ensure (isString)
                                                              (RAA.id (e)))
                                                      (misStringM (index_special)))

const getSocialPrerequisiteText: (staticData: StaticDataRecord) =>
                                 (x: SocialPrerequisiteObjects) => string =
  staticData => x => isString (x)
                     ? x
                     : translateP (staticData)
                                  ("inlinewiki.socialstatusxorhigher")
                                  (List (
                                    pipe_ (
                                      x,
                                      SPA.value,
                                      lookupF (SDA.socialStatuses (staticData)),
                                      maybe <string | number> (SPA.value (x))
                                                              (NumIdName.A.name)
                                    )
                                  ))

export const getCategorizedItems =
  // (_req_text_index: PrerequisitesIndex) =>
  ifoldr (() => (e: AllRequirements): ident<Record<CategorizedPrerequisites>> => {
           // lookup (i) (req_text_index)
           const index_special = Nothing

           if (Maybe.elem<string | false> (false) (index_special)) {
             return ident
           }

           if (e === "RCP") {
             return set (CIL.rcp) (fromMaybe<string | boolean> (true) (index_special))
           }

           if (RaceRequirement.is (e)) {
             return set (CIL.race)
                        (Just (fromMaybe<RacePrerequisiteObjects> (e) (misStringM (index_special))))
           }

           if (SocialPrerequisite.is (e)) {
             return set (CIL.social)
                        (Just (fromMaybe<SocialPrerequisiteObjects> (e)
                                                                    (misStringM (index_special))))
           }

           if (RequirePrimaryAttribute.is (e)) {
             type InRecord = ReplacedPrerequisite<RequirePrimaryAttribute>

             return set (CIL.primaryAttribute)
                        (Just (fromMaybe<InRecord> (e) (misStringM (index_special))))
           }

           if (RequireIncreasable.is (e)) {
             type InRecord = ReplacedPrerequisite<RequireIncreasable>
             const id = RequireIncreasable.A.id (e)
             const mcategory = isList (id) ? getCategoryById (head (id)) : getCategoryById (id)
             const isCategory = Maybe.elemF (mcategory)

             return over (isCategory (Category.ATTRIBUTES) ? CIL.attributes : CIL.skills)
                         (consF (fromMaybe<InRecord> (e) (misStringM (index_special))))
           }

           if (RequireActivatable.is (e)) {
             const id = RAA.id (e)
             const mcategory = isList (id) ? getCategoryById (head (id)) : getCategoryById (id)
             const isCategory = Maybe.elemF (mcategory)
             const addEntry = consF (getActivatablePrerequisite (index_special) (e))

             if (isCategory (Category.LITURGICAL_CHANTS) || isCategory (Category.SPELLS)) {
               return over (CIL.activeSkills) (addEntry)
             }

             if (isList (id) ? any (isCasterOrBlessedOneId) (id) : isCasterOrBlessedOneId (id)) {
               return over (CIL.casterBlessedOne) (addEntry)
             }

             if (isList (id) ? any (isTraditionId) (id) : isTraditionId (id)) {
               return over (CIL.traditions) (addEntry)
             }

             const isActive = RAA.active (e)

             if (isCategory (Category.SPECIAL_ABILITIES)) {
               return over (isActive
                             ? CIL.otherActiveSpecialAbilities
                             : CIL.inactiveSpecialAbilities)
                           (addEntry)
             }

             if (isCategory (Category.ADVANTAGES)) {
               return over (isActive ? CIL.otherActiveAdvantages : CIL.inactiveAdvantages)
                           (addEntry)
             }

             if (isCategory (Category.DISADVANTAGES)) {
               return over (isActive ? CIL.activeDisadvantages : CIL.inactiveDisadvantages)
                           (addEntry)
             }
           }

           return ident
         })
         (CategorizedPrerequisites.default)

const getPrerequisitesActivatablesCategoryAdd =
  (staticData: StaticDataRecord) =>
    pipe (
      getCategoryById,
      Maybe.elemF,
      isCategory =>
        isCategory (Category.ADVANTAGES)
          ? `${translate (staticData) ("inlinewiki.advantage")} `
          : isCategory (Category.DISADVANTAGES)
          ? `${translate (staticData) ("inlinewiki.disadvantage")} `
          : ""
    )

const getPrerequisitesRCPText =
  (staticData: StaticDataRecord) =>
  (x: Activatable) =>
  (options: RCPPrerequisiteObjects) => {
    if (isString (options)) {
      return <span>{options}</span>
    }
    else {
      const category = AAL.category (x)
      const name = translateP (staticData)
                              ("inlinewiki.racecultureorprofessionrequiresautomaticorsuggested")
                              (List (
                                AAL.name (x),
                                category === Category.ADVANTAGES
                                  ? translate (staticData) ("inlinewiki.advantage")
                                  : translate (staticData) ("inlinewiki.disadvantage")
                              ))

      return <span>{name}</span>
    }
  }

const mapPrerequisitesActivatablesTextElem =
  (staticData: StaticDataRecord) =>
  (sid: Maybe<string | number>) =>
  (sid2: Maybe<string | number>) =>
  (level: Maybe<number>) =>
    pipe (
      getWikiEntry (staticData),
      bindF (a => {
        const curr_id = AAL.id (a)

        const category_add = getPrerequisitesActivatablesCategoryAdd (staticData) (curr_id)

        const active = ActiveObjectWithId ({
          id: curr_id,
          sid,
          sid2,
          tier: level,
          index: 0,
        })

        const mcombined_name =
          fmapF (getName (staticData) (active))
                (naming => putLevelName (true)
                                        (staticData)
                                        (ActivatableNameCost ({
                                          active,
                                          naming,
                                          finalCost: 0,
                                          isAutomatic: false,
                                        })))

        return fmapF (mcombined_name)
                     (combined_name =>
                       `${category_add}${ActivatableNameCostA_.name (combined_name)}`)
      })
    )

const getPrerequisitesActivatablesText =
  (staticData: StaticDataRecord) =>
    pipe (
      map ((x: ActivatablePrerequisiteObjects) => {
        if (RequireActivatable.is (x)) {
          const id = RAA.id (x)
          const active = RAA.active (x)
          const msid = RAA.sid (x)
          const msid2 = RAA.sid2 (x)
          const mlevel = RAA.tier (x)

          const name =
            pipe_ (
              msid,
              bindF (ensure ((a): a is string | number => !isList (a))),
              sid => isList (id)
                           ? pipe_ (
                               id,
                               mapMaybe (mapPrerequisitesActivatablesTextElem (staticData)
                                                                              (sid)
                                                                              (msid2)
                                                                              (mlevel)),
                               localizeOrList (staticData)
                             )
                           : fromMaybe ("")
                                       (mapPrerequisitesActivatablesTextElem (staticData)
                                                                             (sid)
                                                                             (msid2)
                                                                             (mlevel)
                                                                             (id))
            )

          return ActivatablePrerequisiteText ({
            id,
            active,
            name,
          })
        }
        else {
          const { id, active, value } = x
          const category_add = getPrerequisitesActivatablesCategoryAdd (staticData) (id)

          return ActivatablePrerequisiteText ({
            id,
            active,
            name: `${category_add}${value}`,
          })
        }
      }),
      sortRecordsByName (staticData),
      map ((x): Just<string | JSX.Element> => {
        const id = APTA.id (x)
        const name = APTA.name (x)
        const active = APTA.active (x)

        if (active) {
          return Just (name)
        }
        else {
          return Just (
            <span
              key={notNullStr (name) ? name : isString (id) ? id : ""}
              className="disabled"
              >
              {name}
            </span>
          )
        }
      })
    )

const getPrerequisitesAttributesText =
  (staticData: StaticDataRecord) => {
    const attrs = SDA.attributes (staticData)
    const getAttrAbbrv = pipe (lookupF (attrs), fmap (Attribute.A.short))

    return pipe (
      ensure (notNull as notNull<IncreasablePrerequisiteObjects>),
      fmap (pipe (
        map ((e: IncreasablePrerequisiteObjects) => {
          if (RequireIncreasable.is (e)) {
            const ids = RIA.id (e)
            const value = RIA.value (e)

            if (isList (ids)) {
              const name = pipe_ (ids, mapMaybe (getAttrAbbrv), localizeOrList (staticData))

              return `${name} ${value}`
            }
            else {
              const name = pipe_ (ids, getAttrAbbrv, fromMaybe (""))

              return `${name} ${value}`
            }
          }
          else {
            return e
          }
        }),
        sortStrings (staticData),
        intercalate (", ")
      ))
    )
  }

const getPrerequisitesPrimaryAttributeText =
  (staticData: StaticDataRecord) =>
  (x: PrimaryAttributePrerequisiteObjects) => (
    <span>
      {isString (x)
        ? x
        : `${translate (staticData) ("inlinewiki.primaryattributeofthetradition")} ${RPAA.value (x)}`}
    </span>
  )

const getNameById =
  (wiki: StaticDataRecord) =>
    pipe (getWikiEntry (wiki), bindF (pipe (Profession.AL.name, ensure (isString))))

const getPrerequisitesSkillsText =
  (staticData: StaticDataRecord) =>
    pipe (
      ensure (notNull as notNull<IncreasablePrerequisiteObjects>),
      fmap (pipe (
        map ((e: IncreasablePrerequisiteObjects) => {
          if (RequireIncreasable.is (e)) {
            const ids = RIA.id (e)
            const value = RIA.value (e)

            if (isList (ids)) {
              const name = pipe_ (
                             ids,
                             mapMaybe (getNameById (staticData)),
                             localizeOrList (staticData)
                           )

              return `${name} ${value}`
            }
            else {
              const name = pipe_ (ids, getNameById (staticData), fromMaybe (""))

              return `${name} ${value}`
            }
          }
          else {
            return e
          }
        }),
        sortStrings (staticData),
        intercalate (", ")
      ))
    )

const getPrerequisitesActivatedSkillsTextCategoryAdd =
  (staticData: StaticDataRecord) =>
  (id: string) => {
    const isCategory = Maybe.elemF (getCategoryById (id))

    return isCategory (Category.LITURGICAL_CHANTS)
      ? translate (staticData) ("inlinewiki.knowledgeofliturgicalchant")
      : translate (staticData) ("inlinewiki.knowledgeofspell")
  }

const getPrerequisitesActivatedSkillsText =
  (staticData: StaticDataRecord) =>
    pipe (
      ensure (notNull as notNull<ActivatablePrerequisiteObjects>),
      fmap (pipe (
        map ((e: ActivatablePrerequisiteObjects) => {
          if (RequireActivatable.is (e)) {
            const ids = RAA.id (e)

            if (isList (ids)) {
              const category_add = getPrerequisitesActivatedSkillsTextCategoryAdd (staticData)
                                                                                  (head (ids))

              const name = pipe_ (
                             ids,
                             mapMaybe (getNameById (staticData)),
                             localizeOrList (staticData)
                           )

              return `${category_add} ${name}`
            }
            else {
              const category_add = getPrerequisitesActivatedSkillsTextCategoryAdd (staticData) (ids)

              const name = pipe_ (ids, getNameById (staticData), fromMaybe (""))

              return `${category_add} ${name}`
            }
          }
          else {
            return e .value
          }
        }),
        sortStrings (staticData),
        intercalate (", ")
      ))
    )

const getPrerequisitesRaceText =
  (staticData: StaticDataRecord) =>
  (race: RacePrerequisiteObjects) => {
    if (isString (race)) {
      return <span>{race}</span>
    }

    const races = SDA.races (staticData)

    const race_tag = translate (staticData) ("inlinewiki.race")

    const value = RaceRequirement.A.value (race)
    const active = RaceRequirement.A.active (race)

    if (isList (value)) {
      const curr_races =
        pipe_ (
          value,
          mapMaybe (pipe (lookupF (races), fmap (Race.A.name))),
          localizeOrList (staticData)
        )

      return <span className={active ? "" : "disabled"}>{`${race_tag} ${curr_races}`}</span>
    }
    else {
      const curr_race = pipe_ (value, lookupF (races), maybe ("") (Race.A.name))

      return <span className={active ? "" : "disabled"}>{`${race_tag} ${curr_race}`}</span>
    }
  }

export interface PrerequisitesProps {
  x: Activatable
  staticData: StaticDataRecord
}

const getPrerequisites =
  (rs: List<AllRequirements>) =>
  // (req_text_index: PrerequisitesIndex) =>
  (props: PrerequisitesProps): List<Maybe<JSX.Element | string>> => {
    const { x, staticData } = props

    if (fnull (rs) && !isExtendedSpecialAbility (x)) {
      return List<Maybe<JSX.Element | string>> (
        Just (translate (staticData) ("general.none"))
      )
    }

    // const items = getCategorizedItems (req_text_index) (rs)
    const items = getCategorizedItems (rs)

    const rcp = CIA.rcp (items)
    const casterBlessedOne = CIA.casterBlessedOne (items)
    const traditions = CIA.traditions (items)
    const attributes = CIA.attributes (items)
    const primaryAttribute = CIA.primaryAttribute (items)
    const skills = CIA.skills (items)
    const activeSkills = CIA.activeSkills (items)
    const otherActiveSpecialAbilities = CIA.otherActiveSpecialAbilities (items)
    const inactiveSpecialAbilities = CIA.inactiveSpecialAbilities (items)
    const otherActiveAdvantages = CIA.otherActiveAdvantages (items)
    const inactiveAdvantages = CIA.inactiveAdvantages (items)
    const activeDisadvantages = CIA.activeDisadvantages (items)
    const inactiveDisadvantages = CIA.inactiveDisadvantages (items)
    const race = CIA.race (items)
    const social = CIA.social (items)

    const category = AAL.category (x)
    const gr = AAL.gr (x)

    return List<Maybe<JSX.Element | string>> (
      (isString (rcp) ? notNullStr (rcp) : rcp)
        ? Just (getPrerequisitesRCPText (staticData) (x) (rcp))
        : Nothing,
      ...getPrerequisitesActivatablesText (staticData) (casterBlessedOne),
      ...getPrerequisitesActivatablesText (staticData) (traditions),
      getPrerequisitesAttributesText (staticData) (attributes),
      fmap (getPrerequisitesPrimaryAttributeText (staticData)) (primaryAttribute),
      getPrerequisitesSkillsText (staticData) (skills),
      getPrerequisitesActivatedSkillsText (staticData) (activeSkills),
      ...getPrerequisitesActivatablesText (staticData) (otherActiveSpecialAbilities),
      ...getPrerequisitesActivatablesText (staticData) (inactiveSpecialAbilities),
      ...getPrerequisitesActivatablesText (staticData) (otherActiveAdvantages),
      ...getPrerequisitesActivatablesText (staticData) (inactiveAdvantages),
      ...getPrerequisitesActivatablesText (staticData) (activeDisadvantages),
      ...getPrerequisitesActivatablesText (staticData) (inactiveDisadvantages),
      fmap (getPrerequisitesRaceText (staticData)) (race),
      fmap (getSocialPrerequisiteText (staticData)) (social),
      category === Category.SPECIAL_ABILITIES
        ? (gr === SpecialAbilityGroup.CombatExtended
          ? Just (translate (staticData) ("inlinewiki.appropriatecombatstylespecialability"))
          : gr === SpecialAbilityGroup.MagicalExtended
          ? Just (translate (staticData) ("inlinewiki.appropriatemagicalstylespecialability"))
          : gr === SpecialAbilityGroup.KarmaExtended
          ? Just (translate (staticData) ("inlinewiki.appropriateblessedstylespecialability"))
          : gr === SpecialAbilityGroup.SkillExtended
          ? Just (translate (staticData) ("inlinewiki.appropriateskillstylespecialability"))
          : Nothing)
        : Nothing
    )
  }

export interface PrerequisitesTextProps {
  x: Activatable
  staticData: StaticDataRecord
}

export function PrerequisitesText (props: PrerequisitesTextProps) {
  const { x, staticData } = props

  const prerequisitesText = AAL.prerequisitesText (x)
  // const prerequisitesTextIndex = AAL.prerequisitesTextIndex (x)

  if (isJust (prerequisitesText)) {
    return (
      <Markdown
        source={`**${translate (staticData) ("inlinewiki.prerequisites")}:** ${fromJust (prerequisitesText)}`}
        />
    )
  }

  const levels = Maybe.product (AAL.tiers (x))
  const prerequisites = AAL.prerequisites (x)
  const prerequisitesTextEnd = AAL.prerequisitesTextEnd (x)
  const prerequisitesTextStart = AAL.prerequisitesTextStart (x)

  type TypeofMaybeList = Maybe<JSX.Element | string>
  type TypeofList = JSX.Element | string

  const mtext_before = fmapF (prerequisitesTextStart)
                             (y => <Markdown key="before" source={y} noWrapper />)

  /**
   * `Right`: Will need a comma before if there are elements before the text.
   * `Left`: Must not get a comma before the text.
   */
  const mtext_after = fmapF (prerequisitesTextEnd)
                            ((y): Either<JSX.Element, JSX.Element> =>
                              /^(?: |,|\.)/u .test (y)
                                ? Left (<Markdown key="after" source={y} noWrapper />)
                                : Right (<Markdown key="after" source={y} noWrapper />))

  const mtext_after_insidelist = bind (mtext_after) (eitherToMaybe)
  const mtext_after_outsidelist = bind (mtext_after) (pipe (invertEither, eitherToMaybe))

  const addTextAfterOutsideList: <A> (xs: List<TypeofList | A>) => List<TypeofList | A> =
    xs => maybe (xs) (snoc (xs)) (mtext_after_outsidelist)

  if (isOrderedMap (prerequisites)) {
    const levelList = rangeN (1, levels)

    return (
      <p>
        <span>
          {translate (staticData) ("inlinewiki.prerequisites")}
          {": "}
        </span>
        <span>
          {pipe_ (
            List<Maybe<TypeofList>> (
              mtext_before,
              notMember (1) (prerequisites)
                ? Just (`${translate (staticData) ("inlinewiki.level")} I: ${translate (staticData) ("general.none")} `)
                : Nothing,
              ...map ((lvl: number) => {
                  const prereqForLevel = lookup (lvl) (prerequisites)
                  const not_empty = Maybe.any (notNull) (prereqForLevel)

                  const level_num_str = `${translate (staticData) ("inlinewiki.level")} ${toRoman (lvl)}: `

                  const requires_last_str =
                    lvl > 1
                    ? `${not_empty ? ", " : ""}${AAL.name (x)}${nbsp}${toRoman (lvl - 1)}`
                    : ""

                  return Just (
                    <React.Fragment key={lvl}>
                      {level_num_str}
                      {maybeRNull ((rs: List<AllRequirements>) =>
                                    pipe_ (
                                      // getPrerequisites (rs) (prerequisitesTextIndex) (props),
                                      getPrerequisites (rs) (props),
                                      catMaybes,
                                      intersperse<TypeofList> (", "),
                                      toArray,
                                      e => <>{e}</>
                                    ))
                                  (prereqForLevel)}
                      {requires_last_str}
                    </React.Fragment>
                  )
                })
                (levelList),
              mtext_after_insidelist
            ),
            catMaybes,
            intersperse<TypeofList> ("; "),
            addTextAfterOutsideList,
            ensure (notNull),
            maybe<React.ReactNode> (translate (staticData) ("general.none")) (toArray)
          )}
        </span>
      </p>
    )
  }
  else {
    return (
      <p>
        <span>
          {translate (staticData) ("inlinewiki.prerequisites")}
          {": "}
        </span>
        <span>
          {pipe_ (
            // getPrerequisites (prerequisites) (prerequisitesTextIndex) (props),
            getPrerequisites (prerequisites) (props),
            consF<TypeofMaybeList> (mtext_before),
            snocF<TypeofMaybeList> (mtext_after_insidelist),
            catMaybes,
            intersperse<JSX.Element | string> (", "),
            addTextAfterOutsideList,
            ensure (notNull),
            maybe<React.ReactNode> (translate (staticData) ("general.none")) (toArray)
          )}
        </span>
      </p>
    )
  }
}

export interface WikiActivatableInfoProps {
  staticData: StaticDataRecord
  x: Activatable
  selector: Maybe<WikiInfoSelector>
}

export const WikiActivatableInfo: React.FC<WikiActivatableInfoProps> = props => {
  const { x, staticData, selector } = props

  const isCustom = isCustomActivatable (x)

  const specialAbilities = SDA.specialAbilities (staticData)

  const cost = getCost (staticData) (x)
  const cost_elem = <Markdown source={cost} />

  const source_elem = (
    <WikiSource<RecordI<Activatable>>
      staticData={staticData}
      x={x}
      acc={AcA}
      />
  )

  if (SpecialAbility.is (x)) {
    const header_name_levels =
      maybe ("")
            ((levels: number) => levels < 2 ? " I" : ` I-${toRoman (levels)}`)
            (SAA.tiers (x))

    const header_full_name = fromMaybe (SAA.name (x)) (SAA.nameInWiki (x))

    const header_name = `${header_full_name}${header_name_levels}`

    const header_sub_name =
      maybe (null as React.ReactNode)
            (pipe (
              NumIdName.A.name,
              subgr => (
                <p className="title">
                  {subgr}
                </p>
              )
            ))
            (bind (SAA.subgr (x))
                  (lookupF (SDA.combatSpecialAbilityGroups (staticData))))


    if (isCustom) {
      return (
        <WikiBoxTemplate className="disadv" title={header_name}>
          <WikiInfoCustomRuleContainer
            staticData={staticData}
            selector={selector}
            />
          <PrerequisitesText
            staticData={staticData}
            x={x}
            />
          {cost_elem}
          {source_elem}
        </WikiBoxTemplate>
      )
    }

    switch (SAA.gr (x)) {
      case SpecialAbilityGroup.StaffEnchantments:
      case SpecialAbilityGroup.Bannschwert:
      case SpecialAbilityGroup.Dolch:
      case SpecialAbilityGroup.Instrument:
      case SpecialAbilityGroup.Gewand:
      case SpecialAbilityGroup.Kugel:
      case SpecialAbilityGroup.Stecken:
      case SpecialAbilityGroup.Magierkugel:
      case SpecialAbilityGroup.Narrenkappe:
      case SpecialAbilityGroup.Schelmenspielzeug:
      case SpecialAbilityGroup.Alchimistenschale:
      case SpecialAbilityGroup.WaffenzauberAnimisten:
      case SpecialAbilityGroup.Sichelrituale:
      case SpecialAbilityGroup.Ringzauber:
      case SpecialAbilityGroup.Chronikzauber:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            {maybeRNullF (SAA.effect (x))
                         (str => (
                           <Markdown
                             source={`**${translate (staticData) ("inlinewiki.effect")}:** ${str}`}
                             />
                         ))}
            {maybeRNullF (SAA.volume (x))
                         (str => (
                           <WikiProperty staticData={staticData} title="inlinewiki.volume">
                             {str}
                           </WikiProperty>
                         ))}
            {maybeRNullF (SAA.aeCost (x))
                         (str => (
                           <WikiProperty staticData={staticData} title="inlinewiki.aecost">
                             {str}
                           </WikiProperty>
                         ))}
            {isNothing (SAA.aeCost (x)) && isNothing (SAA.bindingCost (x))
              ? (
                  <WikiProperty staticData={staticData} title="inlinewiki.aecost">
                    {translate (staticData) ("general.none")}
                  </WikiProperty>
                )
              : null}
            {maybeRNullF (SAA.bindingCost (x))
                         (str => (
                           <WikiProperty staticData={staticData} title="inlinewiki.bindingcost">
                             {str}
                           </WikiProperty>
                         ))}
            {maybeRNullF (bind (misNumberM (SAA.property (x)))
                               (lookupF (SDA.properties (staticData))))
                         (pipe (
                           NumIdName.A.name,
                           str => (
                             <WikiProperty staticData={staticData} title="inlinewiki.property">
                               {str}
                             </WikiProperty>
                           )
                         ))}
            <PrerequisitesText
              staticData={staticData}
              x={x}
              />
            {cost_elem}
            {source_elem}
          </WikiBoxTemplate>
        )

      case SpecialAbilityGroup.Zeremonialgegenstände:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            {maybeRNullF (SAA.effect (x))
                         (str => (
                           <Markdown
                             source={`**${translate (staticData) ("inlinewiki.effect")}:** ${str}`}
                             />
                         ))}
            {maybeRNullF (SAA.aspect (x))
                         (aspect => (
                           <WikiProperty staticData={staticData} title="inlinewiki.aspect">
                             {isNumber (aspect)
                               ? pipe_ (
                                   aspect,
                                   lookupF (SDA.aspects (staticData)),
                                   maybe ("") (NumIdName.A.name)
                                 )
                               : aspect}
                           </WikiProperty>
                         ))}
            <PrerequisitesText
              staticData={staticData}
              x={x}
              />
            {cost_elem}
            {source_elem}
          </WikiBoxTemplate>
        )

      case SpecialAbilityGroup.ProtectiveWardingCircles:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            <WikiProperty staticData={staticData} title="inlinewiki.aecost">
              {renderMaybe (SAA.aeCost (x))}
            </WikiProperty>
            <WikiProperty staticData={staticData} title="inlinewiki.protectivecircle">
              {renderMaybe (SAA.protectiveCircle (x))}
            </WikiProperty>
            <WikiProperty staticData={staticData} title="inlinewiki.wardingcircle">
              {renderMaybe (SAA.wardingCircle (x))}
            </WikiProperty>
            {cost_elem}
            {source_elem}
          </WikiBoxTemplate>
        )

      case SpecialAbilityGroup.MagicalTraditions:
      case SpecialAbilityGroup.BlessedTraditions:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            <Markdown source={renderMaybe (SAA.rules (x))} />
            <PrerequisitesText
              staticData={staticData}
              x={x}
              />
            {cost_elem}
            {source_elem}
          </WikiBoxTemplate>
        )

      case SpecialAbilityGroup.CombatStylesArmed:
      case SpecialAbilityGroup.CombatStylesUnarmed: {
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            {maybeRNullF (SAA.rules (x))
                         (str => (
                           <Markdown
                             source={`**${translate (staticData) ("inlinewiki.rule")}:** ${str}`}
                             />
                         ))}
            {maybeRNullF (SAA.extended (x))
                         (es => {
                           const tag = translate (staticData)
                                                 ("inlinewiki.extendedcombatspecialabilities")

                           const names = pipe_ (
                            es,
                            mapMaybe (pipe (
                              ensure (isString),
                              bindF (lookupF (specialAbilities)),
                              fmap (SAA.name)
                            )),
                            sortStrings (staticData),
                            intercalate (", ")
                           )

                           return (
                             <Markdown source={`**${tag}:** ${names}`} />
                           )
                         })}
            {maybeRNullF (SAA.penalty (x))
                         (str => (
                           <Markdown
                             source={`**${translate (staticData) ("inlinewiki.penalty")}:** ${str}`}
                             />
                         ))}
            <WikiCombatTechniques
              acc={SAA}
              combatTechniques={SDA.combatTechniques (staticData)}
              staticData={staticData}
              x={x}
              />
            <PrerequisitesText
              staticData={staticData}
              x={x}
              />
            {cost_elem}
            {source_elem}
          </WikiBoxTemplate>
        )
      }

      case SpecialAbilityGroup.MagicalStyles:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            {maybeRNullF (SAA.rules (x))
                         (str => (
                           <Markdown
                             source={`**${translate (staticData) ("inlinewiki.rule")}:** ${str}`}
                             />
                         ))}
            {maybeRNullF (SAA.extended (x))
                         (es => {
                           const tag = translate (staticData)
                                                 ("inlinewiki.extendedmagicalspecialabilities")

                           const names = pipe_ (
                             es,
                             mapMaybe (pipe (
                               ensure (isString),
                               bindF (lookupF (specialAbilities)),
                               fmap (SAA.name)
                             )),
                             sortStrings (staticData),
                             intercalate (", ")
                           )

                           return (
                             <Markdown source={`**${tag}:** ${names}`} />
                           )
                         })}
            <PrerequisitesText
              staticData={staticData}
              x={x}
              />
            {cost_elem}
            {source_elem}
          </WikiBoxTemplate>
        )

      case SpecialAbilityGroup.BlessedStyles: {
        const SA_639 = lookup<string> (SpecialAbilityId.GebieterDesAspekts) (specialAbilities)

        const add_extended =
          pipe_ (
            SA_639,
            bindF (SAA.select),
            fmap (mapMaybe (join ((option: Record<SelectOption>) =>
                                   pipe (
                                     SelectOption.A.prerequisites,
                                     bindF (ensure (any (e => {
                                                     if (!RequireActivatable.is (e)) {
                                                       return false
                                                     }

                                                     const req_ids = RAAL.id (e)

                                                     return isString (req_ids)
                                                       ? req_ids === SAA.id (x)
                                                       : elem (SAA.id (x)) (req_ids)
                                                   }))),
                                     fmap (() => ActiveObjectWithId ({
                                                   id: SpecialAbilityId.GebieterDesAspekts,
                                                   index: 0,
                                                   sid: Just (SelectOption.A.id (option)),
                                                 }))
                                   )))),
            joinMaybeList
          )

        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            {maybeRNullF (SAA.rules (x))
                         (str => (
                           <Markdown
                             source={`**${translate (staticData) ("inlinewiki.rule")}:** ${str}`}
                             />
                         ))}
            {maybeRNullF (SAA.extended (x))
                         (pipe (
                           mapMaybe (pipe (
                             ensure (isString),
                             bindF (lookupF (specialAbilities)),
                             fmap (SAA.name)
                           )),
                           append (mapMaybe (pipe (
                                              getNameCostForWiki (staticData),
                                              fmap (ActivatableNameCostA_.name)
                                            ))
                                            (add_extended)),
                           sortStrings (staticData),
                           intercalate (", "),
                           str => {
                             const tag = translate (staticData)
                                                   ("inlinewiki.extendedblessedspecialabilities")

                             return (
                               <Markdown source={`**${tag}:** ${str}`} />
                             )
                           }
                         ))}
            <PrerequisitesText
              staticData={staticData}
              x={x}
              />
            {cost_elem}
            {source_elem}
          </WikiBoxTemplate>
        )
      }

      case SpecialAbilityGroup.SkillStyles:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            {maybeRNullF (SAA.rules (x))
                         (str => (
                           <Markdown
                             source={`**${translate (staticData) ("inlinewiki.rule")}:** ${str}`}
                             />
                         ))}
            {maybeRNullF (SAA.extended (x))
                         (es => {
                           const tag = translate (staticData)
                                                 ("inlinewiki.extendedskillspecialabilities")
                           const names = pipe_ (
                             es,
                             mapMaybe (pipe (
                               ensure (isString),
                               bindF (lookupF (specialAbilities)),
                               fmap (SAA.name)
                             )),
                             sortStrings (staticData),
                             intercalate (", ")
                           )

                           return (
                             <Markdown source={`**${tag}:** ${names}`} />
                           )
                         })}
            <PrerequisitesText
              staticData={staticData}
              x={x}
              />
            {cost_elem}
            {source_elem}
          </WikiBoxTemplate>
        )

      case SpecialAbilityGroup.Hexenkessel:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            {maybeRNullF (SAA.effect (x))
                          (str => (
                            <Markdown
                              source={`**${translate (staticData) ("inlinewiki.effect")}:** ${str}`}
                              />
                          ))}
            {maybeRNullF (SAA.volume (x))
                          (str => (
                            <WikiProperty staticData={staticData} title="inlinewiki.volume">
                              {str}
                            </WikiProperty>
                          ))}
            {maybeRNullF (bind (misNumberM (SAA.brew (x)))
                               (lookupF (SDA.brews (staticData))))
                         (pipe (
                           NumIdName.A.name,
                           str => (
                             <WikiProperty staticData={staticData} title="inlinewiki.brew">
                               {str}
                             </WikiProperty>
                           )
                         ))}
            {maybeRNullF (SAA.aeCost (x))
                          (str => (
                            <WikiProperty staticData={staticData} title="inlinewiki.aecost">
                              {str}
                            </WikiProperty>
                          ))}
            {isNothing (SAA.aeCost (x)) && isNothing (SAA.bindingCost (x))
              ? (
                  <WikiProperty staticData={staticData} title="inlinewiki.aecost">
                    {translate (staticData) ("general.none")}
                  </WikiProperty>
                )
              : null}
            {maybeRNullF (SAA.bindingCost (x))
                          (str => (
                            <WikiProperty staticData={staticData} title="inlinewiki.bindingcost">
                              {str}
                            </WikiProperty>
                          ))}
            {maybeRNullF (bind (misNumberM (SAA.property (x)))
                               (lookupF (SDA.properties (staticData))))
                         (pipe (
                           NumIdName.A.name,
                           str => (
                             <WikiProperty staticData={staticData} title="inlinewiki.property">
                               {str}
                             </WikiProperty>
                           )
                         ))}
            <PrerequisitesText
              staticData={staticData}
              x={x}
              />
            {cost_elem}
            {source_elem}
          </WikiBoxTemplate>
        )

      case SpecialAbilityGroup.Paktgeschenke:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            {maybeRNullF (SAA.rules (x))
                         (str => (
                           <Markdown
                             source={`**${translate (staticData) ("inlinewiki.rule")}:** ${str}`}
                             />
                         ))}
            {maybeRNullF (SAA.effect (x))
                         (str => (
                           <Markdown
                             source={`**${translate (staticData) ("inlinewiki.effect")}:** ${str}`}
                             />
                         ))}
            <PrerequisitesText
              staticData={staticData}
              x={x}
              />
            {cost_elem}
            {source_elem}
          </WikiBoxTemplate>
        )

      case SpecialAbilityGroup.Combat:
      case SpecialAbilityGroup.CombatExtended:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            {maybeRNullF (SAA.rules (x))
                         (str => (
                           <Markdown
                             source={`**${translate (staticData) ("inlinewiki.rule")}:** ${str}`}
                             />
                         ))}
            {maybeRNullF (SAA.effect (x))
                         (str => (
                           <Markdown
                             source={`**${translate (staticData) ("inlinewiki.effect")}:** ${str}`}
                             />
                         ))}
            {maybeRNullF (SAA.penalty (x))
                         (str => (
                           <Markdown
                             source={`**${translate (staticData) ("inlinewiki.penalty")}:** ${str}`}
                             />
                         ))}
            <WikiCombatTechniques
              acc={SAA}
              combatTechniques={SDA.combatTechniques (staticData)}
              staticData={staticData}
              x={x}
              />
            {maybeRNullF (SAA.aeCost (x))
                         (str => (
                           <WikiProperty staticData={staticData} title="inlinewiki.aecost">
                             {str}
                           </WikiProperty>
                         ))}
            <PrerequisitesText
              staticData={staticData}
              x={x}
              />
            {cost_elem}
            {source_elem}
          </WikiBoxTemplate>
        )

      default:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            {maybeRNullF (SAA.rules (x))
                         (str => (
                           <Markdown
                             source={`**${translate (staticData) ("inlinewiki.rule")}:** ${str}`}
                             />
                         ))}
            {maybeRNullF (SAA.effect (x))
                         (str => (
                           <Markdown
                             source={`**${translate (staticData) ("inlinewiki.effect")}:** ${str}`}
                             />
                         ))}
            {maybeRNullF (SAA.penalty (x))
                         (str => (
                           <Markdown
                             source={`**${translate (staticData) ("inlinewiki.penalty")}:** ${str}`}
                             />
                         ))}
            {maybeRNullF (SAA.aeCost (x))
                         (str => (
                           <WikiProperty staticData={staticData} title="inlinewiki.aecost">
                             {str}
                           </WikiProperty>
                         ))}
            <PrerequisitesText
              staticData={staticData}
              x={x}
              />
            {cost_elem}
            {source_elem}
          </WikiBoxTemplate>
        )
    }
  }
  else {
    const header_name_levels =
      maybe ("")
            ((levels: number) => levels < 2 ? " I" : ` I-${toRoman (levels)}`)
            (AAL.tiers (x))

    const header_full_name = AAL.name (x)

    const rs = AAL.prerequisites (x)

    const has_rcp =
      isOrderedMap (rs)
        ? maybe (false) (elem<AllRequirements> ("RCP")) (lookup (1) (rs))
        : elem<AllRequirements> ("RCP") (rs)

    const header_rcp = has_rcp ? " (*)" : ""

    const header_name = `${header_full_name}${header_name_levels}${header_rcp}`


    if (isCustom) {
      return (
        <WikiBoxTemplate className="disadv" title={header_name}>
          <WikiInfoCustomRuleContainer
            staticData={staticData}
            selector={selector}
            />
          <PrerequisitesText
            staticData={staticData}
            x={x}
            />
          {cost_elem}
          {source_elem}
        </WikiBoxTemplate>
      )
    }

    return (
      <WikiBoxTemplate className="disadv" title={header_name}>
        <Markdown source={`**${translate (staticData) ("inlinewiki.rule")}:** ${AAL.rules (x)}`} />
        {maybeRNullF (AcA.range (x))
                     (str => (
                       <WikiProperty staticData={staticData} title="inlinewiki.range">
                         {str}
                       </WikiProperty>
                     ))}
        {maybeRNullF (AcA.actions (x))
                     (str => (
                       <WikiProperty staticData={staticData} title="inlinewiki.actions">
                         {str}
                       </WikiProperty>
                     ))}
        <PrerequisitesText
          staticData={staticData}
          x={x}
          />
        {cost_elem}
        {source_elem}
      </WikiBoxTemplate>
    )
  }
}
