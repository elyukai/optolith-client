(** This module handles AND combinations of multiple identifier types for cases
    such as if a prerequisite can require both a skill or a spell on a certain
    skill rating.

    Each combination type has an associated [Decode] module where a decoder is
    specified for JSON values of the form [{ type: string; value: int; }].

    Each module works exactly the same way, which is outlined above, and why no
    duplicate documentation is present below. *)

module ExtensionRule : sig
  type t = FocusRule of Id.FocusRule.t | OptionalRule of Id.OptionalRule.t

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module Activatable : sig
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

  module Decode : sig
    val t : t Json.Decode.decoder
  end

  module Many : sig
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

    module Decode : sig
      val t : t Json.Decode.decoder
    end
  end
end

module SelectOption : sig
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

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module Rated : sig
  type t =
    | Attribute of Id.Attribute.t
    | Skill of Id.Skill.t
    | MeleeCombatTechnique of Id.MeleeCombatTechnique.t
    | RangedCombatTechnique of Id.RangedCombatTechnique.t
    | Spell of Id.Spell.t
    | Ritual of Id.Ritual.t
    | LiturgicalChant of Id.LiturgicalChant.t
    | Ceremony of Id.Ceremony.t

  module Decode : sig
    val t : t Json.Decode.decoder
  end

  module Many : sig
    type t =
      | Attribute of Id.Attribute.t NonEmptyList.t
      | Skill of Id.Skill.t NonEmptyList.t
      | MeleeCombatTechnique of Id.MeleeCombatTechnique.t NonEmptyList.t
      | RangedCombatTechnique of Id.RangedCombatTechnique.t NonEmptyList.t
      | Spell of Id.Spell.t NonEmptyList.t
      | Ritual of Id.Ritual.t NonEmptyList.t
      | LiturgicalChant of Id.LiturgicalChant.t NonEmptyList.t
      | Ceremony of Id.Ceremony.t NonEmptyList.t

    module Decode : sig
      val t : t Json.Decode.decoder
    end
  end
end

module Skill : sig
  type t =
    | Skill of Id.Skill.t
    | Spell of Id.Spell.t
    | Ritual of Id.Ritual.t
    | LiturgicalChant of Id.LiturgicalChant.t
    | Ceremony of Id.Ceremony.t

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module ActivatableSkill : sig
  type t =
    | Spell of Id.Spell.t
    | Ritual of Id.Ritual.t
    | LiturgicalChant of Id.LiturgicalChant.t
    | Ceremony of Id.Ceremony.t

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module ActivatableAndSkill : sig
  type t =
    | Activatable of Activatable.t
    | ActivatableSkill of ActivatableSkill.t

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end

module AnimistPower : sig
  type t = AnimistPower of Id.AnimistPower.t

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end
