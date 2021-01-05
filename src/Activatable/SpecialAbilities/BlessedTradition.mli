module Static : sig
  type specialRule =
    | Labeled of { label : string; text : string }
    | Plain of string

  type favoredCombatTechniques =
    | All
    | AllMelee
    | AllUsedInHunting
    | Specific of Id.CombatTechnique.t list

  type favoredSkillsSelection = { amount : int; options : int list }

  type t = {
    id : int;
    name : string;
    nameShort : string option;
    nameInWiki : string option;
    levels : int option;
    max : int option;
    specialRules : specialRule list;
    selectOptions : SelectOption.map;
    input : string option;
    primary : int;
    aspects : (int * int) option;
    restrictedBlessings : int list;
    favoredCombatTechniques : favoredCombatTechniques option;
    favoredSkills : int list;
    favoredSkillsSelection : favoredSkillsSelection option;
    isShamanistic : bool;
    prerequisites : Prerequisite.Collection.AdvantageDisadvantage.t;
    prerequisitesText : string option;
    prerequisitesTextStart : string option;
    prerequisitesTextEnd : string option;
    apValue : Activatable_Shared.ApValue.t option;
    apValueText : string option;
    apValueTextAppend : string option;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val assoc : t Activatable_Shared.Decode.decodeAssoc
  end
end

module Dynamic : Activatable_Dynamic.S with type static = Static.t
