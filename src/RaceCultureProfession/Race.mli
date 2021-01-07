module Static : sig
  module Variant : sig
    type t = {
      id : int;
      name : string;
      common_cultures : Ley_IntSet.t;
      common_advantages : int list;
      common_advantages_text : string option;
      common_disadvantages : int list;
      common_disadvantages_text : string option;
      uncommon_advantages : int list;
      uncommon_advantages_text : string option;
      uncommon_disadvantages : int list;
      uncommon_disadvantages_text : string option;
      hair_colors : int list;
      eye_colors : int list;
      size_base : int;
      size_random : Dice.t list;
    }
  end

  type starting_age_options = {
    experience_level : int;
    base : int;
    random : Dice.t;
  }

  type variant_options =
    | WithVariants of { variants : Variant.t Ley_IntMap.t }
    | WithoutVariants of {
        common_cultures : Ley_IntSet.t;
        hair_colors : int list;
        eye_colors : int list;
        size_base : int;
        size_random : Dice.t list;
      }

  type t = {
    id : int;
    name : string;
    ap_value : int;
    lp : int;
    spi : int;
    tou : int;
    mov : int;
    attribute_adjustments : int Ley_IntMap.t;
    attribute_adjustments_selection_value : int;
    attribute_adjustments_selection_list : Ley_IntSet.t;
    attribute_adjustments_text : string;
    automatic_advantages : int list;
    automatic_advantages_text : string option;
    strongly_recommended_advantages : int list;
    strongly_recommended_advantages_text : string option;
    strongly_recommended_disadvantages : int list;
    strongly_recommended_disadvantages_text : string option;
    common_advantages : int list;
    common_advantages_text : string option;
    common_disadvantages : int list;
    common_disadvantages_text : string option;
    uncommon_advantages : int list;
    uncommon_advantages_text : string option;
    uncommon_disadvantages : int list;
    uncommon_disadvantages_text : string option;
    weight_base : int;
    weight_random : Dice.t list;
    starting_age : starting_age_options Ley_IntMap.t;
    variant_options : variant_options;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end

module Dynamic : sig
  type id = Base of int | WithVariant of { base : int; variant : int }

  type t = { id : id; static : Static.t option }
end
