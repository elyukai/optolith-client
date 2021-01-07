module O = Ley_Option
module L = Ley_List

(** Get the SR maximum bonus from an active Exceptional Skill advantage. *)
let exceptional_skill_bonus exceptional_skill id =
  let is_selected (x : Activatable_Dynamic.single) =
    x.options |> O.listToOption |> O.elem (Id.Activatable.Option.Preset id)
  in
  let count_selected (x : Advantage.Dynamic.t) =
    x.active |> L.countBy is_selected
  in
  O.option 0 count_selected exceptional_skill

(**
 * Creates the base for a list for calculating the maximum of a skill based on
 * the skill check's attributes' values.
 *)
let max_sr_by_check mp check =
  check |> Check.values mp |> fun (a1, a2, a3) -> L.maximum [ a1; a2; a3 ] + 2

(**
 * Adds the maximum skill rating defined by the chosen experience level to the
 * list created by `getInitialMaximumList` if the hero is in character
 * creation phase.
 *)
let max_sr_by_el (start_el : ExperienceLevel.t) = function
  | Id.Phase.Outline | Definition -> Some start_el.maxSkillRating
  | Advancement -> None

(**
 * Returns the maximum skill rating for the passed skill.
 *)
let max ~start_el ~phase ~attributes ~exceptional_skill
    ~(static_entry : Skill.Static.t) =
  [
    Some (max_sr_by_check attributes static_entry.check);
    max_sr_by_el start_el phase;
  ]
  |> O.catOptions |> L.minimum
  |> ( + ) (exceptional_skill_bonus exceptional_skill (Skill static_entry.id))

(**
 * Returns if the passed skill's skill rating can be increased.
 *)
let is_increasable ~start_el ~phase ~attributes ~exceptional_skill ~static_entry
    ~(hero_entry : Skill.Dynamic.t) =
  hero_entry.value
  < max ~start_el ~phase ~attributes ~exceptional_skill ~static_entry

let min_sr_by_craft_instruments craft_instruments skills
    (static_entry : Skill.Static.t) =
  (* Sum of Woodworking and Metalworking must be at least 12. *)
  let minimum_sum = 12 in
  let other_sr id =
    skills |> Ley_IntMap.lookup (Id.Skill.toInt id) |> Skill.Dynamic.value
  in
  let diff id = minimum_sum - other_sr id in
  match Activatable_Accessors.isActiveM craft_instruments with
  | true -> (
      match Id.Skill.fromInt static_entry.id with
      | Woodworking -> Some (diff Metalworking)
      | Metalworking -> Some (diff Woodworking)
      | Flying | Gaukelei | Climbing | BodyControl | FeatOfStrength | Riding
      | Swimming | SelfControl | Singing | Perception | Dancing | Pickpocket
      | Stealth | Carousing | Persuasion | Seduction | Intimidation | Etiquette
      | Streetwise | Empathy | FastTalk | Disguise | Willpower | Tracking
      | Ropes | Fishing | Orienting | PlantLore | AnimalLore | Survival
      | Gambling | Geography | History | Religions | Warfare | MagicalLore
      | Mechanics | Math | Law | MythsAndLegends | SphereLore | Astronomy
      | Alchemy | Sailing | Driving | Commerce | TreatPoison | TreatDisease
      | TreatSoul | TreatWounds | Woodworking | PrepareFood | Leatherworking
      | ArtisticAbility | Metalworking | Music | PickLocks | Earthencraft
      | Clothworking | Other _ ->
          None )
  | false -> None

(**
 * Check if the dependencies allow the passed skill to be decreased.
 *)
let min_sr_by_deps skills (heroEntry : Skill.Dynamic.t) =
  O.Infix.(
    heroEntry.dependencies
    |> Dependencies.Resolve.skill_deps (fun id ->
           ( skills |> Ley_IntMap.lookup id |> Skill.Dynamic.getValueDef,
             heroEntry.id ))
    |> ensure L.Extra.notNull <&> L.maximum)

(**
 * Returns the minimum skill rating for the passed skill.
 *)
let min ~craft_instruments ~skills ~static_entry ~hero_entry =
  [
    ( getMinSrByDeps (heroSkills, heroEntry),
      getMinSrByCraftInstruments (craftInstruments, heroSkills, staticEntry) );
  ]
  |> catOptions
  |> ensure Ley_List.Extra.notNull
  <&> Ley_List.maximum

(**
 * Returns if the passed skill's skill rating can be decreased.
 *)
let is_decreasable ~craft_instruments ~hero_skills ~static_entry ~hero_entry =
  Skill.Dynamic.t = heroEntry.value
  |> ( getMin ~craftInstruments ~heroSkills ~staticEntry ~heroEntry
     |> fromOption 0 )

module Routine = struct
  type t = { minimum_modifier : int; optional_rule_only : bool }

  let attributeThreshold = 13

  (**
   * Returns the total of missing attribute points for a routine check without
   * using the optional rule for routine checks, because the minimum attribute
   * value is 13 in that case.
   *)
  let getMissingPoints =
    (a1, a2, a3) => [ (a1, a2, a3) ]
    |> Ley_List.map (a => attributeThreshold - a |> Ley_Int.max 0)
    |> Ley_List.sum

  (**
   * Returns the minimum check modifier from which a routine check is possible
   * without using the optional rule for routine checks.
   *)
  let getBaseMinCheckMod =
    sr => -Js.Math.floor_int ((Js.Int.toFloat sr -. 1.0) /. 3.0) + 3

  (**
   * Returns the minimum check modifier from which a routine check is possible for
   * the passed skill rating. Returns `None` if no routine check is possible,
   * otherwise a `Some` of a pair, where the first value is the minimum check
   * modifier and the second a boolean, where `True` states that the minimum check
   * modifier is only valid when using the optional rule for routine checks, thus
   * otherwise a routine check would not be possible.
   *)
  let getMinCheckModForRoutine =
    (check, sr) => sr
    (* Routine checks do only work if the SR is larger than 0 *)
    |> ensure (( > ) 0)
    >>= ( sr
        =>
        let missingPoints = getMissingPoints check in
        let checkModThreshold = getBaseMinCheckMod sr in

        let dependentCheckMod = checkModThreshold + missingPoints in

        if dependentCheckMod < 4 then Some (dependentCheckMod, missingPoints > 0)
        else None )
end
