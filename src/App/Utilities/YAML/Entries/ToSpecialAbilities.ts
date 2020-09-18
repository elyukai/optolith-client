import { SpecialAbilityL10n } from "../../../../../app/Database/Schema/SpecialAbilities/SpecialAbilities.l10n"
import { SpecialAbilityUniv } from "../../../../../app/Database/Schema/SpecialAbilities/SpecialAbilities.univ"
import { bindF, fromRight_, isLeft, Right, second } from "../../../../Data/Either"
import { fromArray, List, map, notNull } from "../../../../Data/List"
import { ensure, Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { elems, fromMap, OrderedMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { SpecialAbilityId } from "../../../Constants/Ids"
import { ArcaneBardTradition } from "../../../Models/Wiki/ArcaneBardTradition"
import { ArcaneDancerTradition } from "../../../Models/Wiki/ArcaneDancerTradition"
import { Blessing } from "../../../Models/Wiki/Blessing"
import { Cantrip } from "../../../Models/Wiki/Cantrip"
import { CombatTechnique } from "../../../Models/Wiki/CombatTechnique"
import { LiturgicalChant } from "../../../Models/Wiki/LiturgicalChant"
import { Skill } from "../../../Models/Wiki/Skill"
import { SpecialAbility, SpecialAbilityCombatTechniques } from "../../../Models/Wiki/SpecialAbility"
import { Spell } from "../../../Models/Wiki/Spell"
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption"
import { pipe, pipe_ } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdownM } from "./ToMarkdown"
import { getPrerequisitesIndex, toLevelPrerequisites } from "./ToPrerequisites"
import { mergeSOs, resolveSOCats } from "./ToSelectOptions"
import { toSourceRefs } from "./ToSourceRefs"


const ABTA = ArcaneBardTradition.A
const ADTA = ArcaneDancerTradition.A


const toSA = (
  arcaneBardTraditions: OrderedMap<number, Record<ArcaneBardTradition>>,
  arcaneDancerTraditions: OrderedMap<number, Record<ArcaneDancerTradition>>,
  blessings: OrderedMap<string, Record<Blessing>>,
  cantrips: OrderedMap<string, Record<Cantrip>>,
  combatTechniques: OrderedMap<string, Record<CombatTechnique>>,
  liturgicalChants: OrderedMap<string, Record<LiturgicalChant>>,
  skills: OrderedMap<string, Record<Skill>>,
  spells: OrderedMap<string, Record<Spell>>,
  spell_enhancements: OrderedMap<number, Record<SelectOption>>,
  lc_enhancements: OrderedMap<number, Record<SelectOption>>
): YamlPairConverterE<SpecialAbilityUniv, SpecialAbilityL10n, string, SpecialAbility> =>
  ([ univ, l10n ]) => {
    const src = toSourceRefs (l10n.src)

    const eselectOptions = univ.id === SpecialAbilityId.SpellEnhancement
                           ? Right (ensure (notNull) (elems (spell_enhancements)))
                           : univ.id === SpecialAbilityId.ChantEnhancement
                           ? Right (ensure (notNull) (elems (lc_enhancements)))
                           : univ.id === SpecialAbilityId.TraditionArcaneBard
                           ? Right (pipe_ (
                               arcaneBardTraditions,
                               elems,
                               map (tradition => SelectOption ({
                                 id: ABTA.id (tradition),
                                 name: ABTA.name (tradition),
                                 prerequisites: Just (ABTA.prerequisites (tradition)),
                                 src,
                                 errata: List (),
                               })),
                               ensure (notNull)
                             ))
                           : univ.id === SpecialAbilityId.TraditionArcaneDancer
                           ? Right (pipe_ (
                               arcaneDancerTraditions,
                               elems,
                               map (tradition => SelectOption ({
                                 id: ADTA.id (tradition),
                                 name: ADTA.name (tradition),
                                 prerequisites: Just (ADTA.prerequisites (tradition)),
                                 src,
                                 errata: List (),
                               })),
                               ensure (notNull)
                             ))
                           : pipe_ (
                               univ.selectOptionCategories,
                               resolveSOCats (blessings)
                                             (cantrips)
                                             (combatTechniques)
                                             (liturgicalChants)
                                             (skills)
                                             (spells),
                               mergeSOs (l10n.selectOptions)
                                        (univ.selectOptions),
                               second (ensure (notNull))
                             )

    if (isLeft (eselectOptions)) {
      return eselectOptions
    }

    const selectOptions = fromRight_ (eselectOptions)

    const prerequisitesIndex = getPrerequisitesIndex (
                                 univ.prerequisitesIndex,
                                 l10n.prerequisitesIndex
                               )

    return Right<[string, Record<SpecialAbility>]> ([
      univ.id,
      SpecialAbility ({
        id: univ.id,
        name: l10n.name,
        nameInWiki: Maybe (l10n.nameInWiki),
        cost: typeof univ.cost === "object"
              ? Just (fromArray (univ.cost))
              : Maybe (univ.cost),
        input: Maybe (l10n.input),
        max: Maybe (univ.max),
        prerequisites: toLevelPrerequisites (univ),
        prerequisitesText: Maybe (l10n.prerequisites),
        prerequisitesTextIndex: prerequisitesIndex,
        prerequisitesTextStart: Maybe (l10n.prerequisitesStart),
        prerequisitesTextEnd: Maybe (l10n.prerequisitesEnd),
        tiers: Maybe (univ.levels),
        select: selectOptions,
        gr: univ.gr,
        extended: typeof univ.extended === "object"
                  ? pipe_ (
                     univ.extended,
                     fromArray,
                     map (x => typeof x === "object" ? fromArray (x) : x),
                     Just
                   )
                  : Nothing,
        subgr: Maybe (univ.subgr),
        combatTechniques: typeof univ.combatTechniques === "object"
                          ? Just (SpecialAbilityCombatTechniques ({
                                    explicitIds: fromArray (univ.combatTechniques),
                                    group: Nothing,
                                    customText: Maybe (l10n.combatTechniques),
                                  }))
                          : typeof univ.combatTechniques === "string"
                          ? Just (SpecialAbilityCombatTechniques ({
                                    explicitIds: Nothing,
                                    group: univ.combatTechniques,
                                    customText: Maybe (l10n.combatTechniques),
                                  }))
                          : typeof l10n.combatTechniques === "string"
                          ? Just (SpecialAbilityCombatTechniques ({
                                    explicitIds: Nothing,
                                    group: Nothing,
                                    customText: Maybe (l10n.combatTechniques),
                                  }))
                          : Nothing,
        rules: toMarkdownM (Maybe (l10n.rules)),
        effect: toMarkdownM (Maybe (l10n.effect)),
        volume: Maybe (l10n.volume),
        penalty: Maybe (l10n.penalty),
        aeCost: Maybe (l10n.aeCost),
        protectiveCircle: Maybe (l10n.protectiveCircle),
        wardingCircle: Maybe (l10n.wardingCircle),
        bindingCost: Maybe (l10n.bindingCost),
        property: Maybe (univ.property),
        aspect: Maybe (univ.aspect),
        apValue: Maybe (l10n.apValue),
        apValueAppend: Maybe (l10n.apValueAppend),
        brew: Maybe (univ.brew),
        src,
        errata: toErrata (l10n.errata),
        category: Nothing,
      }),
    ])
  }


export const toSpecialAbilities = (
  arcaneBardTraditions: OrderedMap<number, Record<ArcaneBardTradition>>,
  arcaneDancerTraditions: OrderedMap<number, Record<ArcaneDancerTradition>>,
  blessings: OrderedMap<string, Record<Blessing>>,
  cantrips: OrderedMap<string, Record<Cantrip>>,
  combatTechniques: OrderedMap<string, Record<CombatTechnique>>,
  liturgicalChants: OrderedMap<string, Record<LiturgicalChant>>,
  skills: OrderedMap<string, Record<Skill>>,
  spells: OrderedMap<string, Record<Spell>>,
  spell_enhancements: OrderedMap<number, Record<SelectOption>>,
  lc_enhancements: OrderedMap<number, Record<SelectOption>>
): YamlFileConverter<string, Record<SpecialAbility>> =>
  pipe (
    (yaml_mp: YamlNameMap) =>
      zipBy ("id")
            (yaml_mp.SpecialAbilitiesUniv)
            (yaml_mp.SpecialAbilitiesL10nDefault)
            (yaml_mp.SpecialAbilitiesL10nOverride),
    bindF (pipe (
      mapM (toSA (
              arcaneBardTraditions,
              arcaneDancerTraditions,
              blessings,
              cantrips,
              combatTechniques,
              liturgicalChants,
              skills,
              spells,
              spell_enhancements,
              lc_enhancements
            )),
      bindF (toMapIntegrity),
    )),
    second (fromMap)
  )
