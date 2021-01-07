let isActive (x : 'a Activatable_Dynamic.t) = Ley_List.Extra.notNull x.active

let isActiveM x = Ley_Option.option false isActive x

let id = function
  | Activatable.Advantage x -> Id.Activatable.Advantage x.id
  | Disadvantage x -> Disadvantage x.id
  | GeneralSpecialAbility x -> GeneralSpecialAbility x.id
  | FatePointSpecialAbility x -> FatePointSpecialAbility x.id
  | CombatSpecialAbility x -> CombatSpecialAbility x.id
  | MagicalSpecialAbility x -> MagicalSpecialAbility x.id
  | StaffEnchantment x -> StaffEnchantment x.id
  | FamiliarSpecialAbility x -> FamiliarSpecialAbility x.id
  | KarmaSpecialAbility x -> KarmaSpecialAbility x.id
  | ProtectiveWardingCircleSpecialAbility x ->
      ProtectiveWardingCircleSpecialAbility x.id
  | CombatStyleSpecialAbility x -> CombatStyleSpecialAbility x.id
  | AdvancedCombatSpecialAbility x -> AdvancedCombatSpecialAbility x.id
  | CommandSpecialAbility x -> CommandSpecialAbility x.id
  | MagicStyleSpecialAbility x -> MagicStyleSpecialAbility x.id
  | AdvancedMagicalSpecialAbility x -> AdvancedMagicalSpecialAbility x.id
  | SpellSwordEnchantment x -> SpellSwordEnchantment x.id
  | DaggerRitual x -> DaggerRitual x.id
  | InstrumentEnchantment x -> InstrumentEnchantment x.id
  | AttireEnchantment x -> AttireEnchantment x.id
  | OrbEnchantment x -> OrbEnchantment x.id
  | WandEnchantment x -> WandEnchantment x.id
  | BrawlingSpecialAbility x -> BrawlingSpecialAbility x.id
  | AncestorGlyph x -> AncestorGlyph x.id
  | CeremonialItemSpecialAbility x -> CeremonialItemSpecialAbility x.id
  | Sermon x -> Sermon x.id
  | LiturgicalStyleSpecialAbility x -> LiturgicalStyleSpecialAbility x.id
  | AdvancedKarmaSpecialAbility x -> AdvancedKarmaSpecialAbility x.id
  | Vision x -> Vision x.id
  | MagicalTradition x -> MagicalTradition x.id
  | BlessedTradition x -> BlessedTradition x.id
  | Paktgeschenk x -> Paktgeschenk x.id
  | SikaryanRaubSonderfertigkeit x -> SikaryanRaubSonderfertigkeit x.id
  | LykanthropischeGabe x -> LykanthropischeGabe x.id
  | Talentstilsonderfertigkeit x -> Talentstilsonderfertigkeit x.id
  | ErweiterteTalentsonderfertigkeit x -> ErweiterteTalentsonderfertigkeit x.id
  | Kugelzauber x -> Kugelzauber x.id
  | Kesselzauber x -> Kesselzauber x.id
  | Kappenzauber x -> Kappenzauber x.id
  | Spielzeugzauber x -> Spielzeugzauber x.id
  | Schalenzauber x -> Schalenzauber x.id
  | SexSchicksalspunkteSonderfertigkeit x ->
      SexSchicksalspunkteSonderfertigkeit x.id
  | SexSonderfertigkeit x -> SexSonderfertigkeit x.id
  | Waffenzauber x -> Waffenzauber x.id
  | Sichelritual x -> Sichelritual x.id
  | Ringzauber x -> Ringzauber x.id
  | Chronikzauber x -> Chronikzauber x.id

let id' = function
  | Activatable.Advantage x -> x.id
  | Disadvantage x -> x.id
  | GeneralSpecialAbility x -> x.id
  | FatePointSpecialAbility x -> x.id
  | CombatSpecialAbility x -> x.id
  | MagicalSpecialAbility x -> x.id
  | StaffEnchantment x -> x.id
  | FamiliarSpecialAbility x -> x.id
  | KarmaSpecialAbility x -> x.id
  | ProtectiveWardingCircleSpecialAbility x -> x.id
  | CombatStyleSpecialAbility x -> x.id
  | AdvancedCombatSpecialAbility x -> x.id
  | CommandSpecialAbility x -> x.id
  | MagicStyleSpecialAbility x -> x.id
  | AdvancedMagicalSpecialAbility x -> x.id
  | SpellSwordEnchantment x -> x.id
  | DaggerRitual x -> x.id
  | InstrumentEnchantment x -> x.id
  | AttireEnchantment x -> x.id
  | OrbEnchantment x -> x.id
  | WandEnchantment x -> x.id
  | BrawlingSpecialAbility x -> x.id
  | AncestorGlyph x -> x.id
  | CeremonialItemSpecialAbility x -> x.id
  | Sermon x -> x.id
  | LiturgicalStyleSpecialAbility x -> x.id
  | AdvancedKarmaSpecialAbility x -> x.id
  | Vision x -> x.id
  | MagicalTradition x -> x.id
  | BlessedTradition x -> x.id
  | Paktgeschenk x -> x.id
  | SikaryanRaubSonderfertigkeit x -> x.id
  | LykanthropischeGabe x -> x.id
  | Talentstilsonderfertigkeit x -> x.id
  | ErweiterteTalentsonderfertigkeit x -> x.id
  | Kugelzauber x -> x.id
  | Kesselzauber x -> x.id
  | Kappenzauber x -> x.id
  | Spielzeugzauber x -> x.id
  | Schalenzauber x -> x.id
  | SexSchicksalspunkteSonderfertigkeit x -> x.id
  | SexSonderfertigkeit x -> x.id
  | Waffenzauber x -> x.id
  | Sichelritual x -> x.id
  | Ringzauber x -> x.id
  | Chronikzauber x -> x.id

let idDeepVariant x = x |> id |> Id.Activatable.to_nested

let name = function
  | Activatable.Advantage x -> x.name
  | Disadvantage x -> x.name
  | GeneralSpecialAbility x -> x.name
  | FatePointSpecialAbility x -> x.name
  | CombatSpecialAbility x -> x.name
  | MagicalSpecialAbility x -> x.name
  | StaffEnchantment x -> x.name
  | FamiliarSpecialAbility x -> x.name
  | KarmaSpecialAbility x -> x.name
  | ProtectiveWardingCircleSpecialAbility x -> x.name
  | CombatStyleSpecialAbility x -> x.name
  | AdvancedCombatSpecialAbility x -> x.name
  | CommandSpecialAbility x -> x.name
  | MagicStyleSpecialAbility x -> x.name
  | AdvancedMagicalSpecialAbility x -> x.name
  | SpellSwordEnchantment x -> x.name
  | DaggerRitual x -> x.name
  | InstrumentEnchantment x -> x.name
  | AttireEnchantment x -> x.name
  | OrbEnchantment x -> x.name
  | WandEnchantment x -> x.name
  | BrawlingSpecialAbility x -> x.name
  | AncestorGlyph x -> x.name
  | CeremonialItemSpecialAbility x -> x.name
  | Sermon x -> x.name
  | LiturgicalStyleSpecialAbility x -> x.name
  | AdvancedKarmaSpecialAbility x -> x.name
  | Vision x -> x.name
  | MagicalTradition x -> x.name
  | BlessedTradition x -> x.name
  | Paktgeschenk x -> x.name
  | SikaryanRaubSonderfertigkeit x -> x.name
  | LykanthropischeGabe x -> x.name
  | Talentstilsonderfertigkeit x -> x.name
  | ErweiterteTalentsonderfertigkeit x -> x.name
  | Kugelzauber x -> x.name
  | Kesselzauber x -> x.name
  | Kappenzauber x -> x.name
  | Spielzeugzauber x -> x.name
  | Schalenzauber x -> x.name
  | SexSchicksalspunkteSonderfertigkeit x -> x.name
  | SexSonderfertigkeit x -> x.name
  | Waffenzauber x -> x.name
  | Sichelritual x -> x.name
  | Ringzauber x -> x.name
  | Chronikzauber x -> x.name

let selectOptions = function
  | Activatable.Advantage x -> x.selectOptions
  | Disadvantage x -> x.selectOptions
  | GeneralSpecialAbility x -> x.selectOptions
  | FatePointSpecialAbility x -> x.selectOptions
  | CombatSpecialAbility x -> x.selectOptions
  | MagicalSpecialAbility x -> x.selectOptions
  | StaffEnchantment x -> x.selectOptions
  | FamiliarSpecialAbility x -> x.selectOptions
  | KarmaSpecialAbility x -> x.selectOptions
  | ProtectiveWardingCircleSpecialAbility x -> x.selectOptions
  | CombatStyleSpecialAbility x -> x.selectOptions
  | AdvancedCombatSpecialAbility x -> x.selectOptions
  | CommandSpecialAbility x -> x.selectOptions
  | MagicStyleSpecialAbility x -> x.selectOptions
  | AdvancedMagicalSpecialAbility x -> x.selectOptions
  | SpellSwordEnchantment x -> x.selectOptions
  | DaggerRitual x -> x.selectOptions
  | InstrumentEnchantment x -> x.selectOptions
  | AttireEnchantment x -> x.selectOptions
  | OrbEnchantment x -> x.selectOptions
  | WandEnchantment x -> x.selectOptions
  | BrawlingSpecialAbility x -> x.selectOptions
  | AncestorGlyph x -> x.selectOptions
  | CeremonialItemSpecialAbility x -> x.selectOptions
  | Sermon x -> x.selectOptions
  | LiturgicalStyleSpecialAbility x -> x.selectOptions
  | AdvancedKarmaSpecialAbility x -> x.selectOptions
  | Vision x -> x.selectOptions
  | MagicalTradition x -> x.selectOptions
  | BlessedTradition x -> x.selectOptions
  | Paktgeschenk x -> x.selectOptions
  | SikaryanRaubSonderfertigkeit x -> x.selectOptions
  | LykanthropischeGabe x -> x.selectOptions
  | Talentstilsonderfertigkeit x -> x.selectOptions
  | ErweiterteTalentsonderfertigkeit x -> x.selectOptions
  | Kugelzauber x -> x.selectOptions
  | Kesselzauber x -> x.selectOptions
  | Kappenzauber x -> x.selectOptions
  | Spielzeugzauber x -> x.selectOptions
  | Schalenzauber x -> x.selectOptions
  | SexSchicksalspunkteSonderfertigkeit x -> x.selectOptions
  | SexSonderfertigkeit x -> x.selectOptions
  | Waffenzauber x -> x.selectOptions
  | Sichelritual x -> x.selectOptions
  | Ringzauber x -> x.selectOptions
  | Chronikzauber x -> x.selectOptions

let input = function
  | Activatable.Advantage x -> x.input
  | Disadvantage x -> x.input
  | GeneralSpecialAbility x -> x.input
  | FatePointSpecialAbility x -> x.input
  | CombatSpecialAbility x -> x.input
  | MagicalSpecialAbility x -> x.input
  | StaffEnchantment x -> x.input
  | FamiliarSpecialAbility x -> x.input
  | KarmaSpecialAbility x -> x.input
  | ProtectiveWardingCircleSpecialAbility _ -> None
  | CombatStyleSpecialAbility x -> x.input
  | AdvancedCombatSpecialAbility x -> x.input
  | CommandSpecialAbility x -> x.input
  | MagicStyleSpecialAbility x -> x.input
  | AdvancedMagicalSpecialAbility x -> x.input
  | SpellSwordEnchantment x -> x.input
  | DaggerRitual x -> x.input
  | InstrumentEnchantment x -> x.input
  | AttireEnchantment x -> x.input
  | OrbEnchantment x -> x.input
  | WandEnchantment x -> x.input
  | BrawlingSpecialAbility x -> x.input
  | AncestorGlyph x -> x.input
  | CeremonialItemSpecialAbility x -> x.input
  | Sermon x -> x.input
  | LiturgicalStyleSpecialAbility x -> x.input
  | AdvancedKarmaSpecialAbility x -> x.input
  | Vision x -> x.input
  | MagicalTradition x -> x.input
  | BlessedTradition x -> x.input
  | Paktgeschenk x -> x.input
  | SikaryanRaubSonderfertigkeit x -> x.input
  | LykanthropischeGabe x -> x.input
  | Talentstilsonderfertigkeit x -> x.input
  | ErweiterteTalentsonderfertigkeit x -> x.input
  | Kugelzauber x -> x.input
  | Kesselzauber x -> x.input
  | Kappenzauber x -> x.input
  | Spielzeugzauber x -> x.input
  | Schalenzauber x -> x.input
  | SexSchicksalspunkteSonderfertigkeit x -> x.input
  | SexSonderfertigkeit x -> x.input
  | Waffenzauber x -> x.input
  | Sichelritual x -> x.input
  | Ringzauber x -> x.input
  | Chronikzauber x -> x.input

let apValue = function
  | Activatable.Advantage x -> x.apValue
  | Disadvantage x -> x.apValue
  | GeneralSpecialAbility x -> x.apValue
  | FatePointSpecialAbility x -> x.apValue
  | CombatSpecialAbility x -> x.apValue
  | MagicalSpecialAbility x -> x.apValue
  | StaffEnchantment x -> x.apValue
  | FamiliarSpecialAbility x -> x.apValue
  | KarmaSpecialAbility x -> x.apValue
  | ProtectiveWardingCircleSpecialAbility x -> x.apValue
  | CombatStyleSpecialAbility x -> x.apValue
  | AdvancedCombatSpecialAbility x -> x.apValue
  | CommandSpecialAbility x -> x.apValue
  | MagicStyleSpecialAbility x -> x.apValue
  | AdvancedMagicalSpecialAbility x -> x.apValue
  | SpellSwordEnchantment x -> x.apValue
  | DaggerRitual x -> x.apValue
  | InstrumentEnchantment x -> x.apValue
  | AttireEnchantment x -> x.apValue
  | OrbEnchantment x -> x.apValue
  | WandEnchantment x -> x.apValue
  | BrawlingSpecialAbility x -> x.apValue
  | AncestorGlyph x -> x.apValue
  | CeremonialItemSpecialAbility x -> x.apValue
  | Sermon x -> x.apValue
  | LiturgicalStyleSpecialAbility x -> x.apValue
  | AdvancedKarmaSpecialAbility x -> x.apValue
  | Vision x -> x.apValue
  | MagicalTradition x -> x.apValue
  | BlessedTradition x -> x.apValue
  | Paktgeschenk x -> x.apValue
  | SikaryanRaubSonderfertigkeit x -> x.apValue
  | LykanthropischeGabe x -> x.apValue
  | Talentstilsonderfertigkeit x -> x.apValue
  | ErweiterteTalentsonderfertigkeit x -> x.apValue
  | Kugelzauber x -> x.apValue
  | Kesselzauber x -> x.apValue
  | Kappenzauber x -> x.apValue
  | Spielzeugzauber x -> x.apValue
  | Schalenzauber x -> x.apValue
  | SexSchicksalspunkteSonderfertigkeit x -> x.apValue
  | SexSonderfertigkeit x -> x.apValue
  | Waffenzauber x -> x.apValue
  | Sichelritual x -> x.apValue
  | Ringzauber x -> x.apValue
  | Chronikzauber x -> x.apValue

let apValue' x =
  x |> apValue |> function
  | Some (Activatable_Shared.ApValue.Flat x) -> Some (OneOrMany.One x)
  | Some (PerLevel xs) -> Some (Many xs)
  | Some Option | None -> None

let max = function
  | Activatable.Advantage x -> x.max
  | Disadvantage x -> x.max
  | GeneralSpecialAbility x -> x.max
  | FatePointSpecialAbility x -> x.max
  | CombatSpecialAbility x -> x.max
  | MagicalSpecialAbility x -> x.max
  | StaffEnchantment x -> x.max
  | FamiliarSpecialAbility x -> x.max
  | KarmaSpecialAbility x -> x.max
  | ProtectiveWardingCircleSpecialAbility x -> x.max
  | CombatStyleSpecialAbility x -> x.max
  | AdvancedCombatSpecialAbility x -> x.max
  | CommandSpecialAbility x -> x.max
  | MagicStyleSpecialAbility x -> x.max
  | AdvancedMagicalSpecialAbility x -> x.max
  | SpellSwordEnchantment x -> x.max
  | DaggerRitual x -> x.max
  | InstrumentEnchantment x -> x.max
  | AttireEnchantment x -> x.max
  | OrbEnchantment x -> x.max
  | WandEnchantment x -> x.max
  | BrawlingSpecialAbility x -> x.max
  | AncestorGlyph x -> x.max
  | CeremonialItemSpecialAbility x -> x.max
  | Sermon x -> x.max
  | LiturgicalStyleSpecialAbility x -> x.max
  | AdvancedKarmaSpecialAbility x -> x.max
  | Vision x -> x.max
  | MagicalTradition x -> x.max
  | BlessedTradition x -> x.max
  | Paktgeschenk x -> x.max
  | SikaryanRaubSonderfertigkeit x -> x.max
  | LykanthropischeGabe x -> x.max
  | Talentstilsonderfertigkeit x -> x.max
  | ErweiterteTalentsonderfertigkeit x -> x.max
  | Kugelzauber x -> x.max
  | Kesselzauber x -> x.max
  | Kappenzauber x -> x.max
  | Spielzeugzauber x -> x.max
  | Schalenzauber x -> x.max
  | SexSchicksalspunkteSonderfertigkeit x -> x.max
  | SexSonderfertigkeit x -> x.max
  | Waffenzauber x -> x.max
  | Sichelritual x -> x.max
  | Ringzauber x -> x.max
  | Chronikzauber x -> x.max
