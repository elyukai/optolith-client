/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { bindF, Right, second } from "../../../../Data/Either"
import { fromArray, List } from "../../../../Data/List"
import { Nothing } from "../../../../Data/Maybe"
import { fromMap, OrderedMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { MagicalGroup, MagicalTradition } from "../../../Constants/Groups"
import { Blessing } from "../../../Models/Wiki/Blessing"
import { Cantrip } from "../../../Models/Wiki/Cantrip"
import { CombatTechnique } from "../../../Models/Wiki/CombatTechnique"
import { LiturgicalChant } from "../../../Models/Wiki/LiturgicalChant"
import { Skill } from "../../../Models/Wiki/Skill"
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility"
import { Spell } from "../../../Models/Wiki/Spell"
import { SelectOption } from "../../../Models/Wiki/sub/SelectOption"
import { icToInt } from "../../AdventurePoints/improvementCostUtils"
import { ndash } from "../../Chars"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { SpecialAbilityL10n } from "../Schema/SpecialAbilities/SpecialAbilities.l10n"
import { SpecialAbilityUniv } from "../Schema/SpecialAbilities/SpecialAbilities.univ"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./toErrata"
import { toMarkdown } from "./ToMarkdown"
import { toSourceRefs } from "./toSourceRefs"


const toSA : (blessings : OrderedMap<number, Record<Blessing>>)
           => (cantrips : OrderedMap<number, Record<Cantrip>>)
           => (combatTechniques : OrderedMap<number, Record<CombatTechnique>>)
           => (liturgicalChants : OrderedMap<number, Record<LiturgicalChant>>)
           => (skills : OrderedMap<number, Record<Skill>>)
           => (spells : OrderedMap<number, Record<Spell>>)
           => (spell_enhancements : OrderedMap<number, Record<SelectOption>>)
           => (lc_enhancements : OrderedMap<number, Record<SelectOption>>)
           => YamlPairConverterE<SpecialAbilityUniv, SpecialAbilityL10n, string, SpecialAbility>
           = blessings =>
             cantrips =>
             combatTechniques =>
             liturgicalChants =>
             skills =>
             spells =>
             spell_enhancements =>
             lc_enhancements =>
             ([ univ, l10n ]) => Right<[string, Record<SpecialAbility>]> ([
               univ.id,
               SpecialAbility ({
                 id: univ .id,
                 name: l10n.name,
                 check: List (univ.check1, univ.check2, univ.check3),
                 checkmod: Nothing,
                 gr: MagicalGroup.MagicalMelodies,
                 ic: icToInt (univ .ic),
                 property: univ.property,
                 tradition: List (MagicalTradition.ArcaneBards),
                 subtradition: fromArray (univ.musictraditions),
                 prerequisites: List (),
                 effect: toMarkdown (l10n.effect),
                 castingTime: ndash,
                 castingTimeShort: ndash,
                 castingTimeNoMod: false,
                 cost: l10n.aeCost,
                 costShort: l10n.aeCostShort,
                 costNoMod: false,
                 range: ndash,
                 rangeShort: ndash,
                 rangeNoMod: false,
                 duration: l10n.duration,
                 durationShort: l10n.durationShort,
                 durationNoMod: false,
                 target: ndash,
                 src: toSourceRefs (l10n.src),
                 errata: toErrata (l10n.errata),
                 category: Nothing,
               }),
             ])


export const toSpecialAbilities : (blessings : OrderedMap<number, Record<Blessing>>)
                                => (cantrips : OrderedMap<number, Record<Cantrip>>)
                                => (combatTechniques : OrderedMap<number, Record<CombatTechnique>>)
                                => (liturgicalChants : OrderedMap<number, Record<LiturgicalChant>>)
                                => (skills : OrderedMap<number, Record<Skill>>)
                                => (spells : OrderedMap<number, Record<Spell>>)
                                => (spell_enhancements : OrderedMap<number, Record<SelectOption>>)
                                => (lc_enhancements : OrderedMap<number, Record<SelectOption>>)
                                => YamlFileConverter<string, Record<Spell>>
                                = blessings =>
                                  cantrips =>
                                  combatTechniques =>
                                  liturgicalChants =>
                                  skills =>
                                  spells =>
                                  spell_enhancements =>
                                  lc_enhancements => pipe (
                                    (yaml_mp : YamlNameMap) => zipBy ("id")
                                                                     (yaml_mp.SpecialAbilitiesUniv)
                                                                     (yaml_mp.SpecialAbilitiesL10n),
                                    bindF (pipe (
                                      mapM (toSA),
                                      bindF (toMapIntegrity),
                                    )),
                                    second (fromMap)
                                  )
