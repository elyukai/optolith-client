type contentList =
  | Conditions
  | States
  | Archetypes
  | Races
  | Cultures
  | Professions
  | Advantages
  | Disadvantages
  | Skills
  | SpecialAbilities
  | CombatTechniques
  | Curses
  | ElvenMagicalSongs
  | DominationRituals
  | Cantrips
  | Spells
  | Blessings
  | LiturgicalChants
  | Poisons
  | Diseases
  | Plants
  | FocusRules
  | OptionalRules
  | Creatures
  | Elixirs
  | Receipes
  | EquipmentPackages
  | MeleeWeapons
  | RangedWeapons
  | Armors
  | Equipment;

type contentSingle =
  | Condition
  | State
  | Archetype
  | Race
  | Culture
  | Profession
  | Advantage
  | Disadvantage
  | Skill
  | SpecialAbility
  | CombatTechnique
  | Curse
  | ElvenMagicalSong
  | DominationRitual
  | Cantrip
  | Spell
  | Blessing
  | LiturgicalChant
  | Poison
  | Disease
  | Plant
  | FocusRule
  | OptionalRule
  | Creature
  | Elixir
  | Receipe
  | EquipmentPackage
  | Item;

type nodeType =
  | Parent(list(int))
  | ListChild({
      entryType: contentList,
      entryGroup: option(int),
    })
  | SingleChild({
      entryType: contentSingle,
      entryId: int,
    })
  | SimpleChild;

type t = {
  id: int,
  name: string,
  description: string,
  nodeType,
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

module Decode = {
  let contentList =
    Json.Decode.(
      field("type", string)
      |> map(
           fun
           | "Conditions" => Conditions
           | "States" => States
           | "Archetypes" => Archetypes
           | "Races" => Races
           | "Cultures" => Cultures
           | "Professions" => Professions
           | "Advantages" => Advantages
           | "Disadvantages" => Disadvantages
           | "Skills" => Skills
           | "SpecialAbilities" => SpecialAbilities
           | "CombatTechniques" => CombatTechniques
           | "Curses" => Curses
           | "ElvenMagicalSongs" => ElvenMagicalSongs
           | "DominationRituals" => DominationRituals
           | "Cantrips" => Cantrips
           | "Spells" => Spells
           | "Blessings" => Blessings
           | "LiturgicalChants" => LiturgicalChants
           | "Poisons" => Poisons
           | "Diseases" => Diseases
           | "Plants" => Plants
           | "FocusRules" => FocusRules
           | "OptionalRules" => OptionalRules
           | "Creatures" => Creatures
           | "Elixirs" => Elixirs
           | "Receipes" => Receipes
           | "EquipmentPackages" => EquipmentPackages
           | "MeleeWeapons" => MeleeWeapons
           | "RangedWeapons" => RangedWeapons
           | "Armors" => Armors
           | "Equipment" => Equipment
           | str => raise(DecodeError("Unknown content list: " ++ str)),
         )
    );

  let contentSingle =
    Json.Decode.(
      field("type", string)
      |> map(
           fun
           | "Condition" => Condition
           | "State" => State
           | "Archetype" => Archetype
           | "Race" => Race
           | "Culture" => Culture
           | "Profession" => Profession
           | "Advantage" => Advantage
           | "Disadvantage" => Disadvantage
           | "Skill" => Skill
           | "SpecialAbility" => SpecialAbility
           | "CombatTechnique" => CombatTechnique
           | "Curse" => Curse
           | "ElvenMagicalSong" => ElvenMagicalSong
           | "DominationRitual" => DominationRitual
           | "Cantrip" => Cantrip
           | "Spell" => Spell
           | "Blessing" => Blessing
           | "LiturgicalChant" => LiturgicalChant
           | "Poison" => Poison
           | "Disease" => Disease
           | "Plant" => Plant
           | "FocusRule" => FocusRule
           | "OptionalRule" => OptionalRule
           | "Creature" => Creature
           | "Elixir" => Elixir
           | "Receipe" => Receipe
           | "EquipmentPackage" => EquipmentPackage
           | "Item" => Item
           | str => raise(DecodeError("Unknown content list: " ++ str)),
         )
    );

  let nodeType =
    JsonStrict.(
      field("type", string)
      |> andThen(
           fun
           | "Parent" =>
             field("value", json =>
               Parent(json |> field("children", list(int)))
             )
           | "ListChild" =>
             field("value", json =>
               ListChild({
                 entryType: json |> field("entryType", contentList),
                 entryGroup: json |> optionalField("entryGroup", int),
               })
             )
           | "SingleChild" =>
             field("value", json =>
               SingleChild({
                 entryType: json |> field("entryType", contentSingle),
                 entryId: json |> field("entryId", int),
               })
             )
           | "SimpleChild" => (_ => SimpleChild)
           | str => raise(DecodeError("Unknown node type: " ++ str)),
         )
    );

  module Translation = {
    type t = {
      name: string,
      description: string,
      errata: option(list(Erratum.t)),
    };

    let t = json =>
      JsonStrict.{
        name: json |> field("name", string),
        description: json |> field("description", string),
        errata: json |> optionalField("errata", Erratum.Decode.list),
      };
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    nodeType,
    src: list(PublicationRef.Decode.multilingual),
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    Json.Decode.{
      id: json |> field("id", int),
      nodeType: json |> field("typeSpecific", nodeType),
      src: json |> field("src", PublicationRef.Decode.multilingualList),
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
          description: translation.description,
          nodeType: x.nodeType,
          src: PublicationRef.Decode.resolveTranslationsList(langs, x.src),
          errata: translation.errata |> Ley_Option.fromOption([]),
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
};
