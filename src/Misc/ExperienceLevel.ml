type t = {
  id : int;
  name : string;
  ap : int;
  maxAttributeValue : int;
  maxSkillRating : int;
  maxCombatTechniqueRating : int;
  maxAttributeTotal : int;
  maxNumberSpellsLiturgicalChants : int;
  maxUnfamiliarSpells : int;
}

module Decode = Json_Decode_Static.Make (struct
  type nonrec t = t

  module Translation = struct
    type t = { name : string }

    let t json = Json_Decode_Strict.{ name = json |> field "name" string }

    let pred _ = true
  end

  type multilingual = {
    id : int;
    ap : int;
    maxAttributeValue : int;
    maxSkillRating : int;
    maxCombatTechniqueRating : int;
    maxAttributeTotal : int;
    maxNumberSpellsLiturgicalChants : int;
    maxUnfamiliarSpells : int;
    translations : Translation.t Json_Decode_TranslationMap.partial;
  }

  let multilingual decodeTranslations json =
    Json_Decode_Strict.
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
        translations = json |> field "translations" decodeTranslations;
      }

  let make _ (multilingual : multilingual) (translation : Translation.t) =
    Some
      {
        id = multilingual.id;
        name = translation.name;
        ap = multilingual.ap;
        maxAttributeValue = multilingual.maxAttributeValue;
        maxSkillRating = multilingual.maxSkillRating;
        maxCombatTechniqueRating = multilingual.maxCombatTechniqueRating;
        maxAttributeTotal = multilingual.maxAttributeTotal;
        maxNumberSpellsLiturgicalChants =
          multilingual.maxNumberSpellsLiturgicalChants;
        maxUnfamiliarSpells = multilingual.maxUnfamiliarSpells;
      }

  module Accessors = struct
    let id (x : t) = x.id

    let translations x = x.translations
  end
end)
