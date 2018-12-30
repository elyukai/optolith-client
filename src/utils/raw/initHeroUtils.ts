import { pipe } from 'ramda';
import { Categories } from '../../constants/Categories';
import * as Data from '../../types/data';
import * as Raw from '../../types/rawdata';
import { getCombinedPrerequisites } from '../activatable/activatableActivationUtils';
import { getActiveFromState } from '../activatable/activatableConvertUtils';
import { addAllStyleRelatedDependencies } from '../activatable/ExtendedStyleUtils';
import { ActivatableDependent, createActivatableDependentWithActive } from '../activeEntries/ActivatableDependent';
import { ActivatableSkillDependent, createActivatableSkillDependentWithValue } from '../activeEntries/ActivatableSkillDependent';
import { ActiveObject } from '../activeEntries/ActiveObject';
import { AttributeDependent, createAttributeDependentWithValue } from '../activeEntries/AttributeDependent';
import { createSkillDependentWithValue, SkillDependent } from '../activeEntries/SkillDependent';
import { addDependencies } from '../dependencies/dependencyUtils';
import { Belongings } from '../heroData/Belongings';
import { Energies } from '../heroData/Energies';
import { HeroModel, HeroModelRecord } from '../heroData/HeroModel';
import { HitZoneArmor } from '../heroData/HitZoneArmor';
import { Item } from '../heroData/Item';
import { PermanentEnergyLoss } from '../heroData/PermanentEnergyLoss';
import { PermanentEnergyLossAndBoughtBack } from '../heroData/PermanentEnergyLossAndBoughtBack';
import { PersonalData } from '../heroData/PersonalData';
import { Pet } from '../heroData/Pet';
import { Purse } from '../heroData/Purse';
import { Rules } from '../heroData/Rules';
import { getCategoryById } from '../IDUtils';
import { ident } from '../structures/Function';
import { fromArray, List } from '../structures/List';
import { elem, fromNullable, Maybe } from '../structures/Maybe';
import { foldlWithKey, OrderedMap } from '../structures/OrderedMap';
import { insert, OrderedSet } from '../structures/OrderedSet';
import { Record, StringKeyObject } from '../structures/Record';
import { PrimaryAttributeDamageThreshold } from '../wikiData/sub/PrimaryAttributeDamageThreshold';
import { WikiModelRecord } from '../wikiData/WikiModel';

const createHeroObject = (hero: Raw.RawHero): HeroModelRecord =>
  HeroModel ({
    id: hero .id,
    clientVersion: hero .clientVersion,
    phase: hero .phase,
    name: hero .name,
    avatar: fromNullable (hero .avatar),
    adventurePointsTotal: hero .ap .total,
    race: fromNullable (hero .r),
    raceVariant: fromNullable (hero .rv),
    culture: fromNullable (hero .c),
    profession: fromNullable (hero .p),
    professionName: fromNullable (hero .professionName),
    professionVariant: fromNullable (hero .pv),
    sex: hero .sex,
    experienceLevel: hero .el,

    personalData: PersonalData ({
      family: fromNullable (hero .pers .family),
      placeOfBirth: fromNullable (hero .pers .placeofbirth),
      dateOfBirth: fromNullable (hero .pers .dateofbirth),
      age: fromNullable (hero .pers .age),
      hairColor: fromNullable (hero .pers .haircolor),
      eyeColor: fromNullable (hero .pers .eyecolor),
      size: fromNullable (hero .pers .size),
      weight: fromNullable (hero .pers .weight),
      title: fromNullable (hero .pers .title),
      socialStatus: fromNullable (hero .pers .socialstatus),
      characteristics: fromNullable (hero .pers .characteristics),
      otherInfo: fromNullable (hero .pers .otherinfo),
      cultureAreaKnowledge: fromNullable (hero .pers .cultureAreaKnowledge),
    }),

    player: Maybe.fmap ((player: Raw.RawUser) => player .id)
                        (fromNullable (hero .player)),

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
        hero .attr .permanentLP
          ? PermanentEnergyLoss (hero .attr .permanentLP)
          : PermanentEnergyLoss ({ lost: 0 }),
    }),

    ...getActivatables (hero),

    skills: getDependentSkills (hero .talents),
    combatTechniques: getDependentSkills (hero .talents),
    spells: getActivatableDependentSkills (hero .spells),
    cantrips: OrderedSet.fromArray (hero .cantrips),
    liturgicalChants: getActivatableDependentSkills (hero .liturgies),
    blessings: OrderedSet.fromArray (hero .blessings),

    belongings: Belongings ({
      items: OrderedMap.fromArray (
        Object.entries (hero .belongings .items) .map<[string, Record<Item>]> (
          ([id, obj]) => {
            return [
              id,
              Item ({
                id,
                name: obj .name,
                ammunition: fromNullable (obj .ammunition),
                combatTechnique: fromNullable (obj .combatTechnique),
                damageDiceSides: fromNullable (obj .damageDiceSides),
                gr: obj .gr,
                isParryingWeapon: fromNullable (obj .isParryingWeapon),
                isTemplateLocked: obj .isTemplateLocked,
                reach: fromNullable (obj .reach),
                template: fromNullable (obj .template),
                isTwoHandedWeapon: fromNullable (obj .isTwoHandedWeapon),
                improvisedWeaponGroup: fromNullable (obj .imp),
                loss: fromNullable (obj .loss),
                forArmorZoneOnly: fromNullable (obj .forArmorZoneOnly),
                addPenalties: fromNullable (obj .addPenalties),
                armorType: fromNullable (obj .armorType),
                at: fromNullable (obj .at),
                iniMod: fromNullable (obj .iniMod),
                movMod: fromNullable (obj .movMod),
                damageBonus:
                  Maybe.fmap<
                    Raw.RawPrimaryAttributeDamageThreshold,
                    Record<PrimaryAttributeDamageThreshold>
                  >
                    (primaryThreshold => PrimaryAttributeDamageThreshold ({
                      primary: fromNullable (primaryThreshold .primary),
                      threshold: typeof primaryThreshold .threshold === 'object'
                        ? List.fromArray (primaryThreshold .threshold)
                        : primaryThreshold .threshold,
                    }))
                    (fromNullable (obj .primaryThreshold)),
                damageDiceNumber: fromNullable (obj .damageDiceNumber),
                damageFlat: fromNullable (obj .damageFlat),
                enc: fromNullable (obj .enc),
                length: fromNullable (obj .length),
                amount: obj .amount,
                pa: fromNullable (obj .pa),
                price: fromNullable (obj .price),
                pro: fromNullable (obj .pro),
                range: Maybe.fmap<number[], List<number>> (List.fromArray)
                                                          (fromNullable (obj .range)),
                reloadTime: fromNullable (obj .reloadTime),
                stp: fromNullable (obj .stp),
                weight: obj .weight,
                stabilityMod: fromNullable (obj .stabilityMod),
              }),
            ];
          }
        )
      ),

      armorZones: hero .belongings .armorZones
        ? OrderedMap.fromArray (
          Object.entries (hero .belongings .armorZones)
            .map<[string, Record<HitZoneArmor>]> (
              ([id, obj]) => [
                id,
                HitZoneArmor ({
                  id,
                  name: obj .name,
                  head: fromNullable (obj .head),
                  headLoss: fromNullable (obj .headLoss),
                  leftArm: fromNullable (obj .leftArm),
                  leftArmLoss: fromNullable (obj .leftArmLoss),
                  rightArm: fromNullable (obj .rightArm),
                  rightArmLoss: fromNullable (obj .rightArmLoss),
                  torso: fromNullable (obj .torso),
                  torsoLoss: fromNullable (obj .torsoLoss),
                  leftLeg: fromNullable (obj .leftLeg),
                  leftLegLoss: fromNullable (obj .leftLegLoss),
                  rightLeg: fromNullable (obj .rightLeg),
                  rightLegLoss: fromNullable (obj .rightLegLoss),
                }),
              ]
            )
        )
        : OrderedMap.empty,

      purse: Purse (hero .belongings .purse),

      isInItemCreation: false,
      isInZoneArmorCreation: false,
    }),

    rules: Rules ({
      ...hero.rules,
      enabledRuleBooks: OrderedSet.fromArray (hero.rules.enabledRuleBooks),
    }),

    pets: hero .pets
      ? OrderedMap.fromArray (
        Object.entries (hero .pets)
          .map<[string, Record<Pet>]> (
            ([id, obj]) => [
              id,
              Pet ({
                id,
                name: obj .name,
                avatar: fromNullable (obj .avatar),
                size: fromNullable (obj .size),
                type: fromNullable (obj .type),
                attack: fromNullable (obj .attack),
                dp: fromNullable (obj .dp),
                reach: fromNullable (obj .reach),
                actions: fromNullable (obj .actions),
                talents: fromNullable (obj .talents),
                skills: fromNullable (obj .skills),
                notes: fromNullable (obj .notes),
                spentAp: fromNullable (obj .spentAp),
                totalAp: fromNullable (obj .totalAp),
                cou: fromNullable (obj .cou),
                sgc: fromNullable (obj .sgc),
                int: fromNullable (obj .int),
                cha: fromNullable (obj .cha),
                dex: fromNullable (obj .dex),
                agi: fromNullable (obj .agi),
                con: fromNullable (obj .con),
                str: fromNullable (obj .str),
                lp: fromNullable (obj .lp),
                ae: fromNullable (obj .ae),
                spi: fromNullable (obj .spi),
                tou: fromNullable (obj .tou),
                pro: fromNullable (obj .pro),
                ini: fromNullable (obj .ini),
                mov: fromNullable (obj .mov),
                at: fromNullable (obj .at),
                pa: fromNullable (obj .pa),
              })]
          )
      )
      : OrderedMap.empty,

    isInPetCreation: false,
    blessedStyleDependencies: List.empty,
    combatStyleDependencies: List.empty,
    magicalStyleDependencies: List.empty,
  })

const getActivatableDependent =
  (source: StringKeyObject<Raw.RawActiveObject[]>): HeroModel['advantages'] =>
    OrderedMap.fromArray (
      Object.entries (source) .map<[string, Record<ActivatableDependent>]> (
        ([id, active]) => [
          id,
          createActivatableDependentWithActive (fromArray (active .map (e => ActiveObject ({
                                                  cost: fromNullable (e .cost),
                                                  sid: fromNullable (e .sid),
                                                  sid2: fromNullable (e .sid2),
                                                  tier: fromNullable (e .tier),
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
          ? 'advantages'
          : elem (Categories.DISADVANTAGES) (category)
          ? 'disadvantages'
          : 'specialAbilities'

      return {
        ...acc,
        [key]: OrderedMap.insert<string, Record<ActivatableDependent>> (id) (obj) (acc [key]),
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

const { advantages, disadvantages, specialAbilities, spells } = HeroModel.A

export const convertFromRawHero =
  (wiki: WikiModelRecord) => (hero: Raw.RawHero): HeroModelRecord => {
    const intermediateState = createHeroObject (hero)

    const activeAdvantages = getActiveFromState (advantages (intermediateState))
    const activeDisadvantages = getActiveFromState (disadvantages (intermediateState))
    const activeSpecialAbilities = getActiveFromState (specialAbilities (intermediateState))

    const { active, id } = ActivatableSkillDependent.A

    const activeSpells =
      OrderedMap.foldr<Record<ActivatableSkillDependent>, OrderedSet<string>>
        (spell => active (spell) ? insert (id (spell)) : ident)
        (OrderedSet.empty)
        (spells (intermediateState))

    const addAllDependencies = pipe (
      advantages.foldl<HeroModelRecord> (
        state => entry => Maybe.fromMaybe (state) (
          wiki.get ('advantages').lookup (entry.get ('id'))
            .fmap (
              wikiEntry => addDependencies (
                state,
                getCombinedPrerequisites (
                  wikiEntry,
                  intermediateState.get ('advantages').lookup (entry.get ('id')),
                  entry as any as Record<Data.ActiveObject>,
                  true
                ),
                entry.get ('id')
              )
            )
        )
      ),
      disadvantages.foldl<HeroModelRecord> (
        state => entry => Maybe.fromMaybe (state) (
          wiki.get ('disadvantages').lookup (entry.get ('id'))
            .fmap (
              wikiEntry => addDependencies (
                state,
                getCombinedPrerequisites (
                  wikiEntry,
                  intermediateState.get ('disadvantages').lookup (entry.get ('id')),
                  entry as any as Record<Data.ActiveObject>,
                  true
                ),
                entry.get ('id')
              )
            )
        )
      ),
      specialAbilities.foldl<HeroModelRecord> (
        state => entry => Maybe.fromMaybe (state) (
          wiki.get ('specialAbilities').lookup (entry.get ('id'))
            .fmap (
              wikiEntry => addAllStyleRelatedDependencies (
                addDependencies (
                  state,
                  getCombinedPrerequisites (
                    wikiEntry,
                    intermediateState.get ('specialAbilities').lookup (entry.get ('id')),
                    entry as any as Record<Data.ActiveObject>,
                    true
                  ),
                  entry.get ('id')
                ),
                wikiEntry
              )
            )
        )
      ),
      spells.foldl<HeroModelRecord> (
        state => spellId => Maybe.fromMaybe (state) (
          wiki.get ('spells').lookup (spellId)
            .fmap (
              wikiEntry => addDependencies (
                state,
                wikiEntry.get ('prerequisites'),
                spellId
              )
            )
        )
      )
    );

    return addAllDependencies (intermediateState);
  }
