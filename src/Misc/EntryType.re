module All = {
  type t =
    | ExperienceLevel
    | Race
    | Culture
    | Profession
    | Attribute
    | Advantage
    | Disadvantage
    | Skill
    | CombatTechnique
    | Spell
    | Curse
    | ElvenMagicalSong
    | DominationRitual
    | MagicalMelody
    | MagicalDance
    | RogueSpell
    | AnimistForce
    | GeodeRitual
    | ZibiljaRitual
    | Cantrip
    | LiturgicalChant
    | Blessing
    | SpecialAbility
    | Item
    | EquipmentPackage
    | HitZoneArmor
    | Familiar
    | Animal
    | FocusRule
    | OptionalRule
    | Condition
    | State;

  let toInt = x =>
    switch (x) {
    | ExperienceLevel => 1
    | Race => 2
    | Culture => 3
    | Profession => 4
    | Attribute => 5
    | Advantage => 6
    | Disadvantage => 7
    | Skill => 8
    | CombatTechnique => 9
    | Spell => 10
    | Curse => 11
    | ElvenMagicalSong => 12
    | DominationRitual => 13
    | MagicalMelody => 14
    | MagicalDance => 15
    | RogueSpell => 16
    | AnimistForce => 17
    | GeodeRitual => 18
    | ZibiljaRitual => 19
    | Cantrip => 20
    | LiturgicalChant => 21
    | Blessing => 22
    | SpecialAbility => 23
    | Item => 24
    | EquipmentPackage => 25
    | HitZoneArmor => 26
    | Familiar => 27
    | Animal => 28
    | FocusRule => 29
    | OptionalRule => 30
    | Condition => 31
    | State => 32
    };
};

module Activatable = {
  type t =
    | Advantage
    | Disadvantage
    | SpecialAbility;

  let toAll = x =>
    switch (x) {
    | Advantage => All.Advantage
    | Disadvantage => All.Disadvantage
    | SpecialAbility => All.SpecialAbility
    };

  module SelectOption = {
    type t =
      | Generic
      | Skill
      | CombatTechnique
      | Spell
      | Cantrip
      | LiturgicalChant
      | Blessing
      | SpecialAbility;

    let toInt = x =>
      switch (x) {
      | Generic => 1
      | Skill => 2
      | CombatTechnique => 3
      | Spell => 4
      | Cantrip => 5
      | LiturgicalChant => 6
      | Blessing => 7
      | SpecialAbility => 8
      };
  };
};

module ActivatableAndSkill = {
  type t =
    | Advantage
    | Disadvantage
    | SpecialAbility
    | Spell
    | LiturgicalChant;
};

module ActivatableSkill = {
  type t =
    | Spell
    | LiturgicalChant;
};

module PermanentSkill = {
  type t =
    | Skill
    | CombatTechnique;
};

module Increasable = {
  type t =
    | Attribute
    | Skill
    | CombatTechnique
    | Spell
    | LiturgicalChant;
};

module PrerequisiteSource = {
  type t =
    | Advantage
    | Disadvantage
    | SpecialAbility
    | Attribute
    | Skill
    | CombatTechnique
    | Spell
    | LiturgicalChant;
};
