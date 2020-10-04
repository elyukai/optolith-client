module IM = Ley_IntMap;

type t =
  | Spells
  | LiturgicalChants;

/**
 * Get all active hero entries from the specified domain.
 */
let getActiveSkillEntries = (domain, hero: Hero.t) =>
  (
    switch (domain) {
    | Spells => hero.spells
    | LiturgicalChants => hero.liturgicalChants
    }
  )
  |> IM.filter((entry: ActivatableSkill.Dynamic.t) =>
       switch (entry.value) {
       | Active(_) => true
       | Inactive => false
       }
     );

/**
 * Count all active skills from the specified domain.
 */
let countActiveSkillEntries = (domain, hero: Hero.t) =>
  (
    switch (domain) {
    | Spells => hero.spells
    | LiturgicalChants => hero.liturgicalChants
    }
  )
  |> IM.countWith((entry: ActivatableSkill.Dynamic.t) =>
       switch (entry.value) {
       | Active(_) => true
       | Inactive => false
       }
     );

/**
 * Has active skill(s) from the specified domain.
 */
let hasActiveSkillEntries = (domain, hero: Hero.t) =>
  (
    switch (domain) {
    | Spells => hero.spells
    | LiturgicalChants => hero.liturgicalChants
    }
  )
  |> IM.any((entry: ActivatableSkill.Dynamic.t) =>
       switch (entry.value) {
       | Active(_) => true
       | Inactive => false
       }
     );
