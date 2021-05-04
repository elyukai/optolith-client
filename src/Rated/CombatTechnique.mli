(**
 * This module contains definitions and simple utility functions for both the
 * dynamic and the static parts of a combat technique.
 *)

module Melee : sig
  module Static : sig
    type t = {
      id : Id.MeleeCombatTechnique.t;
      name : string;
      ic : IC.t;
      primary : int list;
      special : string option;
      hasNoParry : bool;
      breakingPointRating : int;
      gr : int;
      src : PublicationRef.list;
      errata : Erratum.list;
    }

    module Decode : sig
      val make_assoc : (Id.MeleeCombatTechnique.t, t) JsonStatic.make_assoc
    end
  end

  module Dynamic : Rated.Dynamic.S with type static = Static.t
end

module Ranged : sig
  module Static : sig
    type t = {
      id : Id.RangedCombatTechnique.t;
      name : string;
      ic : IC.t;
      primary : int list;
      special : string option;
      breakingPointRating : int;
      gr : int;
      src : PublicationRef.list;
      errata : Erratum.list;
    }

    module Decode : sig
      val make_assoc : (Id.RangedCombatTechnique.t, t) JsonStatic.make_assoc
    end
  end

  module Dynamic : Rated.Dynamic.S with type static = Static.t
end
