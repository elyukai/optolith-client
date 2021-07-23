(**
 * This module contains definitions and simple utility functions for both the
 * dynamic and the static parts of a combat technique.
 *)

module Melee : sig
  module Static : sig
    type t = {
      id : Id.MeleeCombatTechnique.t;
      name : string;
      special : string option;
      primary_attribute : Id.Attribute.t list;
      improvement_cost : ImprovementCost.t;
      breaking_point_rating : int;
      parry : bool;
      src : PublicationRef.list;
      errata : Erratum.list;
    }

    module Decode : sig
      val make_assoc : (Id.MeleeCombatTechnique.t, t) Parsing.make_assoc
    end
  end

  module Dynamic :
    Rated.Dynamic.S
      with type id = Id.MeleeCombatTechnique.t
       and type static = Static.t
end

module Ranged : sig
  module Static : sig
    type t = {
      id : Id.RangedCombatTechnique.t;
      name : string;
      special : string option;
      primary_attribute : Id.Attribute.t list;
      improvement_cost : ImprovementCost.t;
      breaking_point_rating : int;
      src : PublicationRef.list;
      errata : Erratum.list;
    }

    module Decode : sig
      val make_assoc : (Id.RangedCombatTechnique.t, t) Parsing.make_assoc
    end
  end

  module Dynamic :
    Rated.Dynamic.S
      with type id = Id.RangedCombatTechnique.t
       and type static = Static.t
end
