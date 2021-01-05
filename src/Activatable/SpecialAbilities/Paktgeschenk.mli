module Static : sig
  type permanentDemonicConsumption = Fixed of int | PerLevel of int

  type automaticEntryTarget =
    | MagicalTraditions
    | MagicalDilettanteTraditions
    | Fixed of Id.Activatable.t

  type automaticEntryAction = Add | Remove

  type automaticEntry = {
    action : automaticEntryAction;
    noCost : bool;
    target : automaticEntryTarget;
  }

  type t = {
    id : int;
    name : string;
    nameInWiki : string option;
    levels : int option;
    max : int option;
    effect : string;
    selectOptions : SelectOption.map;
    input : string option;
    permanentDemonicConsumption : permanentDemonicConsumption option;
    automaticEntries : automaticEntry list;
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
