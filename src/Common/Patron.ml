module Category = struct
  type t = {
    id : int;
    name : string;
    primary_patron_cultures : Id.Culture.Set.t;
  }

  module Decode = struct
    open Json.Decode

    type translation = { name : string }

    let translation json = { name = json |> field "name" string }

    type multilingual = {
      id : int;
      primaryPatronCultures : int list;
      translations : translation TranslationMap.t;
    }

    let multilingual json =
      {
        id = json |> field "id" int;
        primaryPatronCultures = json |> field "primaryPatronCultures" (list int);
        translations =
          json |> field "translations" (TranslationMap.Decode.t translation);
      }

    let make_assoc locale_order json =
      let open Option.Infix in
      json |> multilingual
      |> fun multilingual ->
      multilingual.translations
      |> TranslationMap.preferred locale_order
      <&> fun translation ->
      ( multilingual.id,
        {
          id = multilingual.id;
          name = translation.name;
          primary_patron_cultures =
            multilingual.primaryPatronCultures |> Id.Culture.Set.from_int_list;
        } )
  end
end

type combat_value =
  | Attack
  | Parry
  | RangedCombat
  | Dodge
  | DamagePoints
  | Protection

type power =
  | Advantage of {
      id : Id.Advantage.t;
      level : int option;
      option : int option;
    }
  | Skill of { id : Id.Skill.t; value : int }
  | Combat of { combat_value : combat_value; value : int }
  | Attribute of { id : Id.Attribute.t; value : int }

type t = {
  id : int;
  name : string;
  category : int;
  skills : Id.Skill.t * Id.Skill.t * Id.Skill.t;
  limited_to_cultures : Id.Culture.Set.t;
  is_limited_to_cultures_reverse : bool;
  powers : power NonEmptyList.t list;
  cost : int option;
  ic : IC.t option;
}

module Decode = struct
  open Json.Decode
  open JsonStrict

  type translation = { name : string }

  let translation json = { name = json |> field "name" string }

  let combat_value =
    string
    |> map (function
         | "Attack" -> Attack
         | "Parry" -> Parry
         | "RangedCombat" -> RangedCombat
         | "Dodge" -> Dodge
         | "DamagePoints" -> DamagePoints
         | "Protection" -> Protection
         | str ->
             JsonStatic.raise_unknown_variant ~variant_name:"combat_value"
               ~invalid:str)

  let power =
    field "type" string
    |> andThen (function
         | "Advantage" ->
             field "value" (fun json ->
                 Advantage
                   {
                     id = json |> field "id" Id.Advantage.Decode.t;
                     level = json |> optionalField "level" int;
                     option = json |> optionalField "option" int;
                   })
         | "Skill" ->
             field "value" (fun json ->
                 Skill
                   {
                     id = json |> field "id" Id.Skill.Decode.t;
                     value = json |> field "value" int;
                   })
         | "Combat" ->
             field "value" (fun json ->
                 Combat
                   {
                     combat_value = json |> field "id" combat_value;
                     value = json |> field "value" int;
                   })
         | "Attribute" ->
             field "value" (fun json ->
                 Attribute
                   {
                     id = json |> field "id" Id.Attribute.Decode.t;
                     value = json |> field "value" int;
                   })
         | str ->
             JsonStatic.raise_unknown_variant ~variant_name:"power" ~invalid:str)

  type multilingual = {
    id : int;
    category : int;
    skills : Id.Skill.t * Id.Skill.t * Id.Skill.t;
    limitedToCultures : int list;
    isLimitedToCulturesReverse : bool;
    powers : power NonEmptyList.t NonEmptyList.t option;
    cost : int option;
    ic : IC.t option;
    translations : translation TranslationMap.t;
  }

  let multilingual json =
    {
      id = json |> field "id" int;
      category = json |> field "category" int;
      skills =
        json
        |> field "skills"
             (tuple3 Id.Skill.Decode.t Id.Skill.Decode.t Id.Skill.Decode.t);
      limitedToCultures = json |> field "limitedToCultures" (list int);
      powers =
        json
        |> optionalField "powers"
             (NonEmptyList.Decode.t (NonEmptyList.Decode.t power));
      cost = json |> optionalField "cost" int;
      ic = json |> optionalField "ic" IC.Decode.t;
      isLimitedToCulturesReverse =
        json |> field "isLimitedToCulturesReverse" bool;
      translations =
        json |> field "translations" (TranslationMap.Decode.t translation);
    }

  let make_assoc locale_order json =
    let open Option.Infix in
    json |> multilingual
    |> fun multilingual ->
    multilingual.translations
    |> TranslationMap.preferred locale_order
    <&> fun translation ->
    ( multilingual.id,
      {
        id = multilingual.id;
        name = translation.name;
        category = multilingual.category;
        skills = multilingual.skills;
        limited_to_cultures =
          multilingual.limitedToCultures |> Id.Culture.Set.from_int_list;
        powers =
          multilingual.powers |> Option.fold ~none:[] ~some:NonEmptyList.to_list;
        cost = multilingual.cost;
        ic = multilingual.ic;
        is_limited_to_cultures_reverse = multilingual.isLimitedToCulturesReverse;
      } )
end
