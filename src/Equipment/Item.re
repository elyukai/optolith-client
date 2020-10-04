module Info = {
  type t = {
    note: option(string),
    rules: option(string),
    advantage: option(string),
    disadvantage: option(string),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Translations = {
    type t = {
      note: option(string),
      rules: option(string),
      advantage: option(string),
      disadvantage: option(string),
      errata: list(Erratum.t),
    };

    let decode = json =>
      JsonStrict.{
        note: json |> optionalField("note", string),
        rules: json |> optionalField("rules", string),
        advantage: json |> optionalField("advantage", string),
        disadvantage: json |> optionalField("disadvantage", string),
        errata: json |> field("errata", Erratum.decodeList),
      };
  };

  module TranslationMap = TranslationMap.Make(Translations);

  type multilingual = {
    src: list(PublicationRef.multilingual),
    translations: TranslationMap.t,
  };

  let decodeMultilingual = json =>
    Json.Decode.{
      src: json |> field("src", PublicationRef.decodeMultilingualList),
      translations: json |> field("translations", TranslationMap.decode),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Infix.(
      x.translations
      |> TranslationMap.getFromLanguageOrder(langs)
      <&> (
        translation => {
          note: translation.note,
          rules: translation.rules,
          advantage: translation.advantage,
          disadvantage: translation.disadvantage,
          src: PublicationRef.resolveTranslationsList(langs, x.src),
          errata: translation.errata,
        }
      )
    );
};

module MundaneItem = {
  type t = {structurePoints: option(OneOrMany.t(int))};

  let decode = json =>
    JsonStrict.{
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
    JsonStrict.{
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
    JsonStrict.{
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
    JsonStrict.(
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

let decodeCombinedWeapon = json =>
  Json.Decode.(
    json |> field("melee", MeleeWeapon.decode),
    json |> field("ranged", RangedWeapon.decode),
  );

type special =
  | MundaneItem(MundaneItem.t)
  | MeleeWeapon(MeleeWeapon.t)
  | RangedWeapon(RangedWeapon.t)
  | CombinedWeapon(MeleeWeapon.t, RangedWeapon.t)
  | Armor(Armor.t);

let decodeSpecial =
  Json.Decode.oneOf([
    json => json |> MundaneItem.decode |> (x => MundaneItem(x)),
    json => json |> MeleeWeapon.decode |> (x => MeleeWeapon(x)),
    json => json |> RangedWeapon.decode |> (x => RangedWeapon(x)),
    json =>
      json |> decodeCombinedWeapon |> (((m, r)) => CombinedWeapon(m, r)),
    json => json |> Armor.decode |> (x => Armor(x)),
  ]);

type t = {
  id: int,
  name: string,
  price: option(int),
  weight: option(int),
  special: option(special),
  info: list(Info.t),
  gr: int,
};

module Translations = {
  type t = {
    name: string,
    info: list(Info.multilingual),
  };

  let decode = json =>
    Json.Decode.{
      name: json |> field("name", string),
      info:
        json
        |> field(
             "versions",
             oneOf([
               json => json |> Info.decodeMultilingual |> (x => [x]),
               json => json |> list(Info.decodeMultilingual),
             ]),
           ),
    };
};

module TranslationMap = TranslationMap.Make(Translations);

type multilingual = {
  id: int,
  price: option(int),
  weight: option(int),
  special: option(special),
  gr: int,
  translations: TranslationMap.t,
};

let decodeMultilingual = json =>
  JsonStrict.{
    id: json |> field("id", int),
    price: json |> optionalField("price", int),
    weight: json |> optionalField("weight", int),
    special: json |> optionalField("special", decodeSpecial),
    gr: json |> field("gr", int),
    translations: json |> field("translations", TranslationMap.decode),
  };

let resolveTranslations = (langs, x) =>
  Ley_Option.Infix.(
    x.translations
    |> TranslationMap.getFromLanguageOrder(langs)
    <&> (
      translation => (
        x.id,
        {
          id: x.id,
          name: translation.name,
          price: x.price,
          weight: x.weight,
          special: x.special,
          gr: x.gr,
          info:
            translation.info
            |> Ley_Option.mapOption(Info.resolveTranslations(langs)),
        },
      )
    )
  );

let decode = (langs, json) =>
  json |> decodeMultilingual |> resolveTranslations(langs);
