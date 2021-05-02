let decode_value f g =
  Json.Decode.(field "value" int |> map (fun x -> x |> f |> g))

let decode_values f g =
  Json.Decode.(
    field "value" (NonEmptyList.Decode.t int)
    |> map (fun x -> x |> NonEmptyList.fmap f |> g))

module ExtensionRule = struct
  type t = FocusRule of Id.FocusRule.t | OptionalRule of Id.OptionalRule.t
  [@@bs.deriving accessors]

  module Decode = struct
    open Json.Decode

    let t =
      field "type" string
      |> andThen (function
           | "FocusRule" -> decode_value Id.FocusRule.from_int focusRule
           | "OptionalRule" ->
               decode_value Id.OptionalRule.from_int optionalRule
           | str ->
               JsonStatic.raise_unknown_variant ~variant_name:"ExtensionRule"
                 ~invalid:str)
  end
end

module Activatable = struct
  module Many = struct
    type t =
      | Advantage of Id.Advantage.t NonEmptyList.t
      | Disadvantage of Id.Disadvantage.t NonEmptyList.t
      | GeneralSpecialAbility of Id.GeneralSpecialAbility.t NonEmptyList.t
      | FatePointSpecialAbility of Id.FatePointSpecialAbility.t NonEmptyList.t
      | CombatSpecialAbility of Id.CombatSpecialAbility.t NonEmptyList.t
      | MagicalSpecialAbility of Id.MagicalSpecialAbility.t NonEmptyList.t
      | StaffEnchantment of Id.StaffEnchantment.t NonEmptyList.t
      | FamiliarSpecialAbility of Id.FamiliarSpecialAbility.t NonEmptyList.t
      | KarmaSpecialAbility of Id.KarmaSpecialAbility.t NonEmptyList.t
      | ProtectiveWardingCircleSpecialAbility of
          Id.ProtectiveWardingCircleSpecialAbility.t NonEmptyList.t
      | CombatStyleSpecialAbility of
          Id.CombatStyleSpecialAbility.t NonEmptyList.t
      | AdvancedCombatSpecialAbility of
          Id.AdvancedCombatSpecialAbility.t NonEmptyList.t
      | CommandSpecialAbility of Id.CommandSpecialAbility.t NonEmptyList.t
      | MagicStyleSpecialAbility of Id.MagicStyleSpecialAbility.t NonEmptyList.t
      | AdvancedMagicalSpecialAbility of
          Id.AdvancedMagicalSpecialAbility.t NonEmptyList.t
      | SpellSwordEnchantment of Id.SpellSwordEnchantment.t NonEmptyList.t
      | DaggerRitual of Id.DaggerRitual.t NonEmptyList.t
      | InstrumentEnchantment of Id.InstrumentEnchantment.t NonEmptyList.t
      | AttireEnchantment of Id.AttireEnchantment.t NonEmptyList.t
      | OrbEnchantment of Id.OrbEnchantment.t NonEmptyList.t
      | WandEnchantment of Id.WandEnchantment.t NonEmptyList.t
      | BrawlingSpecialAbility of Id.BrawlingSpecialAbility.t NonEmptyList.t
      | AncestorGlyph of Id.AncestorGlyph.t NonEmptyList.t
      | CeremonialItemSpecialAbility of
          Id.CeremonialItemSpecialAbility.t NonEmptyList.t
      | Sermon of Id.Sermon.t NonEmptyList.t
      | LiturgicalStyleSpecialAbility of
          Id.LiturgicalStyleSpecialAbility.t NonEmptyList.t
      | AdvancedKarmaSpecialAbility of
          Id.AdvancedKarmaSpecialAbility.t NonEmptyList.t
      | Vision of Id.Vision.t NonEmptyList.t
      | MagicalTradition of Id.MagicalTradition.t NonEmptyList.t
      | BlessedTradition of Id.BlessedTradition.t NonEmptyList.t
      | PactGift of Id.PactGift.t NonEmptyList.t
      | SikaryanDrainSpecialAbility of
          Id.SikaryanDrainSpecialAbility.t NonEmptyList.t
      | LycantropicGift of Id.LycantropicGift.t NonEmptyList.t
      | SkillStyleSpecialAbility of Id.SkillStyleSpecialAbility.t NonEmptyList.t
      | AdvancedSkillSpecialAbility of
          Id.AdvancedSkillSpecialAbility.t NonEmptyList.t
      | ArcaneOrbEnchantment of Id.ArcaneOrbEnchantment.t NonEmptyList.t
      | CauldronEnchantment of Id.CauldronEnchantment.t NonEmptyList.t
      | FoolsHatEnchantment of Id.FoolsHatEnchantment.t NonEmptyList.t
      | ToyEnchantment of Id.ToyEnchantment.t NonEmptyList.t
      | BowlEnchantment of Id.BowlEnchantment.t NonEmptyList.t
      | FatePointSexSpecialAbility of
          Id.FatePointSexSpecialAbility.t NonEmptyList.t
      | SexSpecialAbility of Id.SexSpecialAbility.t NonEmptyList.t
      | WeaponEnchantment of Id.WeaponEnchantment.t NonEmptyList.t
      | SickleRitual of Id.SickleRitual.t NonEmptyList.t
      | RingEnchantment of Id.RingEnchantment.t NonEmptyList.t
      | ChronicleEnchantment of Id.ChronicleEnchantment.t NonEmptyList.t
    [@@bs.deriving accessors]

    module Decode = struct
      open Json.Decode

      let t =
        field "type" string
        |> andThen (function
             | "Advantage" -> decode_values Id.Advantage.from_int advantage
             | "Disadvantage" ->
                 decode_values Id.Disadvantage.from_int disadvantage
             | "GeneralSpecialAbility" ->
                 decode_values Id.GeneralSpecialAbility.from_int
                   generalSpecialAbility
             | "FatePointSpecialAbility" ->
                 decode_values Id.FatePointSpecialAbility.from_int
                   fatePointSpecialAbility
             | "CombatSpecialAbility" ->
                 decode_values Id.CombatSpecialAbility.from_int
                   combatSpecialAbility
             | "MagicalSpecialAbility" ->
                 decode_values Id.MagicalSpecialAbility.from_int
                   magicalSpecialAbility
             | "StaffEnchantment" ->
                 decode_values Id.StaffEnchantment.from_int staffEnchantment
             | "FamiliarSpecialAbility" ->
                 decode_values Id.FamiliarSpecialAbility.from_int
                   familiarSpecialAbility
             | "KarmaSpecialAbility" ->
                 decode_values Id.KarmaSpecialAbility.from_int
                   karmaSpecialAbility
             | "ProtectiveWardingCircleSpecialAbility" ->
                 decode_values Id.ProtectiveWardingCircleSpecialAbility.from_int
                   protectiveWardingCircleSpecialAbility
             | "CombatStyleSpecialAbility" ->
                 decode_values Id.CombatStyleSpecialAbility.from_int
                   combatStyleSpecialAbility
             | "AdvancedCombatSpecialAbility" ->
                 decode_values Id.AdvancedCombatSpecialAbility.from_int
                   advancedCombatSpecialAbility
             | "CommandSpecialAbility" ->
                 decode_values Id.CommandSpecialAbility.from_int
                   commandSpecialAbility
             | "MagicStyleSpecialAbility" ->
                 decode_values Id.MagicStyleSpecialAbility.from_int
                   magicStyleSpecialAbility
             | "AdvancedMagicalSpecialAbility" ->
                 decode_values Id.AdvancedMagicalSpecialAbility.from_int
                   advancedMagicalSpecialAbility
             | "SpellSwordEnchantment" ->
                 decode_values Id.SpellSwordEnchantment.from_int
                   spellSwordEnchantment
             | "DaggerRitual" ->
                 decode_values Id.DaggerRitual.from_int daggerRitual
             | "InstrumentEnchantment" ->
                 decode_values Id.InstrumentEnchantment.from_int
                   instrumentEnchantment
             | "AttireEnchantment" ->
                 decode_values Id.AttireEnchantment.from_int attireEnchantment
             | "OrbEnchantment" ->
                 decode_values Id.OrbEnchantment.from_int orbEnchantment
             | "WandEnchantment" ->
                 decode_values Id.WandEnchantment.from_int wandEnchantment
             | "BrawlingSpecialAbility" ->
                 decode_values Id.BrawlingSpecialAbility.from_int
                   brawlingSpecialAbility
             | "AncestorGlyph" ->
                 decode_values Id.AncestorGlyph.from_int ancestorGlyph
             | "CeremonialItemSpecialAbility" ->
                 decode_values Id.CeremonialItemSpecialAbility.from_int
                   ceremonialItemSpecialAbility
             | "Sermon" -> decode_values Id.Sermon.from_int sermon
             | "LiturgicalStyleSpecialAbility" ->
                 decode_values Id.LiturgicalStyleSpecialAbility.from_int
                   liturgicalStyleSpecialAbility
             | "AdvancedKarmaSpecialAbility" ->
                 decode_values Id.AdvancedKarmaSpecialAbility.from_int
                   advancedKarmaSpecialAbility
             | "Vision" -> decode_values Id.Vision.from_int vision
             | "MagicalTradition" ->
                 decode_values Id.MagicalTradition.from_int magicalTradition
             | "BlessedTradition" ->
                 decode_values Id.BlessedTradition.from_int blessedTradition
             | "PactGift" -> decode_values Id.PactGift.from_int pactGift
             | "SikaryanDrainSpecialAbility" ->
                 decode_values Id.SikaryanDrainSpecialAbility.from_int
                   sikaryanDrainSpecialAbility
             | "LycantropicGift" ->
                 decode_values Id.LycantropicGift.from_int lycantropicGift
             | "SkillStyleSpecialAbility" ->
                 decode_values Id.SkillStyleSpecialAbility.from_int
                   skillStyleSpecialAbility
             | "AdvancedSkillSpecialAbility" ->
                 decode_values Id.AdvancedSkillSpecialAbility.from_int
                   advancedSkillSpecialAbility
             | "ArcaneOrbEnchantment" ->
                 decode_values Id.ArcaneOrbEnchantment.from_int
                   arcaneOrbEnchantment
             | "CauldronEnchantment" ->
                 decode_values Id.CauldronEnchantment.from_int
                   cauldronEnchantment
             | "FoolsHatEnchantment" ->
                 decode_values Id.FoolsHatEnchantment.from_int
                   foolsHatEnchantment
             | "ToyEnchantment" ->
                 decode_values Id.ToyEnchantment.from_int toyEnchantment
             | "BowlEnchantment" ->
                 decode_values Id.BowlEnchantment.from_int bowlEnchantment
             | "FatePointSexSpecialAbility" ->
                 decode_values Id.FatePointSexSpecialAbility.from_int
                   fatePointSexSpecialAbility
             | "SexSpecialAbility" ->
                 decode_values Id.SexSpecialAbility.from_int sexSpecialAbility
             | "WeaponEnchantment" ->
                 decode_values Id.WeaponEnchantment.from_int weaponEnchantment
             | "SickleRitual" ->
                 decode_values Id.SickleRitual.from_int sickleRitual
             | "RingEnchantment" ->
                 decode_values Id.RingEnchantment.from_int ringEnchantment
             | "ChronicleEnchantment" ->
                 decode_values Id.ChronicleEnchantment.from_int
                   chronicleEnchantment
             | str ->
                 JsonStatic.raise_unknown_variant
                   ~variant_name:"Activatable.Many" ~invalid:str)
    end
  end

  type t =
    | Advantage of Id.Advantage.t
    | Disadvantage of Id.Disadvantage.t
    | GeneralSpecialAbility of Id.GeneralSpecialAbility.t
    | FatePointSpecialAbility of Id.FatePointSpecialAbility.t
    | CombatSpecialAbility of Id.CombatSpecialAbility.t
    | MagicalSpecialAbility of Id.MagicalSpecialAbility.t
    | StaffEnchantment of Id.StaffEnchantment.t
    | FamiliarSpecialAbility of Id.FamiliarSpecialAbility.t
    | KarmaSpecialAbility of Id.KarmaSpecialAbility.t
    | ProtectiveWardingCircleSpecialAbility of
        Id.ProtectiveWardingCircleSpecialAbility.t
    | CombatStyleSpecialAbility of Id.CombatStyleSpecialAbility.t
    | AdvancedCombatSpecialAbility of Id.AdvancedCombatSpecialAbility.t
    | CommandSpecialAbility of Id.CommandSpecialAbility.t
    | MagicStyleSpecialAbility of Id.MagicStyleSpecialAbility.t
    | AdvancedMagicalSpecialAbility of Id.AdvancedMagicalSpecialAbility.t
    | SpellSwordEnchantment of Id.SpellSwordEnchantment.t
    | DaggerRitual of Id.DaggerRitual.t
    | InstrumentEnchantment of Id.InstrumentEnchantment.t
    | AttireEnchantment of Id.AttireEnchantment.t
    | OrbEnchantment of Id.OrbEnchantment.t
    | WandEnchantment of Id.WandEnchantment.t
    | BrawlingSpecialAbility of Id.BrawlingSpecialAbility.t
    | AncestorGlyph of Id.AncestorGlyph.t
    | CeremonialItemSpecialAbility of Id.CeremonialItemSpecialAbility.t
    | Sermon of Id.Sermon.t
    | LiturgicalStyleSpecialAbility of Id.LiturgicalStyleSpecialAbility.t
    | AdvancedKarmaSpecialAbility of Id.AdvancedKarmaSpecialAbility.t
    | Vision of Id.Vision.t
    | MagicalTradition of Id.MagicalTradition.t
    | BlessedTradition of Id.BlessedTradition.t
    | PactGift of Id.PactGift.t
    | SikaryanDrainSpecialAbility of Id.SikaryanDrainSpecialAbility.t
    | LycantropicGift of Id.LycantropicGift.t
    | SkillStyleSpecialAbility of Id.SkillStyleSpecialAbility.t
    | AdvancedSkillSpecialAbility of Id.AdvancedSkillSpecialAbility.t
    | ArcaneOrbEnchantment of Id.ArcaneOrbEnchantment.t
    | CauldronEnchantment of Id.CauldronEnchantment.t
    | FoolsHatEnchantment of Id.FoolsHatEnchantment.t
    | ToyEnchantment of Id.ToyEnchantment.t
    | BowlEnchantment of Id.BowlEnchantment.t
    | FatePointSexSpecialAbility of Id.FatePointSexSpecialAbility.t
    | SexSpecialAbility of Id.SexSpecialAbility.t
    | WeaponEnchantment of Id.WeaponEnchantment.t
    | SickleRitual of Id.SickleRitual.t
    | RingEnchantment of Id.RingEnchantment.t
    | ChronicleEnchantment of Id.ChronicleEnchantment.t
  [@@bs.deriving accessors]

  module Decode = struct
    open Json.Decode

    let t =
      field "type" string
      |> andThen (function
           | "Advantage" -> decode_value Id.Advantage.from_int advantage
           | "Disadvantage" ->
               decode_value Id.Disadvantage.from_int disadvantage
           | "GeneralSpecialAbility" ->
               decode_value Id.GeneralSpecialAbility.from_int
                 generalSpecialAbility
           | "FatePointSpecialAbility" ->
               decode_value Id.FatePointSpecialAbility.from_int
                 fatePointSpecialAbility
           | "CombatSpecialAbility" ->
               decode_value Id.CombatSpecialAbility.from_int
                 combatSpecialAbility
           | "MagicalSpecialAbility" ->
               decode_value Id.MagicalSpecialAbility.from_int
                 magicalSpecialAbility
           | "StaffEnchantment" ->
               decode_value Id.StaffEnchantment.from_int staffEnchantment
           | "FamiliarSpecialAbility" ->
               decode_value Id.FamiliarSpecialAbility.from_int
                 familiarSpecialAbility
           | "KarmaSpecialAbility" ->
               decode_value Id.KarmaSpecialAbility.from_int karmaSpecialAbility
           | "ProtectiveWardingCircleSpecialAbility" ->
               decode_value Id.ProtectiveWardingCircleSpecialAbility.from_int
                 protectiveWardingCircleSpecialAbility
           | "CombatStyleSpecialAbility" ->
               decode_value Id.CombatStyleSpecialAbility.from_int
                 combatStyleSpecialAbility
           | "AdvancedCombatSpecialAbility" ->
               decode_value Id.AdvancedCombatSpecialAbility.from_int
                 advancedCombatSpecialAbility
           | "CommandSpecialAbility" ->
               decode_value Id.CommandSpecialAbility.from_int
                 commandSpecialAbility
           | "MagicStyleSpecialAbility" ->
               decode_value Id.MagicStyleSpecialAbility.from_int
                 magicStyleSpecialAbility
           | "AdvancedMagicalSpecialAbility" ->
               decode_value Id.AdvancedMagicalSpecialAbility.from_int
                 advancedMagicalSpecialAbility
           | "SpellSwordEnchantment" ->
               decode_value Id.SpellSwordEnchantment.from_int
                 spellSwordEnchantment
           | "DaggerRitual" ->
               decode_value Id.DaggerRitual.from_int daggerRitual
           | "InstrumentEnchantment" ->
               decode_value Id.InstrumentEnchantment.from_int
                 instrumentEnchantment
           | "AttireEnchantment" ->
               decode_value Id.AttireEnchantment.from_int attireEnchantment
           | "OrbEnchantment" ->
               decode_value Id.OrbEnchantment.from_int orbEnchantment
           | "WandEnchantment" ->
               decode_value Id.WandEnchantment.from_int wandEnchantment
           | "BrawlingSpecialAbility" ->
               decode_value Id.BrawlingSpecialAbility.from_int
                 brawlingSpecialAbility
           | "AncestorGlyph" ->
               decode_value Id.AncestorGlyph.from_int ancestorGlyph
           | "CeremonialItemSpecialAbility" ->
               decode_value Id.CeremonialItemSpecialAbility.from_int (fun x ->
                   CeremonialItemSpecialAbility x)
           | "Sermon" -> decode_value Id.Sermon.from_int sermon
           | "LiturgicalStyleSpecialAbility" ->
               decode_value Id.LiturgicalStyleSpecialAbility.from_int
                 liturgicalStyleSpecialAbility
           | "AdvancedKarmaSpecialAbility" ->
               decode_value Id.AdvancedKarmaSpecialAbility.from_int (fun x ->
                   AdvancedKarmaSpecialAbility x)
           | "Vision" -> decode_value Id.Vision.from_int vision
           | "MagicalTradition" ->
               decode_value Id.MagicalTradition.from_int magicalTradition
           | "BlessedTradition" ->
               decode_value Id.BlessedTradition.from_int blessedTradition
           | "PactGift" -> decode_value Id.PactGift.from_int pactGift
           | "SikaryanDrainSpecialAbility" ->
               decode_value Id.SikaryanDrainSpecialAbility.from_int
                 sikaryanDrainSpecialAbility
           | "LycantropicGift" ->
               decode_value Id.LycantropicGift.from_int lycantropicGift
           | "SkillStyleSpecialAbility" ->
               decode_value Id.SkillStyleSpecialAbility.from_int
                 skillStyleSpecialAbility
           | "AdvancedSkillSpecialAbility" ->
               decode_value Id.AdvancedSkillSpecialAbility.from_int
                 advancedSkillSpecialAbility
           | "ArcaneOrbEnchantment" ->
               decode_value Id.ArcaneOrbEnchantment.from_int
                 arcaneOrbEnchantment
           | "CauldronEnchantment" ->
               decode_value Id.CauldronEnchantment.from_int cauldronEnchantment
           | "FoolsHatEnchantment" ->
               decode_value Id.FoolsHatEnchantment.from_int foolsHatEnchantment
           | "ToyEnchantment" ->
               decode_value Id.ToyEnchantment.from_int toyEnchantment
           | "BowlEnchantment" ->
               decode_value Id.BowlEnchantment.from_int bowlEnchantment
           | "FatePointSexSpecialAbility" ->
               decode_value Id.FatePointSexSpecialAbility.from_int
                 fatePointSexSpecialAbility
           | "SexSpecialAbility" ->
               decode_value Id.SexSpecialAbility.from_int sexSpecialAbility
           | "WeaponEnchantment" ->
               decode_value Id.WeaponEnchantment.from_int weaponEnchantment
           | "SickleRitual" ->
               decode_value Id.SickleRitual.from_int sickleRitual
           | "RingEnchantment" ->
               decode_value Id.RingEnchantment.from_int ringEnchantment
           | "ChronicleEnchantment" ->
               decode_value Id.ChronicleEnchantment.from_int
                 chronicleEnchantment
           | str ->
               JsonStatic.raise_unknown_variant ~variant_name:"Activatable"
                 ~invalid:str)
  end
end

module SelectOption = struct
  type t =
    | Generic of int
    | Blessing of Id.Blessing.t
    | Cantrip of Id.Cantrip.t
    | TradeSecret of Id.GeneralSpecialAbility.TradeSecret.t
    | Script of Id.Script.t
    | AnimalShape of Id.StaffEnchantment.AnimalShape.t
    | ArcaneBardTradition of Id.MagicalTradition.ArcaneBardTradition.t
    | ArcaneDancerTradition of Id.MagicalTradition.ArcaneDancerTradition.t
    | SexPractice of Id.SexPractice.t
    | Race of Id.Race.t
    | Culture of Id.Culture.t
    | BlessedTradition of Id.BlessedTradition.t
    | Element of Id.Element.t
    | Property of Id.Property.t
    | Aspect of Id.Aspect.t
    | Disease of Id.Disease.t
    | Poison of Id.Poison.t
    | Language of Id.Language.t
    | Skill of Id.Skill.t
    | MeleeCombatTechnique of Id.MeleeCombatTechnique.t
    | RangedCombatTechnique of Id.RangedCombatTechnique.t
    | LiturgicalChant of Id.LiturgicalChant.t
    | Ceremony of Id.Ceremony.t
    | Spell of Id.Spell.t
    | Ritual of Id.Ritual.t
  [@@bs.deriving accessors]

  module Decode = struct
    open Json.Decode

    let t =
      let generic = int |> map generic in
      let specific =
        field "type" string
        |> andThen (function
             | "Blessing" -> decode_value Id.Blessing.from_int blessing
             | "Cantrip" -> decode_value Id.Cantrip.from_int cantrip
             | "TradeSecret" ->
                 decode_value Id.GeneralSpecialAbility.TradeSecret.from_int
                   tradeSecret
             | "Script" -> decode_value Id.Script.from_int script
             | "AnimalShape" ->
                 decode_value Id.StaffEnchantment.AnimalShape.from_int
                   animalShape
             | "ArcaneBardTradition" ->
                 decode_value Id.MagicalTradition.ArcaneBardTradition.from_int
                   arcaneBardTradition
             | "ArcaneDancerTradition" ->
                 decode_value Id.MagicalTradition.ArcaneDancerTradition.from_int
                   arcaneDancerTradition
             | "SexPractice" -> decode_value Id.SexPractice.from_int sexPractice
             | "Race" -> decode_value Id.Race.from_int race
             | "Culture" -> decode_value Id.Culture.from_int culture
             | "BlessedTradition" ->
                 decode_value Id.BlessedTradition.from_int blessedTradition
             | "Element" -> decode_value Id.Element.from_int element
             | "Property" -> decode_value Id.Property.from_int property
             | "Aspect" -> decode_value Id.Aspect.from_int aspect
             | "Disease" -> decode_value Id.Disease.from_int disease
             | "Poison" -> decode_value Id.Poison.from_int poison
             | "Language" -> decode_value Id.Language.from_int language
             | "Skill" -> decode_value Id.Skill.from_int skill
             | "MeleeCombatTechnique" ->
                 decode_value Id.MeleeCombatTechnique.from_int
                   meleeCombatTechnique
             | "RangedCombatTechnique" ->
                 decode_value Id.RangedCombatTechnique.from_int
                   rangedCombatTechnique
             | "LiturgicalChant" ->
                 decode_value Id.LiturgicalChant.from_int liturgicalChant
             | "Ceremony" -> decode_value Id.Ceremony.from_int ceremony
             | "Spell" -> decode_value Id.Spell.from_int spell
             | "Ritual" -> decode_value Id.Ritual.from_int ritual
             | str ->
                 JsonStatic.raise_unknown_variant ~variant_name:"SelectOption"
                   ~invalid:str)
      in
      oneOf [ generic; specific ]
  end
end

module Rated = struct
  module Many = struct
    type t =
      | Attribute of Id.Attribute.t NonEmptyList.t
      | Skill of Id.Skill.t NonEmptyList.t
      | MeleeCombatTechnique of Id.MeleeCombatTechnique.t NonEmptyList.t
      | RangedCombatTechnique of Id.RangedCombatTechnique.t NonEmptyList.t
      | Spell of Id.Spell.t NonEmptyList.t
      | Ritual of Id.Ritual.t NonEmptyList.t
      | LiturgicalChant of Id.LiturgicalChant.t NonEmptyList.t
      | Ceremony of Id.Ceremony.t NonEmptyList.t
    [@@bs.deriving accessors]

    module Decode = struct
      open Json.Decode

      let t =
        field "type" string
        |> andThen (function
             | "Attribute" -> decode_values Id.Attribute.from_int attribute
             | "Skill" -> decode_values Id.Skill.from_int skill
             | "MeleeCombatTechnique" ->
                 decode_values Id.MeleeCombatTechnique.from_int
                   meleeCombatTechnique
             | "RangedCombatTechnique" ->
                 decode_values Id.RangedCombatTechnique.from_int
                   rangedCombatTechnique
             | "Spell" -> decode_values Id.Spell.from_int spell
             | "Ritual" -> decode_values Id.Ritual.from_int ritual
             | "LiturgicalChant" ->
                 decode_values Id.LiturgicalChant.from_int liturgicalChant
             | "Ceremony" -> decode_values Id.Ceremony.from_int ceremony
             | str ->
                 JsonStatic.raise_unknown_variant
                   ~variant_name:"ActivatableSkill.Many" ~invalid:str)
    end
  end

  type t =
    | Attribute of Id.Attribute.t
    | Skill of Id.Skill.t
    | MeleeCombatTechnique of Id.MeleeCombatTechnique.t
    | RangedCombatTechnique of Id.RangedCombatTechnique.t
    | Spell of Id.Spell.t
    | Ritual of Id.Ritual.t
    | LiturgicalChant of Id.LiturgicalChant.t
    | Ceremony of Id.Ceremony.t
  [@@bs.deriving accessors]

  module Decode = struct
    open Json.Decode

    let t =
      field "type" string
      |> andThen (function
           | "Attribute" -> decode_value Id.Attribute.from_int attribute
           | "Skill" -> decode_value Id.Skill.from_int skill
           | "MeleeCombatTechnique" ->
               decode_value Id.MeleeCombatTechnique.from_int
                 meleeCombatTechnique
           | "RangedCombatTechnique" ->
               decode_value Id.RangedCombatTechnique.from_int
                 rangedCombatTechnique
           | "Spell" -> decode_value Id.Spell.from_int spell
           | "Ritual" -> decode_value Id.Ritual.from_int ritual
           | "LiturgicalChant" ->
               decode_value Id.LiturgicalChant.from_int liturgicalChant
           | "Ceremony" -> decode_value Id.Ceremony.from_int ceremony
           | str ->
               JsonStatic.raise_unknown_variant ~variant_name:"ActivatableSkill"
                 ~invalid:str)
  end
end

module Skill = struct
  type t =
    | Skill of Id.Skill.t
    | Spell of Id.Spell.t
    | Ritual of Id.Ritual.t
    | LiturgicalChant of Id.LiturgicalChant.t
    | Ceremony of Id.Ceremony.t
  [@@bs.deriving accessors]

  module Decode = struct
    open Json.Decode

    let t =
      field "type" string
      |> andThen (function
           | "Skill" -> decode_value Id.Skill.from_int skill
           | "Spell" -> decode_value Id.Spell.from_int spell
           | "Ritual" -> decode_value Id.Ritual.from_int ritual
           | "LiturgicalChant" ->
               decode_value Id.LiturgicalChant.from_int liturgicalChant
           | "Ceremony" -> decode_value Id.Ceremony.from_int ceremony
           | str ->
               JsonStatic.raise_unknown_variant ~variant_name:"ActivatableSkill"
                 ~invalid:str)
  end
end

module ActivatableSkill = struct
  type t =
    | Spell of Id.Spell.t
    | Ritual of Id.Ritual.t
    | LiturgicalChant of Id.LiturgicalChant.t
    | Ceremony of Id.Ceremony.t
  [@@bs.deriving accessors]

  module Decode = struct
    open Json.Decode

    let t =
      field "type" string
      |> andThen (function
           | "Spell" -> decode_value Id.Spell.from_int spell
           | "Ritual" -> decode_value Id.Ritual.from_int ritual
           | "LiturgicalChant" ->
               decode_value Id.LiturgicalChant.from_int liturgicalChant
           | "Ceremony" -> decode_value Id.Ceremony.from_int ceremony
           | str ->
               JsonStatic.raise_unknown_variant ~variant_name:"ActivatableSkill"
                 ~invalid:str)
  end
end

module ActivatableAndSkill = struct
  type t =
    | Activatable of Activatable.t
    | ActivatableSkill of ActivatableSkill.t
  [@@bs.deriving accessors]

  module Decode = struct
    open Json.Decode

    let t =
      oneOf
        [
          Activatable.Decode.t |> map activatable;
          ActivatableSkill.Decode.t |> map activatableSkill;
        ]
  end
end

module AnimistPower = struct
  type t = AnimistPower of Id.AnimistPower.t [@@bs.deriving accessors]

  module Decode = struct
    open Json.Decode

    let t =
      field "type" string
      |> andThen (function
           | "AnimistPower" ->
               decode_value Id.AnimistPower.from_int animistPower
           | str ->
               JsonStatic.raise_unknown_variant ~variant_name:"AnimistPower"
                 ~invalid:str)
  end
end
