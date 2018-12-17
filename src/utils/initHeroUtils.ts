import * as R from 'ramda';
import { Categories } from '../constants/Categories';
import * as Data from '../types/data';
import * as Raw from '../types/rawdata';
import { WikiAll } from '../types/wiki';
import { getCombinedPrerequisites } from './activatableActivationUtils';
import { getActiveFromState } from './activatableConvertUtils';
import * as CreateDependencyObjectUtils from './createEntryUtils';
import { List, Maybe, OrderedMap, OrderedSet, Record, StringKeyObject } from './dataUtils';
import { addDependencies } from './dependencies/dependencyUtils';
import { exists } from './exists';
import { addAllStyleRelatedDependencies } from './ExtendedStyleUtils';
import { getCategoryById } from './IDUtils';
import { currentVersion } from './VersionUtils';

const getUnchangedProperties = (id: string, hero: Raw.RawHero) => {
  const {
    clientVersion,
    name,
    avatar,
    ap,
    r,
    rv,
    c,
    p,
    pv,
    professionName,
    sex,
    phase,
    el,
    pers,
  } = hero;

  return {
    id,
    clientVersion,
    phase,
    name,
    avatar,
    adventurePointsTotal: ap.total,
    race: r,
    raceVariant: rv,
    culture: c,
    profession: p,
    professionName,
    professionVariant: pv,
    sex,
    experienceLevel: el,
    personalData: Record.of (pers),
  };
};

const getPlayer = (hero: Raw.RawHero) => {
  const { player } = hero;

  return {
    player: player && player.id,
  };
};

const getDates = (hero: Raw.RawHero) => {
  const { dateCreated, dateModified } = hero;

  return {
    dateCreated: new Date (dateCreated),
    dateModified: new Date (dateModified),
  };
};

const getActivatableDependent = (
  source: StringKeyObject<Data.ActiveObject[]>
): (OrderedMap<string, Record<Data.ActivatableDependent>>) =>
  OrderedMap.of (
    Object.entries (source).map<[string, Record<Data.ActivatableDependent>]> (
      ([id, active]) => [
        id,
        CreateDependencyObjectUtils.createActivatableDependent (
          id,
          { active: List.of (...active.map (Record.of)) }
        ),
      ]
    )
  );

interface ActivatableMaps {
  advantages: OrderedMap<string, Record<Data.ActivatableDependent>>;
  disadvantages: OrderedMap<string, Record<Data.ActivatableDependent>>;
  specialAbilities: OrderedMap<string, Record<Data.ActivatableDependent>>;
}

const getActivatables = (hero: Raw.RawHero): ActivatableMaps => {
  const objectsInMap = getActivatableDependent (hero.activatable);

  return objectsInMap.foldlWithKey<ActivatableMaps> (
    acc => id => obj => {
      const category = getCategoryById (id);

      if (category.equals (Maybe.pure (Categories.ADVANTAGES))) {
        return {
          ...acc,
          advantages: acc.advantages.insert (id) (obj),
        };
      }
      else if (category.equals (Maybe.pure (Categories.DISADVANTAGES))) {
        return {
          ...acc,
          disadvantages: acc.disadvantages.insert (id) (obj),
        };
      }
      else if (category.equals (Maybe.pure (Categories.SPECIAL_ABILITIES))) {
        return {
          ...acc,
          specialAbilities: acc.specialAbilities.insert (id) (obj),
        };
      }

      return acc;
    }
  ) (
    {
      advantages: OrderedMap.empty (),
      disadvantages: OrderedMap.empty (),
      specialAbilities: OrderedMap.empty (),
    }
  );
};

const getAttributes = (
  hero: Raw.RawHero
): (OrderedMap<string, Record<Data.AttributeDependent>>) =>
  OrderedMap.of (
    hero.attr.values.map<[string, Record<Data.AttributeDependent>]> (
      ({ id, value }) => [
        id,
        CreateDependencyObjectUtils.createAttributeDependent (
          id,
          { value }
        ),
      ]
    )
  );

const getEnergies = (hero: Raw.RawHero): Record<Data.Energies> => {
  const {
    attr: {
      ae: addedArcaneEnergyPoints,
      kp: addedKarmaPoints,
      lp: addedLifePoints,
      permanentAE,
      permanentKP,
      permanentLP = { lost: 0 },
    },
  } = hero;

  return Record.of<Data.Energies> ({
    addedArcaneEnergyPoints,
    addedKarmaPoints,
    addedLifePoints,
    permanentArcaneEnergyPoints: Record.of (permanentAE),
    permanentKarmaPoints: Record.of (permanentKP),
    permanentLifePoints: Record.of (permanentLP),
  });
};

const getDependentSkills = (
  source: StringKeyObject<number>
): (OrderedMap<string, Record<Data.SkillDependent>>) =>
  OrderedMap.of (
    Object.entries (source) .map<[string, Record<Data.SkillDependent>]> (
      ([id, value]) => [
        id,
        CreateDependencyObjectUtils.createDependentSkill (value) (id),
      ]
    )
  );

const getSkills = (
  hero: Raw.RawHero
): (OrderedMap<string, Record<Data.SkillDependent>>) =>
  getDependentSkills (hero.talents);

const getCombatTechniques = (
  hero: Raw.RawHero
): (OrderedMap<string, Record<Data.SkillDependent>>) =>
  getDependentSkills (hero.ct);

const getActivatableDependentSkills = (
  source: StringKeyObject<number>
): (OrderedMap<string, Record<Data.ActivatableSkillDependent>>) =>
  OrderedMap.of (
    Object.entries (source)
      .map<[string, Record<Data.ActivatableSkillDependent>]> (
        ([id, value]) => [
          id,
          CreateDependencyObjectUtils.createActivatableDependentSkill (id, {
            active: true,
            value,
          }),
        ]
      )
  );

const getSpells = (
  hero: Raw.RawHero
): (OrderedMap<string, Record<Data.ActivatableSkillDependent>>) =>
  getActivatableDependentSkills (hero.spells);

const getCantrips = (
  hero: Raw.RawHero
): OrderedSet<string> =>
  OrderedSet.of (hero.cantrips);

const getLiturgicalChants = (
  hero: Raw.RawHero
): (OrderedMap<string, Record<Data.ActivatableSkillDependent>>) =>
  getActivatableDependentSkills (hero.liturgies);

const getBlessings = (
  hero: Raw.RawHero
): OrderedSet<string> =>
  OrderedSet.of (hero.blessings);

const getBelongings = (hero: Raw.RawHero): Record<Data.Belongings> => {
  const {
    items,
    armorZones,
    purse,
  } = hero.belongings;

  return Record.of<Data.Belongings> ({
    items: OrderedMap.of (
      Object.entries (items)
        .map<[string, Record<Data.ItemInstance>]> (
          ([id, obj]) => {
            const {
              imp,
              primaryThreshold,
              range,
              ...other
            } = obj;

            return [id, Record.of<Data.ItemInstance> ({
              ...other,
              improvisedWeaponGroup: imp,
              damageBonus: primaryThreshold && Record.of ({
                ...primaryThreshold,
                threshold: typeof primaryThreshold.threshold === 'object'
                  ? List.fromArray (primaryThreshold.threshold)
                  : primaryThreshold.threshold,
              }),
              range: range ? List.fromArray (range) : undefined,
            })];
          }
        )
    ),
    armorZones: armorZones
      ? OrderedMap.of (
        Object.entries (armorZones)
          .map<[string, Record<Data.ArmorZonesInstance>]> (
            ([id, obj]) => [id, Record.of (obj)]
          )
      )
      : OrderedMap.empty (),
    purse: Record.of (purse),
    isInItemCreation: false,
    isInZoneArmorCreation: false,
  });
};

const getRules =
  (hero: Raw.RawHero): Record<Data.Rules> =>
    Record.of ({
      ...hero.rules,
      enabledRuleBooks: OrderedSet.of (hero.rules.enabledRuleBooks),
    });

const getPets =
  (hero: Raw.RawHero): OrderedMap<string, Record<Data.PetInstance>> =>
    exists (hero.pets)
      ? OrderedMap.of (
          Object.entries (hero.pets)
            .map<[string, Record<Data.PetInstance>]> (
              ([id, obj]) => [id, Record.of<Data.PetInstance> (obj)]
            )
        )
      : OrderedMap.empty ();

export const getHeroInstance = (
  wiki: Record<WikiAll>,
  id: string,
  hero: Raw.RawHero
): Record<Data.HeroDependent> => {
  const intermediateState = Record.of<Data.HeroDependent> ({
    ...getUnchangedProperties (id, hero),
    ...getPlayer (hero),
    ...getDates (hero),
    ...getActivatables (hero),
    attributes: getAttributes (hero),
    attributeAdjustmentSelected: hero.attr.attributeAdjustmentSelected,
    energies: getEnergies (hero),
    skills: getSkills (hero),
    combatTechniques: getCombatTechniques (hero),
    spells: getSpells (hero),
    cantrips: getCantrips (hero),
    liturgicalChants: getLiturgicalChants (hero),
    blessings: getBlessings (hero),
    belongings: getBelongings (hero),
    rules: getRules (hero),
    pets: getPets (hero),
    isInPetCreation: false,
    combatStyleDependencies: List.of (),
    magicalStyleDependencies: List.of (),
    blessedStyleDependencies: List.of (),
  });

  const advantages = getActiveFromState (intermediateState.get ('advantages'));
  const disadvantages = getActiveFromState (intermediateState.get ('disadvantages'));
  const specialAbilities = getActiveFromState (intermediateState.get ('specialAbilities'));
  const spells = intermediateState.get ('spells').foldl<OrderedSet<string>> (
    acc => spell => spell.get ('active') ? acc.insert (spell.get ('id')) : acc
  ) (OrderedSet.empty ());

  const addAllDependencies = R.pipe (
    advantages.foldl<Record<Data.HeroDependent>> (
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
    disadvantages.foldl<Record<Data.HeroDependent>> (
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
    specialAbilities.foldl<Record<Data.HeroDependent>> (
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
    spells.foldl<Record<Data.HeroDependent>> (
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

export const getInitialHeroObject = (
  id: string,
  name: string,
  sex: 'm' | 'f',
  experienceLevel: string,
  totalAp: number,
  enableAllRuleBooks: boolean,
  enabledRuleBooks: OrderedSet<string>
): Record<Data.HeroDependent> => {
  return Record.of<Data.HeroDependent> ({
    id,
    clientVersion: currentVersion,
    phase: 1,
    name,
    adventurePointsTotal: totalAp,
    sex,
    experienceLevel,
    personalData: Record.of ({}),
    rules: Record.of<Data.Rules> ({
      higherParadeValues: 0,
      attributeValueLimit: false,
      enableAllRuleBooks,
      enabledRuleBooks,
      enableLanguageSpecializations: false,
    }),
    dateCreated: new Date (),
    dateModified: new Date (),
    advantages: OrderedMap.empty (),
    disadvantages: OrderedMap.empty (),
    specialAbilities: OrderedMap.empty (),
    attributes: OrderedMap.empty (),
    attributeAdjustmentSelected: 'ATTR_1',
    energies: Record.of ({
      addedArcaneEnergyPoints: 0,
      addedKarmaPoints: 0,
      addedLifePoints: 0,
      permanentArcaneEnergyPoints: Record.of ({
        lost: 0,
        redeemed: 0,
      }),
      permanentKarmaPoints: Record.of ({
        lost: 0,
        redeemed: 0,
      }),
      permanentLifePoints: Record.of ({
        lost: 0,
      }),
    }),
    skills: OrderedMap.empty (),
    combatTechniques: OrderedMap.empty (),
    spells: OrderedMap.empty (),
    cantrips: OrderedSet.empty (),
    liturgicalChants: OrderedMap.empty (),
    blessings: OrderedSet.empty (),
    belongings: Record.of<Data.Belongings> ({
      items: OrderedMap.empty (),
      armorZones: OrderedMap.empty (),
      purse: Record.of ({
        d: '',
        s: '',
        h: '',
        k: '',
      }),
      isInItemCreation: false,
      isInZoneArmorCreation: false,
    }),
    pets: OrderedMap.empty (),
    isInPetCreation: false,
    combatStyleDependencies: List.of (),
    magicalStyleDependencies: List.of (),
    blessedStyleDependencies: List.of (),
  });
};
