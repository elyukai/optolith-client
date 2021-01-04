module Static : sig
  type t = {
    id : int;
    name : string;
    nameInWiki : string option;
    levels : int option;
    max : int option;
    effect : string;
    selectOptions : SelectOption.map;
    input : string option;
    aeCost : string;
    property : Activatable_Shared.Property.t;
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
