/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { DisadvantageL10n } from "../../../../../app/Database/Schema/Disadvantages/Disadvantages.l10n"
import { DisadvantageUniv } from "../../../../../app/Database/Schema/Disadvantages/Disadvantages.univ"
import { bindF, fromRight_, isLeft, Right, second } from "../../../../Data/Either"
import { append, cons, fromArray, isList, List, notNull } from "../../../../Data/List"
import { ensure, fromMaybe, Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap, insertWith, OrderedMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Blessing } from "../../../Models/Wiki/Blessing"
import { Cantrip } from "../../../Models/Wiki/Cantrip"
import { CombatTechnique } from "../../../Models/Wiki/CombatTechnique"
import { Disadvantage } from "../../../Models/Wiki/Disadvantage"
import { LiturgicalChant } from "../../../Models/Wiki/LiturgicalChant"
import { Skill } from "../../../Models/Wiki/Skill"
import { Spell } from "../../../Models/Wiki/Spell"
import { AllRequirements } from "../../../Models/Wiki/wikiTypeHelpers"
import { pipe, pipe_ } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdown } from "./ToMarkdown"
import { getPrerequisitesIndex, toLevelPrerequisites } from "./ToPrerequisites"
import { mergeSOs, resolveSOCats } from "./ToSelectOptions"
import { toSourceRefs } from "./ToSourceRefs"


const toDisadv = (
  blessings : OrderedMap<string, Record<Blessing>>,
  cantrips : OrderedMap<string, Record<Cantrip>>,
  combatTechniques : OrderedMap<string, Record<CombatTechnique>>,
  liturgicalChants : OrderedMap<string, Record<LiturgicalChant>>,
  skills : OrderedMap<string, Record<Skill>>,
  spells : OrderedMap<string, Record<Spell>>
) : YamlPairConverterE<DisadvantageUniv, DisadvantageL10n, string, Disadvantage> =>
  ([ univ, l10n ]) => {
    const eselectOptions = pipe_ (
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

    return Right<[string, Record<Disadvantage>]> ([
      univ.id,
      Disadvantage ({
        id: univ.id,
        name: l10n.name,
        range: Maybe (l10n.range),
        actions: Nothing,
        cost: typeof univ.cost === "object"
              ? Just (fromArray (univ.cost))
              : Maybe (univ.cost),
        isExclusiveToArcaneSpellworks:
          fromMaybe (false) (Maybe (univ.isExclusiveToArcaneSpellworks)),
        input: Maybe (l10n.input),
        max: Maybe (univ.max),
        prerequisites: pipe_ (
          toLevelPrerequisites (univ),
          mp => univ.hasToBeCommonOrSuggestedByRCP
                ? isList (mp)
                  ? cons <AllRequirements> (mp) ("RCP")
                  : insertWith <List<AllRequirements>> (append)
                                                       (1)
                                                       (List ("RCP"))
                                                       (mp)
                : mp
        ),
        prerequisitesText: Maybe (l10n.prerequisites),
        prerequisitesTextIndex: prerequisitesIndex,
        prerequisitesTextStart: Maybe (l10n.prerequisitesStart),
        prerequisitesTextEnd: Maybe (l10n.prerequisitesEnd),
        tiers: Maybe (univ.levels),
        select: selectOptions,
        gr: univ.gr,
        rules: toMarkdown (l10n.rules),
        apValue: Maybe (l10n.apValue),
        apValueAppend: Maybe (l10n.apValueAppend),
        src: toSourceRefs (l10n.src),
        errata: toErrata (l10n.errata),
        category: Nothing,
      }),
    ])
  }


export const toDisadvantages = (
  blessings : OrderedMap<string, Record<Blessing>>,
  cantrips : OrderedMap<string, Record<Cantrip>>,
  combatTechniques : OrderedMap<string, Record<CombatTechnique>>,
  liturgicalChants : OrderedMap<string, Record<LiturgicalChant>>,
  skills : OrderedMap<string, Record<Skill>>,
  spells : OrderedMap<string, Record<Spell>>
) : YamlFileConverter<string, Record<Disadvantage>> =>
  pipe (
    (yaml_mp : YamlNameMap) =>
     zipBy ("id")
           (yaml_mp.DisadvantagesUniv)
           (yaml_mp.DisadvantagesL10nDefault)
           (yaml_mp.DisadvantagesL10nOverride),
    bindF (pipe (
      mapM (toDisadv (blessings, cantrips, combatTechniques, liturgicalChants, skills, spells)),
      bindF (toMapIntegrity),
    )),
    second (fromMap)
  )
