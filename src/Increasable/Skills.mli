val exceptional_skill_bonus :
  Advantage.Dynamic.t option -> Id.Activatable.SelectOption.t -> int
(**
 * [exceptional_skill_bonus exceptional_skill skill_id] return the SR maximum
 * bonus from an active Exceptional Skill advantage for the passed skill id.
 *)

val max_sr_by_check : Attribute.Dynamic.t Ley_IntMap.t -> Check.t -> int
(**
 * [max_sr_by_check attributes check] creates the base for a list for
 * calculating the maximum of a skill based on the skill check's attributes'
 * values. It takes the map of attribute hero entries and the skill check
 * attribute ids [check].
 *)

val max_sr_by_el : ExperienceLevel.t -> Id.Phase.t -> int option
(**
 * [max_sr_by_el el phase] returns the maximum SR defined in the selected
 * experience levele [el], if applicable.
 *)

val max :
  start_el:ExperienceLevel.t ->
  phase:Id.Phase.t ->
  attributes:Attribute.Dynamic.t Ley_IntMap.t ->
  exceptional_skill:Advantage.Dynamic.t option ->
  static_entry:Skill.Static.t ->
  int
(**
 * Returns the maximum skill rating for the passed skill.
 *)

val is_increasable :
  start_el:ExperienceLevel.t ->
  phase:Id.Phase.t ->
  attributes:Attribute.Dynamic.t Ley_IntMap.t ->
  exceptional_skill:Advantage.Dynamic.t option ->
  static_entry:Skill.Static.t ->
  hero_entry:Skill.Dynamic.t ->
  bool
(**
 * Returns if the passed skill's skill rating can be increased.
 *)

val min :
  craft_instruments:GeneralSpecialAbility.Dynamic.t option ->
  skills:Skill.Dynamic.t Ley_IntMap.t ->
  static_entry:Skill.Static.t ->
  hero_entry:Skill.Dynamic.t ->
  int option
(**
 * Returns the minimum skill rating for the passed skill.
 *)

val is_decreasable :
  craft_instruments:GeneralSpecialAbility.Dynamic.t option ->
  skills:Skill.Dynamic.t Ley_IntMap.t ->
  static_entry:Skill.Static.t ->
  hero_entry:Skill.Dynamic.t ->
  bool
(**
 * Returns if the passed skill's skill rating can be decreased.
 *)

module Routine : sig
  type t = { minimum_modifier : int; optional_rule_only : bool }

  val min_check_mod : int * int * int -> int -> t option
  (**
   * `min_check_mod check sr` returns the minimum check modifier from
   * which a routine check is possible for the passed skill rating `sr` and the
   * passed check attribute values `check`. Returns `None` if no routine check
   * is possible, otherwise a `Some` of a pair, where the first value is the
   * minimum check modifier and the second a boolean, where `True` states that
   * the minimum check modifier is only valid when using the optional rule for
   * routine checks, thus otherwise a routine check would not be possible.
   *)
end
