module IM = Ley_IntMap;

open Hero.ActivatableSkill;

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
  |> IM.filter((entry: Hero.ActivatableSkill.t) =>
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
  |> IM.countWith((entry: Hero.ActivatableSkill.t) =>
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
  |> IM.Foldable.any((entry: Hero.ActivatableSkill.t) =>
       switch (entry.value) {
       | Active(_) => true
       | Inactive => false
       }
     );
