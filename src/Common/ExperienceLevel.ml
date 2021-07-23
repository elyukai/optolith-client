type t = {
  id : Id.ExperienceLevel.t;
  name : string;
  adventure_points : int;
  max_attribute_value : int;
  max_skill_rating : int;
  max_combat_technique_rating : int;
  max_attribute_total : int;
  max_number_of_spells_liturgical_chants : int;
  max_number_of_unfamiliar_spells : int;
}

module Decode = struct
  open Decoders_bs.Decode

  type translation = { name : string }

  let translation = field "name" string >>= fun name -> succeed { name }

  type multilingual = {
    id : Id.ExperienceLevel.t;
    adventure_points : int;
    max_attribute_value : int;
    max_skill_rating : int;
    max_combat_technique_rating : int;
    max_attribute_total : int;
    max_number_of_spells_liturgical_chants : int;
    max_number_of_unfamiliar_spells : int;
    translations : translation TranslationMap.t;
  }

  let multilingual =
    field "id" Id.ExperienceLevel.Decode.t
    >>= fun id ->
    field "adventure_points" int
    >>= fun adventure_points ->
    field "max_attribute_value" int
    >>= fun max_attribute_value ->
    field "max_skill_rating" int
    >>= fun max_skill_rating ->
    field "max_combat_technique_rating" int
    >>= fun max_combat_technique_rating ->
    field "max_attribute_total" int
    >>= fun max_attribute_total ->
    field "max_number_of_spells_liturgical_chants" int
    >>= fun max_number_of_spells_liturgical_chants ->
    field "max_number_of_unfamiliar_spells" int
    >>= fun max_number_of_unfamiliar_spells ->
    field "translations" (TranslationMap.Decode.t translation)
    >>= fun translations ->
    succeed
      {
        id;
        adventure_points;
        max_attribute_value;
        max_skill_rating;
        max_combat_technique_rating;
        max_attribute_total;
        max_number_of_spells_liturgical_chants;
        max_number_of_unfamiliar_spells;
        translations;
      }

  let make_assoc locale_order =
    let open Option.Infix in
    multilingual
    >|= fun multilingual ->
    multilingual.translations
    |> TranslationMap.preferred locale_order
    <&> fun translation ->
    ( multilingual.id,
      {
        id = multilingual.id;
        name = translation.name;
        adventure_points = multilingual.adventure_points;
        max_attribute_value = multilingual.max_attribute_value;
        max_skill_rating = multilingual.max_skill_rating;
        max_combat_technique_rating = multilingual.max_combat_technique_rating;
        max_attribute_total = multilingual.max_attribute_total;
        max_number_of_spells_liturgical_chants =
          multilingual.max_number_of_spells_liturgical_chants;
        max_number_of_unfamiliar_spells =
          multilingual.max_number_of_unfamiliar_spells;
      } )
end
