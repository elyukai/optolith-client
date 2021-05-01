type t = {
  id : int;
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
  open Json.Decode

  type translation = { name : string }

  let translation json = { name = json |> field "name" string }

  type multilingual = {
    id : int;
    ap : int;
    maxAttributeValue : int;
    maxSkillRating : int;
    maxCombatTechniqueRating : int;
    maxAttributeTotal : int;
    maxNumberSpellsLiturgicalChants : int;
    maxUnfamiliarSpells : int;
    translations : translation TranslationMap.t;
  }

  let multilingual json =
    {
      id = json |> field "id" int;
      ap = json |> field "ap" int;
      maxAttributeValue = json |> field "maxAttributeValue" int;
      maxSkillRating = json |> field "maxSkillRating" int;
      maxCombatTechniqueRating = json |> field "maxCombatTechniqueRating" int;
      maxAttributeTotal = json |> field "maxAttributeTotal" int;
      maxNumberSpellsLiturgicalChants =
        json |> field "maxNumberSpellsLiturgicalChants" int;
      maxUnfamiliarSpells = json |> field "maxUnfamiliarSpells" int;
      translations =
        json |> field "translations" (TranslationMap.Decode.t translation);
    }

  let make_assoc locale_order json =
    let open Option.Infix in
    json |> multilingual |> fun multilingual ->
    multilingual.translations |> TranslationMap.preferred locale_order
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
