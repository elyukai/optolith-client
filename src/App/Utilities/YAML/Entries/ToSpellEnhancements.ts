/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { SpellEnhancementL10n, SpellEnhancementLevelL10n } from "../../../../../app/Database/Schema/SpellEnhancements/SpellEnhancements.l10n"
import { SpellEnhancementLevelUniv, SpellEnhancementUniv } from "../../../../../app/Database/Schema/SpellEnhancements/SpellEnhancements.univ"
import { bindF, Either, Right, second } from "../../../../Data/Either"
import { List } from "../../../../Data/List"
import { Just, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { SpecialAbilityId } from "../../../Constants/Ids"
import { RequireActivatable } from "../../../Models/Wiki/prerequisites/ActivatableRequirement"
import { Erratum } from "../../../Models/Wiki/sub/Errata"
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption"
import { SourceLink } from "../../../Models/Wiki/sub/SourceLink"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toSourceRefs } from "./ToSourceRefs"

interface SelectOptionBase {
  id : number
  name : string
  cost : Just<number>
  description : Just<string>
  target : Just<string>
  src : List<Record<SourceLink>>
  errata : List<Record<Erratum>>
}


const getBase : (l10n : SpellEnhancementL10n)
              => (univLevel : SpellEnhancementLevelUniv)
              => (l10nLevel : SpellEnhancementLevelL10n)
              => SelectOptionBase
              = l10n =>
                univLevel =>
                l10nLevel => ({
                  id: univLevel.id,
                  name: l10nLevel.name,
                  cost: Just (univLevel.cost),
                  description: Just (l10nLevel.effect),
                  target: Just (l10n.target),
                  src: toSourceRefs (l10n.src),
                  errata: toErrata (l10n.errata),
                })


// eslint-disable-next-line max-len
const toSE : (x : [SpellEnhancementUniv, SpellEnhancementL10n])
           => Either<Error[], [number, Record<SelectOption>][]>
           = ([ univ, l10n ]) => Right<[number, Record<SelectOption>][]> ([
               [
                 univ.level1.id,
                 SelectOption ({
                   ...getBase (l10n) (univ.level1) (l10n.level1),
                   level: Just (1),
                 }),
               ],
               [
                 univ.level2.id,
                 SelectOption ({
                   ...getBase (l10n) (univ.level2) (l10n.level2),
                   level: Just (2),
                   prerequisites: typeof univ.level2.previousRequirement === "number"
                                  ? Just (List (RequireActivatable ({
                                                  id: SpecialAbilityId.SpellEnhancement,
                                                  active: true,
                                                  sid: Just (univ.level1.id),
                                                })))
                                  : Nothing,
                 }),
               ],
               [
                 univ.level3.id,
                 SelectOption ({
                   ...getBase (l10n) (univ.level3) (l10n.level3),
                   level: Just (3),
                   prerequisites: univ.level3.previousRequirement === 1
                                  ? Just (List (RequireActivatable ({
                                                  id: SpecialAbilityId.SpellEnhancement,
                                                  active: true,
                                                  sid: Just (univ.level1.id),
                                                })))
                                  : univ.level3.previousRequirement === 2
                                  ? Just (List (RequireActivatable ({
                                                  id: SpecialAbilityId.SpellEnhancement,
                                                  active: true,
                                                  sid: Just (univ.level2.id),
                                                })))
                                  : Nothing,
                 }),
               ],
             ])


export const toSpellEnhancements : YamlFileConverter<number, Record<SelectOption>>
                                 = pipe (
                                     (yaml_mp : YamlNameMap) =>
                                       zipBy ("target")
                                             (yaml_mp.SpellEnhancementsUniv)
                                             (yaml_mp.SpellEnhancementsL10nDefault)
                                             (yaml_mp.SpellEnhancementsL10nOverride),
                                     bindF (pipe (
                                       mapM (toSE),
                                       bindF (pipe (
                                         arr => arr.flat (1),
                                         toMapIntegrity
                                       )),
                                     )),
                                     second (fromMap)
                                   )
