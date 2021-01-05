module Info = struct
  type t = {
    note : string option;
    rules : string option;
    advantage : string option;
    disadvantage : string option;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = struct
    module Translation = struct
      type t = {
        note : string option;
        rules : string option;
        advantage : string option;
        disadvantage : string option;
        errata : Erratum.list option;
      }

      let t json =
        Json_Decode_Strict.
          {
            note = json |> optionalField "note" string;
            rules = json |> optionalField "rules" string;
            advantage = json |> optionalField "advantage" string;
            disadvantage = json |> optionalField "disadvantage" string;
            errata = json |> optionalField "errata" Erratum.Decode.list;
          }

      let pred _ = true
    end

    module TranslationMap = Json_Decode_TranslationMap.Make (Translation)

    type multilingual = {
      src : PublicationRef.Decode.multilingual list;
      translations : TranslationMap.t;
    }

    let multilingual json =
      Json.Decode.
        {
          src = json |> field "src" PublicationRef.Decode.multilingualList;
          translations = json |> field "translations" TranslationMap.t;
        }

    let make langs (multilingual : multilingual) (translation : Translation.t) =
      Some
        {
          note = translation.note;
          rules = translation.rules;
          advantage = translation.advantage;
          disadvantage = translation.disadvantage;
          src =
            PublicationRef.Decode.resolveTranslationsList langs multilingual.src;
          errata = translation.errata |> Ley_Option.fromOption [];
        }

    let resolveTranslations langs x =
      Ley_Option.Infix.(
        x.translations
        |> TranslationMap.getFromLanguageOrder langs
        >>= make langs x)
  end
end

module MundaneItem = struct
  type t = { structurePoints : int OneOrMany.t option }

  let decode json =
    Json_Decode_Strict.
      {
        structurePoints =
          json |> optionalField "structurePoints" (OneOrMany.Decode.t int);
      }
end

module PrimaryAttributeDamageThreshold = struct
  type newAttribute = { attribute : int; threshold : int }

  let decodeNewAttribute json =
    Json.Decode.
      {
        attribute = json |> field "attribute" int;
        threshold = json |> field "threshold" int;
      }

  type agilityStrength = { agility : int; strength : int }

  let decodeAgilityStrength =
    Json.Decode.(
      pair int int |> map (fun x -> { agility = fst x; strength = snd x }))

  type t =
    | DefaultAttribute of int
    | DifferentAttribute of newAttribute
    | AgilityStrength of agilityStrength

  let decode =
    Json.Decode.(
      oneOf
        [
          int |> map (fun x -> DefaultAttribute x);
          decodeNewAttribute |> map (fun x -> DifferentAttribute x);
          decodeAgilityStrength |> map (fun x -> AgilityStrength x);
        ])
end

module Damage = struct
  type t = { amount : int; sides : int; flat : int option }

  let decode json =
    Json_Decode_Strict.
      {
        amount = json |> field "damageDiceNumber" int;
        sides = json |> field "damageDiceSides" int;
        flat = json |> optionalField "damageFlat" int;
      }
end

module MeleeWeapon = struct
  type t = {
    combatTechnique : int;
    damage : Damage.t;
    primaryAttributeDamageThreshold : PrimaryAttributeDamageThreshold.t option;
    at : int option;
    pa : int option;
    reach : int option;
    length : int option;
    structurePoints : int OneOrMany.t option;
    isParryingWeapon : bool;
    isTwoHandedWeapon : bool;
    isImprovisedWeapon : bool;
  }

  let decode json =
    Json_Decode_Strict.
      {
        combatTechnique = json |> field "combatTechnique" int;
        damage = json |> Damage.decode;
        primaryAttributeDamageThreshold =
          json
          |> optionalField "damageThreshold"
               PrimaryAttributeDamageThreshold.decode;
        at = json |> optionalField "at" int;
        pa = json |> optionalField "pa" int;
        reach = json |> optionalField "reach" int;
        length = json |> optionalField "length" int;
        structurePoints =
          json |> optionalField "structurePoints" (OneOrMany.Decode.t int);
        isParryingWeapon = json |> field "isParryingWeapon" bool;
        isTwoHandedWeapon = json |> field "isTwoHandedWeapon" bool;
        isImprovisedWeapon = json |> field "isImprovisedWeapon" bool;
      }
end

module RangedWeapon = struct
  type t = {
    combatTechnique : int;
    damage : Damage.t option;
    length : int option;
    range : int * int * int;
    reloadTime : int OneOrMany.t;
    ammunition : int option;
    isImprovisedWeapon : bool;
  }

  let decode json =
    Json_Decode_Strict.(
      Ley_Option.
        {
          combatTechnique = json |> field "combatTechnique" int;
          damage =
            liftM2
              (fun amount sides ->
                {
                  Damage.amount;
                  sides;
                  flat = json |> optionalField "damageFlat" int;
                })
              (json |> optionalField "damageDiceNumber" int)
              (json |> optionalField "damageDiceSides" int);
          length = json |> optionalField "length" int;
          range =
            ( json |> field "closeRange" int,
              json |> field "mediumRange" int,
              json |> field "farRange" int );
          reloadTime = json |> field "reloadTime" (OneOrMany.Decode.t int);
          ammunition = json |> optionalField "ammunition" int;
          isImprovisedWeapon = json |> field "isImprovisedWeapon" bool;
        })
end

module Armor = struct
  type t = {
    protection : int;
    encumbrance : int;
    hasAdditionalPenalties : bool;
    armorType : int;
  }

  let decode json =
    Json.Decode.
      {
        protection = json |> field "protection" int;
        encumbrance = json |> field "encumbrance" int;
        hasAdditionalPenalties = json |> field "hasAdditionalPenalties" bool;
        armorType = json |> field "armorType" int;
      }
end

type special =
  | MundaneItem of MundaneItem.t
  | MeleeWeapon of MeleeWeapon.t
  | RangedWeapon of RangedWeapon.t
  | CombinedWeapon of MeleeWeapon.t * RangedWeapon.t
  | Armor of Armor.t

type t = {
  id : int;
  name : string;
  price : int option;
  weight : int option;
  special : special option;
  info : Info.t list;
  gr : int;
}

module Decode = Json_Decode_Static.Make (struct
  type nonrec t = t

  module Translation = struct
    type t = { name : string; info : Info.Decode.multilingual list }

    let t json =
      Json.Decode.
        {
          name = json |> field "name" string;
          info =
            json
            |> field "versions"
                 (oneOf
                    [
                      Info.Decode.multilingual |> map Ley_List.return;
                      list Info.Decode.multilingual;
                    ]);
        }

    let pred _ = true
  end

  let combinedWeapon json =
    Json.Decode.
      ( json |> field "melee" MeleeWeapon.decode,
        json |> field "ranged" RangedWeapon.decode )

  let special =
    Json.Decode.(
      oneOf
        [
          MundaneItem.decode |> map (fun x -> MundaneItem x);
          MeleeWeapon.decode |> map (fun x -> MeleeWeapon x);
          RangedWeapon.decode |> map (fun x -> RangedWeapon x);
          combinedWeapon |> map (fun (m, r) -> CombinedWeapon (m, r));
          Armor.decode |> map (fun x -> Armor x);
        ])

  type multilingual = {
    id : int;
    price : int option;
    weight : int option;
    special : special option;
    gr : int;
    translations : Translation.t Json_Decode_TranslationMap.partial;
  }

  let multilingual decodeTranslations json =
    Json_Decode_Strict.
      {
        id = json |> field "id" int;
        price = json |> optionalField "price" int;
        weight = json |> optionalField "weight" int;
        special = json |> optionalField "special" special;
        gr = json |> field "gr" int;
        translations = json |> field "translations" decodeTranslations;
      }

  let make langs (multilingual : multilingual) (translation : Translation.t) =
    Some
      {
        id = multilingual.id;
        name = translation.name;
        price = multilingual.price;
        weight = multilingual.weight;
        special = multilingual.special;
        gr = multilingual.gr;
        info =
          translation.info
          |> Ley_Option.mapOption (Info.Decode.resolveTranslations langs);
      }

  module Accessors = struct
    let id (x : t) = x.id

    let translations x = x.translations
  end
end)
