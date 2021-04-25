module ActivatableAndSkill = struct
  type t =
    | Advantage of int
    | Disadvantage of int
    | SpecialAbility of int
    | Spell of int
    | LiturgicalChant of int
end
