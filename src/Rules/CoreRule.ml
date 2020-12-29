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
  | Equipment

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
  | Item

type nodeType =
  | Parent of int list
  | ListChild of { entryType : contentList; entryGroup : int option }
  | SingleChild of { entryType : contentSingle; entryId : int }
  | SimpleChild

type t = {
  id : int;
  name : string;
  description : string;
  nodeType : nodeType;
  src : PublicationRef.list;
  errata : Erratum.list;
}

module Decode = Json_Decode_Static.Make (struct
  type nonrec t = t

  let contentList =
    Json.Decode.(
      field "type" string
      |> map (function
           | "Conditions" -> Conditions
           | "States" -> States
           | "Archetypes" -> Archetypes
           | "Races" -> Races
           | "Cultures" -> Cultures
           | "Professions" -> Professions
           | "Advantages" -> Advantages
           | "Disadvantages" -> Disadvantages
           | "Skills" -> Skills
           | "SpecialAbilities" -> SpecialAbilities
           | "CombatTechniques" -> CombatTechniques
           | "Curses" -> Curses
           | "ElvenMagicalSongs" -> ElvenMagicalSongs
           | "DominationRituals" -> DominationRituals
           | "Cantrips" -> Cantrips
           | "Spells" -> Spells
           | "Blessings" -> Blessings
           | "LiturgicalChants" -> LiturgicalChants
           | "Poisons" -> Poisons
           | "Diseases" -> Diseases
           | "Plants" -> Plants
           | "FocusRules" -> FocusRules
           | "OptionalRules" -> OptionalRules
           | "Creatures" -> Creatures
           | "Elixirs" -> Elixirs
           | "Receipes" -> Receipes
           | "EquipmentPackages" -> EquipmentPackages
           | "MeleeWeapons" -> MeleeWeapons
           | "RangedWeapons" -> RangedWeapons
           | "Armors" -> Armors
           | "Equipment" -> Equipment
           | str -> raise (DecodeError ("Unknown content list: " ^ str))))

  let contentSingle =
    Json.Decode.(
      field "type" string
      |> map (function
           | "Condition" -> Condition
           | "State" -> State
           | "Archetype" -> Archetype
           | "Race" -> Race
           | "Culture" -> Culture
           | "Profession" -> Profession
           | "Advantage" -> Advantage
           | "Disadvantage" -> Disadvantage
           | "Skill" -> Skill
           | "SpecialAbility" -> SpecialAbility
           | "CombatTechnique" -> CombatTechnique
           | "Curse" -> Curse
           | "ElvenMagicalSong" -> ElvenMagicalSong
           | "DominationRitual" -> DominationRitual
           | "Cantrip" -> Cantrip
           | "Spell" -> Spell
           | "Blessing" -> Blessing
           | "LiturgicalChant" -> LiturgicalChant
           | "Poison" -> Poison
           | "Disease" -> Disease
           | "Plant" -> Plant
           | "FocusRule" -> FocusRule
           | "OptionalRule" -> OptionalRule
           | "Creature" -> Creature
           | "Elixir" -> Elixir
           | "Receipe" -> Receipe
           | "EquipmentPackage" -> EquipmentPackage
           | "Item" -> Item
           | str -> raise (DecodeError ("Unknown content list: " ^ str))))

  let nodeType =
    Json_Decode_Strict.(
      field "type" string
      |> andThen (function
           | "Parent" ->
               field "value" (fun json ->
                   Parent (json |> field "children" (list int)))
           | "ListChild" ->
               field "value" (fun json ->
                   ListChild
                     {
                       entryType = json |> field "entryType" contentList;
                       entryGroup = json |> optionalField "entryGroup" int;
                     })
           | "SingleChild" ->
               field "value" (fun json ->
                   SingleChild
                     {
                       entryType = json |> field "entryType" contentSingle;
                       entryId = json |> field "entryId" int;
                     })
           | "SimpleChild" -> fun _ -> SimpleChild
           | str -> raise (DecodeError ("Unknown node type: " ^ str))))

  module Translation = struct
    type t = {
      name : string;
      description : string;
      errata : Erratum.list option;
    }

    let t json =
      Json_Decode_Strict.
        {
          name = json |> field "name" string;
          description = json |> field "description" string;
          errata = json |> optionalField "errata" Erratum.Decode.list;
        }

    let pred _ = true
  end

  type multilingual = {
    id : int;
    nodeType : nodeType;
    src : PublicationRef.Decode.multilingual list;
    translations : Translation.t Json_Decode_TranslationMap.partial;
  }

  let multilingual decodeTranslations json =
    let open Json.Decode in
    {
      id = json |> field "id" int;
      nodeType = json |> field "typeSpecific" nodeType;
      src = json |> field "src" PublicationRef.Decode.multilingualList;
      translations = json |> field "translations" decodeTranslations;
    }

  let make langs (multilingual : multilingual) (translation : Translation.t) =
    Some
      {
        id = multilingual.id;
        name = translation.name;
        description = translation.description;
        nodeType = multilingual.nodeType;
        src =
          PublicationRef.Decode.resolveTranslationsList langs multilingual.src;
        errata = translation.errata |> Ley_Option.fromOption [];
      }

  module Accessors = struct
    let id (x : t) = x.id

    let translations x = x.translations
  end
end)
