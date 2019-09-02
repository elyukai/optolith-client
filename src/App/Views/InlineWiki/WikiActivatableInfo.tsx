import * as React from "react";
import { Either, eitherToMaybe, invertEither, Left, Right } from "../../../Data/Either";
import { cnst, flip, ident, join } from "../../../Data/Function";
import { fmap, fmapF } from "../../../Data/Functor";
import { rangeN } from "../../../Data/Ix";
import { over, set } from "../../../Data/Lens";
import { any, append, appendStr, consF, elem, fnull, head, ifoldr, imap, intercalate, intersperse, isList, List, map, NonEmptyList, notNull, notNullStr, snoc, snocF, subscript, toArray } from "../../../Data/List";
import { bind, bindF, catMaybes, ensure, fromJust, fromMaybe, isJust, isNothing, joinMaybeList, Just, liftM2, mapMaybe, maybe, Maybe, maybeR, maybeRNull, maybeRNullF, Nothing } from "../../../Data/Maybe";
import { dec, negate } from "../../../Data/Num";
import { isOrderedMap, lookup, lookupF, notMember, OrderedMap } from "../../../Data/OrderedMap";
import { fromDefault, makeLenses, Record, RecordI, RecordIBase } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { SpecialAbilityGroup } from "../../Constants/Groups";
import { SpecialAbilityId } from "../../Constants/Ids";
import { ActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId";
import { ActivatableNameCost, ActivatableNameCostA_ } from "../../Models/View/ActivatableNameCost";
import { Advantage } from "../../Models/Wiki/Advantage";
import { Attribute } from "../../Models/Wiki/Attribute";
import { Book } from "../../Models/Wiki/Book";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { RequireActivatable } from "../../Models/Wiki/prerequisites/ActivatableRequirement";
import { RequireIncreasable } from "../../Models/Wiki/prerequisites/IncreasableRequirement";
import { RequirePrimaryAttribute } from "../../Models/Wiki/prerequisites/PrimaryAttributeRequirement";
import { RaceRequirement } from "../../Models/Wiki/prerequisites/RaceRequirement";
import { Profession } from "../../Models/Wiki/Profession";
import { Race } from "../../Models/Wiki/Race";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { SelectOption } from "../../Models/Wiki/sub/SelectOption";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Activatable, AllRequirements } from "../../Models/Wiki/wikiTypeHelpers";
import { getNameCostForWiki } from "../../Utilities/Activatable/activatableActiveUtils";
import { getName } from "../../Utilities/Activatable/activatableNameUtils";
import { isExtendedSpecialAbility } from "../../Utilities/Activatable/checkStyleUtils";
import { putLevelName } from "../../Utilities/AdventurePoints/activatableCostUtils";
import { nbsp } from "../../Utilities/Chars";
import { localizeOrList, translate, translateP } from "../../Utilities/I18n";
import { getCategoryById, isBlessedTraditionId, isMagicalTraditionId, prefixRace } from "../../Utilities/IDUtils";
import { toRoman, toRomanFromIndex } from "../../Utilities/NumberUtils";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { renderMaybe } from "../../Utilities/ReactUtils";
import { sortRecordsByName, sortStrings } from "../../Utilities/sortBy";
import { isNumber, isString, misNumberM, misStringM } from "../../Utilities/typeCheckUtils";
import { getWikiEntry } from "../../Utilities/WikiUtils";
import { Markdown } from "../Universal/Markdown";
import { WikiCombatTechniques } from "./Elements/WikiCombatTechniques";
import { WikiSource } from "./Elements/WikiSource";
import { WikiBoxTemplate } from "./WikiBoxTemplate";
import { WikiProperty } from "./WikiProperty";

export interface WikiActivatableInfoProps {
  attributes: OrderedMap<string, Record<Attribute>>
  books: OrderedMap<string, Record<Book>>
  wiki: WikiModelRecord
  x: Activatable
  l10n: L10nRecord
  specialAbilities: OrderedMap<string, Record<SpecialAbility>>
}

const AcA = { ...Advantage.AL, ...SpecialAbility.AL }
const SAA = SpecialAbility.A
const RAA = RequireActivatable.A
const RAAL = RequireActivatable.AL
const RIA = RequireIncreasable.A
const RPAA = RequirePrimaryAttribute.A
const AAL = Advantage.AL
const WA = WikiModel.A

export function WikiActivatableInfo (props: WikiActivatableInfoProps) {
  const { x, l10n, specialAbilities, wiki } = props

  const cost = getCost (l10n) (x)
  const cost_elem = <Markdown source={cost} />

  const source_elem = <WikiSource<RecordI<Activatable>> {...props} acc={AcA} />

  if (SpecialAbility.is (x)) {
    const header_name_levels =
      maybe ("")
            ((levels: number) => levels < 2 ? " I" : ` I-${toRoman (levels)}`)
            (SAA.tiers (x))

    const header_full_name = fromMaybe (SAA.name (x)) (SAA.nameInWiki (x))

    const header_name = `${header_full_name}${header_name_levels}`

    const header_sub_name =
      maybeR (null)
             ((subgr: string) => (
               <p className="title">
                 {subgr}
               </p>
             ))
             (bind (SAA.subgr (x))
                   (pipe (dec, subscript (translate (l10n) ("combatspecialabilitygroups")))))

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
                           <Markdown source={`**${translate (l10n) ("effect")}:** ${str}`} />
                         ))}
            {maybeRNullF (SAA.volume (x))
                         (str => (
                           <WikiProperty l10n={l10n} title="volume">
                             {str}
                           </WikiProperty>
                         ))}
            {maybeRNullF (SAA.aeCost (x))
                         (str => (
                           <WikiProperty l10n={l10n} title="aecost">
                             {str}
                           </WikiProperty>
                         ))}
            {isNothing (SAA.aeCost (x)) && isNothing (SAA.bindingCost (x))
              ? <WikiProperty l10n={l10n} title="aecost">{translate (l10n) ("none")}</WikiProperty>
              : null}
            {maybeRNullF (SAA.bindingCost (x))
                         (str => (
                           <WikiProperty l10n={l10n} title="bindingcost">
                             {str}
                           </WikiProperty>
                         ))}
            {maybeRNullF (bind (misNumberM (SAA.property (x)))
                               (pipe (dec, subscript (translate (l10n) ("propertylist")))))
                         (str => (
                           <WikiProperty l10n={l10n} title="property">
                             {str}
                           </WikiProperty>
                         ))}
            <PrerequisitesText {...props} />
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
                           <Markdown source={`**${translate (l10n) ("effect")}:** ${str}`} />
                         ))}
            {maybeRNullF (SAA.aspect (x))
                         (aspect => (
                           <WikiProperty l10n={l10n} title="aspect">
                             {isNumber (aspect)
                               ? fromMaybe ("")
                                           (subscript (translate (l10n) ("aspectlist"))
                                                      (aspect - 1))
                               : aspect}
                           </WikiProperty>
                         ))}
            <PrerequisitesText {...props} />
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
            <WikiProperty l10n={l10n} title="aecost">
              {renderMaybe (SAA.aeCost (x))}
            </WikiProperty>
            <WikiProperty l10n={l10n} title="protectivecircle">
              {renderMaybe (SAA.protectiveCircle (x))}
            </WikiProperty>
            <WikiProperty l10n={l10n} title="wardingcircle">
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
            <PrerequisitesText {...props} />
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
                           <Markdown source={`**${translate (l10n) ("rules")}:** ${str}`} />
                         ))}
            {maybeRNullF (SAA.extended (x))
                         (es => {
                           const tag = translate (l10n) ("extendedcombatspecialabilities")
                           const names = pipe_ (
                            es,
                            mapMaybe (pipe (
                              ensure (isString),
                              bindF (lookupF (specialAbilities)),
                              fmap (SAA.name)
                            )),
                            sortStrings (L10n.A.id (l10n)),
                            intercalate (", ")
                           )

                           return (
                             <Markdown source={`**${tag}:** ${names}`} />
                           )
                         })}
            {maybeRNullF (SAA.penalty (x))
                         (str => (
                           <Markdown source={`**${translate (l10n) ("penalty")}:** ${str}`} />
                         ))}
            <WikiCombatTechniques
              acc={SAA}
              combatTechniques={WA.combatTechniques (wiki)}
              l10n={l10n}
              x={x}
              />
            <PrerequisitesText {...props} />
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
                           <Markdown source={`**${translate (l10n) ("rules")}:** ${str}`} />
                         ))}
            {maybeRNullF (SAA.extended (x))
                         (es => {
                           const tag = translate (l10n) ("extendedmagicalspecialabilities")
                           const names = pipe_ (
                            es,
                            mapMaybe (pipe (
                              ensure (isString),
                              bindF (lookupF (specialAbilities)),
                              fmap (SAA.name)
                            )),
                            sortStrings (L10n.A.id (l10n)),
                            intercalate (", ")
                           )

                           return (
                             <Markdown source={`**${tag}:** ${names}`} />
                           )
                         })}
            <PrerequisitesText {...props} />
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
                           <Markdown source={`**${translate (l10n) ("rules")}:** ${str}`} />
                         ))}
            {maybeRNullF (SAA.extended (x))
                         (pipe (
                           mapMaybe (pipe (
                             ensure (isString),
                             bindF (lookupF (specialAbilities)),
                             fmap (SAA.name)
                           )),
                           append (mapMaybe (pipe (
                                              getNameCostForWiki (l10n) (wiki),
                                              fmap (ActivatableNameCostA_.name)
                                            ))
                                            (add_extended)),
                           sortStrings (L10n.A.id (l10n)),
                           intercalate (", "),
                           str => {
                             const tag = translate (l10n) ("extendedblessedtspecialabilities")

                             return (
                               <Markdown source={`**${tag}:** ${str}`} />
                             )
                           }
                         ))}
            <PrerequisitesText {...props} />
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
                           <Markdown source={`**${translate (l10n) ("rules")}:** ${str}`} />
                         ))}
            {maybeRNullF (SAA.extended (x))
                         (es => {
                           const tag = translate (l10n) ("extendedskillspecialabilities")
                           const names = pipe_ (
                            es,
                            mapMaybe (pipe (
                              ensure (isString),
                              bindF (lookupF (specialAbilities)),
                              fmap (SAA.name)
                            )),
                            sortStrings (l10n),
                            intercalate (", ")
                           )

                           return (
                             <Markdown source={`**${tag}:** ${names}`} />
                           )
                         })}
            <PrerequisitesText {...props} />
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
                            <Markdown source={`**${translate (l10n) ("effect")}:** ${str}`} />
                          ))}
            {maybeRNullF (SAA.volume (x))
                          (str => (
                            <WikiProperty l10n={l10n} title="volume">
                              {str}
                            </WikiProperty>
                          ))}
            {maybeRNullF (bind (misNumberM (SAA.brew (x)))
                                (pipe (dec, subscript (translate (l10n) ("brews")))))
                          (str => (
                            <WikiProperty l10n={l10n} title="brew">
                              {str}
                            </WikiProperty>
                          ))}
            {maybeRNullF (SAA.aeCost (x))
                          (str => (
                            <WikiProperty l10n={l10n} title="aecost">
                              {str}
                            </WikiProperty>
                          ))}
            {isNothing (SAA.aeCost (x)) && isNothing (SAA.bindingCost (x))
              ? <WikiProperty l10n={l10n} title="aecost">{translate (l10n) ("none")}</WikiProperty>
              : null}
            {maybeRNullF (SAA.bindingCost (x))
                          (str => (
                            <WikiProperty l10n={l10n} title="bindingcost">
                              {str}
                            </WikiProperty>
                          ))}
            {maybeRNullF (bind (misNumberM (SAA.property (x)))
                                (pipe (dec, subscript (translate (l10n) ("propertylist")))))
                          (str => (
                            <WikiProperty l10n={l10n} title="property">
                              {str}
                            </WikiProperty>
                          ))}
            <PrerequisitesText {...props} />
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
            {maybeRNullF (SAA.effect (x))
                         (str => (
                           <Markdown source={`**${translate (l10n) ("effect")}:** ${str}`} />
                         ))}
            <PrerequisitesText {...props} />
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
                           <Markdown source={`**${translate (l10n) ("rules")}:** ${str}`} />
                         ))}
            {maybeRNullF (SAA.effect (x))
                         (str => (
                           <Markdown source={`**${translate (l10n) ("effect")}:** ${str}`} />
                         ))}
            {maybeRNullF (SAA.penalty (x))
                         (str => (
                           <Markdown source={`**${translate (l10n) ("penalty")}:** ${str}`} />
                         ))}
            <WikiCombatTechniques
              acc={SAA}
              combatTechniques={WA.combatTechniques (wiki)}
              l10n={l10n}
              x={x}
              />
            {maybeRNullF (SAA.aeCost (x))
                         (str => (
                           <WikiProperty l10n={l10n} title="aecost">
                             {str}
                           </WikiProperty>
                         ))}
            <PrerequisitesText {...props} />
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
                           <Markdown source={`**${translate (l10n) ("rules")}:** ${str}`} />
                         ))}
            {maybeRNullF (SAA.effect (x))
                         (str => (
                           <Markdown source={`**${translate (l10n) ("effect")}:** ${str}`} />
                         ))}
            {maybeRNullF (SAA.penalty (x))
                         (str => (
                           <Markdown source={`**${translate (l10n) ("penalty")}:** ${str}`} />
                         ))}
            {maybeRNullF (SAA.aeCost (x))
                         (str => (
                           <WikiProperty l10n={l10n} title="aecost">
                             {str}
                           </WikiProperty>
                         ))}
            <PrerequisitesText {...props} />
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

    return (
      <WikiBoxTemplate className="disadv" title={header_name}>
        <Markdown source={`**${translate (l10n) ("rules")}:** ${AAL.rules (x)}`} />
        {maybeRNullF (AcA.range (x))
                     (str => (
                       <WikiProperty l10n={l10n} title="range">
                         {str}
                       </WikiProperty>
                     ))}
        {maybeRNullF (AcA.actions (x))
                     (str => (
                       <WikiProperty l10n={l10n} title="actions">
                         {str}
                       </WikiProperty>
                     ))}
        <PrerequisitesText {...props} />
        {cost_elem}
        {source_elem}
      </WikiBoxTemplate>
    )
  }
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

          const abs_cost = AcA.category (x) === Categories.DISADVANTAGES ? -cost : cost

          const plain_str = `${str}${abs_cost} ${ap_str}`

          return isJust (AcA.tiers (x))
            ? `${plain_str} ${translate (l10n) ("perlevel")}`
            : plain_str
        }

        return str
      },
      maybe (ident as ident<string>)
            ((str: string) => flip (appendStr) (` ${str}`))
            (apValueAppend)
    )
  }

export interface PrerequisitesTextProps {
  x: Activatable
  l10n: L10nRecord
  wiki: WikiModelRecord
}

export function PrerequisitesText (props: PrerequisitesTextProps) {
  const { x, l10n } = props

  const prerequisitesText = AAL.prerequisitesText (x)
  const prerequisitesTextIndex = AAL.prerequisitesTextIndex (x)

  if (isJust (prerequisitesText)) {
    return (
      <Markdown
        source={`**${translate (l10n) ("prerequisites")}:** ${fromJust (prerequisitesText)}`}
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
        <span>{translate (l10n) ("prerequisites")}: </span>
        <span>
          {pipe_ (
            List<Maybe<TypeofList>> (
              mtext_before,
              notMember (1) (prerequisites)
                ? Just (`${translate (l10n) ("level")} I: ${translate (l10n) ("none")} `)
                : Nothing,
              ...map ((lvl: number) => {
                  const prereqForLevel = lookup (lvl) (prerequisites)
                  const not_empty = Maybe.any (notNull) (prereqForLevel)

                  const level_num_str = `${translate (l10n) ("level")} ${toRoman (lvl)}: `

                  const requires_last_str =
                    lvl > 1
                    ? `${not_empty ? ", " : ""}${AAL.name (x)}${nbsp}${toRoman (lvl - 1)}`
                    : ""

                  return Just (
                    <React.Fragment key={lvl}>
                      {level_num_str}
                      {maybeRNull ((rs: List<AllRequirements>) =>
                                    pipe_ (
                                      getPrerequisites (rs) (prerequisitesTextIndex) (props),
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
            maybeR (translate (l10n) ("none")) (toArray)
          )}
        </span>
      </p>
    )
  }
  else {
    return (
      <p>
        <span>{translate (l10n) ("prerequisites")}: </span>
        <span>
          {pipe_ (
            getPrerequisites (prerequisites) (prerequisitesTextIndex) (props),
            consF<TypeofMaybeList> (mtext_before),
            snocF<TypeofMaybeList> (mtext_after_insidelist),
            catMaybes,
            intersperse<JSX.Element | string> (", "),
            addTextAfterOutsideList,
            ensure (notNull),
            maybeR (translate (l10n) ("none")) (toArray)
          )}
        </span>
      </p>
    )
  }
}

export interface PrerequisitesProps {
  x: Activatable
  l10n: L10nRecord
  wiki: WikiModelRecord
}

const getPrerequisites =
  (rs: List<AllRequirements>) =>
  (req_text_index: OrderedMap<number, string | false>) =>
  (props: PrerequisitesProps): List<Maybe<JSX.Element | string>> => {
    const { x, l10n, wiki } = props

    if (fnull (rs) && !isExtendedSpecialAbility (x)) {
      return List<Maybe<JSX.Element | string>> (
        Just (translate (l10n) ("none"))
      )
    }

    const items = getCategorizedItems (req_text_index) (rs)

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

    const category = AAL.category (x)
    const gr = AAL.gr (x)

    return List<Maybe<JSX.Element | string>> (
      (isString (rcp) ? notNullStr (rcp) : rcp)
        ? Just (getPrerequisitesRCPText (l10n) (x) (rcp))
        : Nothing,
      ...getPrerequisitesActivatablesText (l10n) (wiki) (casterBlessedOne),
      ...getPrerequisitesActivatablesText (l10n) (wiki) (traditions),
      getPrerequisitesAttributesText (l10n) (WikiModel.A.attributes (wiki)) (attributes),
      fmap (getPrerequisitesPrimaryAttributeText (l10n)) (primaryAttribute),
      getPrerequisitesSkillsText (l10n) (wiki) (skills),
      getPrerequisitesActivatedSkillsText (l10n) (wiki) (activeSkills),
      ...getPrerequisitesActivatablesText (l10n) (wiki) (otherActiveSpecialAbilities),
      ...getPrerequisitesActivatablesText (l10n) (wiki) (inactiveSpecialAbilities),
      ...getPrerequisitesActivatablesText (l10n) (wiki) (otherActiveAdvantages),
      ...getPrerequisitesActivatablesText (l10n) (wiki) (inactiveAdvantages),
      ...getPrerequisitesActivatablesText (l10n) (wiki) (activeDisadvantages),
      ...getPrerequisitesActivatablesText (l10n) (wiki) (inactiveDisadvantages),
      fmap (getPrerequisitesRaceText (l10n) (WikiModel.A.races (wiki))) (race),
      category === Categories.SPECIAL_ABILITIES
        ? (gr === 11
          ? Just (translate (l10n) ("appropriatecombatstylespecialability"))
          : gr === 14
          ? Just (translate (l10n) ("appropriatemagicalstylespecialability"))
          : gr === 26
          ? Just (translate (l10n) ("appropriateblessedstylespecialability"))
          : Nothing)
        : Nothing
    )
  }

interface ActivatableStringObject {
  id: string
  active: boolean
  value: string
}

type ReplacedPrerequisite<T extends RecordIBase<any> = RequireActivatable> = Record<T> | string
type ActivatablePrerequisiteObjects = Record<RequireActivatable> | ActivatableStringObject
type PrimaryAttributePrerequisiteObjects = Record<RequirePrimaryAttribute> | string
type IncreasablePrerequisiteObjects = Record<RequireIncreasable> | string
type RacePrerequisiteObjects = Record<RaceRequirement> | string
type RCPPrerequisiteObjects = boolean | string

const getPrerequisitesRCPText =
  (l10n: L10nRecord) =>
  (x: Activatable) =>
  (options: RCPPrerequisiteObjects) => {
    if (isString (options)) {
      return <span>{options}</span>
    }
    else {
      const category = AAL.category (x)
      const name = translateP (l10n)
                              ("racecultureorprofessionrequiresautomaticorsuggested")
                              (List (
                                AAL.name (x),
                                category === Categories.ADVANTAGES
                                  ? translate (l10n) ("advantage")
                                  : translate (l10n) ("disadvantage")
                              ))

      return <span>{name}</span>
    }
  }

const getPrerequisitesAttributesText =
  (l10n: L10nRecord) =>
  (attrs: OrderedMap<string, Record<Attribute>>) => {
    const getAttrAbbrv = pipe (lookupF (attrs), fmap (Attribute.A.short))

    return pipe (
      ensure (notNull as notNull<IncreasablePrerequisiteObjects>),
      fmap (pipe (
        map (e => {
          if (RequireIncreasable.is (e)) {
            const ids = RIA.id (e)
            const value = RIA.value (e)

            if (isList (ids)) {
              const name = pipe_ (ids, mapMaybe (getAttrAbbrv), localizeOrList (l10n))

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
        sortStrings (l10n),
        intercalate (", ")
      ))
    )
  }

const getPrerequisitesPrimaryAttributeText =
  (l10n: L10nRecord) =>
  (x: PrimaryAttributePrerequisiteObjects) => (
    <span>
      {isString (x)
        ? x
        : `${translate (l10n) ("primaryattributeofthetradition")} ${RPAA.value (x)}`}
    </span>
  )

const getPrerequisitesSkillsText =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
    pipe (
      ensure (notNull as notNull<IncreasablePrerequisiteObjects>),
      fmap (pipe (
        map (e => {
          if (RequireIncreasable.is (e)) {
            const ids = RIA.id (e)
            const value = RIA.value (e)

            if (isList (ids)) {
              const name = pipe_ (ids, mapMaybe (getNameById (wiki)), localizeOrList (l10n))

              return `${name} ${value}`
            }
            else {
              const name = pipe_ (ids, getNameById (wiki), fromMaybe (""))

              return `${name} ${value}`
            }
          }
          else {
            return e
          }
        }),
        sortStrings (l10n),
        intercalate (", ")
      ))
    )

const getPrerequisitesActivatedSkillsTextCategoryAdd =
  (l10n: L10nRecord) =>
  (id: string) => {
    const isCategory = Maybe.elemF (getCategoryById (id))

    return isCategory (Categories.LITURGIES)
      ? translate (l10n) ("knowledgeofliturgicalchant")
      : translate (l10n) ("knowledgeofspell")
  }

const getNameById =
  (wiki: WikiModelRecord) =>
    pipe (getWikiEntry (wiki), bindF (pipe (Profession.AL.name, ensure (isString))))

const getPrerequisitesActivatedSkillsText =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
    pipe (
      ensure (notNull as notNull<ActivatablePrerequisiteObjects>),
      fmap (pipe (
        map (e => {
          if (RequireActivatable.is (e)) {
            const ids = RAA.id (e)

            if (isList (ids)) {
              const category_add =
                getPrerequisitesActivatedSkillsTextCategoryAdd (l10n) (head (ids))

              const name = pipe_ (ids, mapMaybe (getNameById (wiki)), localizeOrList (l10n))

              return `${category_add} ${name}`
            }
            else {
              const category_add =
                getPrerequisitesActivatedSkillsTextCategoryAdd (l10n) (ids)

              const name = pipe_ (ids, getNameById (wiki), fromMaybe (""))

              return `${category_add} ${name}`
            }
          }
          else {
            return e .value
          }
        }),
        sortStrings (l10n),
        intercalate (", ")
      ))
    )

interface ActivatablePrerequisiteText {
  "@@name": "ActivatablePrerequisiteText"
  id: string | NonEmptyList<string>
  active: boolean
  name: string
}

const ActivatablePrerequisiteText =
  fromDefault ("ActivatablePrerequisiteText") <ActivatablePrerequisiteText> ({
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
        const curr_id = AAL.id (a)

        const category_add = getPrerequisitesActivatablesCategoryAdd (l10n) (curr_id)

        const active = ActiveObjectWithId ({
          id: curr_id,
          sid,
          sid2,
          tier: level,
          index: 0,
        })

        const mcombined_name =
          fmapF (getName (l10n) (wiki) (active))
                (naming => putLevelName (true)
                                        (l10n)
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
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
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
                               mapMaybe (mapPrerequisitesActivatablesTextElem (l10n)
                                                                              (wiki)
                                                                              (sid)
                                                                              (msid2)
                                                                              (mlevel)),
                               localizeOrList (l10n)
                             )
                           : fromMaybe ("")
                                       (mapPrerequisitesActivatablesTextElem (l10n)
                                                                             (wiki)
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
          const category_add = getPrerequisitesActivatablesCategoryAdd (l10n) (id)

          return ActivatablePrerequisiteText ({
            id,
            active,
            name: `${category_add}${value}`,
          })
        }
      }),
      sortRecordsByName (l10n),
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

const getPrerequisitesRaceText =
  (l10n: L10nRecord) =>
  (races: OrderedMap<string, Record<Race>>) =>
  (race: RacePrerequisiteObjects) => {
    if (isString (race)) {
      return <span>{race}</span>
    }

    const race_tag = translate (l10n) ("race")

    const value = RaceRequirement.A.value (race)
    const active = RaceRequirement.A.active (race)

    if (isList (value)) {
      const curr_races =
        pipe_ (
          value,
          mapMaybe (pipe (prefixRace, lookupF (races), fmap (Race.A.name))),
          localizeOrList (l10n)
        )

      return <span className={active ? "" : "disabled"}>{`${race_tag} ${curr_races}`}</span>
    }
    else {
      const curr_race = pipe_ (value, prefixRace, lookupF (races), maybe ("") (Race.A.name))

      return <span className={active ? "" : "disabled"}>{`${race_tag} ${curr_race}`}</span>
    }
  }

interface CategorizedItems {
  "@@name": "CategorizedItems"
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
  fromDefault ("CategorizedItems") <CategorizedItems> ({
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
                                                           active: RAA.active (e),
                                                           value,
                                                         }))
                                                      (ensure (isString)
                                                              (RAA.id (e)))
                                                      (misStringM (index_special)))

export const getCategorizedItems =
  (req_text_index: OrderedMap<number, string | false>) =>
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
             const id = RAA.id (e)
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

             const isActive = RAA.active (e)

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
