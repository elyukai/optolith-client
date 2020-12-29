module Dynamic : sig
  (** The state of a derived characteristic.

      The [base] value is the result of the given calculation. The [modifier] is
      a value that is added to the [base] value. It's source are entries that
      change the value of that derived characteristic. The [currentAdded] is the
      current amount of bought points and the [permanentLost] is how many points
      have been permanently lost. The end result of combining all values is the
      [value]. *)
  type state =
    | Inactive
    | Basic of { value : int; base : int }
    | Energy of {
        value : int;
        base : int;
        modifier : int;
        currentAdded : int;
        maxAddable : int;
        permanentLost : int;
      }
    | EnergyWithBoughtBack of {
        value : int;
        base : int;
        modifier : int;
        currentAdded : int;
        maxAddable : int;
        permanentLost : int;
        permanentBoughtBack : int;
      }

  type t = { id : int; calc : string; state : state }
end

module Static : sig
  type t = {
    id : int;
    name : string;
    nameAbbr : string;
    calc : string;
    calcHalfPrimary : string option;
    calcNoPrimary : string option;
  }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end
