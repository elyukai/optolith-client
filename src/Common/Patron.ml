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
      primary_patron_cultures : Id.Culture.Set.t;
      translations : translation TranslationMap.t;
    }

    let multilingual =
      field "id" int
      >>= fun id ->
      field "primary_patron_cultures" Id.Culture.Decode.set
      >>= fun primary_patron_cultures ->
      field "translations" (TranslationMap.Decode.t translation)
      >>= fun translations ->
      succeed { id; primary_patron_cultures; translations }

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
          primary_patron_cultures = multilingual.primary_patron_cultures;
        } )
  end
end

type culture = All | Only of Id.Culture.Set.t | Except of Id.Culture.Set.t

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
  culture : culture;
  powers : power NonEmptyList.t list;
  cost : int option;
  ic : ImprovementCost.t option;
}

module Decode = struct
  open Decoders_bs.Decode

  let culture =
    field "tag" string
    >>= function
    | "All" -> succeed All
    | "Only" ->
        field "list" Id.Culture.Decode.set >>= fun list -> succeed (Only list)
    | "Except" ->
        field "list" Id.Culture.Decode.set >>= fun list -> succeed (Except list)
    | _ -> fail "Expected a culture"

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
        field "id" Id.Advantage.Decode.t
        >>= fun id ->
        field_opt "level" int
        >>= fun level ->
        field_opt "option" int
        >>= fun option -> succeed (Advantage { id; level; option })
    | "Skill" ->
        field "id" Id.Skill.Decode.t
        >>= fun id ->
        field "value" int >>= fun value -> succeed (Skill { id; value })
    | "Combat" ->
        field "id" combat_value
        >>= fun combat_value ->
        field "value" int
        >>= fun value -> succeed (Combat { combat_value; value })
    | "Attribute" ->
        field "id" Id.Attribute.Decode.t
        >>= fun id ->
        field "value" int >>= fun value -> succeed (Attribute { id; value })
    | _ -> fail "Expected a power"

  type translation = { name : string }

  let translation = field "name" string >>= fun name -> succeed { name }

  type multilingual = {
    id : int;
    category : int;
    skills : Id.Skill.t * Id.Skill.t * Id.Skill.t;
    culture : culture;
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
      (list Id.Skill.Decode.t
      >>= function
      | [ id1; id2; id3 ] -> succeed (id1, id2, id3)
      | _ -> fail "Expected an array of three identifiers")
    >>= fun skills ->
    field "culture" culture
    >>= fun culture ->
    field_opt "powers" (NonEmptyList.Decode.t (NonEmptyList.Decode.t power))
    >>= fun powers ->
    field_opt "cost" int
    >>= fun cost ->
    field_opt "ic" ImprovementCost.Decode.t
    >>= fun ic ->
    field "translations" (TranslationMap.Decode.t translation)
    >>= fun translations ->
    succeed { id; category; skills; culture; powers; cost; ic; translations }

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
        culture = multilingual.culture;
        powers =
          multilingual.powers |> Option.fold ~none:[] ~some:NonEmptyList.to_list;
        cost = multilingual.cost;
        ic = multilingual.ic;
      } )
end
