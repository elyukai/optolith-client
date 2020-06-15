open Ley.Option;
open Ley.Option.Functor;
open Ley.Option.Monad;
open Static;
open Ley.Function;
open Activatable_Convert;
open Activatable_SelectOptions;

let getDefaultNameAddition = (staticEntry, heroEntry) => {
  let input = Activatable_Accessors.input(staticEntry);
  let selectOptions = Activatable_Accessors.selectOptions(staticEntry);

  let sid = heroEntry |> getOption1;
  let sid2 = heroEntry |> getOption2;

  switch (input, sid, sid2) {
  // Text input
  | (Some(_), Some(`CustomInput(str)), None) => Some(str)
  // Select option and text input
  | (
      Some(_),
      Some(
        `Generic(_) as id | `Skill(_) as id | `CombatTechnique(_) as id |
        `Spell(_) as id |
        `LiturgicalChant(_) as id |
        `Cantrip(_) as id |
        `Blessing(_) as id,
      ),
      Some(`CustomInput(str)),
    )
      when SelectOption.SelectOptionMap.size(selectOptions) > 0 =>
    Some(
      (id |> getSelectOptionName(staticEntry) |> fromOption(""))
      ++ ": "
      ++ str,
    )
  // Plain select option
  | (
      None,
      Some(
        `Generic(_) as id | `Skill(_) as id | `CombatTechnique(_) as id |
        `Spell(_) as id |
        `LiturgicalChant(_) as id |
        `Cantrip(_) as id |
        `Blessing(_) as id,
      ),
      None,
    ) =>
    getSelectOptionName(staticEntry, id)
  | _ => None
  };
};

/**
 * A lot of entries have customization options: Text input, select option or
 * both. This function creates a string that can be appended to the `name`
 * property of the respective record to create the full active name.
 */
let getEntrySpecificNameAddition = (staticData, staticEntry, heroEntry) =>
  switch (staticEntry) {
  | Advantage(entry) =>
    switch (Id.advantageFromInt(entry.id)) {
    | Aptitude
    | ExceptionalSkill =>
      heroEntry
      |> getOption1
      >>= (
        sid =>
          switch (sid) {
          | `Skill(id) => lookupMap(id, staticData.skills, x => x.name)
          | `Spell(id) => lookupMap(id, staticData.spells, x => x.name)
          | `LiturgicalChant(id) =>
            lookupMap(id, staticData.liturgicalChants, x => x.name)
          | `Generic(_)
          | `CombatTechnique(_)
          | `Cantrip(_)
          | `Blessing(_)
          | `SpecialAbility(_)
          | `CustomInput(_) => None
          }
      )
    | ExceptionalCombatTechnique
    | WeaponAptitude =>
      heroEntry
      |> getOption1
      >>= (
        sid =>
          switch (sid) {
          | `CombatTechnique(id) =>
            lookupMap(id, staticData.combatTechniques, x => x.name)
          | `Generic(_)
          | `Skill(_)
          | `Spell(_)
          | `LiturgicalChant(_)
          | `Cantrip(_)
          | `Blessing(_)
          | `SpecialAbility(_)
          | `CustomInput(_) => None
          }
      )
    | HatredFor =>
      heroEntry
      |> getOption1
      >>= getSelectOption(staticEntry)
      |> liftM2(
           (type_, frequency: Static.SelectOption.t) =>
             type_ ++ " (" ++ frequency.name ++ ")",
           getOption2(heroEntry) >>= getCustomInput,
         )
    | _ => getDefaultNameAddition(staticEntry, heroEntry)
    }
  | Disadvantage(entry) =>
    switch (Id.disadvantageFromInt(entry.id)) {
    | Incompetent =>
      heroEntry
      |> getOption1
      >>= getSkillFromOption(staticData)
      <&> (x => x.name)
    | PersonalityFlaw =>
      heroEntry
      |> getOption1
      >>= getSelectOption(staticEntry)
      <&> (
        option1 =>
          (
            switch (option1.id) {
            // Get the input if Prejudice or Unworldly is selected
            | `Generic(7 | 8) => heroEntry |> getOption2 >>= getCustomInput
            // Otherwise ignore any additional options
            | `Generic(_)
            | `Skill(_)
            | `CombatTechnique(_)
            | `Spell(_)
            | `LiturgicalChant(_)
            | `Cantrip(_)
            | `Blessing(_)
            | `SpecialAbility(_) => None
            }
          )
          |> option(option1.name, specialInput =>
               option1.name ++ ": " ++ specialInput
             )
      )
    | _ => getDefaultNameAddition(staticEntry, heroEntry)
    }
  | SpecialAbility(entry) =>
    switch (Id.specialAbilityFromInt(entry.id)) {
    | AdaptionZauber
    | FavoriteSpellwork =>
      heroEntry
      |> getOption1
      >>= (
        sid =>
          switch (sid) {
          | `Spell(id) => lookupMap(id, staticData.spells, x => x.name)
          | `Generic(_)
          | `Skill(_)
          | `CombatTechnique(_)
          | `LiturgicalChant(_)
          | `Cantrip(_)
          | `Blessing(_)
          | `SpecialAbility(_)
          | `CustomInput(_) => None
          }
      )
    | TraditionSavant
    | Forschungsgebiet
    | Expertenwissen
    | Wissensdurst
    | Recherchegespuer =>
      heroEntry
      |> getOption1
      >>= getSkillFromOption(staticData)
      <&> (x => x.name)
    | Lieblingsliturgie =>
      heroEntry
      |> getOption1
      >>= (
        sid =>
          switch (sid) {
          | `LiturgicalChant(id) =>
            lookupMap(id, staticData.liturgicalChants, x => x.name)
          | `Generic(_)
          | `Skill(_)
          | `CombatTechnique(_)
          | `Spell(_)
          | `Cantrip(_)
          | `Blessing(_)
          | `SpecialAbility(_)
          | `CustomInput(_) => None
          }
      )
    | SkillSpecialization =>
      heroEntry
      |> getOption1
      >>= getSkillFromOption(staticData)
      >>= (
        skill =>
          heroEntry
          |> getOption2
          >>= (
            option2 =>
              (
                switch (option2) {
                // If input string use input
                | `CustomInput(x) => Some(x)
                // Otherwise lookup application name
                | `Generic(id) =>
                  skill.applications
                  |> Ley.IntMap.Foldable.find((a: Skill.application) =>
                       a.id === id
                     )
                  <&> (a => a.name)
                | `Skill(_)
                | `CombatTechnique(_)
                | `Spell(_)
                | `LiturgicalChant(_)
                | `Cantrip(_)
                | `Blessing(_)
                | `SpecialAbility(_) => None
                }
              )
              // Merge skill name and application name
              <&> (appName => skill.name ++ ": " ++ appName)
          )
      )
    | Exorzist =>
      switch (heroEntry.level) {
      | Some(1) =>
        heroEntry |> getOption1 >>= getSelectOptionName(staticEntry)
      | _ => None
      }
    | SpellEnhancement as entryId
    | ChantEnhancement as entryId =>
      heroEntry
      |> getOption1
      >>= getSelectOption(staticEntry)
      >>= (
        enhancement =>
          enhancement.enhancementTarget
          >>= (
            id =>
              (
                switch (entryId) {
                | SpellEnhancement =>
                  Ley.IntMap.lookup(id, staticData.spells) <&> (x => x.name)
                | _ =>
                  Ley.IntMap.lookup(id, staticData.liturgicalChants)
                  <&> (x => x.name)
                }
              )
              <&> (targetName => targetName ++ ": " ++ enhancement.name)
          )
      )
    | TraditionArcaneBard =>
      heroEntry
      |> getOption1
      >>= getGenericId
      >>= flip(Ley.IntMap.lookup, staticData.arcaneBardTraditions)
    | TraditionArcaneDancer =>
      heroEntry
      |> getOption1
      >>= getGenericId
      >>= flip(Ley.IntMap.lookup, staticData.arcaneDancerTraditions)
    | LanguageSpecializations =>
      liftM2(
        getSelectOption,
        Ley.IntMap.lookup(
          Id.specialAbilityToInt(Language),
          staticData.specialAbilities,
        )
        <&> (specialAbility => SpecialAbility(specialAbility)),
        getOption1(heroEntry),
      )
      |> join
      >>= (
        language =>
          heroEntry
          |> getOption2
          >>= (
            option2 =>
              (
                switch (option2) {
                | `CustomInput(str) => Some(str)
                | `Generic(specializationId) =>
                  language.specializations
                  >>= (
                    specializations =>
                      Ley.List.Safe.atMay(
                        specializations,
                        specializationId - 1,
                      )
                  )
                | `Skill(_)
                | `CombatTechnique(_)
                | `Spell(_)
                | `LiturgicalChant(_)
                | `Cantrip(_)
                | `Blessing(_)
                | `SpecialAbility(_) => None
                }
              )
              <&> (specialization => language.name ++ ": " ++ specialization)
          )
      )
    | Fachwissen =>
      heroEntry
      |> getOption1
      >>= getSkillFromOption(staticData)
      >>= (
        skill => {
          let applications =
            skill.applications
            |> Ley.IntMap.filter((app: Skill.application) =>
                 app.prerequisite |> isNone
               );

          [heroEntry |> getOption2, heroEntry |> getOption3]
          |> mapOption(option =>
               option
               >>= getGenericId
               >>= (
                 opt =>
                   applications
                   |> Ley.IntMap.Foldable.find((app: Skill.application) =>
                        app.id === opt
                      )
                   <&> (app => app.name)
               )
             )
          |> ensure(apps => apps |> Ley.List.Foldable.length |> (===)(2))
          <&> (
            apps =>
              apps
              |> AdvancedFiltering.sortStrings(staticData)
              |> Intl.ListFormat.format(Conjunction, staticData)
              |> (appsStr => skill.name ++ ": " ++ appsStr)
          );
        }
      )
    | _ => getDefaultNameAddition(staticEntry, heroEntry)
    }
  };

let getDisAdvLevelStr = level =>
  level |> Integers.intToRoman |> fromOption(Ley.Int.show(level));

let getSpecialAbilityLevelStr = level =>
  (level > 1 ? "I" ++ Chars.nobr ++ "–" ++ Chars.nobr : "")
  ++ getDisAdvLevelStr(level);

/**
 * Gets the level string that hast to be appended (with a non-breaking space!)
 * to the name. This string is aware of differences between dis/advantages and
 *  special abilties as well as it handles the Native Tongue level for
 * languages.
 */
let getLevelName = (staticData, staticEntry, singleHeroEntry) =>
  switch (staticEntry, singleHeroEntry.level) {
  | (Advantage(_), Some(level))
  | (Disadvantage(_), Some(level)) => Some(getDisAdvLevelStr(level))
  | (SpecialAbility(staticEntry), Some(level)) =>
    switch (Id.specialAbilityFromInt(staticEntry.id)) {
    // Language level 4 = Native Tongue and thus needs a special name
    | Language when level === 4 =>
      Some(staticData.messages.specialabilities_nativetonguelevel)
    | _ => Some(getSpecialAbilityLevelStr(level))
    }
  | _ => None
  };

/**
 * Some entries cannot use the default `name` property from wiki entries. The
 * value returned by may not use the default `name` property. For all entries
 * that do not need to handle a specific display format, the default `name`
 * property is used.
 */
let getEntrySpecificNameReplacements =
    (~addLevelToName, staticEntry, nameAddition, levelName) => {
  let name = Activatable_Accessors.name(staticEntry);

  let flatLevelName =
    addLevelToName ? option("", (++)(Chars.nbsp), levelName) : "";

  let mapNameAddition = f => option(name, f, nameAddition);

  let mapDefaultWithParens = () =>
    mapNameAddition(add => name ++ " (" ++ add ++ ")");

  let mapDefaultWithoutParens = () =>
    mapNameAddition(add => name ++ " " ++ add);

  let addSndInParens = snd =>
    Ley.List.Extra.replaceStr(")", ": " ++ snd ++ ")");

  switch (staticEntry) {
  | Advantage(entry) =>
    switch (Id.advantageFromInt(entry.id)) {
    | ImmunityToPoison
    | ImmunityToDisease
    | HatredFor => mapDefaultWithoutParens()
    | _ => mapDefaultWithParens() ++ flatLevelName
    }
  | Disadvantage(entry) =>
    switch (Id.disadvantageFromInt(entry.id)) {
    | AfraidOf => mapDefaultWithoutParens() ++ flatLevelName
    | Principles
    | Obligations =>
      option(
        name ++ flatLevelName,
        nameAddition => name ++ flatLevelName ++ " (" ++ nameAddition ++ ")",
        nameAddition,
      )
    | _ => mapDefaultWithParens() ++ flatLevelName
    }
  | SpecialAbility(entry) =>
    switch (Id.specialAbilityFromInt(entry.id)) {
    | GebieterDesAspekts => mapDefaultWithoutParens()
    | TraditionArcaneBard
    | TraditionArcaneDancer
    | TraditionSavant => mapNameAddition(flip(addSndInParens, name))
    | _ => mapDefaultWithParens() ++ flatLevelName
    }
  };
};

type combinedName = {
  name: string,
  baseName: string,
  addName: option(string),
  levelName: option(string),
};

/**
 * Returns name, splitted and combined, of advantage/disadvantage/special
 * ability as a Option (in case the wiki entry does not exist).
 */
let getName = (~addLevelToName, staticData, staticEntry, heroEntry) => {
  let addName =
    getEntrySpecificNameAddition(staticData, staticEntry, heroEntry);

  let levelName = getLevelName(staticData, staticEntry, heroEntry);

  let fullName =
    getEntrySpecificNameReplacements(
      ~addLevelToName,
      staticEntry,
      addName,
      levelName,
    );

  {
    name: fullName,
    baseName: Activatable_Accessors.name(staticEntry),
    addName,
    levelName,
  };
};
/*
 /**
   * Returns the name of the given object. If the object is a string, it returns
   * the string.
   */
 export const getFullName =
   (obj: string | ActiveActivatable): string => {
     if (typeof obj === "string") {
       return obj
     }

     return obj.nameAndCost.naming.name
   }

 /**
   * Accepts the full special ability name and returns only the text between
   * parentheses. If no parentheses were found, returns an empty string.
   */
 export const getBracketedNameFromFullName =
   (full_name: string): string => {
     const result = /\((?<subname>.+)\)/u .exec (full_name)

     if (result === null || result .groups === undefined) {
       return ""
     }

     return result .groups .subname
   }

 /**
   * `compressList :: L10n -> [ActiveActivatable] -> String`
   *
   * Takes a list of active Activatables and merges them together. Used to display
   * lists of Activatables on character sheet.
   */
 export const compressList =
   (staticData: StaticDataRecord) =>
   (xs: List<Record<ActiveActivatable>>): string => {
     const grouped_xs =
       elems (groupByKey<Record<ActiveActivatable>, string> (AAA_.id) (xs))

     return pipe (
                   map (
                     ifElse<List<Record<ActiveActivatable>>>
                       (xs_group => flength (xs_group) === 1)
                       (pipe (listToOption, Option ("") (AAA_.name)))
                       (xs_group => pipe (
                                           map ((x: Record<ActiveActivatable>) => {
                                             const levelPart =
                                               pipe (
                                                     AAA_.level,
                                                     fmap (pipe (toRoman, appendStr (" "))),
                                                     fromOption ("")
                                                   )
                                                   (x)

                                             const selectOptionPart =
                                               fromOption ("") (AAA_.addName (x))

                                             return selectOptionPart + levelPart
                                           }),
                                           sortStrings (staticData),
                                           intercalate (", "),
                                           x => ` (${x})`,
                                           x => option ("")
                                                     ((r: Record<ActiveActivatable>) =>
                                                       AAA_.baseName (r) + x)
                                                     (listToOption (xs_group))
                                         )
                                         (xs_group))
                   ),
                   sortStrings (staticData),
                   intercalate (", ")
                 )
                 (grouped_xs)
   }
 */
