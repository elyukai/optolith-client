import { cnst, flip, ident, join } from "../../../Data/Function";
import { fmap } from "../../../Data/Functor";
import { foldr, fromArray, List } from "../../../Data/List";
import { elem, Maybe, maybe, Nothing } from "../../../Data/Maybe";
import { foldlWithKey, lookup, lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { insert, OrderedSet } from "../../../Data/OrderedSet";
import { Record, StringKeyObject } from "../../../Data/Record";
import { Tuple } from "../../../Data/Tuple";
import { Categories } from "../../Constants/Categories";
import { ActivatableDependent, createActivatableDependentWithActive } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent, createActivatableSkillDependentWithValue } from "../../Models/ActiveEntries/ActivatableSkillDependent";
import { ActiveObject } from "../../Models/ActiveEntries/ActiveObject";
import { ActiveObjectWithId, fromActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId";
import { AttributeDependent, createAttributeDependentWithValue } from "../../Models/ActiveEntries/AttributeDependent";
import { createSkillDependentWithValue, SkillDependent } from "../../Models/ActiveEntries/SkillDependent";
import { Belongings } from "../../Models/Hero/Belongings";
import { Energies } from "../../Models/Hero/Energies";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { HitZoneArmor } from "../../Models/Hero/HitZoneArmor";
import { Item } from "../../Models/Hero/Item";
import { PermanentEnergyLoss } from "../../Models/Hero/PermanentEnergyLoss";
import { PermanentEnergyLossAndBoughtBack } from "../../Models/Hero/PermanentEnergyLossAndBoughtBack";
import { PersonalData } from "../../Models/Hero/PersonalData";
import { Pet } from "../../Models/Hero/Pet";
import { Purse } from "../../Models/Hero/Purse";
import { Rules } from "../../Models/Hero/Rules";
import { L10n, L10nRecord } from "../../Models/Wiki/L10n";
import { Spell } from "../../Models/Wiki/Spell";
import { PrimaryAttributeDamageThreshold } from "../../Models/Wiki/sub/PrimaryAttributeDamageThreshold";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Activatable } from "../../Models/Wiki/wikiTypeHelpers";
import { getCombinedPrerequisites } from "../Activatable/activatableActivationUtils";
import { getActiveFromState } from "../Activatable/activatableConvertUtils";
import { addAllStyleRelatedDependencies } from "../Activatable/ExtendedStyleUtils";
import { addDependencies } from "../Dependencies/dependencyUtils";
import { getCategoryById } from "../IDUtils";
import { pipe, pipe_ } from "../pipe";
import * as Raw from "./RawData";

const createHeroObject = (l10n: L10nRecord) => (hero: Raw.RawHero): HeroModelRecord =>
  HeroModel ({
    id: hero .id,
    clientVersion: hero .clientVersion,
    locale: L10n.A.id (l10n),
    phase: hero .phase,
    name: hero .name,
    avatar: Maybe (hero .avatar),
    adventurePointsTotal: hero .ap .total,
    race: Maybe (hero .r),
    raceVariant: Maybe (hero .rv),
    culture: Maybe (hero .c),
    isCulturalPackageActive:
      typeof hero .isCulturalPackageActive === "boolean"
      ? hero .isCulturalPackageActive
      : false,
    profession: Maybe (hero .p),
    professionName: Maybe (hero .professionName),
    professionVariant: Maybe (hero .pv),
    sex: hero .sex,
    experienceLevel: hero .el,

    personalData: PersonalData ({
      family: Maybe (hero .pers .family),
      placeOfBirth: Maybe (hero .pers .placeofbirth),
      dateOfBirth: Maybe (hero .pers .dateofbirth),
      age: Maybe (hero .pers .age),
      hairColor: Maybe (hero .pers .haircolor),
      eyeColor: Maybe (hero .pers .eyecolor),
      size: Maybe (hero .pers .size),
      weight: Maybe (hero .pers .weight),
      title: Maybe (hero .pers .title),
      socialStatus: Maybe (hero .pers .socialstatus),
      characteristics: Maybe (hero .pers .characteristics),
      otherInfo: Maybe (hero .pers .otherinfo),
      cultureAreaKnowledge: Maybe (hero .pers .cultureAreaKnowledge),
    }),

    player: fmap ((player: Raw.RawUser) => player .id)
                 (Maybe (hero .player)),

    dateCreated: new Date (hero .dateCreated),
    dateModified: new Date (hero .dateModified),

    attributes: OrderedMap.fromArray (
      hero .attr .values .map<[string, Record<AttributeDependent>]> (
        ({ id, value }) => [id, createAttributeDependentWithValue (value) (id)]
      )
    ),

    attributeAdjustmentSelected: hero .attr .attributeAdjustmentSelected,

    energies: Energies ({
      addedArcaneEnergyPoints: hero .attr .ae,
      addedKarmaPoints: hero .attr .kp,
      addedLifePoints: hero .attr .lp,
      permanentArcaneEnergyPoints:
        PermanentEnergyLossAndBoughtBack (hero .attr .permanentAE),
      permanentKarmaPoints:
        PermanentEnergyLossAndBoughtBack (hero .attr .permanentKP),
      permanentLifePoints:
        typeof hero .attr .permanentLP === "object"
        ? PermanentEnergyLoss (hero .attr .permanentLP)
        : PermanentEnergyLoss ({ lost: 0 }),
    }),

    ...getActivatables (hero),

    skills: getDependentSkills (hero .talents),
    combatTechniques: getDependentSkills (hero .ct),
    spells: getActivatableDependentSkills (hero .spells),
    cantrips: OrderedSet.fromArray (hero .cantrips),
    liturgicalChants: getActivatableDependentSkills (hero .liturgies),
    blessings: OrderedSet.fromArray (hero .blessings),

    belongings: Belongings ({
      items: OrderedMap.fromArray (
        Object.entries (hero .belongings .items) .map<[string, Record<Item>]> (
          ([id, obj]) => [
            id,
            Item ({
              id,
              name: obj .name,
              ammunition: Maybe (obj .ammunition),
              combatTechnique: Maybe (obj .combatTechnique),
              damageDiceSides: Maybe (obj .damageDiceSides),
              gr: obj .gr,
              isParryingWeapon:
                typeof obj .isParryingWeapon === "boolean" ? obj .isParryingWeapon : false,
              isTemplateLocked: obj .isTemplateLocked,
              reach: Maybe (obj .reach),
              template: Maybe (obj .template),
              isTwoHandedWeapon:
                typeof obj .isTwoHandedWeapon === "boolean" ? obj .isTwoHandedWeapon : false,
              improvisedWeaponGroup: Maybe (obj .imp),
              loss: Maybe (obj .loss),
              forArmorZoneOnly:
                typeof obj .forArmorZoneOnly === "boolean" ? obj .forArmorZoneOnly : false,
              addPenalties:
                typeof obj .addPenalties === "boolean" ? obj .addPenalties : false,
              armorType: Maybe (obj .armorType),
              at: Maybe (obj .at),
              iniMod: Maybe (obj .iniMod),
              movMod: Maybe (obj .movMod),
              damageBonus:
                fmap<
                  Raw.RawPrimaryAttributeDamageThreshold,
                  Record<PrimaryAttributeDamageThreshold>
                >
                  (primaryThreshold => PrimaryAttributeDamageThreshold ({
                    primary: Maybe (primaryThreshold .primary),
                    threshold: typeof primaryThreshold .threshold === "object"
                      ? Tuple.fromArray (primaryThreshold .threshold as [number, number])
                      : primaryThreshold .threshold,
                  }))
                  (Maybe (obj .primaryThreshold)),
              damageDiceNumber: Maybe (obj .damageDiceNumber),
              damageFlat: Maybe (obj .damageFlat),
              enc: Maybe (obj .enc),
              length: Maybe (obj .length),
              amount: obj .amount,
              pa: Maybe (obj .pa),
              price: Maybe (obj .price),
              pro: Maybe (obj .pro),
              range: fmap<number[], List<number>> (List.fromArray)
                                                  (Maybe (obj .range)),
              reloadTime: Maybe (obj .reloadTime),
              stp: Maybe (obj .stp),
              weight: Maybe (obj .weight),
              stabilityMod: Maybe (obj .stabilityMod),
            }),
          ]
        )
      ),

      hitZoneArmors:
        typeof hero .belongings .armorZones === "object"
        ? OrderedMap.fromArray (
          Object.entries (hero .belongings .armorZones)
            .map<[string, Record<HitZoneArmor>]> (
              ([id, obj]) => [
                id,
                HitZoneArmor ({
                  id,
                  name: obj .name,
                  head: Maybe (obj .head),
                  headLoss: Maybe (obj .headLoss),
                  leftArm: Maybe (obj .leftArm),
                  leftArmLoss: Maybe (obj .leftArmLoss),
                  rightArm: Maybe (obj .rightArm),
                  rightArmLoss: Maybe (obj .rightArmLoss),
                  torso: Maybe (obj .torso),
                  torsoLoss: Maybe (obj .torsoLoss),
                  leftLeg: Maybe (obj .leftLeg),
                  leftLegLoss: Maybe (obj .leftLegLoss),
                  rightLeg: Maybe (obj .rightLeg),
                  rightLegLoss: Maybe (obj .rightLegLoss),
                }),
              ]
            )
        )
        : OrderedMap.empty,

      purse: Purse (hero .belongings .purse),

      isInItemCreation: false,
      isInHitZoneArmorCreation: false,
    }),

    rules: Rules ({
      ...hero.rules,
      enabledRuleBooks: OrderedSet.fromArray (hero.rules.enabledRuleBooks),
    }),

    pets:
      typeof hero .pets === "object"
      ? OrderedMap.fromArray (
        Object.entries (hero .pets)
          .map<[string, Record<Pet>]> (
            ([id, obj]) => [
              id,
              Pet ({
                id,
                name: obj .name,
                avatar: Maybe (obj .avatar),
                size: Maybe (obj .size),
                type: Maybe (obj .type),
                attack: Maybe (obj .attack),
                dp: Maybe (obj .dp),
                reach: Maybe (obj .reach),
                actions: Maybe (obj .actions),
                talents: Maybe (obj .talents),
                skills: Maybe (obj .skills),
                notes: Maybe (obj .notes),
                spentAp: Maybe (obj .spentAp),
                totalAp: Maybe (obj .totalAp),
                cou: Maybe (obj .cou),
                sgc: Maybe (obj .sgc),
                int: Maybe (obj .int),
                cha: Maybe (obj .cha),
                dex: Maybe (obj .dex),
                agi: Maybe (obj .agi),
                con: Maybe (obj .con),
                str: Maybe (obj .str),
                lp: Maybe (obj .lp),
                ae: Maybe (obj .ae),
                spi: Maybe (obj .spi),
                tou: Maybe (obj .tou),
                pro: Maybe (obj .pro),
                ini: Maybe (obj .ini),
                mov: Maybe (obj .mov),
                at: Maybe (obj .at),
                pa: Maybe (obj .pa),
              })]
          )
      )
      : OrderedMap.empty,

    isInPetCreation: false,
    blessedStyleDependencies: Nothing,
    combatStyleDependencies: Nothing,
    magicalStyleDependencies: Nothing,
    skillStyleDependencies: Nothing,
  })

const getActivatableDependent =
  (source: StringKeyObject<Raw.RawActiveObject[]>): HeroModel["advantages"] =>
    OrderedMap.fromArray (
      Object.entries (source) .map<[string, Record<ActivatableDependent>]> (
        ([id, active]) => [
          id,
          createActivatableDependentWithActive (fromArray (active .map (e => ActiveObject ({
                                                  cost: Maybe (e .cost),
                                                  sid: Maybe (e .sid),
                                                  sid2: Maybe (e .sid2),
                                                  sid3: Maybe (e .sid3),
                                                  tier: Maybe (e .tier),
                                                }))))
                                                (id),
        ]
      )
    )

interface ActivatableMaps {
  advantages: OrderedMap<string, Record<ActivatableDependent>>;
  disadvantages: OrderedMap<string, Record<ActivatableDependent>>;
  specialAbilities: OrderedMap<string, Record<ActivatableDependent>>;
}

const getActivatables = (hero: Raw.RawHero): ActivatableMaps => {
  const objectsInMap = getActivatableDependent (hero .activatable)

  return foldlWithKey<string, Record<ActivatableDependent>, ActivatableMaps>
    (acc => id => obj => {
      const category = getCategoryById (id)

      const key: keyof ActivatableMaps =
        elem (Categories.ADVANTAGES) (category)
          ? "advantages"
          : elem (Categories.DISADVANTAGES) (category)
          ? "disadvantages"
          : "specialAbilities"

      return {
        ...acc,
        [key]: OrderedMap.insert (id) (obj) (acc [key]),
      }
    })
    ({
      advantages: OrderedMap.empty,
      disadvantages: OrderedMap.empty,
      specialAbilities: OrderedMap.empty,
    })
    (objectsInMap)
}

const getDependentSkills =
  (source: StringKeyObject<number>): OrderedMap<string, Record<SkillDependent>> =>
    OrderedMap.fromArray (
      Object.entries (source) .map<[string, Record<SkillDependent>]> (
        ([id, value]) => [id, createSkillDependentWithValue (value) (id)]
      )
    )

const getActivatableDependentSkills =
  (source: StringKeyObject<number>): OrderedMap<string, Record<ActivatableSkillDependent>> =>
    OrderedMap.fromArray (
      Object.entries (source) .map<[string, Record<ActivatableSkillDependent>]> (
        ([id, value]) => [id, createActivatableSkillDependentWithValue (value) (id)]
      )
    )

const { advantages, disadvantages, specialAbilities, spells } = HeroModel.AL

const addDependenciesForReq =
  (hero_slice: OrderedMap<string, Record<ActivatableDependent>>) =>
  (active: Record<ActiveObjectWithId>) =>
  (id: string) =>
  (wiki_entry: Activatable) =>
    addDependencies (id)
                    (getCombinedPrerequisites (true)
                                              (wiki_entry)
                                              (lookup (id) (hero_slice))
                                              (fromActiveObjectWithId (active)))

const addDependenciesForSlice =
  <A extends Activatable>
  (add_entry_mod: (x: A) => ident<HeroModelRecord>) =>
  (hero_slice: OrderedMap<string, Record<ActivatableDependent>>) =>
  (wiki_slice: OrderedMap<string, A>) => {
    const lookupWiki = lookupF (wiki_slice)

    return flip (foldr ((x: Record<ActiveObjectWithId>) => {
                         const id = ActiveObjectWithId.A.id (x)

                         return maybe (ident as ident<HeroModelRecord>)
                                      ((y: A) => pipe (
                                        addDependenciesForReq (hero_slice) (x) (id) (y),
                                        add_entry_mod (y)
                                      ))
                                      (lookupWiki (id))
                       }))
  }

export const convertFromRawHero =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (hero: Raw.RawHero): HeroModelRecord => {
    const intermediateState = createHeroObject (l10n) (hero)

    const activeAdvantages = getActiveFromState (advantages (intermediateState))
    const activeDisadvantages = getActiveFromState (disadvantages (intermediateState))
    const activeSpecialAbilities = getActiveFromState (specialAbilities (intermediateState))

    const ASDA = ActivatableSkillDependent.A

    const activeSpells =
      OrderedMap.foldr<Record<ActivatableSkillDependent>, OrderedSet<string>>
        (spell => ASDA.active (spell) ? insert (ASDA.id (spell)) : ident)
        (OrderedSet.empty)
        (spells (intermediateState))

    return pipe_ (
      intermediateState,

      join ((s: HeroModelRecord) => addDependenciesForSlice (cnst (ident))
                                                            (HeroModel.A.advantages (s))
                                                            (WikiModel.A.advantages (wiki))
                                                            (activeAdvantages)),

      join (s => addDependenciesForSlice (cnst (ident))
                                         (HeroModel.A.disadvantages (s))
                                         (WikiModel.A.disadvantages (wiki))
                                         (activeDisadvantages)),

      join (s => addDependenciesForSlice (addAllStyleRelatedDependencies)
                                         (HeroModel.A.specialAbilities (s))
                                         (WikiModel.A.specialAbilities (wiki))
                                         (activeSpecialAbilities)),

      flip (OrderedSet.foldr ((id: string) =>
                               maybe (ident as ident<HeroModelRecord>)
                                     (pipe (Spell.A.prerequisites, addDependencies (id)))
                                     (lookup (id) (WikiModel.A.spells (wiki)))))
           (activeSpells)
    )
  }
