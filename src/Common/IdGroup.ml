let decode_one f g = Decoders_bs.Decode.(field "value" int >|= f >|= g)

let decode_many f g =
  Decoders_bs.Decode.(
    field "value" (NonEmptyList.Decode.t int) >|= NonEmptyList.fmap f >|= g)

module type IdGroup = sig
  type t

  val compare : t -> t -> int

  module Map : MapX.T with type key = t
end

module Make (S : sig
  type t

  val compare : t -> t -> int
end) : IdGroup with type t := S.t = struct
  include S

  module Map = MapX.Make (struct
    type nonrec t = S.t

    let compare = compare
  end)
end

module ExtensionRule = struct
  type t = FocusRule of Id.FocusRule.t | OptionalRule of Id.OptionalRule.t
  [@@bs.deriving accessors]

  module Decode = struct
    open Decoders_bs.Decode

    let t =
      field "tag" string
      >>= function
      | "FocusRule" -> decode_one Id.FocusRule.from_int focusRule
      | "OptionalRule" -> decode_one Id.OptionalRule.from_int optionalRule
      | _ -> fail "Expected a Focus Rule or Optional Rule"
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
      open Decoders_bs.Decode

      let t =
        field "tag" string
        >>= function
        | "Advantage" -> decode_many Id.Advantage.from_int advantage
        | "Disadvantage" -> decode_many Id.Disadvantage.from_int disadvantage
        | "GeneralSpecialAbility" ->
            decode_many Id.GeneralSpecialAbility.from_int generalSpecialAbility
        | "FatePointSpecialAbility" ->
            decode_many Id.FatePointSpecialAbility.from_int
              fatePointSpecialAbility
        | "CombatSpecialAbility" ->
            decode_many Id.CombatSpecialAbility.from_int combatSpecialAbility
        | "MagicalSpecialAbility" ->
            decode_many Id.MagicalSpecialAbility.from_int magicalSpecialAbility
        | "StaffEnchantment" ->
            decode_many Id.StaffEnchantment.from_int staffEnchantment
        | "FamiliarSpecialAbility" ->
            decode_many Id.FamiliarSpecialAbility.from_int
              familiarSpecialAbility
        | "KarmaSpecialAbility" ->
            decode_many Id.KarmaSpecialAbility.from_int karmaSpecialAbility
        | "ProtectiveWardingCircleSpecialAbility" ->
            decode_many Id.ProtectiveWardingCircleSpecialAbility.from_int
              protectiveWardingCircleSpecialAbility
        | "CombatStyleSpecialAbility" ->
            decode_many Id.CombatStyleSpecialAbility.from_int
              combatStyleSpecialAbility
        | "AdvancedCombatSpecialAbility" ->
            decode_many Id.AdvancedCombatSpecialAbility.from_int
              advancedCombatSpecialAbility
        | "CommandSpecialAbility" ->
            decode_many Id.CommandSpecialAbility.from_int commandSpecialAbility
        | "MagicStyleSpecialAbility" ->
            decode_many Id.MagicStyleSpecialAbility.from_int
              magicStyleSpecialAbility
        | "AdvancedMagicalSpecialAbility" ->
            decode_many Id.AdvancedMagicalSpecialAbility.from_int
              advancedMagicalSpecialAbility
        | "SpellSwordEnchantment" ->
            decode_many Id.SpellSwordEnchantment.from_int spellSwordEnchantment
        | "DaggerRitual" -> decode_many Id.DaggerRitual.from_int daggerRitual
        | "InstrumentEnchantment" ->
            decode_many Id.InstrumentEnchantment.from_int instrumentEnchantment
        | "AttireEnchantment" ->
            decode_many Id.AttireEnchantment.from_int attireEnchantment
        | "OrbEnchantment" ->
            decode_many Id.OrbEnchantment.from_int orbEnchantment
        | "WandEnchantment" ->
            decode_many Id.WandEnchantment.from_int wandEnchantment
        | "BrawlingSpecialAbility" ->
            decode_many Id.BrawlingSpecialAbility.from_int
              brawlingSpecialAbility
        | "AncestorGlyph" -> decode_many Id.AncestorGlyph.from_int ancestorGlyph
        | "CeremonialItemSpecialAbility" ->
            decode_many Id.CeremonialItemSpecialAbility.from_int
              ceremonialItemSpecialAbility
        | "Sermon" -> decode_many Id.Sermon.from_int sermon
        | "LiturgicalStyleSpecialAbility" ->
            decode_many Id.LiturgicalStyleSpecialAbility.from_int
              liturgicalStyleSpecialAbility
        | "AdvancedKarmaSpecialAbility" ->
            decode_many Id.AdvancedKarmaSpecialAbility.from_int
              advancedKarmaSpecialAbility
        | "Vision" -> decode_many Id.Vision.from_int vision
        | "MagicalTradition" ->
            decode_many Id.MagicalTradition.from_int magicalTradition
        | "BlessedTradition" ->
            decode_many Id.BlessedTradition.from_int blessedTradition
        | "PactGift" -> decode_many Id.PactGift.from_int pactGift
        | "SikaryanDrainSpecialAbility" ->
            decode_many Id.SikaryanDrainSpecialAbility.from_int
              sikaryanDrainSpecialAbility
        | "LycantropicGift" ->
            decode_many Id.LycantropicGift.from_int lycantropicGift
        | "SkillStyleSpecialAbility" ->
            decode_many Id.SkillStyleSpecialAbility.from_int
              skillStyleSpecialAbility
        | "AdvancedSkillSpecialAbility" ->
            decode_many Id.AdvancedSkillSpecialAbility.from_int
              advancedSkillSpecialAbility
        | "ArcaneOrbEnchantment" ->
            decode_many Id.ArcaneOrbEnchantment.from_int arcaneOrbEnchantment
        | "CauldronEnchantment" ->
            decode_many Id.CauldronEnchantment.from_int cauldronEnchantment
        | "FoolsHatEnchantment" ->
            decode_many Id.FoolsHatEnchantment.from_int foolsHatEnchantment
        | "ToyEnchantment" ->
            decode_many Id.ToyEnchantment.from_int toyEnchantment
        | "BowlEnchantment" ->
            decode_many Id.BowlEnchantment.from_int bowlEnchantment
        | "FatePointSexSpecialAbility" ->
            decode_many Id.FatePointSexSpecialAbility.from_int
              fatePointSexSpecialAbility
        | "SexSpecialAbility" ->
            decode_many Id.SexSpecialAbility.from_int sexSpecialAbility
        | "WeaponEnchantment" ->
            decode_many Id.WeaponEnchantment.from_int weaponEnchantment
        | "SickleRitual" -> decode_many Id.SickleRitual.from_int sickleRitual
        | "RingEnchantment" ->
            decode_many Id.RingEnchantment.from_int ringEnchantment
        | "ChronicleEnchantment" ->
            decode_many Id.ChronicleEnchantment.from_int chronicleEnchantment
        | _ -> fail "Expected an Activatable category"
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
    open Decoders_bs.Decode

    let t =
      field "tag" string
      >>= function
      | "Advantage" -> decode_one Id.Advantage.from_int advantage
      | "Disadvantage" -> decode_one Id.Disadvantage.from_int disadvantage
      | "GeneralSpecialAbility" ->
          decode_one Id.GeneralSpecialAbility.from_int generalSpecialAbility
      | "FatePointSpecialAbility" ->
          decode_one Id.FatePointSpecialAbility.from_int fatePointSpecialAbility
      | "CombatSpecialAbility" ->
          decode_one Id.CombatSpecialAbility.from_int combatSpecialAbility
      | "MagicalSpecialAbility" ->
          decode_one Id.MagicalSpecialAbility.from_int magicalSpecialAbility
      | "StaffEnchantment" ->
          decode_one Id.StaffEnchantment.from_int staffEnchantment
      | "FamiliarSpecialAbility" ->
          decode_one Id.FamiliarSpecialAbility.from_int familiarSpecialAbility
      | "KarmaSpecialAbility" ->
          decode_one Id.KarmaSpecialAbility.from_int karmaSpecialAbility
      | "ProtectiveWardingCircleSpecialAbility" ->
          decode_one Id.ProtectiveWardingCircleSpecialAbility.from_int
            protectiveWardingCircleSpecialAbility
      | "CombatStyleSpecialAbility" ->
          decode_one Id.CombatStyleSpecialAbility.from_int
            combatStyleSpecialAbility
      | "AdvancedCombatSpecialAbility" ->
          decode_one Id.AdvancedCombatSpecialAbility.from_int
            advancedCombatSpecialAbility
      | "CommandSpecialAbility" ->
          decode_one Id.CommandSpecialAbility.from_int commandSpecialAbility
      | "MagicStyleSpecialAbility" ->
          decode_one Id.MagicStyleSpecialAbility.from_int
            magicStyleSpecialAbility
      | "AdvancedMagicalSpecialAbility" ->
          decode_one Id.AdvancedMagicalSpecialAbility.from_int
            advancedMagicalSpecialAbility
      | "SpellSwordEnchantment" ->
          decode_one Id.SpellSwordEnchantment.from_int spellSwordEnchantment
      | "DaggerRitual" -> decode_one Id.DaggerRitual.from_int daggerRitual
      | "InstrumentEnchantment" ->
          decode_one Id.InstrumentEnchantment.from_int instrumentEnchantment
      | "AttireEnchantment" ->
          decode_one Id.AttireEnchantment.from_int attireEnchantment
      | "OrbEnchantment" -> decode_one Id.OrbEnchantment.from_int orbEnchantment
      | "WandEnchantment" ->
          decode_one Id.WandEnchantment.from_int wandEnchantment
      | "BrawlingSpecialAbility" ->
          decode_one Id.BrawlingSpecialAbility.from_int brawlingSpecialAbility
      | "AncestorGlyph" -> decode_one Id.AncestorGlyph.from_int ancestorGlyph
      | "CeremonialItemSpecialAbility" ->
          decode_one Id.CeremonialItemSpecialAbility.from_int (fun x ->
              CeremonialItemSpecialAbility x)
      | "Sermon" -> decode_one Id.Sermon.from_int sermon
      | "LiturgicalStyleSpecialAbility" ->
          decode_one Id.LiturgicalStyleSpecialAbility.from_int
            liturgicalStyleSpecialAbility
      | "AdvancedKarmaSpecialAbility" ->
          decode_one Id.AdvancedKarmaSpecialAbility.from_int (fun x ->
              AdvancedKarmaSpecialAbility x)
      | "Vision" -> decode_one Id.Vision.from_int vision
      | "MagicalTradition" ->
          decode_one Id.MagicalTradition.from_int magicalTradition
      | "BlessedTradition" ->
          decode_one Id.BlessedTradition.from_int blessedTradition
      | "PactGift" -> decode_one Id.PactGift.from_int pactGift
      | "SikaryanDrainSpecialAbility" ->
          decode_one Id.SikaryanDrainSpecialAbility.from_int
            sikaryanDrainSpecialAbility
      | "LycantropicGift" ->
          decode_one Id.LycantropicGift.from_int lycantropicGift
      | "SkillStyleSpecialAbility" ->
          decode_one Id.SkillStyleSpecialAbility.from_int
            skillStyleSpecialAbility
      | "AdvancedSkillSpecialAbility" ->
          decode_one Id.AdvancedSkillSpecialAbility.from_int
            advancedSkillSpecialAbility
      | "ArcaneOrbEnchantment" ->
          decode_one Id.ArcaneOrbEnchantment.from_int arcaneOrbEnchantment
      | "CauldronEnchantment" ->
          decode_one Id.CauldronEnchantment.from_int cauldronEnchantment
      | "FoolsHatEnchantment" ->
          decode_one Id.FoolsHatEnchantment.from_int foolsHatEnchantment
      | "ToyEnchantment" -> decode_one Id.ToyEnchantment.from_int toyEnchantment
      | "BowlEnchantment" ->
          decode_one Id.BowlEnchantment.from_int bowlEnchantment
      | "FatePointSexSpecialAbility" ->
          decode_one Id.FatePointSexSpecialAbility.from_int
            fatePointSexSpecialAbility
      | "SexSpecialAbility" ->
          decode_one Id.SexSpecialAbility.from_int sexSpecialAbility
      | "WeaponEnchantment" ->
          decode_one Id.WeaponEnchantment.from_int weaponEnchantment
      | "SickleRitual" -> decode_one Id.SickleRitual.from_int sickleRitual
      | "RingEnchantment" ->
          decode_one Id.RingEnchantment.from_int ringEnchantment
      | "ChronicleEnchantment" ->
          decode_one Id.ChronicleEnchantment.from_int chronicleEnchantment
      | _ -> fail "Expected an Activatable category"
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
    open Decoders_bs.Decode

    let t =
      let generic = int |> map generic in
      let specific =
        field "tag" string
        >>= function
        | "Blessing" -> decode_one Id.Blessing.from_int blessing
        | "Cantrip" -> decode_one Id.Cantrip.from_int cantrip
        | "TradeSecret" ->
            decode_one Id.GeneralSpecialAbility.TradeSecret.from_int tradeSecret
        | "Script" -> decode_one Id.Script.from_int script
        | "AnimalShape" ->
            decode_one Id.StaffEnchantment.AnimalShape.from_int animalShape
        | "ArcaneBardTradition" ->
            decode_one Id.MagicalTradition.ArcaneBardTradition.from_int
              arcaneBardTradition
        | "ArcaneDancerTradition" ->
            decode_one Id.MagicalTradition.ArcaneDancerTradition.from_int
              arcaneDancerTradition
        | "SexPractice" -> decode_one Id.SexPractice.from_int sexPractice
        | "Race" -> decode_one Id.Race.from_int race
        | "Culture" -> decode_one Id.Culture.from_int culture
        | "BlessedTradition" ->
            decode_one Id.BlessedTradition.from_int blessedTradition
        | "Element" -> decode_one Id.Element.from_int element
        | "Property" -> decode_one Id.Property.from_int property
        | "Aspect" -> decode_one Id.Aspect.from_int aspect
        | "Disease" -> decode_one Id.Disease.from_int disease
        | "Poison" -> decode_one Id.Poison.from_int poison
        | "Language" -> decode_one Id.Language.from_int language
        | "Skill" -> decode_one Id.Skill.from_int skill
        | "MeleeCombatTechnique" ->
            decode_one Id.MeleeCombatTechnique.from_int meleeCombatTechnique
        | "RangedCombatTechnique" ->
            decode_one Id.RangedCombatTechnique.from_int rangedCombatTechnique
        | "LiturgicalChant" ->
            decode_one Id.LiturgicalChant.from_int liturgicalChant
        | "Ceremony" -> decode_one Id.Ceremony.from_int ceremony
        | "Spell" -> decode_one Id.Spell.from_int spell
        | "Ritual" -> decode_one Id.Ritual.from_int ritual
        | _ -> fail "Expected a select option category"
      in
      one_of [ ("Generic", generic); ("Specific", specific) ]
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
      open Decoders_bs.Decode

      let t =
        field "tag" string
        >>= function
        | "Attribute" -> decode_many Id.Attribute.from_int attribute
        | "Skill" -> decode_many Id.Skill.from_int skill
        | "MeleeCombatTechnique" ->
            decode_many Id.MeleeCombatTechnique.from_int meleeCombatTechnique
        | "RangedCombatTechnique" ->
            decode_many Id.RangedCombatTechnique.from_int rangedCombatTechnique
        | "Spell" -> decode_many Id.Spell.from_int spell
        | "Ritual" -> decode_many Id.Ritual.from_int ritual
        | "LiturgicalChant" ->
            decode_many Id.LiturgicalChant.from_int liturgicalChant
        | "Ceremony" -> decode_many Id.Ceremony.from_int ceremony
        | _ -> fail "Expected a rated category"
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
    open Decoders_bs.Decode

    let t =
      field "tag" string
      >>= function
      | "Attribute" -> decode_one Id.Attribute.from_int attribute
      | "Skill" -> decode_one Id.Skill.from_int skill
      | "MeleeCombatTechnique" ->
          decode_one Id.MeleeCombatTechnique.from_int meleeCombatTechnique
      | "RangedCombatTechnique" ->
          decode_one Id.RangedCombatTechnique.from_int rangedCombatTechnique
      | "Spell" -> decode_one Id.Spell.from_int spell
      | "Ritual" -> decode_one Id.Ritual.from_int ritual
      | "LiturgicalChant" ->
          decode_one Id.LiturgicalChant.from_int liturgicalChant
      | "Ceremony" -> decode_one Id.Ceremony.from_int ceremony
      | _ -> fail "Expected a rated category"
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
    open Decoders_bs.Decode

    let t =
      field "tag" string
      >>= function
      | "Skill" -> decode_one Id.Skill.from_int skill
      | "Spell" -> decode_one Id.Spell.from_int spell
      | "Ritual" -> decode_one Id.Ritual.from_int ritual
      | "LiturgicalChant" ->
          decode_one Id.LiturgicalChant.from_int liturgicalChant
      | "Ceremony" -> decode_one Id.Ceremony.from_int ceremony
      | _ -> fail "Expected a skill category"
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
    open Decoders_bs.Decode

    let t =
      field "tag" string
      >>= function
      | "Spell" -> decode_one Id.Spell.from_int spell
      | "Ritual" -> decode_one Id.Ritual.from_int ritual
      | "LiturgicalChant" ->
          decode_one Id.LiturgicalChant.from_int liturgicalChant
      | "Ceremony" -> decode_one Id.Ceremony.from_int ceremony
      | _ -> fail "Expected an activatable skill category"
  end
end

module Spellwork = struct
  type t = Spell of Id.Spell.t | Ritual of Id.Ritual.t
  [@@bs.deriving accessors]

  module Decode = struct
    open Decoders_bs.Decode

    let t =
      field "tag" string
      >>= function
      | "Spell" -> decode_one Id.Spell.from_int spell
      | "Ritual" -> decode_one Id.Ritual.from_int ritual
      | _ -> fail "Expected a spellwork category"
  end
end

module ActivatableAndSkill = struct
  type t =
    | Activatable of Activatable.t
    | ActivatableSkill of ActivatableSkill.t
  [@@bs.deriving accessors]

  module Decode = struct
    open Decoders_bs.Decode

    let t =
      one_of
        [
          ("Activatable", Activatable.Decode.t |> map activatable);
          ( "Activatable Skill",
            ActivatableSkill.Decode.t |> map activatableSkill );
        ]
  end
end

module AnimistPower = struct
  type t = AnimistPower of Id.AnimistPower.t [@@bs.deriving accessors]

  module Decode = struct
    open Decoders_bs.Decode

    let t =
      field "tag" string
      >>= function
      | "AnimistPower" -> decode_one Id.AnimistPower.from_int animistPower
      | _ -> fail "Expected the animist power category"
  end
end

module Application = struct
  type t = Generic of int | Region of Id.Region.t | Disease of Id.Disease.t

  include Make (struct
    type nonrec t = t

    let outer_to_int = function
      | Generic _ -> 0
      | Region _ -> 1
      | Disease _ -> 2

    let compare a b =
      match (a, b) with
      | Generic a', Generic b' -> a' - b'
      | Region a', Region b' -> Id.Region.compare a' b'
      | Disease a', Disease b' -> Id.Disease.compare a' b'
      | (Generic _ as a), (Region _ as b)
      | (Generic _ as a), (Disease _ as b)
      | (Region _ as a), (Generic _ as b)
      | (Region _ as a), (Disease _ as b)
      | (Disease _ as a), (Generic _ as b)
      | (Disease _ as a), (Region _ as b) ->
          outer_to_int a - outer_to_int b
  end)
end
