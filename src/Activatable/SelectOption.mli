type staticEntry =
  | Blessing of Blessing.Static.t
  | Cantrip of Cantrip.Static.t
  | TradeSecret of TradeSecret.t
  | Language of Language.t
  | Script of Script.t
  | AnimalShape of AnimalShape.t
  | SpellEnhancement of Enhancement.t
  | LiturgicalChantEnhancement of Enhancement.t
  | ArcaneBardTradition of ArcaneTradition.t
  | ArcaneDancerTradition of ArcaneTradition.t
  | Element of Element.t
  | Property of Property.t
  | Aspect of Aspect.t
  | Disease of Disease.t
  | Poison of Poison.t
  | MeleeCombatTechnique of CombatTechnique.Melee.Static.t
  | RangedCombatTechnique of CombatTechnique.Ranged.Static.t
  | LiturgicalChant of LiturgicalChant.Static.t
  | Ceremony of Ceremony.Static.t
  | Skill of Skill.Static.t
  | Spell of Spell.Static.t
  | Ritual of Ritual.Static.t

type t = {
  id : Id.Activatable.SelectOption.t;
  name : string;
  apValue : int option;
  prerequisites : Prerequisite.Collection.General.t;
  description : string option;
  isSecret : bool option;
  languages : int list option;
  continent : int option;
  isExtinct : bool option;
  specializations : string list option;
  specializationInput : string option;
  animalGr : int option;
  animalLevel : int option;
  enhancementTarget : int option;
  enhancementLevel : int option;
  staticEntry : staticEntry option;
  applications : Skill.Static.Application.t list option;
      (** needed to be able to filter valid applications without altering the
          static entry *)
  src : PublicationRef.t list;
  errata : Erratum.t list;
}

module Map : Ley_Map.T with type key = Id.Activatable.SelectOption.t

type map = t Map.t

module Decode : sig
  type multilingual

  val multilingual : multilingual Json.Decode.decoder

  val resolve :
    blessings:Blessing.Static.t Ley_IntMap.t ->
    cantrips:Cantrip.Static.t Ley_IntMap.t ->
    trade_secrets:TradeSecret.t Ley_IntMap.t ->
    languages:Language.t Ley_IntMap.t ->
    scripts:Script.t Ley_IntMap.t ->
    animal_shapes:AnimalShape.t Ley_IntMap.t ->
    animal_shape_sizes:AnimalShape.Size.t Ley_IntMap.t ->
    arcane_bard_traditions:ArcaneTradition.t Ley_IntMap.t ->
    arcane_dancer_traditions:ArcaneTradition.t Ley_IntMap.t ->
    elements:Element.t Ley_IntMap.t ->
    properties:Property.t Ley_IntMap.t ->
    aspects:Aspect.t Ley_IntMap.t ->
    diseases:Disease.t Ley_IntMap.t ->
    poisons:Poison.t Ley_IntMap.t ->
    melee_combat_techniques:CombatTechnique.Melee.Static.t Ley_IntMap.t ->
    ranged_combat_techniques:CombatTechnique.Ranged.Static.t Ley_IntMap.t ->
    liturgical_chants:LiturgicalChant.Static.t Ley_IntMap.t ->
    ceremonies:Ceremony.Static.t Ley_IntMap.t ->
    skills:Skill.Static.t Ley_IntMap.t ->
    spells:Spell.Static.t Ley_IntMap.t ->
    rituals:Ritual.Static.t Ley_IntMap.t ->
    src:PublicationRef.list ->
    errata:Erratum.list ->
    Locale.Order.t ->
    multilingual ->
    map
end
