(**
 * This module contains definitions and simple utility functions for both the
 * dynamic and the static parts of a combat technique.
 *)

module Melee : sig
  module Static : sig
    type t = {
      id : Id.MeleeCombatTechnique.t;
      name : string;
      ic : ImprovementCost.t;
      primary : int list;
      special : string option;
      hasNoParry : bool;
      breakingPointRating : int;
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
      ic : ImprovementCost.t;
      primary : int list;
      special : string option;
      breakingPointRating : int;
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
