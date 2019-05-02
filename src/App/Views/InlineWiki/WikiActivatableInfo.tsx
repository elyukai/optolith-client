import classNames = require("classnames")
import * as React from "react";
import { cnst, flip, ident } from "../../../Data/Function";
import { fmap, fmapF } from "../../../Data/Functor";
import { over, set } from "../../../Data/Lens";
import { any, appendStr, consF, head, ifoldr, imap, intercalate, isList, List, map, NonEmptyList, notNull, notNullStr, subscript } from "../../../Data/List";
import { bind, bindF, ensure, fromJust, fromMaybe, isJust, isNothing, Just, liftM2, mapMaybe, maybe, Maybe, maybeR, maybeRNullF, Nothing } from "../../../Data/Maybe";
import { lookup, lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { fromDefault, makeLenses, Record, RecordI } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { ActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId";
import { HeroModelRecord } from "../../Models/Hero/HeroModel";
import { ActivatableNameCostA_ } from "../../Models/View/ActivatableNameCost";
import { DerivedCharacteristic } from "../../Models/View/DerivedCharacteristic";
import { Advantage } from "../../Models/Wiki/Advantage";
import { Attribute } from "../../Models/Wiki/Attribute";
import { Book } from "../../Models/Wiki/Book";
import { Disadvantage } from "../../Models/Wiki/Disadvantage";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { RequireActivatable } from "../../Models/Wiki/prerequisites/ActivatableRequirement";
import { RequireIncreasable } from "../../Models/Wiki/prerequisites/IncreasableRequirement";
import { RequirePrimaryAttribute } from "../../Models/Wiki/prerequisites/PrimaryAttributeRequirement";
import { RaceRequirement } from "../../Models/Wiki/prerequisites/RaceRequirement";
import { Race } from "../../Models/Wiki/Race";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Activatable, AllRequirements } from "../../Models/Wiki/wikiTypeHelpers";
import { DCIds } from "../../Selectors/derivedCharacteristicsSelectors";
import { getNameCostForWiki } from "../../Utilities/Activatable/activatableActiveUtils";
import { localizeOrList, translate } from "../../Utilities/I18n";
import { getCategoryById, isBlessedTraditionId, isMagicalTraditionId, prefixRace } from "../../Utilities/IDUtils";
import { dec, negate } from "../../Utilities/mathUtils";
import { toRoman, toRomanFromIndex } from "../../Utilities/NumberUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { sortRecordsByName } from "../../Utilities/sortBy";
import { isString, misNumberM, misStringM } from "../../Utilities/typeCheckUtils";
import { getWikiEntry } from "../../Utilities/WikiUtils";
import { Markdown } from "../Universal/Markdown";
import { WikiSource } from "./Elements/WikiSource";
import { WikiBoxTemplate } from "./WikiBoxTemplate";
import { WikiProperty } from "./WikiProperty";

export interface WikiActivatableInfoProps {
  attributes: OrderedMap<string, Record<Attribute>>
  books: OrderedMap<string, Record<Book>>
  derivedCharacteristics: OrderedMap<DCIds, Record<DerivedCharacteristic>>
  hero: HeroModelRecord
  wiki: WikiModelRecord
  x: Activatable
  l10n: L10nRecord
  specialAbilities: OrderedMap<string, Record<SpecialAbility>>
}

const AcA = { ...Advantage.AL, ...SpecialAbility.AL }
const AdA = Advantage.A
const DA = Disadvantage.A
const SAA = SpecialAbility.A

// tslint:disable-next-line: cyclomatic-complexity
export function WikiActivatableInfo (props: WikiActivatableInfoProps) {
  const { x, l10n, specialAbilities, wiki } = props

  const cost = getCost (l10n) (x)
  const cost_elem = <Markdown source={cost} />

  const source_elem = <WikiSource<RecordI<Activatable>> {...props} acc={AcA} />

  if (SpecialAbility.is (x)) {
    const header_name_levels =
      maybe ("")
            ((levels: number) => levels < 2 ? " I" : ` I-${toRoman (levels)}`)
            (AcA.tiers (x))

    const header_full_name = fromMaybe (AcA.name (x)) (AcA.nameInWiki (x))

    const header_name = `${header_full_name}${header_name_levels}`

    const header_sub_name =
      maybeR (null)
             ((subgr: string) => (
               <p className="title">
                 {subgr}
               </p>
             ))
             (bind (AcA.subgr (x))
                   (pipe (dec, subscript (translate (l10n) ("combatspecialabilitygroups")))))

    // if (["nl-BE"].includes(l10n.id)) {
    //   return (
    //     <WikiBoxTemplate
    //       className="specialability"
    //       title={headerName}
    //       subtitle={headerSubName}
    //       />
    //   )
    // }

    switch (AcA.gr (x)) {
      case 5:
      case 15:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            {maybeRNullF (AcA.effect (x))
                         (str => (
                           <Markdown source={`**${translate (l10n) ("effect")}:** ${str}`} />
                         ))}
            {maybeRNullF (AcA.volume (x))
                         (str => (
                           <WikiProperty l10n={l10n} title="volume">
                             {str}
                           </WikiProperty>
                         ))}
            {maybeRNullF (AcA.aeCost (x))
                         (str => (
                           <WikiProperty l10n={l10n} title="aecost">
                             {str}
                           </WikiProperty>
                         ))}
            {isNothing (AcA.aeCost (x)) && isNothing (AcA.bindingCost (x))
              ? <WikiProperty l10n={l10n} title="aecost">{translate (l10n) ("none")}</WikiProperty>
              : null}
            {maybeRNullF (AcA.bindingCost (x))
                         (str => (
                           <WikiProperty l10n={l10n} title="bindingcost">
                             {str}
                           </WikiProperty>
                         ))}
            {maybeRNullF (bind (misNumberM (AcA.property (x)))
                               (pipe (dec, subscript (translate (l10n) ("propertylist")))))
                         (str => (
                           <WikiProperty l10n={l10n} title="bindingcost">
                             {str}
                           </WikiProperty>
                         ))}
            <PrerequisitesText {...props} entry={currentObject} />
            {cost_elem}
            {source_elem}
          </WikiBoxTemplate>
        )

      case 23:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            {currentObject.effect && <Markdown source={`**${translate(l10n, "info.effect")}:** ${currentObject.effect}`} />}
            {currentObject.aspect && <WikiProperty l10n={l10n} title="aspect">
              {typeof currentObject.aspect === "number" ? translate(l10n, "liturgies.view.aspects")[currentObject.aspect - 1] : currentObject.aspect}
            </WikiProperty>}
            <PrerequisitesText {...props} entry={currentObject} />
            <Markdown source={costText} />
            {source_elem}
          </WikiBoxTemplate>
        )

      case 8:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            <WikiProperty l10n={l10n} title="aecost">
              {currentObject.aeCost}
            </WikiProperty>
            <WikiProperty l10n={l10n} title="protectivecircle">
              {currentObject.protectiveCircle}
            </WikiProperty>
            <WikiProperty l10n={l10n} title="wardingcircle">
              {currentObject.wardingCircle}
            </WikiProperty>
            <Markdown source={costText} />
            {source_elem}
          </WikiBoxTemplate>
        )

      case 28:
      case 29:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            <Markdown source={`${currentObject.rules}`} />
            <PrerequisitesText {...props} entry={currentObject} />
            <Markdown source={costText} />
            {source_elem}
          </WikiBoxTemplate>
        )

      case 9:
      case 10:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            {currentObject.rules && <Markdown source={`**${translate(l10n, "info.rules")}:** ${currentObject.rules}`} />}
            {currentObject.extended && <Markdown source={`**${translate(l10n, "info.extendedcombatspecialabilities")}:** ${sortStrings(currentObject.extended.map(e => !Array.isArray(e) && specialAbilities.has(e) ? specialAbilities.get(e)!.name : "..."), l10n.id).intercalate(", ")}`} />}
            {currentObject.penalty && <Markdown source={`**${translate(l10n, "info.penalty")}:** ${currentObject.penalty}`} />}
            {currentObject.combatTechniques && <Markdown source={`**${translate(l10n, "info.combattechniques")}:** ${currentObject.combatTechniques}`} />}
            <PrerequisitesText {...props} entry={currentObject} />
            <Markdown source={costText} />
            {source_elem}
          </WikiBoxTemplate>
        )

      case 13:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            {currentObject.rules && <Markdown source={`**${translate(l10n, "info.rules")}:** ${currentObject.rules}`} />}
            {currentObject.extended && <Markdown source={`**${translate(l10n, "info.extendedmagicalspecialabilities")}:** ${sortStrings(currentObject.extended.map(e => !Array.isArray(e) && specialAbilities.has(e) ? specialAbilities.get(e)!.name : "..."), l10n.id).intercalate(", ")}`} />}
            <PrerequisitesText {...props} entry={currentObject} />
            <Markdown source={costText} />
            {source_elem}
          </WikiBoxTemplate>
        )

      case 25: {
        const SA_639 = specialAbilities.get("SA_639")

        const additionalExtended = SA_639 && SA_639.select && SA_639.select.foldl<ActiveObject[]>((arr, selectionObject) => {
          if (selectionObject.prerequisites) {
            if (selectionObject.prerequisites.find(e => e.id === currentObject.id || e.id.includes(currentObject.id))) {
              return [
                { sid: selectionObject.id },
                ...arr
              ]
            }
          }
          return arr
        }, [])

        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            {currentObject.rules && <Markdown source={`**${translate(l10n, "info.rules")}:** ${currentObject.rules}`} />}
            {currentObject.extended && <Markdown source={`**${translate(l10n, "info.extendedblessedtspecialabilities")}:** ${sortStrings([
              ...currentObject.extended.map(e => !Array.isArray(e) && specialAbilities.has(e) ? specialAbilities.get(e)!.name : "..."),
              ...(additionalExtended ? additionalExtended.map(e => getNameCostForWiki({ id: "SA_639", index: 0, ...e }, wiki, l10n).combinedName) : [])
            ], l10n.id).intercalate(", ")}`} />}
            {currentObject.penalty && <Markdown source={`**${translate(l10n, "info.penalty")}:** ${currentObject.penalty}`} />}
            {currentObject.combatTechniques && <Markdown source={`**${translate(l10n, "info.combattechniques")}:** ${currentObject.combatTechniques}`} />}
            <PrerequisitesText {...props} entry={currentObject} />
            <Markdown source={costText} />
            {source_elem}
          </WikiBoxTemplate>
        )
      }

      default:
        return (
          <WikiBoxTemplate
            className="specialability"
            title={header_name}
            subtitle={header_sub_name}
            >
            {currentObject.rules && <Markdown source={`**${translate(l10n, "info.rules")}:** ${currentObject.rules}`} />}
            {currentObject.effect && <Markdown source={`**${translate(l10n, "info.effect")}:** ${currentObject.effect}`} />}
            {currentObject.penalty && <Markdown source={`**${translate(l10n, "info.penalty")}:** ${currentObject.penalty}`} />}
            {currentObject.combatTechniques && <Markdown source={`**${translate(l10n, "info.combattechniques")}:** ${currentObject.combatTechniques}`} />}
            {currentObject.aeCost && <WikiProperty l10n={l10n} title="aecost">
              {currentObject.aeCost}
            </WikiProperty>}
            <PrerequisitesText {...props} entry={currentObject} />
            <Markdown source={costText} />
            {source_elem}
          </WikiBoxTemplate>
        )
    }
  }

  const headerName = `${currentObject.name}${typeof tiers === "number" ? tiers < 2 ? " I" : ` I-${getRoman(tiers)}` : ""}${(Array.isArray(currentObject.reqs) ? currentObject.reqs.includes("RCP") : (currentObject.reqs.has(1) && currentObject.reqs.get(1)!.includes("RCP"))) ? " (*)" : ""}`

  // if (["en-US", "nl-BE"].includes(l10n.id)) {
  //   return (
  //     <WikiBoxTemplate className="race" title={headerName} />
  //   )
  // }

  return (
    <WikiBoxTemplate className="disadv" title={headerName}>
      {currentObject.rules && <Markdown source={`**${translate(l10n, "info.rules")}:** ${currentObject.rules}`} />}
      {currentObject.range && <WikiProperty l10n={l10n} title="range">
        {currentObject.range}
      </WikiProperty>}
      {currentObject.actions && <WikiProperty l10n={l10n} title="actions">
        {currentObject.actions}
      </WikiProperty>}
      <PrerequisitesText {...props} entry={currentObject} />
      <Markdown source={costText} />
            {source_elem}
    </WikiBoxTemplate>
  )
}

const getCost =
  (l10n: L10nRecord) =>
  (x: Activatable) => {
    const apValue = AcA.apValue (x)
    const apValueAppend = AcA.apValueAppend (x)
    const mcost = AcA.cost (x)

    return pipe_ (
      `**${translate (l10n) ("apvalue")}:** `,
      str => {
        if (isJust (apValue)) {
          return `${str}${fromJust (apValue)}`
        }

        const ap_str = translate (l10n) ("adventurepoints")

        if (isJust (mcost)) {
          const cost = fromJust (mcost)

          if (isList (cost)) {
            const abs_cost =
              AcA.category (x) === Categories.DISADVANTAGES
                ? map (negate) (cost)
                : cost

            const level_str = translate (l10n) ("level")

            const level_nums =
              pipe_ (abs_cost, imap (pipe (toRomanFromIndex, cnst)), intercalate ("/"))

            const level_costs = intercalate ("/") (abs_cost)

            return `${str}${level_str} ${level_nums}: ${level_costs} ${ap_str}`
          }
          else {
            const abs_cost = AcA.category (x) === Categories.DISADVANTAGES ? -cost : cost

            const plain_str = `${str}${abs_cost} ${ap_str}`

            return isJust (AcA.tiers (x))
              ? `${plain_str} ${translate (l10n) ("perlevel")}`
              : plain_str
          }
        }

        return str
      },
      maybe (ident as ident<string>)
            ((str: string) => flip (appendStr) (` ${str}`))
            (apValueAppend)
    )
  }

export interface PrerequisitesTextProps {
  entry: ActivatableInstance
  dependent: DependentInstancesState
  locale: UIMessages
  wiki: WikiState
}

export function PrerequisitesText (props: PrerequisitesTextProps): JSX.Element {
  const { entry, locale } = props

  if (typeof entry.prerequisitesText === "string") {
    return <Markdown source={`**${translate(locale, "info.prerequisites")}:** ${entry.prerequisitesText}`} />
  }

  const { prerequisitesTextEnd, prerequisitesTextStart, tiers = 1, reqs } = entry

  if (!Array.isArray(reqs)) {
    const tiersArr = Array.from({ length: tiers }, (_, index) => index + 1)
    return <p>
      <span>{translate(locale, "info.prerequisites")}</span>
      <span>
        {prerequisitesTextStart && <Markdown source={prerequisitesTextStart} oneLine="span" />}
        {!reqs.has(1) && `${translate(locale, "tier")} I: ${translate(locale, "info.none")} `}
        {tiersArr.map(e => {
          return <span key={e} className="tier">
            {`${translate(locale, "tier")} ${getRoman(e)}: `}
            {reqs.has(e) && <Prerequisites {...props} list={reqs.get(e)!} prerequisitesTextIndex={entry.prerequisitesTextIndex} />}
            {e > 1 && <span>{entry.name} {getRoman(e - 1)}</span>}
          </span>
        })}
        {prerequisitesTextEnd && <Markdown source={prerequisitesTextEnd} oneLine="span" />}
      </span>
    </p>
  }

  return <p>
    <span>{translate(locale, "info.prerequisites")}</span>
    <span>
      {prerequisitesTextStart && <Markdown source={prerequisitesTextStart} oneLine="span" />}
      <Prerequisites {...props} list={reqs} prerequisitesTextIndex={entry.prerequisitesTextIndex} />
      {prerequisitesTextEnd && (/^(?:|,|\.)/.test(prerequisitesTextEnd) ? <Markdown source={prerequisitesTextEnd} oneLine="fragment" /> : <Markdown source={prerequisitesTextEnd} oneLine="span" />)}
    </span>
  </p>
}

export interface PrerequisitesProps {
  list: ActivatableBasePrerequisites
  entry: ActivatableInstance
  locale: UIMessages
  prerequisitesTextIndex: Map<number, string | false>
  wiki: WikiState
}

export function Prerequisites(props: PrerequisitesProps) {
  const { list, entry, locale, prerequisitesTextIndex, wiki } = props

  if (list.length === 0 && !isExtendedSpecialAbility(entry)) {
    return <React.Fragment>
      {translate(locale, "info.none")}
    </React.Fragment>
  }

  const items = getCategorizedItems(list, prerequisitesTextIndex)

  const {
    rcp,
    casterBlessedOne,
    traditions,
    attributes,
    primaryAttribute,
    skills,
    activeSkills,
    otherActiveSpecialAbilities,
    inactiveSpecialAbilities,
    otherActiveAdvantages,
    inactiveAdvantages,
    activeDisadvantages,
    inactiveDisadvantages,
    race
  } = items

  return <React.Fragment>
    {rcp && getPrerequisitesRCPText(rcp, entry, locale)}
    {getPrerequisitesActivatablesText(casterBlessedOne, wiki, locale)}
    {getPrerequisitesActivatablesText(traditions, wiki, locale)}
    {getPrerequisitesAttributesText(attributes, wiki.attributes, locale)}
    {primaryAttribute && getPrerequisitesPrimaryAttributeText(primaryAttribute, locale)}
    {getPrerequisitesSkillsText(skills, wiki, locale)}
    {getPrerequisitesActivatedSkillsText(activeSkills, wiki, locale)}
    {getPrerequisitesActivatablesText(otherActiveSpecialAbilities, wiki, locale)}
    {getPrerequisitesActivatablesText(inactiveSpecialAbilities, wiki, locale)}
    {getPrerequisitesActivatablesText(otherActiveAdvantages, wiki, locale)}
    {getPrerequisitesActivatablesText(inactiveAdvantages, wiki, locale)}
    {getPrerequisitesActivatablesText(activeDisadvantages, wiki, locale)}
    {getPrerequisitesActivatablesText(inactiveDisadvantages, wiki, locale)}
    {race && getPrerequisitesRaceText(race, wiki.races, locale)}
    {entry.category === Categories.SPECIAL_ABILITIES ? (entry.gr === 11 ? <span>{translate(locale, "appropriatecombatstylespecialability")}</span> : entry.gr === 14 ? <span>{translate(locale, "appropriatemagicalstylespecialability")}</span> : entry.gr === 26 ? <span>{translate(locale, "appropriateblessedstylespecialability")}</span> : "") : ""}
  </React.Fragment>
}

interface ActivatableStringObject {
  id: string
  active: boolean
  value: string
}

type ReplacedPrerequisite<T = RequireActivatable> = Record<T> | string
type ActivatablePrerequisiteObjects = Record<RequireActivatable> | ActivatableStringObject
type PrimaryAttributePrerequisiteObjects = Record<RequirePrimaryAttribute> | string
type IncreasablePrerequisiteObjects = Record<RequireIncreasable> | string
type RacePrerequisiteObjects = Record<RaceRequirement> | string
type RCPPrerequisiteObjects = boolean | string

function isActivatableStringObject(testObj: ActivatablePrerequisiteObjects): testObj is ActivatableStringObject {
  return testObj.hasOwnProperty("id") && testObj.hasOwnProperty("active") && testObj.hasOwnProperty("value")
}

export function getPrerequisitesRCPText(options: RCPPrerequisiteObjects, entry: ActivatableInstance, locale: UIMessages): JSX.Element {
  return <span>
    {typeof options === "string" ? options : translate(locale, "requiresrcp", entry.name, entry.category === Categories.ADVANTAGES ? translate(locale, "advantage") : translate(locale, "disadvantage"))}
  </span>
}

export function getPrerequisitesAttributesText(list: IncreasablePrerequisiteObjects[], attributes: Map<string, Attribute>, locale: UIMessages): JSX.Element {
  return list.length > 0 ? <span>
    {list.map(e => {
      if (typeof e === "string") {
        return e
      }
      const { id, value } = e
      return `${Array.isArray(id) ? id.map(a => attributes.get(a)!.short).join(translate(locale, "info.or")) : attributes.get(id)!.short} ${value}`
    }).join(", ")}
  </span> : <React.Fragment></React.Fragment>
}

export function getPrerequisitesPrimaryAttributeText(primaryAttribute: PrimaryAttributePrerequisiteObjects, locale: UIMessages): JSX.Element {
  return <span>
    {typeof primaryAttribute === "string" ? primaryAttribute : `${translate(locale, "primaryattributeofthetradition")} ${primaryAttribute.value}`}
  </span>
}

export function getPrerequisitesSkillsText(list: IncreasablePrerequisiteObjects[], wiki: WikiState, locale: UIMessages): JSX.Element {
  return list.length > 0 ? <span>
    {sortStrings(list.map(e => {
      if (typeof e === "string") {
        return e
      }
      const { id, value } = e
      return `${Array.isArray(id) ? id.map(a => getWikiEntry(wiki) (a)!.name).join(translate(locale, "info.or")) : getWikiEntry(wiki) (id)!.name} ${value}`
    }), locale.id).intercalate(", ")}
  </span> : <React.Fragment></React.Fragment>
}

const getPrerequisitesActivatedSkillsText =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
    pipe (
      ensure (notNull as notNull<ActivatablePrerequisiteObjects>),
      maybeR (null)
             (pipe (
               map (e => {
                 if (isActivatableStringObject(e)) {
                   return e.value
                 }
                 const { id } = e
                 if (Array.isArray(id)) {
                   const category = getCategoryById(id[0])
                   return `${category === Categories.LITURGIES ? translate(locale, "knowledgeofliturgicalchant") : translate(locale, "knowledgeofspell")} ${id.map(e => getWikiEntry(wiki) (e)!.name).join(translate(locale, "info.or"))}`
                 }
                 const category = getCategoryById(id)
                 return `${category === Categories.LITURGIES ? translate(locale, "knowledgeofliturgicalchant")   : translate(locale, "knowledgeofspell")} ${getWikiEntry(wiki) (id)!.name}`
               }),
               sortStrings (L10n.A.id (l10n)),
               intercalate (", ")
             ))
    )

interface ActivatablePrerequisiteText {
  id: string | NonEmptyList<string>
  active: boolean
  name: string
}

const ActivatablePrerequisiteText =
  fromDefault<ActivatablePrerequisiteText> ({
    id: "",
    active: false,
    name: "",
  })

const APTA = ActivatablePrerequisiteText.A

const getPrerequisitesActivatablesCategoryAdd =
  (l10n: L10nRecord) =>
    pipe (
      getCategoryById,
      Maybe.elemF,
      isCategory =>
        isCategory (Categories.ADVANTAGES)
          ? `${translate (l10n) ("advantage")} `
          : isCategory (Categories.DISADVANTAGES)
          ? `${translate (l10n) ("disadvantage")} `
          : ""
    )

const mapPrerequisitesActivatablesTextElem =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (sid: Maybe<string | number>) =>
  (sid2: Maybe<string | number>) =>
  (level: Maybe<number>) =>
    pipe (
      getWikiEntry (wiki),
      bindF (a => {
        const curr_id = Advantage.AL.id (a)

        const category_add = getPrerequisitesActivatablesCategoryAdd (l10n) (curr_id)

        const mcombined_name =
          getNameCostForWiki (l10n)
                             (wiki)
                             (ActiveObjectWithId ({
                               id: curr_id,
                               sid,
                               sid2,
                               tier: level,
                               index: 0,
                             }))

        return fmapF (mcombined_name)
                     (combined_name =>
                       `${category_add}${ActivatableNameCostA_.name (combined_name)}`)
      })
    )

const getPrerequisitesActivatablesText =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
    pipe (
      map ((x: ActivatablePrerequisiteObjects) => {
        if (RequireActivatable.is (x)) {
          const id = RequireActivatable.A.id (x)
          const active = RequireActivatable.A.active (x)
          const msid = RequireActivatable.A.sid (x)
          const sid2 = RequireActivatable.A.sid2 (x)
          const level = RequireActivatable.A.tier (x)

          const name =
            pipe_ (
              msid,
              bindF (ensure ((a): a is string | number => !isList (a))),
              sid => isList (id)
                           ? pipe_ (
                               id,
                               mapMaybe (mapPrerequisitesActivatablesTextElem (l10n)
                                                                              (wiki)
                                                                              (sid)
                                                                              (sid2)
                                                                              (level)),
                               localizeOrList (l10n)
                             )
                           : fromMaybe ("")
                                       (mapPrerequisitesActivatablesTextElem (l10n)
                                                                             (wiki)
                                                                             (sid)
                                                                             (sid2)
                                                                             (level)
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
          const category_add = getPrerequisitesActivatablesCategoryAdd (l10n) (id)

          return ActivatablePrerequisiteText ({
            id,
            active,
            name: `${category_add}${value}`,
          })
        }
      }),
      sortRecordsByName (L10n.A.id (l10n)),
      map (x => {
        const id = APTA.id (x)
        const name = APTA.name (x)
        const active = APTA.active (x)

        return (
          <span key={notNullStr (name) ? name : isString (id) ? id : ""}>
            <span className={classNames (!active ? "disabled" : undefined)}>{name}</span>
          </span>
        )
      })
    )

const getPrerequisitesRaceText =
  (l10n: L10nRecord) =>
  (races: OrderedMap<string, Record<Race>>) =>
  (race: RacePrerequisiteObjects) => {
    if (isString (race)) {
      return <span>{race}</span>
    }

    const race_tag = translate (l10n) ("race")

    const value = RaceRequirement.A.value (race)

    if (isList (value)) {
      const curr_races =
        pipe_ (
          value,
          mapMaybe (pipe (prefixRace, lookupF (races), fmap (Race.A.name))),
          localizeOrList (l10n)
        )

      return <span>{`${race_tag} ${curr_races}`}</span>
    }
    else {
      const curr_race = pipe_ (value, prefixRace, lookupF (races), maybe ("") (Race.A.name))

      return <span>{`${race_tag} ${curr_race}`}</span>
    }
  }

interface CategorizedItems {
  rcp: RCPPrerequisiteObjects
  casterBlessedOne: List<ActivatablePrerequisiteObjects>
  traditions: List<ActivatablePrerequisiteObjects>
  attributes: List<ReplacedPrerequisite<RequireIncreasable>>
  primaryAttribute: Maybe<ReplacedPrerequisite<RequirePrimaryAttribute>>
  skills: List<ReplacedPrerequisite<RequireIncreasable>>
  activeSkills: List<ActivatablePrerequisiteObjects>
  otherActiveSpecialAbilities: List<ActivatablePrerequisiteObjects>
  inactiveSpecialAbilities: List<ActivatablePrerequisiteObjects>
  otherActiveAdvantages: List<ActivatablePrerequisiteObjects>
  inactiveAdvantages: List<ActivatablePrerequisiteObjects>
  activeDisadvantages: List<ActivatablePrerequisiteObjects>
  inactiveDisadvantages: List<ActivatablePrerequisiteObjects>
  race: Maybe<RacePrerequisiteObjects>
}

const CategorizedItems =
  fromDefault<CategorizedItems> ({
    rcp: false,
    casterBlessedOne: List (),
    traditions: List (),
    attributes: List (),
    primaryAttribute: Nothing,
    skills: List (),
    activeSkills: List (),
    otherActiveSpecialAbilities: List (),
    inactiveSpecialAbilities: List (),
    otherActiveAdvantages: List (),
    inactiveAdvantages: List (),
    activeDisadvantages: List (),
    inactiveDisadvantages: List (),
    race: Nothing,
  })

const CIA = CategorizedItems.A
const CIL = makeLenses (CategorizedItems)

const isCasterOrBlessedOneId = (x: string) => x === "ADV_12" || x === "ADV_50"
const isTraditionId = (x: string) => isMagicalTraditionId (x) || isBlessedTraditionId (x)

const getActivatablePrerequisite =
  (index_special: Maybe<string | false>) =>
  (e: Record<RequireActivatable>) =>
    fromMaybe<ActivatablePrerequisiteObjects> (e)
                                              (liftM2 ((safe_id: string) =>
                                                       (value: string): ActivatableStringObject =>
                                                         ({
                                                           id: safe_id,
                                                           active: RequireActivatable.A.active (e),
                                                           value,
                                                         }))
                                                      (ensure (isString)
                                                              (RequireActivatable.A.id (e)))
                                                      (misStringM (index_special)))

export const getCategorizedItems =
  (req_text_index: OrderedMap<number, string | false>) =>
  // tslint:disable-next-line: cyclomatic-complexity
  ifoldr (i => (e: AllRequirements): ident<Record<CategorizedItems>> => {
           const index_special = lookup (i) (req_text_index)

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

             return over (isCategory (Categories.ATTRIBUTES) ? CIL.attributes : CIL.skills)
                         (consF (fromMaybe<InRecord> (e) (misStringM (index_special))))
           }

           if (RequireActivatable.is (e)) {
             const id = RequireActivatable.A.id (e)
             const mcategory = isList (id) ? getCategoryById (head (id)) : getCategoryById (id)
             const isCategory = Maybe.elemF (mcategory)
             const addEntry = consF (getActivatablePrerequisite (index_special) (e))

             if (isCategory (Categories.LITURGIES) || isCategory (Categories.SPELLS)) {
               return over (CIL.activeSkills) (addEntry)
             }

             if (isList (id) ? any (isCasterOrBlessedOneId) (id) : isCasterOrBlessedOneId (id)) {
               return over (CIL.casterBlessedOne) (addEntry)
             }

             if (isList (id) ? any (isTraditionId) (id) : isTraditionId (id)) {
               return over (CIL.traditions) (addEntry)
             }

             const isActive = RequireActivatable.A.active (e)

             if (isCategory (Categories.SPECIAL_ABILITIES)) {
               return over (isActive
                             ? CIL.otherActiveSpecialAbilities
                             : CIL.inactiveSpecialAbilities)
                           (addEntry)
             }

             if (isCategory (Categories.ADVANTAGES)) {
               return over (isActive ? CIL.otherActiveAdvantages : CIL.inactiveAdvantages)
                           (addEntry)
             }

             if (isCategory (Categories.DISADVANTAGES)) {
               return over (isActive ? CIL.activeDisadvantages : CIL.inactiveDisadvantages)
                           (addEntry)
             }
           }

           return ident
         })
         (CategorizedItems.default)
