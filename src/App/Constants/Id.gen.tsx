/* TypeScript file generated from Id.re by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:interface-over-type-literal
export type t = 
    { tag: "ExperienceLevel"; value: number }
  | { tag: "Race"; value: number }
  | { tag: "Culture"; value: number }
  | { tag: "Profession"; value: number }
  | { tag: "Attribute"; value: number }
  | { tag: "Advantage"; value: number }
  | { tag: "Disadvantage"; value: number }
  | { tag: "Skill"; value: number }
  | { tag: "CombatTechnique"; value: number }
  | { tag: "Spell"; value: number }
  | { tag: "Curse"; value: number }
  | { tag: "ElvenMagicalSong"; value: number }
  | { tag: "DominationRitual"; value: number }
  | { tag: "MagicalMelody"; value: number }
  | { tag: "MagicalDance"; value: number }
  | { tag: "RogueSpell"; value: number }
  | { tag: "AnimistForce"; value: number }
  | { tag: "GeodeRitual"; value: number }
  | { tag: "ZibiljaRitual"; value: number }
  | { tag: "Cantrip"; value: number }
  | { tag: "LiturgicalChant"; value: number }
  | { tag: "Blessing"; value: number }
  | { tag: "SpecialAbility"; value: number }
  | { tag: "Item"; value: number }
  | { tag: "EquipmentPackage"; value: number }
  | { tag: "HitZoneArmor"; value: number }
  | { tag: "Familiar"; value: number }
  | { tag: "Animal"; value: number }
  | { tag: "FocusRule"; value: number }
  | { tag: "OptionalRule"; value: number }
  | { tag: "Condition"; value: number }
  | { tag: "State"; value: number };
export type Id = t;

// tslint:disable-next-line:interface-over-type-literal
export type activatable = 
    { tag: "Advantage"; value: number }
  | { tag: "Disadvantage"; value: number }
  | { tag: "SpecialAbility"; value: number };
export type ActivatableId = activatable;

// tslint:disable-next-line:interface-over-type-literal
export type activatableAndSkill = 
    { tag: "Advantage"; value: number }
  | { tag: "Disadvantage"; value: number }
  | { tag: "SpecialAbility"; value: number }
  | { tag: "Spell"; value: number }
  | { tag: "LiturgicalChant"; value: number };
export type ActivatableAndSkillId = activatableAndSkill;

// tslint:disable-next-line:interface-over-type-literal
export type activatableSkill = 
    { tag: "Spell"; value: number }
  | { tag: "LiturgicalChant"; value: number };
export type ActivatableSkillId = activatableSkill;

// tslint:disable-next-line:interface-over-type-literal
export type permanentSkill = 
    { tag: "Skill"; value: number }
  | { tag: "CombatTechnique"; value: number };
export type PermanentSkillId = permanentSkill;

// tslint:disable-next-line:interface-over-type-literal
export type selectOption = 
    { tag: "Generic"; value: number }
  | { tag: "Skill"; value: number }
  | { tag: "CombatTechnique"; value: number }
  | { tag: "Spell"; value: number }
  | { tag: "Cantrip"; value: number }
  | { tag: "LiturgicalChant"; value: number }
  | { tag: "Blessing"; value: number };
export type SelectOptionId = selectOption;

// tslint:disable-next-line:interface-over-type-literal
export type hitZoneArmorZoneItem = 
    { tag: "Template"; value: number }
  | { tag: "Custom"; value: number };
export type HitZoneArmorZoneItemId = hitZoneArmorZoneItem;

// tslint:disable-next-line:interface-over-type-literal
export type phase = "Outline" | "Definition" | "Advancement";
export type Phase = phase;
