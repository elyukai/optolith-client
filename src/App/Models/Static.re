module SourceRef = {
  type t = {
    id: string,
    page: (int, int),
  };
};

module Erratum = {
  type t = {
    date: Js.Date.t,
    description: string,
  };
};

module Prerequisites = {
  type oneOrMany('a) =
    | Single('a)
    | OneOf(list('a));

  module SexPrerequisite = {
    type sex =
      | Male
      | Female;

    type t = sex;
  };

  module RacePrerequisite = {
    type raceId = oneOrMany(string);

    type t = {
      id: raceId,
      active: bool,
    };
  };

  module CulturePrerequisite = {
    type cultureId = oneOrMany(string);

    type t = cultureId;
  };

  module SocialPrerequisite = {
    type t = int;
  };

  module PactPrerequisite = {
    type t = {
      category: int,
      domain: option(oneOrMany(int)),
      level: option(int),
    };
  };

  module PrimaryAttributePrerequisite = {
    type primaryAttributeType =
      | Magical
      | Blessed;

    type t = {
      value: int,
      scope: primaryAttributeType,
    };
  };

  module ActivatablePrerequisite = {
    type id =
      | Advantage(string)
      | Disadvantage(string)
      | SpecialAbility(string);

    type t = {
      id,
      active: bool,
      sid: option(Ids.selectOptionId),
      sid2: option(Ids.selectOptionId),
      tier: option(int),
    };
  };

  module ActivatableSkillPrerequisite = {
    type id =
      | Spell(string)
      | LiturgicalChant(string);

    type t = {
      id,
      active: bool,
    };
  };

  module ActivatableMultiEntryPrerequisite = {
    type t = {
      id: list(ActivatablePrerequisite.id),
      active: bool,
      sid: option(Ids.selectOptionId),
      sid2: option(Ids.selectOptionId),
      tier: option(int),
    };
  };

  module ActivatableMultiSelectPrerequisite = {
    type t = {
      id: ActivatablePrerequisite.id,
      active: bool,
      sid: list(Ids.selectOptionId),
      sid2: option(Ids.selectOptionId),
      tier: option(int),
    };
  };

  module IncreasablePrerequisite = {
    type id =
      | Attribute(string)
      | Skill(string)
      | CombatTechnique(string)
      | Spell(string)
      | LiturgicalChant(string);

    type t = {
      id,
      value: int,
    };
  };

  module IncreasableMultiEntryPrerequisite = {
    type t = {
      id: list(IncreasablePrerequisite.id),
      value: int,
    };
  };

  type tProfession = {
    sex: option(SexPrerequisite.t),
    race: option(RacePrerequisite.t),
    culture: option(CulturePrerequisite.t),
    activatable: list(ActivatablePrerequisite.t),
    increasable: list(IncreasablePrerequisite.t),
  };

  type t = {
    sex: option(SexPrerequisite.t),
    race: option(RacePrerequisite.t),
    culture: option(CulturePrerequisite.t),
    pact: option(PactPrerequisite.t),
    social: option(SocialPrerequisite.t),
    primaryAttribute: option(PrimaryAttributePrerequisite.t),
    activatable: list(ActivatablePrerequisite.t),
    activatableMultiEntry: list(ActivatableMultiEntryPrerequisite.t),
    activatableMultiSelect: list(ActivatableMultiSelectPrerequisite.t),
    increasable: list(IncreasablePrerequisite.t),
    increasableMultiEntry: list(IncreasableMultiEntryPrerequisite.t),
  };

  type tWithLevel = {
    sex: option(SexPrerequisite.t),
    race: option(RacePrerequisite.t),
    culture: option(CulturePrerequisite.t),
    pact: option(PactPrerequisite.t),
    social: option(SocialPrerequisite.t),
    primaryAttribute: option(PrimaryAttributePrerequisite.t),
    activatable: list(ActivatablePrerequisite.t),
    activatableMultiEntry: list(ActivatableMultiEntryPrerequisite.t),
    activatableMultiSelect: list(ActivatableMultiSelectPrerequisite.t),
    increasable: list(IncreasablePrerequisite.t),
    increasableMultiEntry: list(IncreasableMultiEntryPrerequisite.t),
    levels: IntMap.t(t),
  };

  type commonSuggestedByRCP =
    | Common
    | Uncommon;

  type tWithLevelDisAdv = {
    commonSuggestedByRCP,
    sex: option(SexPrerequisite.t),
    race: option(RacePrerequisite.t),
    culture: option(CulturePrerequisite.t),
    pact: option(PactPrerequisite.t),
    social: option(SocialPrerequisite.t),
    primaryAttribute: option(PrimaryAttributePrerequisite.t),
    activatable: list(ActivatablePrerequisite.t),
    activatableMultiEntry: list(ActivatableMultiEntryPrerequisite.t),
    activatableMultiSelect: list(ActivatableMultiSelectPrerequisite.t),
    increasable: list(IncreasablePrerequisite.t),
    increasableMultiEntry: list(IncreasableMultiEntryPrerequisite.t),
    levels: IntMap.t(t),
  };

  type overwritePrerequisite =
    | Hide
    | ReplaceWith(string);

  type tIndex = {
    sex: option(overwritePrerequisite),
    race: option(overwritePrerequisite),
    culture: option(overwritePrerequisite),
    pact: option(overwritePrerequisite),
    social: option(overwritePrerequisite),
    primaryAttribute: option(overwritePrerequisite),
    activatable: IntMap.t(overwritePrerequisite),
    activatableMultiEntry: IntMap.t(overwritePrerequisite),
    activatableMultiSelect: IntMap.t(overwritePrerequisite),
    increasable: IntMap.t(overwritePrerequisite),
    increasableMultiEntry: IntMap.t(overwritePrerequisite),
  };

  type tIndexWithLevel = {
    sex: option(overwritePrerequisite),
    race: option(overwritePrerequisite),
    culture: option(overwritePrerequisite),
    pact: option(overwritePrerequisite),
    social: option(overwritePrerequisite),
    primaryAttribute: option(overwritePrerequisite),
    activatable: IntMap.t(overwritePrerequisite),
    activatableMultiEntry: IntMap.t(overwritePrerequisite),
    activatableMultiSelect: IntMap.t(overwritePrerequisite),
    increasable: IntMap.t(overwritePrerequisite),
    increasableMultiEntry: IntMap.t(overwritePrerequisite),
    levels: IntMap.t(tIndex),
  };
};

module Skill = {
  module Application = {
    type t = {
      id: int,
      name: string,
      prerequisite: option(Prerequisites.ActivatablePrerequisite.t),
    };
  };

  module Use = {
    type t = {
      id: int,
      name: string,
      prerequisite: Prerequisites.ActivatablePrerequisite.t,
    };
  };

  type encumbrance =
    | True
    | False
    | Maybe;

  type t = {
    id: string,
    name: string,
    check: list(string),
    encumbrance,
    encumbranceDescription: option(string),
    gr: int,
    ic: IC.t,
    applications: list(Application.t),
    applicationsInput: option(string),
    uses: list(Use.t),
    tools: option(string),
    quality: string,
    failed: string,
    critical: string,
    botch: string,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module SelectOption = {
  type t = {
    id: Ids.selectOptionId,
    name: string,
    cost: option(int),
    prerequisites: option(unit),
    description: option(string),
    isSecret: option(bool),
    languages: option(list(int)),
    continent: option(int),
    isExtinct: option(bool),
    specializations: option(list(string)),
    specializationInput: option(string),
    gr: option(int),
    level: option(int),
    target: option(string),
    applications: option(list(Skill.Application.t)),
    applicationInput: option(string),
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module Advantage = {
  type cost =
    | Flat(int)
    | PerLevel(list(int));

  type t = {
    id: string,
    name: string,
    cost,
    noMaxAPInfluence: bool,
    isExclusiveToArcaneSpellworks: bool,
    input: option(string),
    max: option(int),
    levels: option(int),
    select: option(list(SelectOption.t)),
    rules: string,
    range: option(string),
    actions: option(string),
    prerequisites: Prerequisites.tWithLevelDisAdv,
    prerequisitesText: option(string),
    prerequisitesTextIndex: option(Prerequisites.tIndexWithLevel),
    prerequisitesTextStart: option(string),
    prerequisitesTextEnd: option(string),
    apValue: option(string),
    apValueAppend: option(string),
    gr: int,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module AnimistForce = {};

module Attribute = {
  type t = {
    id: string,
    name: string,
    short: string,
  };
};

module BlessedTradition = {
  type t = {
    id: string,
    numId: int,
    name: string,
    primary: string,
    aspects: option((int, int)),
  };
};

module Blessing = {};

module Cantrip = {};

module CombatTechnique = {
  type t = {
    id: string,
    name: string,
    ic: IC.t,
    primary: list(string),
    special: option(string),
    hasNoParry: bool,
    bpr: int,
    gr: int,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module Condition = {
  type t = {
    id: string,
    name: string,
    description: option(string),
    levelColumnDescription: option(string),
    levelDescriptions: (string, string, string, string),
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module Culture = {
  type commonProfessionId =
    | Profession(string)
    | ProfessionGroup(int);

  type commonProfessions =
    | All
    | OneOf(list(commonProfessionId))
    | ExceptFor(list(commonProfessionId));

  module IncreaseSkill = {
    type t = {
      id: string,
      value: int,
    };
  };

  type t = {
    id: string,
    name: string,
    culturalPackageAdventurePoints: int,
    languages: list(int),
    scripts: list(int),
    socialStatus: list(int),
    areaKnowledge: string,
    areaKnowledgeShort: string,
    commonProfessions: (
      commonProfessions,
      commonProfessions,
      commonProfessions,
    ),
    commonMundaneProfessions: option(string),
    commonMagicProfessions: option(string),
    commonBlessedProfessions: option(string),
    commonAdvantages: list(string),
    commonAdvantagesText: option(string),
    commonDisadvantages: list(string),
    commonDisadvantagesText: option(string),
    uncommonAdvantages: list(string),
    uncommonAdvantagesText: option(string),
    uncommonDisadvantages: list(string),
    uncommonDisadvantagesText: option(string),
    commonSkills: list(string),
    uncommonSkills: list(string),
    commonNames: string,
    culturalPackageSkills: list(IncreaseSkill.t),
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module Curse = {};

module DerivedCharacteristic = {
  type t = {
    id: string,
    name: string,
    short: string,
    calc: string,
    calcHalfPrimary: option(string),
    calcNoPrimary: option(string),
  };
};

module Disadvantage = {
  type t = {
    id: string,
    name: string,
    cost: Advantage.cost,
    noMaxAPInfluence: bool,
    isExclusiveToArcaneSpellworks: bool,
    input: option(string),
    max: option(int),
    levels: option(int),
    select: option(list(SelectOption.t)),
    rules: string,
    range: option(string),
    actions: option(string),
    prerequisites: Prerequisites.tWithLevelDisAdv,
    prerequisitesText: option(string),
    prerequisitesTextIndex: option(Prerequisites.tIndexWithLevel),
    prerequisitesTextStart: option(string),
    prerequisitesTextEnd: option(string),
    apValue: option(string),
    apValueAppend: option(string),
    gr: int,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module DominationRitual = {};

module ElvenMagicalSong = {};

module EquipmentPackage = {
  type t = {
    id: string,
    name: string,
    items: StrMap.t(int),
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module ExperienceLevel = {
  type t = {
    id: string,
    name: string,
    ap: int,
    maxAttributeValue: int,
    maxSkillRating: int,
    maxCombatTechniqueRating: int,
    maxTotalAttributeValues: int,
    maxSpellsLiturgicalChants: int,
    maxUnfamiliarSpells: int,
  };
};

module FocusRule = {
  type t = {
    id: string,
    name: string,
    level: int,
    subject: int,
    description: string,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module GeodeRitual = {};

module Item = {};

module LiturgicalChant = {};

module MagicalDance = {};

module MagicalMelody = {};

module MagicalTradition = {
  type t = {
    id: string,
    numId: option(int),
    name: string,
    primary: option(string),
    aeMod: option(float),
    canLearnCantrips: bool,
    canLearnSpells: bool,
    canLearnRituals: bool,
    allowMultipleTraditions: bool,
    isDisAdvAPMaxHalved: bool,
    areDisAdvRequiredApplyToMagActionsOrApps: bool,
  };
};

module Messages = {};

module OptionalRule = {
  type t = {
    id: string,
    name: string,
    description: string,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module PactCategory = {
  type t = {
    id: int,
    name: string,
    types: IntMap.t(string),
    domains: IntMap.t(string),
  };
};

module Patron = {
  module Category = {
    [@genType "PatronCategory"]
    type t = {
      /**
     * The patron category's ID.
     */
      id: int,
      /**
     * The name of the patron category.
     */
      name: string,
      /**
     * The list of cultures where patrons from this category can be the primary
     * patron.
     */
      primaryPatronCultures: array(int),
    };
  };

  [@genType "Patron"]
  type t = {
    /**
   * The patron's ID.
   */
    id: int,
    /**
   * The name of the patron.
   */
    name: string,
    /**
   * The category of the patron.
   */
    category: int,
    /**
   * The patron-specific skills.
   */
    skills: (int, int, int),
    /**
   * If defined, the patron is limited to the listed cultures.
   */
    limitedToCultures: array(int),
    /**
   * If `true`, the patron is limited to every culture *except* the listed
   * cultures in `limitedToCultures`. Does not have an effect if
   * `limitedToCultures` is not defined.
   */
    isLimitedToCulturesReverse: option(bool),
  };
};

module Profession = {
  module NameBySex = {
    type t = {
      m: string,
      f: string,
    };
  };

  module IncreaseSkillList = {
    type t = {
      id: list(string),
      value: int,
    };
  };

  module Options = {
    module CantripSelection = {
      type t = {
        amount: int,
        sid: list(string),
      };
    };

    module CombatTechniqueSelection = {
      type second = {
        amount: int,
        value: int,
      };

      type t = {
        amount: int,
        value: int,
        second: option(second),
        sid: list(string),
      };

      type tForVariant =
        | Remove
        | Overwrite(t);
    };

    module CurseSelection = {
      type t = int;
    };

    module LanguageScriptSelection = {
      type t = int;

      type tForVariant =
        | Remove
        | Overwrite(t);
    };

    module SkillSpecializationSelection = {
      type t =
        | Single(string)
        | OneOf(list(string));
    };

    module SkillSelection = {
      type t = {
        /**
     * If specified, only choose from skills of the specified group.
     */
        gr: option(int),
        /**
     * The AP value the user can spend.
     */
        value: int,
      };
    };

    module TerrainKnowledgeSelection = {
      type t = list(int);
    };

    type t = {
      cantrips: option(CantripSelection.t),
      combatTechniques: option(CombatTechniqueSelection.t),
      curses: option(CurseSelection.t),
      languagesScripts: option(LanguageScriptSelection.t),
      skillSpecialization: option(SkillSpecializationSelection.t),
      skills: option(SkillSelection.t),
      terrainKnowledge: option(TerrainKnowledgeSelection.t),
      guildMageUnfamiliarSpell: bool,
    };

    type tForVariant = {
      cantrips: option(CantripSelection.t),
      combatTechniques: option(CombatTechniqueSelection.tForVariant),
      curses: option(CurseSelection.t),
      languagesScripts: option(LanguageScriptSelection.tForVariant),
      skillSpecialization: option(SkillSpecializationSelection.t),
      skills: option(SkillSelection.t),
      terrainKnowledge: option(TerrainKnowledgeSelection.t),
      guildMageUnfamiliarSpell: bool,
    };
  };

  type name =
    | Const(string)
    | BySex(NameBySex.t);

  type skillIncrease =
    | Flat(Culture.IncreaseSkill.t)
    | Selection(IncreaseSkillList.t);

  module Variant = {
    type t = {
      id: string,
      name,
      ap: int,
      prerequisites: Prerequisites.tProfession,
      selections: Options.tForVariant,
      specialAbilities: list(Prerequisites.ActivatablePrerequisite.t),
      combatTechniques: list(Culture.IncreaseSkill.t),
      skills: list(Culture.IncreaseSkill.t),
      spells: list(skillIncrease),
      liturgicalChants: list(skillIncrease),
      blessings: list(string),
      precedingText: option(string),
      fullText: option(string),
      concludingText: option(string),
      errata: list(Erratum.t),
    };
  };

  type t = {
    id: string,
    name,
    subname: option(name),
    ap: option(int),
    prerequisites: Prerequisites.tProfession,
    prerequisitesStart: option(string),
    prerequisitesEnd: option(string),
    selections: Options.t,
    specialAbilities: list(Prerequisites.ActivatablePrerequisite.t),
    combatTechniques: list(Culture.IncreaseSkill.t),
    skills: list(Culture.IncreaseSkill.t),
    spells: list(skillIncrease),
    liturgicalChants: list(skillIncrease),
    blessings: list(string),
    suggestedAdvantages: list(string),
    suggestedAdvantagesText: option(string),
    suggestedDisadvantages: list(string),
    suggestedDisadvantagesText: option(string),
    unsuitableAdvantages: list(string),
    unsuitableAdvantagesText: option(string),
    unsuitableDisadvantages: list(string),
    unsuitableDisadvantagesText: option(string),
    isVariantRequired: bool,
    variants: list(Variant.t),
    gr: int,
    /**
   * Divides the groups into smaller subgroups, e.g. "Mage", "Blessed One of the
   * Twelve Gods" or "Fighter".
   */
    subgr: int,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module Publication = {
  type t = {
    id: string,
    name: string,
    short: string,
    isCore: bool,
    isAdultContent: bool,
  };
};

module Race = {
  module Die = {
    type t = {
      amount: int,
      sides: int,
    };
  };

  module Variant = {
    type t = {
      id: string,
      name: string,
      commonCultures: list(string),
      commonAdvantages: list(string),
      commonAdvantagesText: option(string),
      commonDisadvantages: list(string),
      commonDisadvantagesText: option(string),
      uncommonAdvantages: list(string),
      uncommonAdvantagesText: option(string),
      uncommonDisadvantages: list(string),
      uncommonDisadvantagesText: option(string),
      hairColors: list(int),
      eyeColors: list(int),
      sizeBase: int,
      sizeRandom: list(Die.t),
    };
  };

  type t = {
    id: string,
    name: string,
    ap: int,
    lp: int,
    spi: int,
    tou: int,
    mov: int,
    attributeAdjustments: list((string, int)),
    attributeAdjustmentsSelection: (int, list(string)),
    attributeAdjustmentsText: string,
    commonCultures: list(string),
    automaticAdvantages: list(string),
    automaticAdvantagesText: option(string),
    stronglyRecommendedAdvantages: list(string),
    stronglyRecommendedAdvantagesText: option(string),
    stronglyRecommendedDisadvantages: list(string),
    stronglyRecommendedDisadvantagesText: option(string),
    commonAdvantages: list(string),
    commonAdvantagesText: option(string),
    commonDisadvantages: list(string),
    commonDisadvantagesText: option(string),
    uncommonAdvantages: list(string),
    uncommonAdvantagesText: option(string),
    uncommonDisadvantages: list(string),
    uncommonDisadvantagesText: option(string),
    hairColors: option(list(int)),
    eyeColors: option(list(int)),
    sizeBase: option(int),
    sizeRandom: option(list(Die.t)),
    weightBase: int,
    weightRandom: list(Die.t),
    variants: list(Variant.t),
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module RogueSpell = {};

module SkillGroup = {
  type t = {
    id: int,
    name: string,
    fullName: string,
  };
};

module SpecialAbility = {};

module Spell = {};

module State = {
  type t = {
    id: string,
    name: string,
    description: string,
    src: list(SourceRef.t),
    errata: list(Erratum.t),
  };
};

module ZibiljaRitual = {};

type t = {
  // advantages: StrMap.t(Advantage.t),
  // animistForces: StrMap.t(AnimistForce.t),
  arcaneBardTraditions: IntMap.t(string),
  arcaneDancerTraditions: IntMap.t(string),
  armorTypes: IntMap.t(string),
  aspects: IntMap.t(string),
  attributes: StrMap.t(Attribute.t),
  // blessedTraditions: StrMap.t(BlessedTradition.t),
  // blessings: StrMap.t(Blessing.t),
  brews: IntMap.t(string),
  // cantrips: StrMap.t(Cantrip.t),
  combatSpecialAbilityGroups: IntMap.t(string),
  combatTechniqueGroups: IntMap.t(string),
  // combatTechniques: StrMap.t(CombatTechnique.t),
  // conditions: StrMap.t(Condition.t),
  // cultures: StrMap.t(Culture.t),
  // curses: StrMap.t(Curse.t),
  // derivedCharacteristics: StrMap.t(DerivedCharacteristic),
  // disadvantages: StrMap.t(Disadvantage.t),
  // dominationRituals: StrMap.t(DominationRitual.t),
  // elvenMagicalSongs: StrMap.t(ElvenMagicalSong.t),
  // itemTemplates: StrMap.t(ItemTemplate.t),
  equipmentGroups: IntMap.t(string),
  // equipmentPackages: StrMap.t(EquipmentPackage.t),
  // experienceLevels: StrMap.t(ExperienceLevel.t),
  eyeColors: IntMap.t(string),
  // focusRules: StrMap.t(FocusRule.t),
  // geodeRituals: StrMap.t(GeodeRitual.t),
  hairColors: IntMap.t(string),
  liturgicalChantEnhancements: IntMap.t(SelectOption.t),
  liturgicalChantGroups: IntMap.t(string),
  // liturgicalChants: StrMap.t(LiturgicalChant.t),
  // magicalDances: StrMap.t(MagicalDance.t),
  // magicalMelodies: StrMap.t(MagicalMelody.t),
  // magicalTraditions: StrMap.t(MagicalTradition.t),
  optionalRules: StrMap.t(OptionalRule.t),
  // pacts: IntMap.t(PactCategory.t),
  // professions: StrMap.t(Profession.t),
  // professionVariants: StrMap.t(ProfessionVariant.t),
  properties: IntMap.t(string),
  publications: StrMap.t(Publication.t),
  // races: StrMap.t(Race),
  // raceVariants: StrMap.t(RaceVariant.t),
  // reaches: IntMap.t(string),
  // rogueSpells: StrMap.t(RogueSpell.t),
  // skillGroups: IntMap.t(SkillGroup.t),
  skills: StrMap.t(Skill.t),
  socialStatuses: IntMap.t(string),
  // specialAbilities: StrMap.t(SpecialAbility.t),
  specialAbilityGroups: IntMap.t(string),
  spellEnhancements: IntMap.t(SelectOption.t),
  spellGroups: IntMap.t(string),
  // spells: StrMap.t(Spell.t),
  // states: StrMap.t(State.t),
  subjects: IntMap.t(string),
  tribes: IntMap.t(string),
  // ui: L10n,
  // zibiljaRituals: StrMap.t(ZibiljaRitual.t),
};
