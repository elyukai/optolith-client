module Category = struct
  type t = {
    id : int;
    name : string;
    primary_patron_cultures : Id.Culture.Set.t;
  }

  module Decode = struct
    open Decoders_bs.Decode

    type translation = { name : string }

    let translation = field "name" string >>= fun name -> succeed { name }

    type multilingual = {
      id : int;
      primaryPatronCultures : int list;
      translations : translation TranslationMap.t;
    }

    let multilingual =
      field "id" int
      >>= fun id ->
      field "primaryPatronCultures" (list int)
      >>= fun primaryPatronCultures ->
      field "translations" (TranslationMap.Decode.t translation)
      >>= fun translations ->
      succeed { id; primaryPatronCultures; translations }

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
  ic : ImprovementCost.t option;
}

module Decode = struct
  open Decoders_bs.Decode

  type translation = { name : string }

  let translation = field "name" string >>= fun name -> succeed { name }

  let combat_value =
    string
    >>= function
    | "Attack" -> succeed Attack
    | "Parry" -> succeed Parry
    | "RangedCombat" -> succeed RangedCombat
    | "Dodge" -> succeed Dodge
    | "DamagePoints" -> succeed DamagePoints
    | "Protection" -> succeed Protection
    | _ -> fail "Expected a combat value"

  let power =
    field "type" string
    >>= function
    | "Advantage" ->
        field "value"
          (field "id" Id.Advantage.Decode.t
          >>= fun id ->
          field_opt "level" int
          >>= fun level ->
          field_opt "option" int
          >>= fun option -> succeed (Advantage { id; level; option }))
    | "Skill" ->
        field "value"
          (field "id" Id.Skill.Decode.t
          >>= fun id ->
          field "value" int >>= fun value -> succeed (Skill { id; value }))
    | "Combat" ->
        field "value"
          (field "id" combat_value
          >>= fun combat_value ->
          field "value" int
          >>= fun value -> succeed (Combat { combat_value; value }))
    | "Attribute" ->
        field "value"
          (field "id" Id.Attribute.Decode.t
          >>= fun id ->
          field "value" int >>= fun value -> succeed (Attribute { id; value }))
    | _ -> fail "Expected a power"

  type multilingual = {
    id : int;
    category : int;
    skills : Id.Skill.t * Id.Skill.t * Id.Skill.t;
    limitedToCultures : int list;
    isLimitedToCulturesReverse : bool;
    powers : power NonEmptyList.t NonEmptyList.t option;
    cost : int option;
    ic : ImprovementCost.t option;
    translations : translation TranslationMap.t;
  }

  let multilingual =
    field "id" int
    >>= fun id ->
    field "category" int
    >>= fun category ->
    field "skills"
      Parsing.Infix.(
        Id.Skill.Decode.t
        >>=:: fun id1 ->
        Id.Skill.Decode.t
        >>=:: fun id2 ->
        Id.Skill.Decode.t >>=:: fun id3 -> succeed (id1, id2, id3))
    >>= fun skills ->
    field "limitedToCultures" (list int)
    >>= fun limitedToCultures ->
    field_opt "powers" (NonEmptyList.Decode.t (NonEmptyList.Decode.t power))
    >>= fun powers ->
    field_opt "cost" int
    >>= fun cost ->
    field_opt "ic" ImprovementCost.Decode.t
    >>= fun ic ->
    field "isLimitedToCulturesReverse" bool
    >>= fun isLimitedToCulturesReverse ->
    field "translations" (TranslationMap.Decode.t translation)
    >>= fun translations ->
    succeed
      {
        id;
        category;
        skills;
        limitedToCultures;
        powers;
        cost;
        ic;
        isLimitedToCulturesReverse;
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
