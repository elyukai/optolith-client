import { flip, ident } from "../../../../../Data/Function"
import { fmap, fmapF } from "../../../../../Data/Functor"
import { over, set } from "../../../../../Data/Lens"
import { consF, foldr, fromArray, List } from "../../../../../Data/List"
import { elem, fromJust, fromMaybe, isNothing, Just, Maybe, maybe, maybe_, Nothing } from "../../../../../Data/Maybe"
import { alter, lookup, OrderedMap } from "../../../../../Data/OrderedMap"
import { insert, OrderedSet } from "../../../../../Data/OrderedSet"
import { Record, StringKeyObject } from "../../../../../Data/Record"
import { Tuple } from "../../../../../Data/Tuple"
import { Category } from "../../../../Constants/Categories"
import { ActivatableDependent, ActivatableDependentL } from "../../../../Models/ActiveEntries/ActivatableDependent"
import { ActivatableSkillDependent, createActivatableSkillDependentWithValue } from "../../../../Models/ActiveEntries/ActivatableSkillDependent"
import { activeObjectFromRaw } from "../../../../Models/ActiveEntries/ActiveObject"
import { ActiveObjectWithId, fromActiveObjectWithId, toActiveObjectWithId } from "../../../../Models/ActiveEntries/ActiveObjectWithId"
import { AttributeDependent, createAttributeDependentWithValue } from "../../../../Models/ActiveEntries/AttributeDependent"
import { createSkillDependentWithValue, SkillDependent } from "../../../../Models/ActiveEntries/SkillDependent"
import { Belongings } from "../../../../Models/Hero/Belongings"
import { Energies } from "../../../../Models/Hero/Energies"
import { HeroModel, HeroModelL, HeroModelRecord } from "../../../../Models/Hero/HeroModel"
import { HitZoneArmor } from "../../../../Models/Hero/HitZoneArmor"
import { Item } from "../../../../Models/Hero/Item"
import { Pact } from "../../../../Models/Hero/Pact"
import { PermanentEnergyLoss } from "../../../../Models/Hero/PermanentEnergyLoss"
import { PermanentEnergyLossAndBoughtBack } from "../../../../Models/Hero/PermanentEnergyLossAndBoughtBack"
import { PersonalData } from "../../../../Models/Hero/PersonalData"
import { Pet } from "../../../../Models/Hero/Pet"
import { Purse } from "../../../../Models/Hero/Purse"
import { Rules } from "../../../../Models/Hero/Rules"
import { Cantrip } from "../../../../Models/Wiki/Cantrip"
import { L10n } from "../../../../Models/Wiki/L10n"
import { SpecialAbility } from "../../../../Models/Wiki/SpecialAbility"
import { Spell } from "../../../../Models/Wiki/Spell"
import { PrimaryAttributeDamageThreshold } from "../../../../Models/Wiki/sub/PrimaryAttributeDamageThreshold"
import { StaticData, StaticDataRecord } from "../../../../Models/Wiki/WikiModel"
import { Activatable } from "../../../../Models/Wiki/wikiTypeHelpers"
import { getCombinedPrerequisites } from "../../../Activatable/activatableActivationUtils"
import { addOtherSpecialAbilityDependenciesOnHeroInit } from "../../../Activatable/SpecialAbilityUtils"
import { addDependencies } from "../../../Dependencies/dependencyUtils"
import { getCategoryById } from "../../../IDUtils"
import { initializeCache } from "../../../Increasable/AttributeSkillCheckMinimum"
import { pipe, pipe_ } from "../../../pipe"
import * as Raw from "../../RawData"

const SDA = StaticData.A
const HA = HeroModel.A
const HL = HeroModelL
const ADL = ActivatableDependentL
const AOWIA = ActiveObjectWithId.A
const ASDA = ActivatableSkillDependent.A

const getDependentSkills =
  (source: StringKeyObject<number>): OrderedMap<string, Record<SkillDependent>> =>
    OrderedMap.fromArray (
      Object.entries (source) .map<[string, Record<SkillDependent>]> (
        ([ id, value ]) => [ id, createSkillDependentWithValue (value) (id) ]
      )
    )

const getActivatableDependentSkills =
  (source: StringKeyObject<number>): OrderedMap<string, Record<ActivatableSkillDependent>> =>
    OrderedMap.fromArray (
      Object.entries (source) .map<[string, Record<ActivatableSkillDependent>]> (
        ([ id, value ]) => [ id, createActivatableSkillDependentWithValue (value) (id) ]
      )
    )

const createHeroObject = (staticData: StaticDataRecord) => (hero: Raw.RawHero): HeroModelRecord =>
  HeroModel ({
    id: hero .id,
    clientVersion: hero .clientVersion,
    locale: fromMaybe (L10n.A.id (StaticData.A.ui (staticData)))
                      (Maybe (hero .locale)),
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
        ({ id, value }) => [ id, createAttributeDependentWithValue (value) (id) ]
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

    advantages: OrderedMap.empty,
    disadvantages: OrderedMap.empty,
    specialAbilities: OrderedMap.empty,

    skills: getDependentSkills (hero .talents),
    combatTechniques: getDependentSkills (hero .ct),
    spells: getActivatableDependentSkills (hero .spells),
    cantrips: OrderedSet.fromArray (hero .cantrips),
    liturgicalChants: getActivatableDependentSkills (hero .liturgies),
    blessings: OrderedSet.fromArray (hero .blessings),

    belongings: Belongings ({
      items: OrderedMap.fromArray (
        Object.entries (hero .belongings .items) .map<[string, Record<Item>]> (
          ([ id, obj ]) => [
            id,
            Item ({
              id,
              name: obj .name,
              ammunition: Maybe (obj .ammunition),
              combatTechnique: Maybe (obj .combatTechnique),
              damageDiceSides: Maybe (obj .damageDiceSides),
              gr: obj .gr,
              where: Maybe (obj .where),
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
                    primary: typeof primaryThreshold.primary === "object"
                             ? Just (Tuple.fromArray (primaryThreshold.primary))
                             : Maybe (primaryThreshold.primary),
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
              reloadTime: typeof obj.reloadTime === "object"
                          ? Just (List.fromArray (obj.reloadTime))
                          : Maybe (obj.reloadTime),
              stp: typeof obj.stp === "object"
                   ? Just (List.fromArray (obj.stp))
                   : Maybe (obj.stp),
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
              ([ id, obj ]) => [
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
            ([ id, obj ]) => [
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
              }) ]
          )
      )
      : OrderedMap.empty,

    pact: fmapF (Maybe (hero .pact)) (Pact),

    isInPetCreation: false,
    blessedStyleDependencies: Nothing,
    combatStyleDependencies: Nothing,
    magicalStyleDependencies: Nothing,
    skillStyleDependencies: Nothing,
    socialStatusDependencies: Nothing,
    transferredUnfamiliarSpells: Nothing,
    skillCheckAttributeCache: Nothing,
  })

const getActiveObjectsFromRaw = (x: StringKeyObject<Raw.RawActiveObject[]>) =>
                                pipe_ (
                                  x,
                                  Object.entries,
                                  xs => xs.flatMap (
                                          ([ id, actives ]: [string, Raw.RawActiveObject[]]) =>
                                            actives.map (
                                              (active, index) =>
                                                toActiveObjectWithId (index)
                                                                     (id)
                                                                     (activeObjectFromRaw (active))

                                            )
                                        ),
                                  fromArray
                                )

const addActivatableEntriesWithDeps =
  (staticData: StaticDataRecord) =>
    flip (foldr ((active: Record<ActiveObjectWithId>): ident<HeroModelRecord> => hero => {
                  const id = AOWIA.id (active)
                  const category = getCategoryById (id)

                  const l = elem (Category.ADVANTAGES) (category)
                            ? HL.advantages
                            : elem (Category.DISADVANTAGES) (category)
                            ? HL.disadvantages
                            : HL.specialAbilities

                  const mwiki_entry: Maybe<Activatable> =
                    elem (Category.ADVANTAGES) (category)
                    ? lookup (id) (SDA.advantages (staticData))
                    : elem (Category.DISADVANTAGES) (category)
                    ? lookup (id) (SDA.disadvantages (staticData))
                    : lookup (id) (SDA.specialAbilities (staticData))

                  const mhero_entry = elem (Category.ADVANTAGES) (category)
                                      ? lookup (id) (HA.advantages (hero))
                                      : elem (Category.DISADVANTAGES) (category)
                                      ? lookup (id) (HA.disadvantages (hero))
                                      : lookup (id) (HA.specialAbilities (hero))

                  if (isNothing (mwiki_entry)) {
                    return hero
                  }

                  const wiki_entry = fromJust (mwiki_entry)

                  return pipe_ (
                    hero,

                    // Add ActiveObject to list
                    over (l)
                         (alter (pipe (
                                  maybe_ (() => ActivatableDependent ({
                                                  id,
                                                  active: List (fromActiveObjectWithId (active)),
                                                  dependencies: List (),
                                                }))
                                         (over (ADL.active)
                                               (consF (fromActiveObjectWithId (active)))),
                                  Just
                                ))
                                (id)),

                    // Add dependencies for current ActiveObject
                    addDependencies (id)
                                    (getCombinedPrerequisites (true)
                                                              (staticData)
                                                              (wiki_entry)
                                                              (mhero_entry)
                                                              (fromActiveObjectWithId (active))),

                    SpecialAbility.is (wiki_entry)
                      ? addOtherSpecialAbilityDependenciesOnHeroInit (wiki_entry) (active)
                      : ident
                  )
                }))

export const convertFromRawHero =
  (staticData: StaticDataRecord) =>
  (hero: Raw.RawHero): HeroModelRecord => {
    const intermediateState = createHeroObject (staticData) (hero)

    const activeSpells =
      OrderedMap.foldr<Record<ActivatableSkillDependent>, OrderedSet<string>>
        (spell => ASDA.active (spell) ? insert (ASDA.id (spell)) : ident)
        (OrderedSet.empty)
        (HA.spells (intermediateState))

    const activeCantrips = HA.cantrips (intermediateState)

    return pipe_ (
      intermediateState,

      addActivatableEntriesWithDeps (staticData)
                                    (getActiveObjectsFromRaw (hero.activatable)),

      flip (OrderedSet.foldr ((id: string) =>
                               maybe (ident as ident<HeroModelRecord>)
                                     (pipe (Spell.A.prerequisites, addDependencies (id)))
                                     (lookup (id) (StaticData.A.spells (staticData)))))
           (activeSpells),

      flip (OrderedSet.foldr ((id: string) =>
                               maybe (ident as ident<HeroModelRecord>)
                                     (pipe (Cantrip.A.prerequisites, addDependencies (id)))
                                     (lookup (id) (StaticData.A.cantrips (staticData)))))
           (activeCantrips),

      intermediateHero =>
        set (HL.skillCheckAttributeCache)
            (initializeCache (
              SDA.skills (staticData),
              SDA.spells (staticData),
              SDA.liturgicalChants (staticData),
              HA.spells (intermediateHero),
              HA.liturgicalChants (intermediateHero),
            ))
            (intermediateHero)
    )
  }
