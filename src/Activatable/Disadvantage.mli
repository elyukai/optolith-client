module Static : sig
  type t = {
    id : int;
    name : string;
    nameInWiki : string option;
    noMaxAPInfluence : bool;
    isExclusiveToArcaneSpellworks : bool;
    levels : int option;
    max : int option;
    rules : string;
    selectOptions : SelectOption.map;
    input : string option;
    range : string option;
    prerequisites : Prerequisite.Collection.AdvantageDisadvantage.t;
    prerequisitesText : string option;
    prerequisitesTextStart : string option;
    prerequisitesTextEnd : string option;
    apValue : Activatable_Shared.ApValue.t option;
    apValueText : string option;
    apValueTextAppend : string option;
    gr : int;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val assoc : t Activatable_Shared.Decode.decodeAssoc
  end
end

module Dynamic : Activatable_Dynamic.S with type static = Static.t