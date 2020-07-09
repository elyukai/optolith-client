module IM = Ley_IntMap;
module O = Ley_Option;

open Hero.ActivatableSkill;

let getValueDef = O.option(Inactive, (x: Hero.ActivatableSkill.t) => x.value);

let valueToInt = value =>
  switch (value) {
  | Active(sr) => sr
  | Inactive => 0
  };

let isActive = (x: Hero.ActivatableSkill.t) =>
  switch (x.value) {
  | Active(_) => true
  | Inactive => false
  };

let isActiveM = O.option(false, isActive);

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
