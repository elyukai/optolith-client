module Info = {
  type t = {
    note: option(string),
    rules: option(string),
    advantage: option(string),
    disadvantage: option(string),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode = {
    module Translation = {
      type t = {
        note: option(string),
        rules: option(string),
        advantage: option(string),
        disadvantage: option(string),
        errata: option(list(Erratum.t)),
      };

      let t = json =>
        Json_Decode_Strict.{
          note: json |> optionalField("note", string),
          rules: json |> optionalField("rules", string),
          advantage: json |> optionalField("advantage", string),
          disadvantage: json |> optionalField("disadvantage", string),
          errata: json |> optionalField("errata", Erratum.Decode.list),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type multilingual = {
      src: list(PublicationRef.Decode.multilingual),
      translations: TranslationMap.t,
    };

    let multilingual = json =>
      Json.Decode.{
        src: json |> field("src", PublicationRef.Decode.multilingualList),
        translations: json |> field("translations", TranslationMap.Decode.t),
      };

    let resolveTranslations = (langs, x) =>
      Ley_Option.Infix.(
        x.translations
        |> TranslationMap.Decode.getFromLanguageOrder(langs)
        <&> (
          translation => {
            note: translation.note,
            rules: translation.rules,
            advantage: translation.advantage,
            disadvantage: translation.disadvantage,
            src: PublicationRef.Decode.resolveTranslationsList(langs, x.src),
            errata: translation.errata |> Ley_Option.fromOption([]),
          }
        )
      );
  };
};

module MundaneItem = {
  type t = {structurePoints: option(OneOrMany.t(int))};

  let decode = json =>
    Json_Decode_Strict.{
      structurePoints:
        json |> optionalField("structurePoints", OneOrMany.Decode.t(int)),
    };
};

module PrimaryAttributeDamageThreshold = {
  type newAttribute = {
    attribute: int,
    threshold: int,
  };

  let decodeNewAttribute = json =>
    Json.Decode.{
      attribute: json |> field("attribute", int),
      threshold: json |> field("threshold", int),
    };

  type agilityStrength = {
    agility: int,
    strength: int,
  };

  let decodeAgilityStrength = json =>
    Json.Decode.(
      json |> pair(int, int) |> (x => {agility: fst(x), strength: snd(x)})
    );

  type t =
    | DefaultAttribute(int)
    | DifferentAttribute(newAttribute)
    | AgilityStrength(agilityStrength);

  let decode =
    Json.Decode.(
      oneOf([
        json => json |> int |> (x => DefaultAttribute(x)),
        json => json |> decodeNewAttribute |> (x => DifferentAttribute(x)),
        json => json |> decodeAgilityStrength |> (x => AgilityStrength(x)),
      ])
    );
};

module Damage = {
  type t = {
    amount: int,
    sides: int,
    flat: option(int),
  };

  let decode = json =>
    Json_Decode_Strict.{
      amount: json |> field("damageDiceNumber", int),
      sides: json |> field("damageDiceSides", int),
      flat: json |> optionalField("damageFlat", int),
    };
};

module MeleeWeapon = {
  type t = {
    combatTechnique: int,
    damage: Damage.t,
    primaryAttributeDamageThreshold:
      option(PrimaryAttributeDamageThreshold.t),
    at: option(int),
    pa: option(int),
    reach: option(int),
    length: option(int),
    structurePoints: option(OneOrMany.t(int)),
    isParryingWeapon: bool,
    isTwoHandedWeapon: bool,
    isImprovisedWeapon: bool,
  };

  let decode = json =>
    Json_Decode_Strict.{
      combatTechnique: json |> field("combatTechnique", int),
      damage: json |> Damage.decode,
      primaryAttributeDamageThreshold:
        json
        |> optionalField(
             "damageThreshold",
             PrimaryAttributeDamageThreshold.decode,
           ),
      at: json |> optionalField("at", int),
      pa: json |> optionalField("pa", int),
      reach: json |> optionalField("reach", int),
      length: json |> optionalField("length", int),
      structurePoints:
        json |> optionalField("structurePoints", OneOrMany.Decode.t(int)),
      isParryingWeapon: json |> field("isParryingWeapon", bool),
      isTwoHandedWeapon: json |> field("isTwoHandedWeapon", bool),
      isImprovisedWeapon: json |> field("isImprovisedWeapon", bool),
    };
};

module RangedWeapon = {
  type t = {
    combatTechnique: int,
    damage: option(Damage.t),
    length: option(int),
    range: (int, int, int),
    reloadTime: OneOrMany.t(int),
    ammunition: option(int),
    isImprovisedWeapon: bool,
  };

  let decode = json =>
    Json_Decode_Strict.(
      Ley_Option.{
        combatTechnique: json |> field("combatTechnique", int),
        damage:
          liftM2(
            (amount, sides) =>
              {
                Damage.amount,
                sides,
                flat: json |> optionalField("damageFlat", int),
              },
            json |> optionalField("damageDiceNumber", int),
            json |> optionalField("damageDiceSides", int),
          ),
        length: json |> optionalField("length", int),
        range: (
          json |> field("closeRange", int),
          json |> field("mediumRange", int),
          json |> field("farRange", int),
        ),
        reloadTime: json |> field("reloadTime", OneOrMany.Decode.t(int)),
        ammunition: json |> optionalField("ammunition", int),
        isImprovisedWeapon: json |> field("isImprovisedWeapon", bool),
      }
    );
};

module Armor = {
  type t = {
    protection: int,
    encumbrance: int,
    hasAdditionalPenalties: bool,
    armorType: int,
  };

  let decode = json =>
    Json.Decode.{
      protection: json |> field("protection", int),
      encumbrance: json |> field("encumbrance", int),
      hasAdditionalPenalties: json |> field("hasAdditionalPenalties", bool),
      armorType: json |> field("armorType", int),
    };
};

type special =
  | MundaneItem(MundaneItem.t)
  | MeleeWeapon(MeleeWeapon.t)
  | RangedWeapon(RangedWeapon.t)
  | CombinedWeapon(MeleeWeapon.t, RangedWeapon.t)
  | Armor(Armor.t);

type t = {
  id: int,
  name: string,
  price: option(int),
  weight: option(int),
  special: option(special),
  info: list(Info.t),
  gr: int,
};

module Decode = {
  module Translation = {
    type t = {
      name: string,
      info: list(Info.Decode.multilingual),
    };

    let t = json =>
      Json.Decode.{
        name: json |> field("name", string),
        info:
          json
          |> field(
               "versions",
               oneOf([
                 json => json |> Info.Decode.multilingual |> (x => [x]),
                 json => json |> list(Info.Decode.multilingual),
               ]),
             ),
      };
  };

  module TranslationMap = TranslationMap.Make(Translation);

  let combinedWeapon = json =>
    Json.Decode.(
      json |> field("melee", MeleeWeapon.decode),
      json |> field("ranged", RangedWeapon.decode),
    );

  let special =
    Json.Decode.oneOf([
      json => json |> MundaneItem.decode |> (x => MundaneItem(x)),
      json => json |> MeleeWeapon.decode |> (x => MeleeWeapon(x)),
      json => json |> RangedWeapon.decode |> (x => RangedWeapon(x)),
      json => json |> combinedWeapon |> (((m, r)) => CombinedWeapon(m, r)),
      json => json |> Armor.decode |> (x => Armor(x)),
    ]);

  type multilingual = {
    id: int,
    price: option(int),
    weight: option(int),
    special: option(special),
    gr: int,
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    Json_Decode_Strict.{
      id: json |> field("id", int),
      price: json |> optionalField("price", int),
      weight: json |> optionalField("weight", int),
      special: json |> optionalField("special", special),
      gr: json |> field("gr", int),
      translations: json |> field("translations", TranslationMap.Decode.t),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Infix.(
      x.translations
      |> TranslationMap.Decode.getFromLanguageOrder(langs)
      <&> (
        translation => {
          id: x.id,
          name: translation.name,
          price: x.price,
          weight: x.weight,
          special: x.special,
          gr: x.gr,
          info:
            translation.info
            |> Ley_Option.mapOption(Info.Decode.resolveTranslations(langs)),
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
};
