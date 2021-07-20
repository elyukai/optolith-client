type t = {
  id : Id.ExperienceLevel.t;
  name : string;
  ap : int;
  max_attribute_value : int;
  max_skill_rating : int;
  max_combat_technique_rating : int;
  max_attribute_total : int;
  max_number_spells_liturgical_chants : int;
  max_unfamiliar_spells : int;
}

module Decode = struct
  open Decoders_bs.Decode

  type translation = { name : string }

  let translation = field "name" string >>= fun name -> succeed { name }

  type multilingual = {
    id : Id.ExperienceLevel.t;
    ap : int;
    maxAttributeValue : int;
    maxSkillRating : int;
    maxCombatTechniqueRating : int;
    maxAttributeTotal : int;
    maxNumberSpellsLiturgicalChants : int;
    maxUnfamiliarSpells : int;
    translations : translation TranslationMap.t;
  }

  let multilingual =
    field "id" Id.ExperienceLevel.Decode.t
    >>= fun id ->
    field "ap" int
    >>= fun ap ->
    field "maxAttributeValue" int
    >>= fun maxAttributeValue ->
    field "maxSkillRating" int
    >>= fun maxSkillRating ->
    field "maxCombatTechniqueRating" int
    >>= fun maxCombatTechniqueRating ->
    field "maxAttributeTotal" int
    >>= fun maxAttributeTotal ->
    field "maxNumberSpellsLiturgicalChants" int
    >>= fun maxNumberSpellsLiturgicalChants ->
    field "maxUnfamiliarSpells" int
    >>= fun maxUnfamiliarSpells ->
    field "translations" (TranslationMap.Decode.t translation)
    >>= fun translations ->
    succeed
      {
        id;
        ap;
        maxAttributeValue;
        maxSkillRating;
        maxCombatTechniqueRating;
        maxAttributeTotal;
        maxNumberSpellsLiturgicalChants;
        maxUnfamiliarSpells;
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
        ap = multilingual.ap;
        max_attribute_value = multilingual.maxAttributeValue;
        max_skill_rating = multilingual.maxSkillRating;
        max_combat_technique_rating = multilingual.maxCombatTechniqueRating;
        max_attribute_total = multilingual.maxAttributeTotal;
        max_number_spells_liturgical_chants =
          multilingual.maxNumberSpellsLiturgicalChants;
        max_unfamiliar_spells = multilingual.maxUnfamiliarSpells;
      } )
end
