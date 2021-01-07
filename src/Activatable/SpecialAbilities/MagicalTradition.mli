module Static : sig
  type specialRule =
    | Labeled of { label : string; text : string }
    | Plain of string

  type t = {
    id : int;
    name : string;
    nameForArcaneSpellworks : string option;
    nameInWiki : string option;
    levels : int option;
    max : int option;
    specialRules : specialRule list;
    selectOptions : SelectOption.map;
    input : string option;
    primary : int option;
    useHalfPrimaryForArcaneEnergy : bool;
    canLearnCantrips : bool;
    canLearnSpells : bool;
    canLearnRituals : bool;
    allowMultipleTraditions : bool;
    alternativeDisAdvApMax : int option;
    isMagicalDilettante : bool;
    areDisAdvRequiredApplyToMagActionsOrApps : bool;
    useArcaneSpellworksFromTradition : int option;
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

val primary_attribute : Dynamic.t Ley_IntMap.t -> int option
