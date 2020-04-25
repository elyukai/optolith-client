type macOsMenuBar = {
  /**
   * - **0**: Name of the app
   */
  aboutApp: string,
  preferences: string,
  quit: string,
  edit: string,
  view: string,
};

type initialization = {loadDatabaseError: string};

type tabs = {
  heroes: string,
  groups: string,
  wiki: string,
  faq: string,
  about: string,
  imprint: string,
  thirdPartyLicenses: string,
  lastChanges: string,
  profile: string,
  overview: string,
  personalData: string,
  characterSheet: string,
  pact: string,
  rules: string,
  raceCultureAndProfession: string,
  race: string,
  culture: string,
  profession: string,
  attributes: string,
  advantagesAndDisadvantages: string,
  advantages: string,
  disadvantages: string,
  abilities: string,
  skills: string,
  combatTechniques: string,
  specialAbilities: string,
  spells: string,
  liturgicalChants: string,
  belongings: string,
  equipment: string,
  hitZoneArmor: string,
  pets: string,
};

type apTooltip = {
  title: string,
  /**
   * - **0**: AP Total
   */
  total: string,
  /**
   * - **0**: AP Spent
   */
  spent: string,
  /**
   * - **0**: Current AP spent on advantages
   * - **1**: Maximum possible AP spent on advantages
   */
  spentOnAdvantages: string,
  /**
   * - **0**: Current AP spent on magic advantages
   * - **1**: Maximum possible AP spent on magic advantages
   */
  spentOnMagicAdvantages: string,
  /**
   * - **0**: Current AP spent on blessed advantages
   * - **1**: Maximum possible AP spent on blessed advantages
   */
  spentOnBlessedAdvantages: string,
  /**
   * - **0**: Current AP spent on disadvantages
   * - **1**: Maximum possible AP spent on disadvantages
   */
  spentOnDisadvantages: string,
  /**
   * - **0**: Current AP spent on magic disadvantages
   * - **1**: Maximum possible AP spent on magic disadvantages
   */
  spentOnMagicDisadvantages: string,
  /**
   * - **0**: Current AP spent on blessed disadvantages
   * - **1**: Maximum possible AP spent on blessed disadvantages
   */
  spentOnBlessedDisadvantages: string,
  /**
   * - **0**: AP spent on race
   */
  spentOnRace: string,
  /**
   * - **0**: AP spent on profession
   */
  spentOnProfession: string,
  /**
   * - **0**: AP spent on attributes
   */
  spentOnAttributes: string,
  /**
   * - **0**: AP spent on skills
   */
  spentOnSkills: string,
  /**
   * - **0**: AP spent on combat techniques
   */
  spentOnCombatTechniques: string,
  /**
   * - **0**: AP spent on spells
   */
  spentOnSpells: string,
  /**
   * - **0**: AP spent on cantrips
   */
  spentOnCantrips: string,
  /**
   * - **0**: AP spent on liturgical chants
   */
  spentOnLiturgicalChants: string,
  /**
   * - **0**: AP spent on blessings
   */
  spentOnBlessings: string,
  /**
   * - **0**: AP spent on special abilities
   */
  spentOnSpecialAbilities: string,
  /**
   * - **0**: AP spent on energies (LP/AE/KP)
   */
  spentOnEnergies: string,
};

type saveConfigError = {
  title: string,
  message: string,
};

type saveHeroesError = {
  title: string,
  message: string,
};

type headerDialogs = {
  heroSaved: string,
  allSaved: string,
  everythingElseSaved: string,
  saveConfigError: saveConfigError,
  saveHeroesError: saveHeroesError,
};

type header = {
  /**
   * - **0**: AP left
   */
  apLeft: string,
  saveBtn: string,
  apTooltip: apTooltip,
  dialogs: headerDialogs,
};

type generalSortFilters = {
  alphabetically: string,
  byDateModified: string,
  byGroup: string,
  byImprovementCost: string,
  byProperty: string,
  byLocation: string,
  byCost: string,
  byWeight: string,
}

type generalFilters = {
  searchFieldPlaceholder: string,
  sort: generalSortFilters,
  showActivatedEntries: string,
}

type notEnoughApDialog = {
  title: string,
  /**
   * - **0**: Missing AP
   */
  message: string,
}

type reachedApLimitDialog = {
  /**
   * - **0**: Category in which the limit is reached
   */
  title: string,
  /**
   * - **0**: Missing AP
   * - **1**: Maximum possible AP spent on category
   * - **2**: Category in which the limit is reached
   */
  message: string,
  advantages: string,
  magicalAdvantages: string,
  blessedAdvantages: string,
  disadvantages: string,
  magicalDisadvantages: string,
  blessedDisadvantages: string,
}

type generalDialogs = {
  saveBtn: string,
  doneBtn: string,
  deleteBtn: string,
  yesBtn: string,
  noBtn: string,
  okBtn: string,
  cancelBtn: string,
  copyBtn: string,
  createBtn: string,
  applyBtn: string,
  addBtn: string,
  notEnoughAp: notEnoughApDialog,
  reachedApLimit: reachedApLimitDialog,
}

type general = {
  /**
   * - **0**: Weight in kg
   */
  weightValue: string,
  /**
   * - **0**: Price in silverthalers
   */
  priceValue: string,
  /**
   * - **0**: Length in cm
   */
  lengthValue: string,
  dice: string,
  none: string,
  or_: string,
  and_: string,
  error: string,
  errorCode: string,
  emptyListPlaceholder: string,
  emptyListNoResultsPlaceholder: string,
  /**
   * - **0**: AP value
   */
  apValue: string,
  /**
   * - **0**: AP value
   */
  apValueShort: string,
  /**
   * - **0**: Name of element
   * - **1**: AP value
   */
  withApValue: string,
  filters: generalFilters,
  dialogs: generalDialogs,
}

type themeSetting = {
  title: string,
  dark: string,
  light: string,
}

type newVersionAvailableDialog = {
  title: string,
  /**
   * - **0**: Version number
   */
  message: string,
  /**
   * - **0**: Version number
   * - **1**: Size of update package
   */
  messageWithSize: string,
  updateBtn: string,
}

type noNewVersionAvailableDialog = {
  title: string,
  message: string,
}

type settings = {
  title: string,
  language: string,
  systemLanguage: string,
  languageHint: string,
  theme: themeSetting,
  showAnimations: string,
  enableEditingHeroAfterCreationPhase: string,
  checkForUpdatesBtn: string,
  newVersionAvailable: newVersionAvailableDialog,
  noNewVersionAvailable: noNewVersionAvailableDialog,
  downloadingUpdate: string,
}

type heroOriginFilter = {
  allHeroes: string,
  ownHeroes: string,
  sharedHeroes: string,
}

type heroFilters = {
  origin: heroOriginFilter,
}

type importHeroErrorDialog = {
  title: string,
  message: string,
}

type heroExportSaveLocationDialog = {
  title: string,
}

type heroJsonSaveErrorDialog = {
  title: string,
  message: string,
}

type unsavedActionsDialog = {
  title: string,
  message: string,
  quit: string,
  saveAndQuit: string,
}

type deleteHeroDialog = {
  /**
   * - **0**: Name of the hero to delete
   */
  title: string,
  message: string,
}

type heroCreationSex = {
  placeholder: string,
  male: string,
  female: string,
}

type heroCreationExperienceLevel = {
  placeholder: string,
}

type heroCreationDialog = {
  title: string,
  nameOfHero: string,
  sex: heroCreationSex,
  experienceLevel: heroCreationExperienceLevel,
  startBtn: string,
}

type heroDialogs = {
  heroSaved: string,
  importHeroError: importHeroErrorDialog,
  heroExportSaveLocation: heroExportSaveLocationDialog,
  heroJsonSaveError: heroJsonSaveErrorDialog,
  unsavedActions: unsavedActionsDialog,
  deleteHero: deleteHeroDialog,
  heroCreation: heroCreationDialog,
}

type unsavedHero = {
  name: string,
}

type heroList = {
  adventurepoints: string,
}

type heroes = {
  filters: heroFilters,
  importHeroBtn: string,
  createHeroBtn: string,
  exportHeroAsJsonBtn: string,
  duplicateHeroBtn: string,
  deleteHeroBtn: string,
  openHeroBtn: string,
  saveHeroBtn: string,
  unsavedHero: unsavedHero,
  list: heroList,
  dialogs: heroDialogs,
}

type wikiFilters = {
  races: string,
  cultures: string,
  professions: string,
  advantages: string,
  disadvantages: string,
  skills: string,
  skills_all: string,
  combattechniques: string,
  combattechniques_all: string,
  magic: string,
  magic_all: string,
  liturgicalchants: string,
  liturgicalchants_all: string,
  specialabilities: string,
  specialabilities_all: string,
  itemtemplates: string,
  itemtemplates_all: string,
}

type wiki = {
  chooseACategory: string,
  chooseACategoryToDisplayAList: string,
  filters: wikiFilters,
}

type imprint = {
  title: string,
}

type changeHeroAvatarDialog = {
  title: string,
  selectFileBtn: string,
  imageFileType: string,
  invalidFileWarning: string,
}

type addAdventurePointsDialog = {
  title: string,
  label: string,
}

type profileDialogs = {
  changeHeroAvatar: changeHeroAvatarDialog,
  addAdventurePoints: addAdventurePointsDialog,
}

type profile = {
  editProfessionNameBtn: string,
  addAdventurePointsBtn: string,
  endHeroCreationBtn: string,
  changeHeroAvatarBtn: string,
  deleteAvatarBtn: string,
  dialogs: profileDialogs,
  advantages: string,
  disadvantages: string,
}

type personalDataSex = {
  male: string,
  female: string,
}

type personalData = {
  title: string,
  sex: personalDataSex,
  family: string,
  placeOfBirth: string,
  dateOfBirth: string,
  age: string,
  hairColor: string,
  eyeColor: string,
  size: string,
  weight: string,
  rank: string,
  socialStatus: string,
  characteristics: string,
  otherInfo: string,
  cultureAreaKnowledge: string,
}

type pdfExportSaveLocationDialog = {
  title: string,
  pdfSaved: string,
}

type pdfSaveErrorDialog = {
  title: string,
  message: string,
}

type pdfCreationErrorDialog = {
  title: string,
  message: string,
}

type sheetDialogs = {
  pdfExportSaveLocation: pdfExportSaveLocationDialog,
  pdfSaveError: pdfSaveErrorDialog,
  pdfCreationError: pdfCreationErrorDialog,
}

type attributeModifiers = {
  title: string,
}

type derivedCharacteristicsLabels = {
  value: string,
  bonusPenalty: string,
  bonus: string,
  bought: string,
  max: string,
  current: string,
  baseStat: string,
  permanentlyLostBoughtBack: string,
}

type derivedCharacteristics = {
  labels: derivedCharacteristicsLabels,
}

type personalDataSheet = {
  title: string,
  name: string,
  family: string,
  placeOfBirth: string,
  dateOfBirth: string,
  age: string,
  sex: string,
  race: string,
  size: string,
  weight: string,
  hairColor: string,
  eyeColor: string,
  culture: string,
  socialStatus: string,
  profession: string,
  rank: string,
  characteristics: string,
  otherInfo: string,
  experienceLevelLabel: string,
  totalApLabel: string,
  apCollectedLabel: string,
  apSpentLabel: string,
  avatarLabel: string,
  advantages: string,
  disadvantages: string,
  generalSpecialAbilites: string,
  derivedCharacteristics: derivedCharacteristics,
  fatePoints: string,
}

type gameStatsSheetSkillsTableLabels = {
  skill: string,
  check: string,
  encumbrance: string,
  improvementCost: string,
  skillRating: string,
  routineChecks: string,
  notes: string,
}

type gameStatsSheetSkillsTableEncumbrance = {
  yes: string,
  no: string,
  maybe: string,
}

type gameStatsSheetSkillsTableGroups = {
  pages: string,
}

type gameStatsSheetSkillsTable = {
  title: string,
  labels: gameStatsSheetSkillsTableLabels,
  encumbrance: gameStatsSheetSkillsTableEncumbrance,
  groups: gameStatsSheetSkillsTableGroups,
}

type gameStatsSheetLanguages = {
  title: string,
  nativetongue: string,
}

type gameStatsSheetKnownScripts = {
  title: string,
}

type gameStatsSheetRoutineChecksLabels = {
  checkMod: string,
  neededSr: string,
}

type gameStatsSheetRoutineChecks = {
  title: string,
  textRow1: string,
  textRow2: string,
  textRow3: string,
  textRow4: string,
  labels: gameStatsSheetRoutineChecksLabels,
  from3on: string,
}

type gameStatsSheetQualityLevelsLabels = {
  skillPoints: string,
  qualityLevel: string,
}

type gameStatsSheetQualityLevels = {
  title: string,
  labels: gameStatsSheetQualityLevelsLabels,
}

type gameStatsSheet = {
  title: string,
  skills: gameStatsSheetSkillsTable,
  languages: gameStatsSheetLanguages,
  knownScripts: gameStatsSheetKnownScripts,
  routineChecks: gameStatsSheetRoutineChecks,
  qualityLevels: gameStatsSheetQualityLevels,
}

type combatSheetCombatTechniquesLabels = {
  combatTechnique: string,
  primaryAttribute: string,
  improvementVost: string,
  combatTechniqueRating: string,
  attackRangeCombat: string,
  parry: string,
}

type combatSheetCombatTechniques = {
  title: string,
  labels: combatSheetCombatTechniquesLabels,
}

type combatSheetLifePoints = {
  title: string,
  max: string,
  current: string,
  pain1: string,
  pain2: string,
  pain3: string,
  pain4: string,
  dying: string,
}

type combatSheetCloseCombatWeaponsLabels = {
  weapon: string,
  combatTechnique: string,
  damageBonus: string,
  damagePoints: string,
  attackParryModifier: string,
  reach: string,
  breakingPointRating: string,
  damaged: string,
  attack: string,
  parry: string,
  weight: string,
}

type combatSheetCloseCombatWeapons = {
  title: string,
  labels: combatSheetCloseCombatWeaponsLabels,
}

type combatSheetRangedCombatWeaponsLabels = {
  weapon: string,
  combatTechnique: string,
  reloadTime: string,
  damagePoints: string,
  ammunition: string,
  rangeBrackets: string,
  breakingPointRating: string,
  damaged: string,
  rangedCombat: string,
  weight: string,
}

type combatSheetRangedCombatWeapons = {
  title: string,
  labels: combatSheetRangedCombatWeaponsLabels,
}

type combatSheetArmorsLabels = {
  armor: string,
  sturdinessRating: string,
  wear: string,
  protection: string,
  encumbrance: string,
  movementInitiative: string,
  carriedWhereExamples: string,
  head: string,
  torso: string,
  leftArm: string,
  rightArm: string,
  leftLeg: string,
  rightLeg: string,
  weight: string,
}

type combatSheetArmors = {
  title: string,
  labels: combatSheetArmorsLabels,
}

type combatSheetShieldParryingWeaponLabels = {
  shieldParryingWeapon: string,
  structurePoints: string,
  breakingPointRating: string,
  damaged: string,
  attackParryModifier: string,
  weight: string,
}

type combatSheetShieldParryingWeapon = {
  title: string,
  labels: combatSheetShieldParryingWeaponLabels,
}

type combatSheet = {
  title: string,
  combatTechniques: combatSheetCombatTechniques,
  lifePoints: combatSheetLifePoints,
  closeCombatWeapons: combatSheetCloseCombatWeapons,
  rangedCombatWeapons: combatSheetRangedCombatWeapons,
  armors: combatSheetArmors,
  shieldParryingWeapon: combatSheetShieldParryingWeapon,
  actions: string,
  combatSpecialAbilities: string,
  conditions: string,
  states: string,
}

type belongingsSheetEquipmentLabels = {
  item: string,
  number: string,
  price: string,
  weight: string,
  carriedWhere: string,
  total: string,
}

type belongingsSheetEquipment = {
  title: string,
  labels: belongingsSheetEquipmentLabels,
}

type belongingsSheetPurse = {
  title: string,
  ducats: string,
  silverthalers: string,
  halers: string,
  kreutzers: string,
  gems: string,
  jewelry: string,
  other: string,
}

type belongingsSheetCarryingCapacity = {
  title: string,
  calc: string,
  label: string,
}

type belongingsSheetAnimal = {
  title: string,
  name: string,
  sizecategory: string,
  type_: string,
  ap: string,
  protection: string,
  attackName: string,
  attack: string,
  parry: string,
  damagePoints: string,
  reach: string,
  actions: string,
  skills: string,
  specialAbilities: string,
  notes: string,
}

type belongingsSheet = {
  title: string,
  equipment: belongingsSheetEquipment,
  purse: belongingsSheetPurse,
  carryingCapacity: belongingsSheetCarryingCapacity,
  animal: belongingsSheetAnimal,
}

type spellsSheetHeaderLabels = {
  aeMax: string,
  aeCurrent: string,
}

type spellsSheetHeader = {
  labels: spellsSheetHeaderLabels,
}

type spellsSheetSpellsLabels = {
  spellOrRitual: string,
  check: string,
  skillRating: string,
  cost: string,
  castingTime: string,
  range: string,
  duration: string,
  property: string,
  improvementCost: string,
  effect: string,
  pages: string,
}

type spellsSheetSpells = {
  title: string,
  labels: spellsSheetSpellsLabels,
  unfamiliarSpell: string,
}

type spellsSheet = {
  title: string,
  header: spellsSheetHeader,
  spells: spellsSheetSpells,
  primaryAttribute: string,
  properties: string,
  tradition: string,
  magicalSpecialAbilities: string,
  cantrips: string,
}

type liturgicalChantsSheetHeaderLabels = {
  kpMax: string,
  kpCurrent: string,
}

type liturgicalChantsSheetHeader = {
  labels: liturgicalChantsSheetHeaderLabels,
}

type liturgicalChantsSheetLiturgicalChantsLabels = {
  chant: string,
  check: string,
  skillRating: string,
  cost: string,
  castingTime: string,
  range: string,
  duration: string,
  aspect: string,
  improvementCost: string,
  effect: string,
  pages: string,
}

type liturgicalChantsSheetLiturgicalChants = {
  title: string,
  labels: liturgicalChantsSheetLiturgicalChantsLabels,
}

type liturgicalChantsSheet = {
  title: string,
  header: liturgicalChantsSheetHeader,
  chants: liturgicalChantsSheetLiturgicalChants,
  primaryAttribute: string,
  aspects: string,
  tradition: string,
  blessedSpecialAbilities: string,
  blessings: string,
}

type sheets = {
  printToPdfBtn: string,
  dialogs: sheetDialogs,
  showAttributeValues: string,
  characterSheet: string,
  personalDataSheet: personalDataSheet,
  gameStatsSheet: gameStatsSheet,
  combatSheet: combatSheet,
  belongingsSheet: belongingsSheet,
  spellsSheet: spellsSheet,
  liturgicalChantsSheet: liturgicalChantsSheet,
}

type pacts = {
  pactCategory: string,
  noPact: string,
  pactLevel: string,
  fairyType: string,
  domain: string,
  userDefined: string,
  demonType: string,
  circleOfDamnation: string,
  minorPact: string,
  pactIsIncompleteHint: string,
  name: string,
}

type rules = {
  ruleBase: string,
  enableAllRuleBooks: string,
  focusRules: string,
  optionalRules: string,
  manualHeroDataRepair: string,
  manualHeroDataRepairExplanation: string,
}

type inlineWikiCommonProfessions = {
  title: string,
  mundane: string,
  magic: string,
  blessed: string,
}

type inlineWikiCombatTechnique = {
  one: string,
  two: string,
}

type inlineWikiCantrip = {
  one: string,
  two: string,
}

type inlineWikiCombatTechniqueGroups = {
  all: string,
  allMeleeCombatTechniques: string,
  allRangedCombatTechniques: string,
  allMeleeCombatTechniquesWithParry: string,
  allMeleeCombatTechniquesForOneHandedWeapons: string,
}

type inlineWikiCombatTechniques = {
  groups: inlineWikiCombatTechniqueGroups
}

type inlineWikiEquipment = {
  weight: string,
  price: string,
  ammunition: string,
  combatTechnique: string,
  damage: string,
  primaryAttributeAndDamageThreshold: string,
  attackParryModifier: string,
  reach: string,
  length: string,
  reloadTime: string,
  range: string,
  /**
   * - **0**: Number of actions
   */
  actionsValue: string,
  protection: string,
  encumbrance: string,
  additionalPenalties: string,
  note: string,
  rules: string,
  weaponAdvantage: string,
  weaponDisadvantage: string,
  armorAdvantage: string,
  armorDisadvantage: string,
}

type inlineWikiSex = {
  name: string,
  male: string,
  female: string,
}

type inlineWiki = {
  complementarySources: string,

  apValue: string,
  adventurePoints: string,
  lifePointBaseValue: string,
  spiritBaseValue: string,
  toughnessBaseValue: string,
  movementBaseValue: string,
  attributeAdjustments: string,
  automaticAdvantages: string,
  stronglyRecommendedAdvantages: string,
  stronglyRecommendedDisadvantages: string,
  commonCultures: string,
  commonAdvantages: string,
  commonDisadvantages: string,
  uncommonAdvantages: string,
  uncommonDisadvantages: string,

  language: string,
  script: string,
  areaKnowledge: string,
  socialStatus: string,
  commonProfessions: inlineWikiCommonProfessions,
  commonSkills: string,
  uncommonSkills: string,
  commonNames: string,
  /**
   * - **0**: Name of cultural package
   * - **1**: AP cost of the cultural package
   */
  culturalPackage: string,

  prerequisites: string,
  race: string,
  specialAbilities: string,
  /**
   * - **0**: AP given
   */
  languagesAndLiteracyTotalingAp: string,
  /**
   * - **0**: Skill name(s)
   */
  skillSpecialization: string,
  /**
   * - **0**: AP given
   * - **1**: Skill group
   */
  skillsSelection: string,
  combatTechniques: string,
  /**
   * - **0**: Amount of combat techniques to choose
   * - **1**: CtR of the selected combat techniques after application
   * - **2**: List of possible combat techniques
   */
  combatTechniqueSelection: string,
  combatTechnique: inlineWikiCombatTechnique,
  /**
   * - **0**: Amount of combat techniques to choose
   * - **1**: CtR of the selected combat techniques after application
   * - **2**: Amount of combat techniques to choose in a second selection
   * - **3**: CtR of the selected combat techniques from second selection after
   *   application
   * - **4**: List of possible combat techniques
   */
  combatTechniqueSecondSelection: string,
  skills: string,
  spells: string,
  /**
   * - **0**: AP given
   */
  cursesTotalingAp: string,
  /**
   * - **0**: Amount of cantrips to choose
   * - **1**: List of possible cantrips
   */
  cantripsFromList: string,
  cantrip: inlineWikiCantrip,
  liturgicalChants: string,
  theTwelveBlessings: string,
  /**
   * - **0**: name of first excluded blessing
   * - **1**: name of second excluded blessing
   * - **2**: name of third excluded blessing
   */
  theTwelveBlessingsExceptions: string,
  sixBlessings: string,
  suggestedAdvantages: string,
  suggestedDisadvantages: string,
  unsuitableAdvantages: string,
  unsuitableDisadvantages: string,
  variants: string,
  insteadOf: string,

  rule: string,
  effect: string,
  extendedCombatSpecialAbilities: string,
  extendedMagicalSpecialAbilities: string,
  extendedBlessedSpecialAbilities: string,
  extendedSkillSpecialAbilities: string,
  penalty: string,
  level: string,
  perLevel: string,
  volume: string,
  aspect: string,
  bindingCost: string,
  protectiveCircle: string,
  wardingCircle: string,
  actions: string,
  /**
   * - **0**: Entry name
   * - **1**: category (advantage, disadvantage,___)
   */
  raceCultureOrProfessionRequiresAutomaticOrSuggested: string,
  advantage: string,
  disadvantage: string,
  primaryAttributeOfTheTradition: string,
  knowledgeOfSpell: string,
  knowledgeOfLiturgicalChant: string,
  appropriateCombatStyleSpecialAbility: string,
  appropriateMagicalStyleSpecialAbility: string,
  appropriateBlessedStyleSpecialAbility: string,
  appropriateSkillStyleSpecialAbility: string,
  sex: inlineWikiSex,
  combattechniques: inlineWikiCombatTechniques,
  /**
   * - **0**: Minimum social status
   */
  socialstatusxorhigher: string,

  check: string,
  newapplications: string,
  applications: string,
  uses: string,
  encumbrance: string,
  encumbrance_yes: string,
  encumbrance_no: string,
  encumbrance_maybe: string,
  tools: string,
  quality: string,
  failedcheck: string,
  criticalsuccess: string,
  botch: string,
  improvementcost: string,

  special: string,
  primaryattribute: string,

  castingtime: string,
  ritualtime: string,
  aecost: string,
  range: string,
  duration: string,
  targetcategory: string,
  property: string,
  traditions: string,
  skill: string,
  lengthoftime: string,
  musictradition: string,
  youcannotuseamodificationonthisspellscastingtime: string,
  youcannotuseamodificationonthisspellsritualtime: string,
  youcannotuseamodificationonthisspellscost: string,
  youcannotuseamodificationonthisspellsrange: string,
  youcannotuseamodificationonthisspellsduration: string,
  spellenhancements: string,
  /**
   * - **0**: Enhancement name
   * - **1**: Required Skill Rating
   * - **2**: AP value
   * - **3**: Description
   */
  spellenhancements_title: string,
  tribaltraditions: string,
  brew: string,
  spirithalf: string,
  spirithalf_short: string,
  spiritortoughness: string,
  spiritortoughness_short: string,
  note: string,

  liturgicaltime: string,
  ceremonialtime: string,
  kpcost: string,
  youcannotuseamodificationonthischantsliturgicaltime: string,
  youcannotuseamodificationonthischantsceremonialtime: string,
  youcannotuseamodificationonthischantscost: string,
  youcannotuseamodificationonthischantsrange: string,
  youcannotuseamodificationonthischantsduration: string,
  liturgicalchantenhancements: string,
  /**
   * - **0**: Enhancement name
   * - **1**: Required Skill Rating
   * - **2**: AP value
   * - **3**: Description
   */
  liturgicalchantenhancements_title: string,

  equipment: inlineWikiEquipment,
}

type race = {
  race_header_name: string,
  race_header_adventurepoints: string,
  race_header_adventurepoints_tooltip: string,
}

type culture = {
  culture_filters_common_allcultures: string,
  culture_filters_common_commoncultures: string,
  culture_header_name: string,
}

type profession = {
  profession_ownprofession: string,
  profession_variants_novariant: string,
  profession_filters_common_allprofessions: string,
  profession_filters_common_commonprofessions: string,
  profession_filters_groups_allprofessiongroups: string,
  profession_filters_groups_mundaneprofessions: string,
  profession_filters_groups_magicalprofessions: string,
  profession_filters_groups_blessedprofessions: string,
  profession_header_name: string,
  profession_header_adventurepoints: string,
  profession_header_adventurepoints_tooltip: string,
}

type rcpSelectOptions = {
  rcpselectoptions_race: string,
  rcpselectoptions_culture: string,
  rcpselectoptions_profession: string,
  /**
   * - **0**: Amount of cantrips to choose
   */
  rcpselectoptions_cantripsfromlist: string,
  rcpselectoptions_cantrip_one: string,
  rcpselectoptions_cantrip_two: string,
  /**
   * - **0**: Amount of combat techniques to choose
   * - **1**: CtR of the selected combat techniques after application
   */
  rcpselectoptions_combattechniqueselection: string,
  rcpselectoptions_combattechnique_one: string,
  rcpselectoptions_combattechnique_two: string,
  rcpselectoptions_selectattributeadjustment: string,
  rcpselectoptions_buyculturalpackage: string,
  rcpselectoptions_nativetongue_placeholder: string,
  rcpselectoptions_buyscript: string,
  rcpselectoptions_script_placeholder: string,
  /**
   * - **0**: Amount of combat techniques to choose in a second selection
   * - **1**: CtR of the selected combat techniques from second selection after
   *   application
   */
  rcpselectoptions_combattechniquesecondselection: string,
  /**
   * - **0**: AP given
   * - **1**: AP left
   */
  rcpselectoptions_cursestotalingapleft: string,
  /**
   * - **0**: AP given
   * - **1**: AP left
   */
  rcpselectoptions_languagesandliteracytotalingapleft: string,
  rcpselectoptions_applicationforskillspecialization: string,
  /**
   * - **0**: Skill group
   * - **1**: AP given
   * - **2**: AP left
   */
  rcpselectoptions_skillselectionap: string,
  /**
   * - **0**: Skill name(s)
   */
  rcpselectoptions_skillspecialization: string,
  rcpselectoptions_completebtn: string,
  rcpselectoptions_unfamiliarspells: string,
  rcpselectoptions_unfamiliarspellselectionfortraditionguildmage: string,
  rcpselectoptions_unfamiliarspell_placeholder: string,
  rcpselectoptions_unfamiliarspell: string,
}

type attributes = {
  attributes_totalpoints: string,
  attributes_attributeadjustmentselection: string,
  attributes_derivedcharacteristics_tooltips_modifier: string,
  attributes_derivedcharacteristics_tooltips_bought: string,
  attributes_derivedcharacteristics_tooltips_losttotal: string,
  attributes_derivedcharacteristics_tooltips_boughtback: string,
  attributes_lostpermanently_lifepoints: string,
  attributes_lostpermanently_lifepoints_short: string,
  attributes_lostpermanently_arcaneenergy: string,
  attributes_lostpermanently_arcaneenergy_short: string,
  attributes_lostpermanently_karmapoints: string,
  attributes_lostpermanently_karmapoints_short: string,
  attributes_removeenergypointslostpermanently_title: string,
  attributes_removeenergypointslostpermanently_message: string,
  attributes_removeenergypointslostpermanently_removebtn: string,
  attributes_pointslostpermanentlyeditor_boughtback: string,
  attributes_pointslostpermanentlyeditor_spent: string,
}

type advantages = {
  advantages_filters_commonadvantages: string,
}

type disadvantages = {
  disadvantages_filters_commondisadvantages: string,
}

type advantagesAndDisadvantages = {
  advantagesdisadvantages_addbtn: string,
  advantagesdisadvantages_afraidof: string,
  advantagesdisadvantages_immunityto: string,
  advantagesdisadvantages_hatredfor: string,
  advantagesdisadvantages_header_name: string,
  advantagesdisadvantages_header_adventurepoints: string,
  advantagesdisadvantages_header_adventurepoints_tooltip: string,
  /**
   * - **0**: Current AP spent on advantages
   * - **1**: Maximum possible AP spent on advantages
   */
  advantagesdisadvantages_apspent_spentonadvantages: string,
  /**
   * - **0**: Current AP spent on magic advantages
   * - **1**: Maximum possible AP spent on magic advantages
   */
  advantagesdisadvantages_apspent_spentonmagicadvantages: string,
  /**
   * - **0**: Current AP spent on blessed advantages
   * - **1**: Maximum possible AP spent on blessed advantages
   */
  advantagesdisadvantages_apspent_spentonblessedadvantages: string,
  /**
   * - **0**: Current AP spent on disadvantages
   * - **1**: Maximum possible AP spent on disadvantages
   */
  advantagesdisadvantages_apspent_spentondisadvantages: string,
  /**
   * - **0**: Current AP spent on magic disadvantages
   * - **1**: Maximum possible AP spent on magic disadvantages
   */
  advantagesdisadvantages_apspent_spentonmagicdisadvantages: string,
  /**
   * - **0**: Current AP spent on blessed disadvantages
   * - **1**: Maximum possible AP spent on blessed disadvantages
   */
  advantagesdisadvantages_apspent_spentonblesseddisadvantages: string,
  advantagesdisadvantages_dialogs_customcost_title: string,
  /**
   * - **0**: Entry name
   */
  advantagesdisadvantages_dialogs_customcost_for: string,
}

type specialAbilities = {
  specialabilities_addbtn: string,
  specialabilities_header_name: string,
  specialabilities_header_group: string,
  specialabilities_header_adventurepoints: string,
  specialabilities_header_adventurepoints_tooltip: string,
  specialabilities_nativetonguelevel: string,
}

type skills = {
  skills_commonskills: string,
  skills_header_name: string,
  skills_header_skillrating: string,
  skills_header_skillrating_tooltip: string,
  skills_header_group: string,
  skills_header_check: string,
  skills_header_improvementcost: string,
  skills_header_improvementcost_tooltip: string,
}

type showFrequency = {
  showfrequency_stronglyrecommended: string,
  showfrequency_common: string,
  showfrequency_uncommon: string,
  showfrequency_unfamiliarspells: string,
}

type combatTechniques = {
  combattechniques_header_name: string,
  combattechniques_header_group: string,
  combattechniques_header_combattechniquerating: string,
  combattechniques_header_combattechniquerating_tooltip: string,
  combattechniques_header_improvementcost: string,
  combattechniques_header_improvementcost_tooltip: string,
  combattechniques_header_primaryattribute: string,
  combattechniques_header_primaryattribute_tooltip: string,
  combattechniques_header_attack: string,
  combattechniques_header_attack_tooltip: string,
  combattechniques_header_parry: string,
  combattechniques_header_parry_tooltip: string,
}

type spells = {
  spells_addbtn: string,
  spells_header_name: string,
  spells_header_property: string,
  spells_header_group: string,
  spells_header_skillrating: string,
  spells_header_skillrating_tooltip: string,
  spells_header_check: string,
  spells_header_checkmodifier: string,
  spells_header_checkmodifier_tooltip: string,
  spells_header_improvementcost: string,
  spells_header_improvementcost_tooltip: string,
  spells_groups_cantrip: string,
  spells_traditions_general: string,
}

type magicalActions = {
  magicalactions_animistforces_tribes_general: string,
}

type liturgicalChants = {
  liturgicalchants_addbtn: string,
  liturgicalchants_header_name: string,
  liturgicalchants_header_traditions: string,
  liturgicalchants_header_group: string,
  liturgicalchants_header_skillrating: string,
  liturgicalchants_header_skillrating_tooltip: string,
  liturgicalchants_header_check: string,
  liturgicalchants_header_checkmodifier: string,
  liturgicalchants_header_checkmodifier_tooltip: string,
  liturgicalchants_header_improvementcost: string,
  liturgicalchants_header_improvementcost_tooltip: string,
  liturgicalchants_groups_blessing: string,
  liturgicalchants_aspects_general: string,
}

type equipmentHeader = {
  name: string,
  group: string,
}

type equipmentFilters = {
  allCombatTechniques: string,
}

type equipmentPurse = {
  title: string,
  ducats: string,
  silverthalers: string,
  halers: string,
  kreutzers: string,
  carryingCapacity: string,
  initialStartingWealthAndCarryingCapacity: string,
}

type equipmentAddEdit = {
  damage: string,
  length: string,
  range: string,
  editItem: string,
  createItem: string,
  number: string,
  name: string,
  price: string,
  weight: string,
  carriedWhere: string,
  itemGroup: string,
  itemGrouphint: string,
  improvisedWeapon: string,
  improvisedWeapongroup: string,
  template: string,
  combatTechnique: string,
  primaryAttributeAndDamageThreshold: string,
  primaryAttribute: string,
  primaryAttributeShort: string,
  damageThreshold: string,
  separateDamageThresholds: string,
  breakingPointRatingModifier: string,
  damaged: string,
  reach: string,
  attackParryModifier: string,
  structurePoints: string,
  lengthWithUnit: string,
  parryingWeapon: string,
  twohandedWeapon: string,
  reloadTime: string,
  rangeClose: string,
  rangeMedium: string,
  rangeFar: string,
  ammunition: string,
  protection: string,
  encumbrance: string,
  armorType: string,
  sturdinessModifier: string,
  wear: string,
  hitZoneArmorOnly: string,
  movementModifier: string,
  initiativeModifier: string,
  additionalPenalties: string,
}

type equipmentDialogs = {
  addEdit: equipmentAddEdit,
}

type equipment = {
  header: equipmentHeader,
  addBtn: string,
  createBtn: string,
  filters: equipmentFilters,
  purse: equipmentPurse,
  dialogs: equipmentDialogs,
}

type hitZoneArmorsHeader = {
  name: string,
}

type hitZoneArmorsAddEdit = {
  name: string,
  editHitZoneArmor: string,
  createHitZoneArmor: string,
  head: string,
  torso: string,
  leftArm: string,
  rightArm: string,
  leftLeg: string,
  rightLeg: string,
  wear: string,
}

type hitZoneArmorsDialogs = {
  addEdit: hitZoneArmorsAddEdit,
}

type hitZoneArmors = {
  header: hitZoneArmorsHeader,
  createbtn: string,
  dialogs: hitZoneArmorsDialogs,
}

type petsAddEdit = {
  deleteAvatarBtn: string,
  name: string,
  sizeCategory: string,
  type_: string,
  apSpent: string,
  totalAp: string,
  protection: string,
  attackName: string,
  attack: string,
  parry: string,
  damagePoints: string,
  reach: string,
  actions: string,
  skills: string,
  specialAbilities: string,
  notes: string,
  addBtn: string,
  saveBtn: string,
}

type petsDialogs = {
  addEdit: petsAddEdit,
}

type pets = {
  dialogs: petsDialogs,
}

type t = {
  macOsMenuBar,
  initialization,
  tabs,
  header,
  general,
  heroes,
  wiki,
  imprint,
  profile,
  personalData,
  sheets,
  pacts,
  rules,
  inlineWiki,
  race,
  culture,
  profession,
  rcpSelectOptions,
  attributes,
  advantages,
  disadvantages,
  advantagesAndDisadvantages,
  specialAbilities,
  skills,
  showFrequency,
  combatTechniques,
  spells,
  magicalActions,
  liturgicalChants,
  equipment,
  hitZoneArmors,
  pets,
};

// module Decode = {
//   open Json.Decode;

//   let macOsMenuBar = json => {
//     aboutApp: json |> field("macosmenubar.aboutapp", string),
//     preferences: json |> field("macosmenubar.preferences", string),
//     quit: json |> field("macosmenubar.quit", string),
//     edit: json |> field("macosmenubar.edit", string),
//     view: json |> field("macosmenubar.view", string),
//   };

//   let initialization = json => {
//     loadDatabaseError: json |> field("initialization.loadtableserror", string),
//   };

//   let tabs = json => {
//     heroes: json |> field("header.tabs.heroes", string),
//     groups: json |> field("header.tabs.groups", string),
//     wiki: json |> field("header.tabs.wiki", string),
//     faq: json |> field("header.tabs.faq", string),
//     about: json |> field("header.tabs.about", string),
//     imprint: json |> field("header.tabs.imprint", string),
//     thirdPartyLicenses:
//       json |> field("header.tabs.thirdpartylicenses", string),
//     lastChanges: json |> field("header.tabs.lastchanges", string),
//     profile: json |> field("header.tabs.profile", string),
//     overview: json |> field("header.tabs.overview", string),
//     personalData: json |> field("header.tabs.personaldata", string),
//     characterSheet: json |> field("header.tabs.charactersheet", string),
//     pact: json |> field("header.tabs.pact", string),
//     rules: json |> field("header.tabs.rules", string),
//     raceCultureAndProfession:
//       json |> field("header.tabs.racecultureandprofession", string),
//     race: json |> field("header.tabs.race", string),
//     culture: json |> field("header.tabs.culture", string),
//     profession: json |> field("header.tabs.profession", string),
//     attributes: json |> field("header.tabs.attributes", string),
//     advantagesAndDisadvantages:
//       json |> field("header.tabs.advantagesanddisadvantages", string),
//     advantages: json |> field("header.tabs.advantages", string),
//     disadvantages: json |> field("header.tabs.disadvantages", string),
//     abilities: json |> field("header.tabs.abilities", string),
//     skills: json |> field("header.tabs.skills", string),
//     combatTechniques: json |> field("header.tabs.combattechniques", string),
//     specialAbilities: json |> field("header.tabs.specialabilities", string),
//     spells: json |> field("header.tabs.spells", string),
//     liturgicalChants: json |> field("header.tabs.liturgicalchants", string),
//     belongings: json |> field("header.tabs.belongings", string),
//     equipment: json |> field("header.tabs.equipment", string),
//     hitZoneArmor: json |> field("header.tabs.hitzonearmor", string),
//     pets: json |> field("header.tabs.pets", string),
//   };

//   let apTooltip = json => {
//     title: json |> field("header.aptooltip.title", string),
//     total: json |> field("header.aptooltip.total", string),
//     spent: json |> field("header.aptooltip.spent", string),
//     spentOnAdvantages:
//       json |> field("header.aptooltip.spentonadvantages", string),
//     spentOnMagicAdvantages:
//       json |> field("header.aptooltip.spentonmagicadvantages", string),
//     spentOnBlessedAdvantages:
//       json |> field("header.aptooltip.spentonblessedadvantages", string),
//     spentOnDisadvantages:
//       json |> field("header.aptooltip.spentondisadvantages", string),
//     spentOnMagicDisadvantages:
//       json |> field("header.aptooltip.spentonmagicdisadvantages", string),
//     spentOnBlessedDisadvantages:
//       json |> field("header.aptooltip.spentonblesseddisadvantages", string),
//     spentOnRace: json |> field("header.aptooltip.spentonrace", string),
//     spentOnProfession:
//       json |> field("header.aptooltip.spentonprofession", string),
//     spentOnAttributes:
//       json |> field("header.aptooltip.spentonattributes", string),
//     spentOnSkills: json |> field("header.aptooltip.spentonskills", string),
//     spentOnCombatTechniques:
//       json |> field("header.aptooltip.spentoncombattechniques", string),
//     spentOnSpells: json |> field("header.aptooltip.spentonspells", string),
//     spentOnCantrips:
//       json |> field("header.aptooltip.spentoncantrips", string),
//     spentOnLiturgicalChants:
//       json |> field("header.aptooltip.spentonliturgicalchants", string),
//     spentOnBlessings:
//       json |> field("header.aptooltip.spentonblessings", string),
//     spentOnSpecialAbilities:
//       json |> field("header.aptooltip.spentonspecialabilities", string),
//     spentOnEnergies:
//       json |> field("header.aptooltip.spentonenergies", string),
//   };

//   let saveConfigError = (json): saveConfigError => {
//     title: json |> field("header.dialogs.saveconfigerror.title", string),
//     message: json |> field("header.dialogs.saveconfigerror.message", string),
//   };

//   let saveHeroesError = (json): saveHeroesError => {
//     title: json |> field("header.dialogs.saveheroeserror.title", string),
//     message: json |> field("header.dialogs.saveheroeserror.message", string),
//   };

//   let dialogs = json => {
//     heroSaved: json |> field("header.dialogs.herosaved", string),
//     allSaved: json |> field("header.dialogs.allsaved", string),
//     everythingElseSaved:
//       json |> field("header.dialogs.everythingelsesaved", string),
//     saveConfigError: json |> saveConfigError,
//     saveHeroesError: json |> saveHeroesError,
//   };

//   let header = json => {
//     apLeft: json |> field("header.apleft", string),
//     saveBtn: json |> field("header.savebtn", string),
//     apTooltip: json |> apTooltip,
//     dialogs: json |> dialogs,
//   };

//   let t = json => {
//     macOsMenuBar: json |> macOsMenuBar,
//     initialization: json |> initialization,
//     tabs: json |> tabs,
//     header: json |> header,
//     general_weightvalue: json |> field("general.weightvalue", string),
//     general_pricevalue: json |> field("general.pricevalue", string),
//     general_lengthvalue: json |> field("general.lengthvalue", string),
//     general_dice: json |> field("general.dice", string),
//     general_none: json |> field("general.none", string),
//     general_or: json |> field("general.or", string),
//     general_and: json |> field("general.and", string),
//     general_error: json |> field("general.error", string),
//     general_errorcode: json |> field("general.errorcode", string),
//     general_emptylistplaceholder:
//       json |> field("general.emptylistplaceholder", string),
//     general_emptylistnoresultsplaceholder:
//       json |> field("general.emptylistnoresultsplaceholder", string),
//     general_apvalue: json |> field("general.apvalue", string),
//     general_apvalue_short: json |> field("general.apvalue.short", string),
//     general_withapvalue: json |> field("general.withapvalue", string),

//     general_filters_searchfield_placeholder:
//       json |> field("general.filters.searchfield.placeholder", string),
//     general_filters_sort_alphabetically:
//       json |> field("general.filters.sort.alphabetically", string),
//     general_filters_sort_bydatemodified:
//       json |> field("general.filters.sort.bydatemodified", string),
//     general_filters_sort_bygroup:
//       json |> field("general.filters.sort.bygroup", string),
//     general_filters_sort_byimprovementcost:
//       json |> field("general.filters.sort.byimprovementcost", string),
//     general_filters_sort_byproperty:
//       json |> field("general.filters.sort.byproperty", string),
//     general_filters_sort_bylocation:
//       json |> field("general.filters.sort.bylocation", string),
//     general_filters_sort_bycost:
//       json |> field("general.filters.sort.bycost", string),
//     general_filters_sort_byweight:
//       json |> field("general.filters.sort.byweight", string),
//     general_filters_showactivatedentries:
//       json |> field("general.filters.showactivatedentries", string),

//     general_dialogs_savebtn: json |> field("general.dialogs.savebtn", string),
//     general_dialogs_donebtn: json |> field("general.dialogs.donebtn", string),
//     general_dialogs_deletebtn:
//       json |> field("general.dialogs.deletebtn", string),
//     general_dialogs_yesbtn: json |> field("general.dialogs.yesbtn", string),
//     general_dialogs_nobtn: json |> field("general.dialogs.nobtn", string),
//     general_dialogs_okbtn: json |> field("general.dialogs.okbtn", string),
//     general_dialogs_cancelbtn:
//       json |> field("general.dialogs.cancelbtn", string),
//     general_dialogs_copybtn: json |> field("general.dialogs.copybtn", string),
//     general_dialogs_createbtn:
//       json |> field("general.dialogs.createbtn", string),
//     general_dialogs_applybtn:
//       json |> field("general.dialogs.applybtn", string),
//     general_dialogs_addbtn: json |> field("general.dialogs.addbtn", string),
//     general_dialogs_notenoughap_title:
//       json |> field("general.dialogs.notenoughap.title", string),
//     general_dialogs_notenoughap_message:
//       json |> field("general.dialogs.notenoughap.message", string),
//     general_dialogs_reachedaplimit_title:
//       json |> field("general.dialogs.reachedaplimit.title", string),
//     general_dialogs_reachedaplimit_message:
//       json |> field("general.dialogs.reachedaplimit.message", string),
//     general_dialogs_reachedaplimit_advantages:
//       json |> field("general.dialogs.reachedaplimit.advantages", string),
//     general_dialogs_reachedaplimit_magicaladvantages:
//       json
//       |> field("general.dialogs.reachedaplimit.magicaladvantages", string),
//     general_dialogs_reachedaplimit_blessedadvantages:
//       json
//       |> field("general.dialogs.reachedaplimit.blessedadvantages", string),
//     general_dialogs_reachedaplimit_disadvantages:
//       json |> field("general.dialogs.reachedaplimit.disadvantages", string),
//     general_dialogs_reachedaplimit_magicaldisadvantages:
//       json
//       |> field("general.dialogs.reachedaplimit.magicaldisadvantages", string),
//     general_dialogs_reachedaplimit_blesseddisadvantages:
//       json
//       |> field("general.dialogs.reachedaplimit.blesseddisadvantages", string),

//     settings_title: json |> field("settings.title", string),
//     settings_language: json |> field("settings.language", string),
//     settings_systemlanguage: json |> field("settings.systemlanguage", string),
//     settings_languagehint: json |> field("settings.languagehint", string),
//     settings_theme: json |> field("settings.theme", string),
//     settings_theme_dark: json |> field("settings.theme.dark", string),
//     settings_theme_light: json |> field("settings.theme.light", string),
//     settings_showanimations: json |> field("settings.showanimations", string),
//     settings_enableeditingheroaftercreationphase:
//       json |> field("settings.enableeditingheroaftercreationphase", string),
//     settings_checkforupdatesbtn:
//       json |> field("settings.checkforupdatesbtn", string),
//     settings_newversionavailable_title:
//       json |> field("settings.newversionavailable.title", string),
//     settings_newversionavailable_message:
//       json |> field("settings.newversionavailable.message", string),
//     settings_newversionavailable_messagewithsize:
//       json |> field("settings.newversionavailable.messagewithsize", string),
//     settings_newversionavailable_updatebtn:
//       json |> field("settings.newversionavailable.updatebtn", string),
//     settings_nonewversionavailable_title:
//       json |> field("settings.nonewversionavailable.title", string),
//     settings_nonewversionavailable_message:
//       json |> field("settings.nonewversionavailable.message", string),
//     settings_downloadingupdate_title:
//       json |> field("settings.downloadingupdate.title", string),

//     heroes_filters_origin_allheroes:
//       json |> field("heroes.filters.origin.allheroes", string),
//     heroes_filters_origin_ownheroes:
//       json |> field("heroes.filters.origin.ownheroes", string),
//     heroes_filters_origin_sharedheroes:
//       json |> field("heroes.filters.origin.sharedheroes", string),
//     heroes_importherobtn: json |> field("heroes.importherobtn", string),
//     heroes_createherobtn: json |> field("heroes.createherobtn", string),
//     heroes_exportheroasjsonbtn:
//       json |> field("heroes.exportheroasjsonbtn", string),
//     heroes_duplicateherobtn: json |> field("heroes.duplicateherobtn", string),
//     heroes_deleteherobtn: json |> field("heroes.deleteherobtn", string),
//     heroes_openherobtn: json |> field("heroes.openherobtn", string),
//     heroes_saveherobtn: json |> field("heroes.saveherobtn", string),
//     heroes_unsavedhero_name: json |> field("heroes.unsavedhero.name", string),
//     heroes_list_adventurepoints:
//       json |> field("heroes.list.adventurepoints", string),
//     heroes_dialogs_herosaved:
//       json |> field("heroes.dialogs.herosaved", string),
//     heroes_dialogs_importheroerror_title:
//       json |> field("heroes.dialogs.importheroerror.title", string),
//     heroes_dialogs_importheroerror_message:
//       json |> field("heroes.dialogs.importheroerror.message", string),
//     heroes_dialogs_heroexportsavelocation_title:
//       json |> field("heroes.dialogs.heroexportsavelocation.title", string),
//     heroes_dialogs_herojsonsaveerror_title:
//       json |> field("heroes.dialogs.herojsonsaveerror.title", string),
//     heroes_dialogs_herojsonsaveerror_message:
//       json |> field("heroes.dialogs.herojsonsaveerror.message", string),
//     heroes_dialogs_unsavedactions_title:
//       json |> field("heroes.dialogs.unsavedactions.title", string),
//     heroes_dialogs_unsavedactions_message:
//       json |> field("heroes.dialogs.unsavedactions.message", string),
//     heroes_dialogs_unsavedactions_quit:
//       json |> field("heroes.dialogs.unsavedactions.quit", string),
//     heroes_dialogs_unsavedactions_saveandquit:
//       json |> field("heroes.dialogs.unsavedactions.saveandquit", string),
//     heroes_dialogs_deletehero_title:
//       json |> field("heroes.dialogs.deletehero.title", string),
//     heroes_dialogs_deletehero_message:
//       json |> field("heroes.dialogs.deletehero.message", string),
//     heroes_dialogs_herocreation_title:
//       json |> field("heroes.dialogs.herocreation.title", string),
//     heroes_dialogs_herocreation_nameofhero:
//       json |> field("heroes.dialogs.herocreation.nameofhero", string),
//     heroes_dialogs_herocreation_sex_placeholder:
//       json |> field("heroes.dialogs.herocreation.sex.placeholder", string),
//     heroes_dialogs_herocreation_sex_male:
//       json |> field("heroes.dialogs.herocreation.sex.male", string),
//     heroes_dialogs_herocreation_sex_female:
//       json |> field("heroes.dialogs.herocreation.sex.female", string),
//     heroes_dialogs_herocreation_experiencelevel_placeholder:
//       json
//       |> field(
//            "heroes.dialogs.herocreation.experiencelevel.placeholder",
//            string,
//          ),
//     heroes_dialogs_herocreation_startbtn:
//       json |> field("heroes.dialogs.herocreation.startbtn", string),

//     wiki_chooseacategory: json |> field("wiki.chooseacategory", string),
//     wiki_chooseacategorytodisplayalist:
//       json |> field("wiki.chooseacategorytodisplayalist", string),
//     wiki_filters_races: json |> field("wiki.filters.races", string),
//     wiki_filters_cultures: json |> field("wiki.filters.cultures", string),
//     wiki_filters_professions:
//       json |> field("wiki.filters.professions", string),
//     wiki_filters_advantages: json |> field("wiki.filters.advantages", string),
//     wiki_filters_disadvantages:
//       json |> field("wiki.filters.disadvantages", string),
//     wiki_filters_skills: json |> field("wiki.filters.skills", string),
//     wiki_filters_skills_all: json |> field("wiki.filters.skills.all", string),
//     wiki_filters_combattechniques:
//       json |> field("wiki.filters.combattechniques", string),
//     wiki_filters_combattechniques_all:
//       json |> field("wiki.filters.combattechniques.all", string),
//     wiki_filters_magic: json |> field("wiki.filters.magic", string),
//     wiki_filters_magic_all: json |> field("wiki.filters.magic.all", string),
//     wiki_filters_liturgicalchants:
//       json |> field("wiki.filters.liturgicalchants", string),
//     wiki_filters_liturgicalchants_all:
//       json |> field("wiki.filters.liturgicalchants.all", string),
//     wiki_filters_specialabilities:
//       json |> field("wiki.filters.specialabilities", string),
//     wiki_filters_specialabilities_all:
//       json |> field("wiki.filters.specialabilities.all", string),
//     wiki_filters_itemtemplates:
//       json |> field("wiki.filters.itemtemplates", string),
//     wiki_filters_itemtemplates_all:
//       json |> field("wiki.filters.itemtemplates.all", string),

//     imprint_title: json |> field("imprint.title", string),

//     profile_editprofessionnamebtn:
//       json |> field("profile.editprofessionnamebtn", string),
//     profile_addadventurepointsbtn:
//       json |> field("profile.addadventurepointsbtn", string),
//     profile_endherocreationbtn:
//       json |> field("profile.endherocreationbtn", string),
//     profile_changeheroavatarbtn:
//       json |> field("profile.changeheroavatarbtn", string),
//     profile_deleteavatarbtn: json |> field("profile.deleteavatarbtn", string),
//     profile_dialogs_changeheroavatar_title:
//       json |> field("profile.dialogs.changeheroavatar.title", string),
//     profile_dialogs_changeheroavatar_selectfilebtn:
//       json |> field("profile.dialogs.changeheroavatar.selectfilebtn", string),
//     profile_dialogs_changeheroavatar_imagefiletype:
//       json |> field("profile.dialogs.changeheroavatar.imagefiletype", string),
//     profile_dialogs_changeheroavatar_invalidfilewarning:
//       json
//       |> field("profile.dialogs.changeheroavatar.invalidfilewarning", string),
//     profile_dialogs_addadventurepoints_title:
//       json |> field("profile.dialogs.addadventurepoints.title", string),
//     profile_dialogs_addadventurepoints_label:
//       json |> field("profile.dialogs.addadventurepoints.label", string),
//     profile_advantages: json |> field("profile.advantages", string),
//     profile_disadvantages: json |> field("profile.disadvantages", string),

//     personaldata_title: json |> field("personaldata.title", string),
//     personaldata_sex_male: json |> field("personaldata.sex.male", string),
//     personaldata_sex_female: json |> field("personaldata.sex.female", string),
//     personaldata_family: json |> field("personaldata.family", string),
//     personaldata_placeofbirth:
//       json |> field("personaldata.placeofbirth", string),
//     personaldata_dateofbirth:
//       json |> field("personaldata.dateofbirth", string),
//     personaldata_age: json |> field("personaldata.age", string),
//     personaldata_haircolor: json |> field("personaldata.haircolor", string),
//     personaldata_eyecolor: json |> field("personaldata.eyecolor", string),
//     personaldata_size: json |> field("personaldata.size", string),
//     personaldata_weight: json |> field("personaldata.weight", string),
//     personaldata_rank: json |> field("personaldata.rank", string),
//     personaldata_socialstatus:
//       json |> field("personaldata.socialstatus", string),
//     personaldata_characteristics:
//       json |> field("personaldata.characteristics", string),
//     personaldata_otherinfo: json |> field("personaldata.otherinfo", string),
//     personaldata_cultureareaknowledge:
//       json |> field("personaldata.cultureareaknowledge", string),

//     sheets_printtopdfbtn: json |> field("sheets.printtopdfbtn", string),
//     sheets_dialogs_pdfexportsavelocation_title:
//       json |> field("sheets.dialogs.pdfexportsavelocation.title", string),
//     sheets_dialogs_pdfsaved: json |> field("sheets.dialogs.pdfsaved", string),
//     sheets_dialogs_pdfsaveerror_title:
//       json |> field("sheets.dialogs.pdfsaveerror.title", string),
//     sheets_dialogs_pdfsaveerror_message:
//       json |> field("sheets.dialogs.pdfsaveerror.message", string),
//     sheets_dialogs_pdfcreationerror_title:
//       json |> field("sheets.dialogs.pdfcreationerror.title", string),
//     sheets_dialogs_pdfcreationerror_message:
//       json |> field("sheets.dialogs.pdfcreationerror.message", string),
//     sheets_showattributevalues:
//       json |> field("sheets.showattributevalues", string),
//     sheets_charactersheet: json |> field("sheets.charactersheet", string),
//     sheets_attributemodifiers_title:
//       json |> field("sheets.attributemodifiers.title", string),

//     sheets_mainsheet_title: json |> field("sheets.mainsheet.title", string),
//     sheets_mainsheet_name: json |> field("sheets.mainsheet.name", string),
//     sheets_mainsheet_family: json |> field("sheets.mainsheet.family", string),
//     sheets_mainsheet_placeofbirth:
//       json |> field("sheets.mainsheet.placeofbirth", string),
//     sheets_mainsheet_dateofbirth:
//       json |> field("sheets.mainsheet.dateofbirth", string),
//     sheets_mainsheet_age: json |> field("sheets.mainsheet.age", string),
//     sheets_mainsheet_sex: json |> field("sheets.mainsheet.sex", string),
//     sheets_mainsheet_race: json |> field("sheets.mainsheet.race", string),
//     sheets_mainsheet_size: json |> field("sheets.mainsheet.size", string),
//     sheets_mainsheet_weight: json |> field("sheets.mainsheet.weight", string),
//     sheets_mainsheet_haircolor:
//       json |> field("sheets.mainsheet.haircolor", string),
//     sheets_mainsheet_eyecolor:
//       json |> field("sheets.mainsheet.eyecolor", string),
//     sheets_mainsheet_culture:
//       json |> field("sheets.mainsheet.culture", string),
//     sheets_mainsheet_socialstatus:
//       json |> field("sheets.mainsheet.socialstatus", string),
//     sheets_mainsheet_profession:
//       json |> field("sheets.mainsheet.profession", string),
//     sheets_mainsheet_rank: json |> field("sheets.mainsheet.rank", string),
//     sheets_mainsheet_characteristics:
//       json |> field("sheets.mainsheet.characteristics", string),
//     sheets_mainsheet_otherinfo:
//       json |> field("sheets.mainsheet.otherinfo", string),
//     sheets_mainsheet_experiencelevellabel:
//       json |> field("sheets.mainsheet.experiencelevellabel", string),
//     sheets_mainsheet_totalaplabel:
//       json |> field("sheets.mainsheet.totalaplabel", string),
//     sheets_mainsheet_apcollectedlabel:
//       json |> field("sheets.mainsheet.apcollectedlabel", string),
//     sheets_mainsheet_apspentlabel:
//       json |> field("sheets.mainsheet.apspentlabel", string),
//     sheets_mainsheet_avatarlabel:
//       json |> field("sheets.mainsheet.avatarlabel", string),
//     sheets_mainsheet_advantages:
//       json |> field("sheets.mainsheet.advantages", string),
//     sheets_mainsheet_disadvantages:
//       json |> field("sheets.mainsheet.disadvantages", string),
//     sheets_mainsheet_generalspecialabilites:
//       json |> field("sheets.mainsheet.generalspecialabilites", string),
//     sheets_mainsheet_fatepoints:
//       json |> field("sheets.mainsheet.fatepoints", string),
//     sheets_mainsheet_derivedcharacteristics_labels_value:
//       json
//       |> field("sheets.mainsheet.derivedcharacteristics.labels.value", string),
//     sheets_mainsheet_derivedcharacteristics_labels_bonuspenalty:
//       json
//       |> field(
//            "sheets.mainsheet.derivedcharacteristics.labels.bonuspenalty",
//            string,
//          ),
//     sheets_mainsheet_derivedcharacteristics_labels_bonus:
//       json
//       |> field("sheets.mainsheet.derivedcharacteristics.labels.bonus", string),
//     sheets_mainsheet_derivedcharacteristics_labels_bought:
//       json
//       |> field(
//            "sheets.mainsheet.derivedcharacteristics.labels.bought",
//            string,
//          ),
//     sheets_mainsheet_derivedcharacteristics_labels_max:
//       json
//       |> field("sheets.mainsheet.derivedcharacteristics.labels.max", string),
//     sheets_mainsheet_derivedcharacteristics_labels_current:
//       json
//       |> field(
//            "sheets.mainsheet.derivedcharacteristics.labels.current",
//            string,
//          ),
//     sheets_mainsheet_derivedcharacteristics_labels_basestat:
//       json
//       |> field(
//            "sheets.mainsheet.derivedcharacteristics.labels.basestat",
//            string,
//          ),
//     sheets_mainsheet_derivedcharacteristics_labels_permanentlylostboughtback:
//       json
//       |> field(
//            "sheets.mainsheet.derivedcharacteristics.labels.permanentlylostboughtback",
//            string,
//          ),

//     sheets_gamestatssheet_title:
//       json |> field("sheets.gamestatssheet.title", string),
//     sheets_gamestatssheet_skillstable_title:
//       json |> field("sheets.gamestatssheet.skillstable.title", string),
//     sheets_gamestatssheet_skillstable_labels_skill:
//       json |> field("sheets.gamestatssheet.skillstable.labels.skill", string),
//     sheets_gamestatssheet_skillstable_labels_check:
//       json |> field("sheets.gamestatssheet.skillstable.labels.check", string),
//     sheets_gamestatssheet_skillstable_labels_encumbrance:
//       json
//       |> field("sheets.gamestatssheet.skillstable.labels.encumbrance", string),
//     sheets_gamestatssheet_skillstable_labels_improvementcost:
//       json
//       |> field(
//            "sheets.gamestatssheet.skillstable.labels.improvementcost",
//            string,
//          ),
//     sheets_gamestatssheet_skillstable_labels_skillrating:
//       json
//       |> field("sheets.gamestatssheet.skillstable.labels.skillrating", string),
//     sheets_gamestatssheet_skillstable_labels_routinechecks:
//       json
//       |> field(
//            "sheets.gamestatssheet.skillstable.labels.routinechecks",
//            string,
//          ),
//     sheets_gamestatssheet_skillstable_labels_notes:
//       json |> field("sheets.gamestatssheet.skillstable.labels.notes", string),
//     sheets_gamestatssheet_skillstable_encumbrance_yes:
//       json
//       |> field("sheets.gamestatssheet.skillstable.encumbrance.yes", string),
//     sheets_gamestatssheet_skillstable_encumbrance_no:
//       json
//       |> field("sheets.gamestatssheet.skillstable.encumbrance.no", string),
//     sheets_gamestatssheet_skillstable_encumbrance_maybe:
//       json
//       |> field("sheets.gamestatssheet.skillstable.encumbrance.maybe", string),
//     sheets_gamestatssheet_skillstable_groups_pages:
//       json |> field("sheets.gamestatssheet.skillstable.groups.pages", string),
//     sheets_gamestatssheet_languages_title:
//       json |> field("sheets.gamestatssheet.languages.title", string),
//     sheets_gamestatssheet_languages_nativetongue:
//       json |> field("sheets.gamestatssheet.languages.nativetongue", string),
//     sheets_gamestatssheet_knownscripts_title:
//       json |> field("sheets.gamestatssheet.knownscripts.title", string),
//     sheets_gamestatssheet_routinechecks_title:
//       json |> field("sheets.gamestatssheet.routinechecks.title", string),
//     sheets_gamestatssheet_routinechecks_textRow1:
//       json |> field("sheets.gamestatssheet.routinechecks.textRow1", string),
//     sheets_gamestatssheet_routinechecks_textRow2:
//       json |> field("sheets.gamestatssheet.routinechecks.textRow2", string),
//     sheets_gamestatssheet_routinechecks_textRow3:
//       json |> field("sheets.gamestatssheet.routinechecks.textRow3", string),
//     sheets_gamestatssheet_routinechecks_textRow4:
//       json |> field("sheets.gamestatssheet.routinechecks.textRow4", string),
//     sheets_gamestatssheet_routinechecks_labels_checkmod:
//       json
//       |> field("sheets.gamestatssheet.routinechecks.labels.checkmod", string),
//     sheets_gamestatssheet_routinechecks_labels_neededsr:
//       json
//       |> field("sheets.gamestatssheet.routinechecks.labels.neededsr", string),
//     sheets_gamestatssheet_routinechecks_from3on:
//       json |> field("sheets.gamestatssheet.routinechecks.from3on", string),
//     sheets_gamestatssheet_qualitylevels_title:
//       json |> field("sheets.gamestatssheet.qualitylevels.title", string),
//     sheets_gamestatssheet_qualitylevels_labels_skillpoints:
//       json
//       |> field(
//            "sheets.gamestatssheet.qualitylevels.labels.skillpoints",
//            string,
//          ),
//     sheets_gamestatssheet_qualitylevels_labels_qualitylevel:
//       json
//       |> field(
//            "sheets.gamestatssheet.qualitylevels.labels.qualitylevel",
//            string,
//          ),

//     sheets_combatsheet_title:
//       json |> field("sheets.combatsheet.title", string),
//     sheets_combatsheet_combattechniquestable_title:
//       json |> field("sheets.combatsheet.combattechniquestable.title", string),
//     sheets_combatsheet_combattechniquestable_labels_combattechnique:
//       json
//       |> field(
//            "sheets.combatsheet.combattechniquestable.labels.combattechnique",
//            string,
//          ),
//     sheets_combatsheet_combattechniquestable_labels_primaryattribute:
//       json
//       |> field(
//            "sheets.combatsheet.combattechniquestable.labels.primaryattribute",
//            string,
//          ),
//     sheets_combatsheet_combattechniquestable_labels_improvementcost:
//       json
//       |> field(
//            "sheets.combatsheet.combattechniquestable.labels.improvementcost",
//            string,
//          ),
//     sheets_combatsheet_combattechniquestable_labels_combattechniquerating:
//       json
//       |> field(
//            "sheets.combatsheet.combattechniquestable.labels.combattechniquerating",
//            string,
//          ),
//     sheets_combatsheet_combattechniquestable_labels_attackrangecombat:
//       json
//       |> field(
//            "sheets.combatsheet.combattechniquestable.labels.attackrangecombat",
//            string,
//          ),
//     sheets_combatsheet_combattechniquestable_labels_parry:
//       json
//       |> field(
//            "sheets.combatsheet.combattechniquestable.labels.parry",
//            string,
//          ),
//     sheets_combatsheet_lifepoints_title:
//       json |> field("sheets.combatsheet.lifepoints.title", string),
//     sheets_combatsheet_lifepoints_max:
//       json |> field("sheets.combatsheet.lifepoints.max", string),
//     sheets_combatsheet_lifepoints_current:
//       json |> field("sheets.combatsheet.lifepoints.current", string),
//     sheets_combatsheet_lifepoints_pain1:
//       json |> field("sheets.combatsheet.lifepoints.pain1", string),
//     sheets_combatsheet_lifepoints_pain2:
//       json |> field("sheets.combatsheet.lifepoints.pain2", string),
//     sheets_combatsheet_lifepoints_pain3:
//       json |> field("sheets.combatsheet.lifepoints.pain3", string),
//     sheets_combatsheet_lifepoints_pain4:
//       json |> field("sheets.combatsheet.lifepoints.pain4", string),
//     sheets_combatsheet_lifepoints_dying:
//       json |> field("sheets.combatsheet.lifepoints.dying", string),
//     sheets_combatsheet_closecombatweapons:
//       json |> field("sheets.combatsheet.closecombatweapons", string),
//     sheets_combatsheet_closecombatweapons_labels_weapon:
//       json
//       |> field("sheets.combatsheet.closecombatweapons.labels.weapon", string),
//     sheets_combatsheet_closecombatweapons_labels_combattechnique:
//       json
//       |> field(
//            "sheets.combatsheet.closecombatweapons.labels.combattechnique",
//            string,
//          ),
//     sheets_combatsheet_closecombatweapons_labels_damagebonus:
//       json
//       |> field(
//            "sheets.combatsheet.closecombatweapons.labels.damagebonus",
//            string,
//          ),
//     sheets_combatsheet_closecombatweapons_labels_damagepoints:
//       json
//       |> field(
//            "sheets.combatsheet.closecombatweapons.labels.damagepoints",
//            string,
//          ),
//     sheets_combatsheet_closecombatweapons_labels_attackparrymodifier:
//       json
//       |> field(
//            "sheets.combatsheet.closecombatweapons.labels.attackparrymodifier",
//            string,
//          ),
//     sheets_combatsheet_closecombatweapons_labels_reach:
//       json
//       |> field("sheets.combatsheet.closecombatweapons.labels.reach", string),
//     sheets_combatsheet_closecombatweapons_labels_breakingpointrating:
//       json
//       |> field(
//            "sheets.combatsheet.closecombatweapons.labels.breakingpointrating",
//            string,
//          ),
//     sheets_combatsheet_closecombatweapons_labels_damaged:
//       json
//       |> field("sheets.combatsheet.closecombatweapons.labels.damaged", string),
//     sheets_combatsheet_closecombatweapons_labels_attack:
//       json
//       |> field("sheets.combatsheet.closecombatweapons.labels.attack", string),
//     sheets_combatsheet_closecombatweapons_labels_parry:
//       json
//       |> field("sheets.combatsheet.closecombatweapons.labels.parry", string),
//     sheets_combatsheet_closecombatweapons_labels_weight:
//       json
//       |> field("sheets.combatsheet.closecombatweapons.labels.weight", string),
//     sheets_combatsheet_rangedcombatweapons:
//       json |> field("sheets.combatsheet.rangedcombatweapons", string),
//     sheets_combatsheet_rangedcombatweapons_labels_weapon:
//       json
//       |> field("sheets.combatsheet.rangedcombatweapons.labels.weapon", string),
//     sheets_combatsheet_rangedcombatweapons_labels_combattechnique:
//       json
//       |> field(
//            "sheets.combatsheet.rangedcombatweapons.labels.combattechnique",
//            string,
//          ),
//     sheets_combatsheet_rangedcombatweapons_labels_reloadtime:
//       json
//       |> field(
//            "sheets.combatsheet.rangedcombatweapons.labels.reloadtime",
//            string,
//          ),
//     sheets_combatsheet_rangedcombatweapons_labels_damagepoints:
//       json
//       |> field(
//            "sheets.combatsheet.rangedcombatweapons.labels.damagepoints",
//            string,
//          ),
//     sheets_combatsheet_rangedcombatweapons_labels_ammunition:
//       json
//       |> field(
//            "sheets.combatsheet.rangedcombatweapons.labels.ammunition",
//            string,
//          ),
//     sheets_combatsheet_rangedcombatweapons_labels_rangebrackets:
//       json
//       |> field(
//            "sheets.combatsheet.rangedcombatweapons.labels.rangebrackets",
//            string,
//          ),
//     sheets_combatsheet_rangedcombatweapons_labels_breakingpointrating:
//       json
//       |> field(
//            "sheets.combatsheet.rangedcombatweapons.labels.breakingpointrating",
//            string,
//          ),
//     sheets_combatsheet_rangedcombatweapons_labels_damaged:
//       json
//       |> field(
//            "sheets.combatsheet.rangedcombatweapons.labels.damaged",
//            string,
//          ),
//     sheets_combatsheet_rangedcombatweapons_labels_rangedcombat:
//       json
//       |> field(
//            "sheets.combatsheet.rangedcombatweapons.labels.rangedcombat",
//            string,
//          ),
//     sheets_combatsheet_rangedcombatweapons_labels_weight:
//       json
//       |> field("sheets.combatsheet.rangedcombatweapons.labels.weight", string),
//     sheets_combatsheet_armors_title:
//       json |> field("sheets.combatsheet.armors.title", string),
//     sheets_combatsheet_armors_labels_armor:
//       json |> field("sheets.combatsheet.armors.labels.armor", string),
//     sheets_combatsheet_armors_labels_sturdinessrating:
//       json
//       |> field("sheets.combatsheet.armors.labels.sturdinessrating", string),
//     sheets_combatsheet_armors_labels_wear:
//       json |> field("sheets.combatsheet.armors.labels.wear", string),
//     sheets_combatsheet_armors_labels_protection:
//       json |> field("sheets.combatsheet.armors.labels.protection", string),
//     sheets_combatsheet_armors_labels_encumbrance:
//       json |> field("sheets.combatsheet.armors.labels.encumbrance", string),
//     sheets_combatsheet_armors_labels_movementinitiative:
//       json
//       |> field("sheets.combatsheet.armors.labels.movementinitiative", string),
//     sheets_combatsheet_armors_labels_carriedwhereexamples:
//       json
//       |> field(
//            "sheets.combatsheet.armors.labels.carriedwhereexamples",
//            string,
//          ),
//     sheets_combatsheet_armors_labels_head:
//       json |> field("sheets.combatsheet.armors.labels.head", string),
//     sheets_combatsheet_armors_labels_torso:
//       json |> field("sheets.combatsheet.armors.labels.torso", string),
//     sheets_combatsheet_armors_labels_leftarm:
//       json |> field("sheets.combatsheet.armors.labels.leftarm", string),
//     sheets_combatsheet_armors_labels_rightarm:
//       json |> field("sheets.combatsheet.armors.labels.rightarm", string),
//     sheets_combatsheet_armors_labels_leftleg:
//       json |> field("sheets.combatsheet.armors.labels.leftleg", string),
//     sheets_combatsheet_armors_labels_rightleg:
//       json |> field("sheets.combatsheet.armors.labels.rightleg", string),
//     sheets_combatsheet_armors_labels_weight:
//       json |> field("sheets.combatsheet.armors.labels.weight", string),
//     sheets_combatsheet_shieldparryingweapon_title:
//       json |> field("sheets.combatsheet.shieldparryingweapon.title", string),
//     sheets_combatsheet_shieldparryingweapon_labels_shieldparryingweapon:
//       json
//       |> field(
//            "sheets.combatsheet.shieldparryingweapon.labels.shieldparryingweapon",
//            string,
//          ),
//     sheets_combatsheet_shieldparryingweapon_labels_structurepoints:
//       json
//       |> field(
//            "sheets.combatsheet.shieldparryingweapon.labels.structurepoints",
//            string,
//          ),
//     sheets_combatsheet_shieldparryingweapon_labels_breakingpointrating:
//       json
//       |> field(
//            "sheets.combatsheet.shieldparryingweapon.labels.breakingpointrating",
//            string,
//          ),
//     sheets_combatsheet_shieldparryingweapon_labels_damaged:
//       json
//       |> field(
//            "sheets.combatsheet.shieldparryingweapon.labels.damaged",
//            string,
//          ),
//     sheets_combatsheet_shieldparryingweapon_labels_attackparrymodifier:
//       json
//       |> field(
//            "sheets.combatsheet.shieldparryingweapon.labels.attackparrymodifier",
//            string,
//          ),
//     sheets_combatsheet_shieldparryingweapon_labels_weight:
//       json
//       |> field(
//            "sheets.combatsheet.shieldparryingweapon.labels.weight",
//            string,
//          ),
//     sheets_combatsheet_actions:
//       json |> field("sheets.combatsheet.actions", string),
//     sheets_combatsheet_combatspecialabilities:
//       json |> field("sheets.combatsheet.combatspecialabilities", string),
//     sheets_combatsheet_conditions:
//       json |> field("sheets.combatsheet.conditions", string),
//     sheets_combatsheet_states:
//       json |> field("sheets.combatsheet.states", string),

//     sheets_belongingssheet_title:
//       json |> field("sheets.belongingssheet.title", string),
//     sheets_belongingssheet_equipmenttable_title:
//       json |> field("sheets.belongingssheet.equipmenttable.title", string),
//     sheets_belongingssheet_equipmenttable_labels_item:
//       json
//       |> field("sheets.belongingssheet.equipmenttable.labels.item", string),
//     sheets_belongingssheet_equipmenttable_labels_number:
//       json
//       |> field("sheets.belongingssheet.equipmenttable.labels.number", string),
//     sheets_belongingssheet_equipmenttable_labels_price:
//       json
//       |> field("sheets.belongingssheet.equipmenttable.labels.price", string),
//     sheets_belongingssheet_equipmenttable_labels_weight:
//       json
//       |> field("sheets.belongingssheet.equipmenttable.labels.weight", string),
//     sheets_belongingssheet_equipmenttable_labels_carriedwhere:
//       json
//       |> field(
//            "sheets.belongingssheet.equipmenttable.labels.carriedwhere",
//            string,
//          ),
//     sheets_belongingssheet_equipmenttable_labels_total:
//       json
//       |> field("sheets.belongingssheet.equipmenttable.labels.total", string),
//     sheets_belongingssheet_purse_title:
//       json |> field("sheets.belongingssheet.purse.title", string),
//     sheets_belongingssheet_purse_ducats:
//       json |> field("sheets.belongingssheet.purse.ducats", string),
//     sheets_belongingssheet_purse_silverthalers:
//       json |> field("sheets.belongingssheet.purse.silverthalers", string),
//     sheets_belongingssheet_purse_halers:
//       json |> field("sheets.belongingssheet.purse.halers", string),
//     sheets_belongingssheet_purse_kreutzers:
//       json |> field("sheets.belongingssheet.purse.kreutzers", string),
//     sheets_belongingssheet_purse_gems:
//       json |> field("sheets.belongingssheet.purse.gems", string),
//     sheets_belongingssheet_purse_jewelry:
//       json |> field("sheets.belongingssheet.purse.jewelry", string),
//     sheets_belongingssheet_purse_other:
//       json |> field("sheets.belongingssheet.purse.other", string),
//     sheets_belongingssheet_carryingcapacity_title:
//       json |> field("sheets.belongingssheet.carryingcapacity.title", string),
//     sheets_belongingssheet_carryingcapacity_calc:
//       json |> field("sheets.belongingssheet.carryingcapacity.calc", string),
//     sheets_belongingssheet_carryingcapacity_label:
//       json |> field("sheets.belongingssheet.carryingcapacity.label", string),
//     sheets_belongingssheet_animal_title:
//       json |> field("sheets.belongingssheet.animal.title", string),
//     sheets_belongingssheet_animal_name:
//       json |> field("sheets.belongingssheet.animal.name", string),
//     sheets_belongingssheet_animal_sizecategory:
//       json |> field("sheets.belongingssheet.animal.sizecategory", string),
//     sheets_belongingssheet_animal_type:
//       json |> field("sheets.belongingssheet.animal.type", string),
//     sheets_belongingssheet_animal_ap:
//       json |> field("sheets.belongingssheet.animal.ap", string),
//     sheets_belongingssheet_animal_protection:
//       json |> field("sheets.belongingssheet.animal.protection", string),
//     sheets_belongingssheet_animal_attackname:
//       json |> field("sheets.belongingssheet.animal.attackname", string),
//     sheets_belongingssheet_animal_attack:
//       json |> field("sheets.belongingssheet.animal.attack", string),
//     sheets_belongingssheet_animal_parry:
//       json |> field("sheets.belongingssheet.animal.parry", string),
//     sheets_belongingssheet_animal_damagepoints:
//       json |> field("sheets.belongingssheet.animal.damagepoints", string),
//     sheets_belongingssheet_animal_reach:
//       json |> field("sheets.belongingssheet.animal.reach", string),
//     sheets_belongingssheet_animal_actions:
//       json |> field("sheets.belongingssheet.animal.actions", string),
//     sheets_belongingssheet_animal_skills:
//       json |> field("sheets.belongingssheet.animal.skills", string),
//     sheets_belongingssheet_animal_specialabilities:
//       json |> field("sheets.belongingssheet.animal.specialabilities", string),
//     sheets_belongingssheet_animal_notes:
//       json |> field("sheets.belongingssheet.animal.notes", string),

//     sheets_spellssheet_title:
//       json |> field("sheets.spellssheet.title", string),
//     sheets_spellssheet_header_labels_aemax:
//       json |> field("sheets.spellssheet.header.labels.aemax", string),
//     sheets_spellssheet_header_labels_aecurrent:
//       json |> field("sheets.spellssheet.header.labels.aecurrent", string),
//     sheets_spellssheet_spellstable_title:
//       json |> field("sheets.spellssheet.spellstable.title", string),
//     sheets_spellssheet_spellstable_labels_spellorritual:
//       json
//       |> field("sheets.spellssheet.spellstable.labels.spellorritual", string),
//     sheets_spellssheet_spellstable_labels_check:
//       json |> field("sheets.spellssheet.spellstable.labels.check", string),
//     sheets_spellssheet_spellstable_labels_skillrating:
//       json
//       |> field("sheets.spellssheet.spellstable.labels.skillrating", string),
//     sheets_spellssheet_spellstable_labels_cost:
//       json |> field("sheets.spellssheet.spellstable.labels.cost", string),
//     sheets_spellssheet_spellstable_labels_castingtime:
//       json
//       |> field("sheets.spellssheet.spellstable.labels.castingtime", string),
//     sheets_spellssheet_spellstable_labels_range:
//       json |> field("sheets.spellssheet.spellstable.labels.range", string),
//     sheets_spellssheet_spellstable_labels_duration:
//       json |> field("sheets.spellssheet.spellstable.labels.duration", string),
//     sheets_spellssheet_spellstable_labels_property:
//       json |> field("sheets.spellssheet.spellstable.labels.property", string),
//     sheets_spellssheet_spellstable_labels_improvementcost:
//       json
//       |> field(
//            "sheets.spellssheet.spellstable.labels.improvementcost",
//            string,
//          ),
//     sheets_spellssheet_spellstable_labels_effect:
//       json |> field("sheets.spellssheet.spellstable.labels.effect", string),
//     sheets_spellssheet_spellstable_labels_pages:
//       json |> field("sheets.spellssheet.spellstable.labels.pages", string),
//     sheets_spellssheet_spellstable_unfamiliarspell:
//       json |> field("sheets.spellssheet.spellstable.unfamiliarspell", string),
//     sheets_spellssheet_primaryattribute:
//       json |> field("sheets.spellssheet.primaryattribute", string),
//     sheets_spellssheet_properties:
//       json |> field("sheets.spellssheet.properties", string),
//     sheets_spellssheet_tradition:
//       json |> field("sheets.spellssheet.tradition", string),
//     sheets_spellssheet_magicalspecialabilities:
//       json |> field("sheets.spellssheet.magicalspecialabilities", string),
//     sheets_spellssheet_cantrips:
//       json |> field("sheets.spellssheet.cantrips", string),

//     sheets_chantssheet_title:
//       json |> field("sheets.chantssheet.title", string),
//     sheets_chantssheet_header_labels_kpmax:
//       json |> field("sheets.chantssheet.header.labels.kpmax", string),
//     sheets_chantssheet_header_labels_kpcurrent:
//       json |> field("sheets.chantssheet.header.labels.kpcurrent", string),
//     sheets_chantssheet_chantstable_title:
//       json |> field("sheets.chantssheet.chantstable.title", string),
//     sheets_chantssheet_chantstable_labels_chant:
//       json |> field("sheets.chantssheet.chantstable.labels.chant", string),
//     sheets_chantssheet_chantstable_labels_check:
//       json |> field("sheets.chantssheet.chantstable.labels.check", string),
//     sheets_chantssheet_chantstable_labels_skillrating:
//       json
//       |> field("sheets.chantssheet.chantstable.labels.skillrating", string),
//     sheets_chantssheet_chantstable_labels_cost:
//       json |> field("sheets.chantssheet.chantstable.labels.cost", string),
//     sheets_chantssheet_chantstable_labels_castingtime:
//       json
//       |> field("sheets.chantssheet.chantstable.labels.castingtime", string),
//     sheets_chantssheet_chantstable_labels_range:
//       json |> field("sheets.chantssheet.chantstable.labels.range", string),
//     sheets_chantssheet_chantstable_labels_duration:
//       json |> field("sheets.chantssheet.chantstable.labels.duration", string),
//     sheets_chantssheet_chantstable_labels_aspect:
//       json |> field("sheets.chantssheet.chantstable.labels.aspect", string),
//     sheets_chantssheet_chantstable_labels_improvementcost:
//       json
//       |> field(
//            "sheets.chantssheet.chantstable.labels.improvementcost",
//            string,
//          ),
//     sheets_chantssheet_chantstable_labels_effect:
//       json |> field("sheets.chantssheet.chantstable.labels.effect", string),
//     sheets_chantssheet_chantstable_labels_pages:
//       json |> field("sheets.chantssheet.chantstable.labels.pages", string),
//     sheets_chantssheet_primaryattribute:
//       json |> field("sheets.chantssheet.primaryattribute", string),
//     sheets_chantssheet_aspects:
//       json |> field("sheets.chantssheet.aspects", string),
//     sheets_chantssheet_tradition:
//       json |> field("sheets.chantssheet.tradition", string),
//     sheets_chantssheet_blessedspecialabilities:
//       json |> field("sheets.chantssheet.blessedspecialabilities", string),
//     sheets_chantssheet_blessings:
//       json |> field("sheets.chantssheet.blessings", string),

//     pacts_pactcategory: json |> field("pacts.pactcategory", string),
//     pacts_nopact: json |> field("pacts.nopact", string),
//     pacts_pactlevel: json |> field("pacts.pactlevel", string),
//     pacts_fairytype: json |> field("pacts.fairytype", string),
//     pacts_domain: json |> field("pacts.domain", string),
//     pacts_userdefined: json |> field("pacts.userdefined", string),
//     pacts_demontype: json |> field("pacts.demontype", string),
//     pacts_circleofdamnation: json |> field("pacts.circleofdamnation", string),
//     pacts_minorpact: json |> field("pacts.minorpact", string),
//     pacts_pactisincompletehint:
//       json |> field("pacts.pactisincompletehint", string),
//     pacts_name: json |> field("pacts.name", string),

//     rules_rulebase: json |> field("rules.rulebase", string),
//     rules_enableallrulebooks:
//       json |> field("rules.enableallrulebooks", string),
//     rules_focusrules: json |> field("rules.focusrules", string),
//     rules_optionalrules: json |> field("rules.optionalrules", string),
//     rules_manualherodatarepair:
//       json |> field("rules.manualherodatarepair", string),
//     rules_manualherodatarepairexplanation:
//       json |> field("rules.manualherodatarepairexplanation", string),

//     inlinewiki_complementarysources:
//       json |> field("inlinewiki.complementarysources", string),

//     race_header_name: json |> field("race.header.name", string),
//     race_header_adventurepoints:
//       json |> field("race.header.adventurepoints", string),
//     race_header_adventurepoints_tooltip:
//       json |> field("race.header.adventurepoints.tooltip", string),

//     inlinewiki_apvalue: json |> field("inlinewiki.apvalue", string),
//     inlinewiki_adventurepoints:
//       json |> field("inlinewiki.adventurepoints", string),
//     inlinewiki_lifepointbasevalue:
//       json |> field("inlinewiki.lifepointbasevalue", string),
//     inlinewiki_spiritbasevalue:
//       json |> field("inlinewiki.spiritbasevalue", string),
//     inlinewiki_toughnessbasevalue:
//       json |> field("inlinewiki.toughnessbasevalue", string),
//     inlinewiki_movementbasevalue:
//       json |> field("inlinewiki.movementbasevalue", string),
//     inlinewiki_attributeadjustments:
//       json |> field("inlinewiki.attributeadjustments", string),
//     inlinewiki_automaticadvantages:
//       json |> field("inlinewiki.automaticadvantages", string),
//     inlinewiki_stronglyrecommendedadvantages:
//       json |> field("inlinewiki.stronglyrecommendedadvantages", string),
//     inlinewiki_stronglyrecommendeddisadvantages:
//       json |> field("inlinewiki.stronglyrecommendeddisadvantages", string),
//     inlinewiki_commoncultures:
//       json |> field("inlinewiki.commoncultures", string),
//     inlinewiki_commonadvantages:
//       json |> field("inlinewiki.commonadvantages", string),
//     inlinewiki_commondisadvantages:
//       json |> field("inlinewiki.commondisadvantages", string),
//     inlinewiki_uncommonadvantages:
//       json |> field("inlinewiki.uncommonadvantages", string),
//     inlinewiki_uncommondisadvantages:
//       json |> field("inlinewiki.uncommondisadvantages", string),

//     culture_filters_common_allcultures:
//       json |> field("culture.filters.common.allcultures", string),
//     culture_filters_common_commoncultures:
//       json |> field("culture.filters.common.commoncultures", string),
//     culture_header_name: json |> field("culture.header.name", string),

//     inlinewiki_language: json |> field("inlinewiki.language", string),
//     inlinewiki_script: json |> field("inlinewiki.script", string),
//     inlinewiki_areaknowledge:
//       json |> field("inlinewiki.areaknowledge", string),
//     inlinewiki_socialstatus: json |> field("inlinewiki.socialstatus", string),
//     inlinewiki_commonprofessions:
//       json |> field("inlinewiki.commonprofessions", string),
//     inlinewiki_commonprofessions_mundane:
//       json |> field("inlinewiki.commonprofessions.mundane", string),
//     inlinewiki_commonprofessions_magic:
//       json |> field("inlinewiki.commonprofessions.magic", string),
//     inlinewiki_commonprofessions_blessed:
//       json |> field("inlinewiki.commonprofessions.blessed", string),
//     inlinewiki_commonskills: json |> field("inlinewiki.commonskills", string),
//     inlinewiki_uncommonskills:
//       json |> field("inlinewiki.uncommonskills", string),
//     inlinewiki_commonnames: json |> field("inlinewiki.commonnames", string),
//     inlinewiki_culturalpackage:
//       json |> field("inlinewiki.culturalpackage", string),

//     profession_ownprofession:
//       json |> field("profession.ownprofession", string),
//     profession_variants_novariant:
//       json |> field("profession.variants.novariant", string),
//     profession_filters_common_allprofessions:
//       json |> field("profession.filters.common.allprofessions", string),
//     profession_filters_common_commonprofessions:
//       json |> field("profession.filters.common.commonprofessions", string),
//     profession_filters_groups_allprofessiongroups:
//       json |> field("profession.filters.groups.allprofessiongroups", string),
//     profession_filters_groups_mundaneprofessions:
//       json |> field("profession.filters.groups.mundaneprofessions", string),
//     profession_filters_groups_magicalprofessions:
//       json |> field("profession.filters.groups.magicalprofessions", string),
//     profession_filters_groups_blessedprofessions:
//       json |> field("profession.filters.groups.blessedprofessions", string),
//     profession_header_name: json |> field("profession.header.name", string),
//     profession_header_adventurepoints:
//       json |> field("profession.header.adventurepoints", string),
//     profession_header_adventurepoints_tooltip:
//       json |> field("profession.header.adventurepoints.tooltip", string),

//     inlinewiki_prerequisites:
//       json |> field("inlinewiki.prerequisites", string),
//     inlinewiki_race: json |> field("inlinewiki.race", string),
//     inlinewiki_specialabilities:
//       json |> field("inlinewiki.specialabilities", string),
//     inlinewiki_languagesandliteracytotalingap:
//       json |> field("inlinewiki.languagesandliteracytotalingap", string),
//     inlinewiki_skillspecialization:
//       json |> field("inlinewiki.skillspecialization", string),
//     inlinewiki_skillsselection:
//       json |> field("inlinewiki.skillsselection", string),
//     inlinewiki_combattechniques:
//       json |> field("inlinewiki.combattechniques", string),
//     inlinewiki_combattechniqueselection:
//       json |> field("inlinewiki.combattechniqueselection", string),
//     inlinewiki_combattechnique_one:
//       json |> field("inlinewiki.combattechnique.one", string),
//     inlinewiki_combattechnique_two:
//       json |> field("inlinewiki.combattechnique.two", string),
//     inlinewiki_combattechniquesecondselection:
//       json |> field("inlinewiki.combattechniquesecondselection", string),
//     inlinewiki_skills: json |> field("inlinewiki.skills", string),
//     inlinewiki_spells: json |> field("inlinewiki.spells", string),
//     inlinewiki_cursestotalingap:
//       json |> field("inlinewiki.cursestotalingap", string),
//     inlinewiki_cantripsfromlist:
//       json |> field("inlinewiki.cantripsfromlist", string),
//     inlinewiki_cantrip_one: json |> field("inlinewiki.cantrip.one", string),
//     inlinewiki_cantrip_two: json |> field("inlinewiki.cantrip.two", string),
//     inlinewiki_liturgicalchants:
//       json |> field("inlinewiki.liturgicalchants", string),
//     inlinewiki_thetwelveblessings:
//       json |> field("inlinewiki.thetwelveblessings", string),
//     inlinewiki_thetwelveblessingsexceptions:
//       json |> field("inlinewiki.thetwelveblessingsexceptions", string),
//     inlinewiki_sixblessings: json |> field("inlinewiki.sixblessings", string),
//     inlinewiki_suggestedadvantages:
//       json |> field("inlinewiki.suggestedadvantages", string),
//     inlinewiki_suggesteddisadvantages:
//       json |> field("inlinewiki.suggesteddisadvantages", string),
//     inlinewiki_unsuitableadvantages:
//       json |> field("inlinewiki.unsuitableadvantages", string),
//     inlinewiki_unsuitabledisadvantages:
//       json |> field("inlinewiki.unsuitabledisadvantages", string),
//     inlinewiki_variants: json |> field("inlinewiki.variants", string),
//     inlinewiki_insteadof: json |> field("inlinewiki.insteadof", string),

//     rcpselectoptions_race: json |> field("rcpselectoptions.race", string),
//     rcpselectoptions_culture:
//       json |> field("rcpselectoptions.culture", string),
//     rcpselectoptions_profession:
//       json |> field("rcpselectoptions.profession", string),
//     rcpselectoptions_cantripsfromlist:
//       json |> field("rcpselectoptions.cantripsfromlist", string),
//     rcpselectoptions_cantrip_one:
//       json |> field("rcpselectoptions.cantrip.one", string),
//     rcpselectoptions_cantrip_two:
//       json |> field("rcpselectoptions.cantrip.two", string),
//     rcpselectoptions_combattechniqueselection:
//       json |> field("rcpselectoptions.combattechniqueselection", string),
//     rcpselectoptions_combattechnique_one:
//       json |> field("rcpselectoptions.combattechnique.one", string),
//     rcpselectoptions_combattechnique_two:
//       json |> field("rcpselectoptions.combattechnique.two", string),
//     rcpselectoptions_selectattributeadjustment:
//       json |> field("rcpselectoptions.selectattributeadjustment", string),
//     rcpselectoptions_buyculturalpackage:
//       json |> field("rcpselectoptions.buyculturalpackage", string),
//     rcpselectoptions_nativetongue_placeholder:
//       json |> field("rcpselectoptions.nativetongue.placeholder", string),
//     rcpselectoptions_buyscript:
//       json |> field("rcpselectoptions.buyscript", string),
//     rcpselectoptions_script_placeholder:
//       json |> field("rcpselectoptions.script.placeholder", string),
//     rcpselectoptions_combattechniquesecondselection:
//       json |> field("rcpselectoptions.combattechniquesecondselection", string),
//     rcpselectoptions_cursestotalingapleft:
//       json |> field("rcpselectoptions.cursestotalingapleft", string),
//     rcpselectoptions_languagesandliteracytotalingapleft:
//       json
//       |> field("rcpselectoptions.languagesandliteracytotalingapleft", string),
//     rcpselectoptions_applicationforskillspecialization:
//       json
//       |> field("rcpselectoptions.applicationforskillspecialization", string),
//     rcpselectoptions_skillselectionap:
//       json |> field("rcpselectoptions.skillselectionap", string),
//     rcpselectoptions_skillspecialization:
//       json |> field("rcpselectoptions.skillspecialization", string),
//     rcpselectoptions_completebtn:
//       json |> field("rcpselectoptions.completebtn", string),
//     rcpselectoptions_unfamiliarspells:
//       json |> field("rcpselectoptions.unfamiliarspells", string),
//     rcpselectoptions_unfamiliarspellselectionfortraditionguildmage:
//       json
//       |> field(
//            "rcpselectoptions.unfamiliarspellselectionfortraditionguildmage",
//            string,
//          ),
//     rcpselectoptions_unfamiliarspell_placeholder:
//       json |> field("rcpselectoptions.unfamiliarspell.placeholder", string),
//     rcpselectoptions_unfamiliarspell:
//       json |> field("rcpselectoptions.unfamiliarspell", string),

//     attributes_totalpoints: json |> field("attributes.totalpoints", string),
//     attributes_attributeadjustmentselection:
//       json |> field("attributes.attributeadjustmentselection", string),
//     attributes_derivedcharacteristics_tooltips_modifier:
//       json
//       |> field("attributes.derivedcharacteristics.tooltips.modifier", string),
//     attributes_derivedcharacteristics_tooltips_bought:
//       json
//       |> field("attributes.derivedcharacteristics.tooltips.bought", string),
//     attributes_derivedcharacteristics_tooltips_losttotal:
//       json
//       |> field("attributes.derivedcharacteristics.tooltips.losttotal", string),
//     attributes_derivedcharacteristics_tooltips_boughtback:
//       json
//       |> field(
//            "attributes.derivedcharacteristics.tooltips.boughtback",
//            string,
//          ),
//     attributes_lostpermanently_lifepoints:
//       json |> field("attributes.lostpermanently.lifepoints", string),
//     attributes_lostpermanently_lifepoints_short:
//       json |> field("attributes.lostpermanently.lifepoints.short", string),
//     attributes_lostpermanently_arcaneenergy:
//       json |> field("attributes.lostpermanently.arcaneenergy", string),
//     attributes_lostpermanently_arcaneenergy_short:
//       json |> field("attributes.lostpermanently.arcaneenergy.short", string),
//     attributes_lostpermanently_karmapoints:
//       json |> field("attributes.lostpermanently.karmapoints", string),
//     attributes_lostpermanently_karmapoints_short:
//       json |> field("attributes.lostpermanently.karmapoints.short", string),
//     attributes_removeenergypointslostpermanently_title:
//       json
//       |> field("attributes.removeenergypointslostpermanently.title", string),
//     attributes_removeenergypointslostpermanently_message:
//       json
//       |> field("attributes.removeenergypointslostpermanently.message", string),
//     attributes_removeenergypointslostpermanently_removebtn:
//       json
//       |> field(
//            "attributes.removeenergypointslostpermanently.removebtn",
//            string,
//          ),
//     attributes_pointslostpermanentlyeditor_boughtback:
//       json
//       |> field("attributes.pointslostpermanentlyeditor.boughtback", string),
//     attributes_pointslostpermanentlyeditor_spent:
//       json |> field("attributes.pointslostpermanentlyeditor.spent", string),

//     advantages_filters_commonadvantages:
//       json |> field("advantages.filters.commonadvantages", string),
//     disadvantages_filters_commondisadvantages:
//       json |> field("disadvantages.filters.commondisadvantages", string),
//     advantagesdisadvantages_addbtn:
//       json |> field("advantagesdisadvantages.addbtn", string),
//     advantagesdisadvantages_afraidof:
//       json |> field("advantagesdisadvantages.afraidof", string),
//     advantagesdisadvantages_immunityto:
//       json |> field("advantagesdisadvantages.immunityto", string),
//     advantagesdisadvantages_hatredfor:
//       json |> field("advantagesdisadvantages.hatredfor", string),
//     advantagesdisadvantages_header_name:
//       json |> field("advantagesdisadvantages.header.name", string),
//     advantagesdisadvantages_header_adventurepoints:
//       json |> field("advantagesdisadvantages.header.adventurepoints", string),
//     advantagesdisadvantages_header_adventurepoints_tooltip:
//       json
//       |> field(
//            "advantagesdisadvantages.header.adventurepoints.tooltip",
//            string,
//          ),
//     advantagesdisadvantages_apspent_spentonadvantages:
//       json
//       |> field("advantagesdisadvantages.apspent.spentonadvantages", string),
//     advantagesdisadvantages_apspent_spentonmagicadvantages:
//       json
//       |> field(
//            "advantagesdisadvantages.apspent.spentonmagicadvantages",
//            string,
//          ),
//     advantagesdisadvantages_apspent_spentonblessedadvantages:
//       json
//       |> field(
//            "advantagesdisadvantages.apspent.spentonblessedadvantages",
//            string,
//          ),
//     advantagesdisadvantages_apspent_spentondisadvantages:
//       json
//       |> field("advantagesdisadvantages.apspent.spentondisadvantages", string),
//     advantagesdisadvantages_apspent_spentonmagicdisadvantages:
//       json
//       |> field(
//            "advantagesdisadvantages.apspent.spentonmagicdisadvantages",
//            string,
//          ),
//     advantagesdisadvantages_apspent_spentonblesseddisadvantages:
//       json
//       |> field(
//            "advantagesdisadvantages.apspent.spentonblesseddisadvantages",
//            string,
//          ),
//     advantagesdisadvantages_dialogs_customcost_title:
//       json
//       |> field("advantagesdisadvantages.dialogs.customcost.title", string),
//     advantagesdisadvantages_dialogs_customcost_for:
//       json |> field("advantagesdisadvantages.dialogs.customcost.for", string),
//     specialabilities_addbtn: json |> field("specialabilities.addbtn", string),
//     specialabilities_header_name:
//       json |> field("specialabilities.header.name", string),
//     specialabilities_header_group:
//       json |> field("specialabilities.header.group", string),
//     specialabilities_header_adventurepoints:
//       json |> field("specialabilities.header.adventurepoints", string),
//     specialabilities_header_adventurepoints_tooltip:
//       json |> field("specialabilities.header.adventurepoints.tooltip", string),
//     specialabilities_nativetonguelevel:
//       json |> field("specialabilities.nativetonguelevel", string),

//     inlinewiki_rule: json |> field("inlinewiki.rule", string),
//     inlinewiki_effect: json |> field("inlinewiki.effect", string),
//     inlinewiki_extendedcombatspecialabilities:
//       json |> field("inlinewiki.extendedcombatspecialabilities", string),
//     inlinewiki_extendedmagicalspecialabilities:
//       json |> field("inlinewiki.extendedmagicalspecialabilities", string),
//     inlinewiki_extendedblessedspecialabilities:
//       json |> field("inlinewiki.extendedblessedspecialabilities", string),
//     inlinewiki_extendedskillspecialabilities:
//       json |> field("inlinewiki.extendedskillspecialabilities", string),
//     inlinewiki_penalty: json |> field("inlinewiki.penalty", string),
//     inlinewiki_level: json |> field("inlinewiki.level", string),
//     inlinewiki_perlevel: json |> field("inlinewiki.perlevel", string),
//     inlinewiki_volume: json |> field("inlinewiki.volume", string),
//     inlinewiki_aspect: json |> field("inlinewiki.aspect", string),
//     inlinewiki_bindingcost: json |> field("inlinewiki.bindingcost", string),
//     inlinewiki_protectivecircle:
//       json |> field("inlinewiki.protectivecircle", string),
//     inlinewiki_wardingcircle:
//       json |> field("inlinewiki.wardingcircle", string),
//     inlinewiki_actions: json |> field("inlinewiki.actions", string),
//     inlinewiki_racecultureorprofessionrequiresautomaticorsuggested:
//       json
//       |> field(
//            "inlinewiki.racecultureorprofessionrequiresautomaticorsuggested",
//            string,
//          ),
//     inlinewiki_advantage: json |> field("inlinewiki.advantage", string),
//     inlinewiki_disadvantage: json |> field("inlinewiki.disadvantage", string),
//     inlinewiki_primaryattributeofthetradition:
//       json |> field("inlinewiki.primaryattributeofthetradition", string),
//     inlinewiki_knowledgeofspell:
//       json |> field("inlinewiki.knowledgeofspell", string),
//     inlinewiki_knowledgeofliturgicalchant:
//       json |> field("inlinewiki.knowledgeofliturgicalchant", string),
//     inlinewiki_appropriatecombatstylespecialability:
//       json |> field("inlinewiki.appropriatecombatstylespecialability", string),
//     inlinewiki_appropriatemagicalstylespecialability:
//       json
//       |> field("inlinewiki.appropriatemagicalstylespecialability", string),
//     inlinewiki_appropriateblessedstylespecialability:
//       json
//       |> field("inlinewiki.appropriateblessedstylespecialability", string),
//     inlinewiki_appropriateskillstylespecialability:
//       json |> field("inlinewiki.appropriateskillstylespecialability", string),
//     inlinewiki_sex: json |> field("inlinewiki.sex", string),
//     inlinewiki_sex_male: json |> field("inlinewiki.sex.male", string),
//     inlinewiki_sex_female: json |> field("inlinewiki.sex.female", string),
//     inlinewiki_combattechniques_groups_all:
//       json |> field("inlinewiki.combattechniques.groups.all", string),
//     inlinewiki_combattechniques_groups_allmeleecombattechniques:
//       json
//       |> field(
//            "inlinewiki.combattechniques.groups.allmeleecombattechniques",
//            string,
//          ),
//     inlinewiki_combattechniques_groups_allrangedcombattechniques:
//       json
//       |> field(
//            "inlinewiki.combattechniques.groups.allrangedcombattechniques",
//            string,
//          ),
//     inlinewiki_combattechniques_groups_allmeleecombattechniqueswithparry:
//       json
//       |> field(
//            "inlinewiki.combattechniques.groups.allmeleecombattechniqueswithparry",
//            string,
//          ),
//     inlinewiki_combattechniques_groups_allmeleecombattechniquesforonehandedweapons:
//       json
//       |> field(
//            "inlinewiki.combattechniques.groups.allmeleecombattechniquesforonehandedweapons",
//            string,
//          ),

//     inlinewiki_socialstatusxorhigher:
//       json |> field("inlinewiki.socialstatusxorhigher", string),

//     skills_commonskills: json |> field("skills.commonskills", string),
//     skills_header_name: json |> field("skills.header.name", string),
//     skills_header_skillrating:
//       json |> field("skills.header.skillrating", string),
//     skills_header_skillrating_tooltip:
//       json |> field("skills.header.skillrating.tooltip", string),
//     skills_header_group: json |> field("skills.header.group", string),
//     skills_header_check: json |> field("skills.header.check", string),
//     skills_header_improvementcost:
//       json |> field("skills.header.improvementcost", string),
//     skills_header_improvementcost_tooltip:
//       json |> field("skills.header.improvementcost.tooltip", string),

//     inlinewiki_check: json |> field("inlinewiki.check", string),
//     inlinewiki_newapplications:
//       json |> field("inlinewiki.newapplications", string),
//     inlinewiki_applications: json |> field("inlinewiki.applications", string),
//     inlinewiki_uses: json |> field("inlinewiki.uses", string),
//     inlinewiki_encumbrance: json |> field("inlinewiki.encumbrance", string),
//     inlinewiki_encumbrance_yes:
//       json |> field("inlinewiki.encumbrance.yes", string),
//     inlinewiki_encumbrance_no:
//       json |> field("inlinewiki.encumbrance.no", string),
//     inlinewiki_encumbrance_maybe:
//       json |> field("inlinewiki.encumbrance.maybe", string),
//     inlinewiki_tools: json |> field("inlinewiki.tools", string),
//     inlinewiki_quality: json |> field("inlinewiki.quality", string),
//     inlinewiki_failedcheck: json |> field("inlinewiki.failedcheck", string),
//     inlinewiki_criticalsuccess:
//       json |> field("inlinewiki.criticalsuccess", string),
//     inlinewiki_botch: json |> field("inlinewiki.botch", string),
//     inlinewiki_improvementcost:
//       json |> field("inlinewiki.improvementcost", string),

//     showfrequency_stronglyrecommended:
//       json |> field("showfrequency.stronglyrecommended", string),
//     showfrequency_common: json |> field("showfrequency.common", string),
//     showfrequency_uncommon: json |> field("showfrequency.uncommon", string),
//     showfrequency_unfamiliarspells:
//       json |> field("showfrequency.unfamiliarspells", string),

//     combattechniques_header_name:
//       json |> field("combattechniques.header.name", string),
//     combattechniques_header_group:
//       json |> field("combattechniques.header.group", string),
//     combattechniques_header_combattechniquerating:
//       json |> field("combattechniques.header.combattechniquerating", string),
//     combattechniques_header_combattechniquerating_tooltip:
//       json
//       |> field(
//            "combattechniques.header.combattechniquerating.tooltip",
//            string,
//          ),
//     combattechniques_header_improvementcost:
//       json |> field("combattechniques.header.improvementcost", string),
//     combattechniques_header_improvementcost_tooltip:
//       json |> field("combattechniques.header.improvementcost.tooltip", string),
//     combattechniques_header_primaryattribute:
//       json |> field("combattechniques.header.primaryattribute", string),
//     combattechniques_header_primaryattribute_tooltip:
//       json
//       |> field("combattechniques.header.primaryattribute.tooltip", string),
//     combattechniques_header_attack:
//       json |> field("combattechniques.header.attack", string),
//     combattechniques_header_attack_tooltip:
//       json |> field("combattechniques.header.attack.tooltip", string),
//     combattechniques_header_parry:
//       json |> field("combattechniques.header.parry", string),
//     combattechniques_header_parry_tooltip:
//       json |> field("combattechniques.header.parry.tooltip", string),

//     inlinewiki_special: json |> field("inlinewiki.special", string),
//     inlinewiki_primaryattribute:
//       json |> field("inlinewiki.primaryattribute", string),

//     spells_addbtn: json |> field("spells.addbtn", string),
//     spells_header_name: json |> field("spells.header.name", string),
//     spells_header_property: json |> field("spells.header.property", string),
//     spells_header_group: json |> field("spells.header.group", string),
//     spells_header_skillrating:
//       json |> field("spells.header.skillrating", string),
//     spells_header_skillrating_tooltip:
//       json |> field("spells.header.skillrating.tooltip", string),
//     spells_header_check: json |> field("spells.header.check", string),
//     spells_header_checkmodifier:
//       json |> field("spells.header.checkmodifier", string),
//     spells_header_checkmodifier_tooltip:
//       json |> field("spells.header.checkmodifier.tooltip", string),
//     spells_header_improvementcost:
//       json |> field("spells.header.improvementcost", string),
//     spells_header_improvementcost_tooltip:
//       json |> field("spells.header.improvementcost.tooltip", string),
//     spells_groups_cantrip: json |> field("spells.groups.cantrip", string),
//     spells_traditions_general:
//       json |> field("spells.traditions.general", string),
//     magicalactions_animistforces_tribes_general:
//       json |> field("magicalactions.animistforces.tribes.general", string),

//     inlinewiki_castingtime: json |> field("inlinewiki.castingtime", string),
//     inlinewiki_ritualtime: json |> field("inlinewiki.ritualtime", string),
//     inlinewiki_aecost: json |> field("inlinewiki.aecost", string),
//     inlinewiki_range: json |> field("inlinewiki.range", string),
//     inlinewiki_duration: json |> field("inlinewiki.duration", string),
//     inlinewiki_targetcategory:
//       json |> field("inlinewiki.targetcategory", string),
//     inlinewiki_property: json |> field("inlinewiki.property", string),
//     inlinewiki_traditions: json |> field("inlinewiki.traditions", string),
//     inlinewiki_skill: json |> field("inlinewiki.skill", string),
//     inlinewiki_lengthoftime: json |> field("inlinewiki.lengthoftime", string),
//     inlinewiki_musictradition:
//       json |> field("inlinewiki.musictradition", string),
//     inlinewiki_youcannotuseamodificationonthisspellscastingtime:
//       json
//       |> field(
//            "inlinewiki.youcannotuseamodificationonthisspellscastingtime",
//            string,
//          ),
//     inlinewiki_youcannotuseamodificationonthisspellsritualtime:
//       json
//       |> field(
//            "inlinewiki.youcannotuseamodificationonthisspellsritualtime",
//            string,
//          ),
//     inlinewiki_youcannotuseamodificationonthisspellscost:
//       json
//       |> field("inlinewiki.youcannotuseamodificationonthisspellscost", string),
//     inlinewiki_youcannotuseamodificationonthisspellsrange:
//       json
//       |> field(
//            "inlinewiki.youcannotuseamodificationonthisspellsrange",
//            string,
//          ),
//     inlinewiki_youcannotuseamodificationonthisspellsduration:
//       json
//       |> field(
//            "inlinewiki.youcannotuseamodificationonthisspellsduration",
//            string,
//          ),
//     inlinewiki_spellenhancements:
//       json |> field("inlinewiki.spellenhancements", string),
//     inlinewiki_spellenhancements_title:
//       json |> field("inlinewiki.spellenhancements.title", string),
//     inlinewiki_tribaltraditions:
//       json |> field("inlinewiki.tribaltraditions", string),
//     inlinewiki_brew: json |> field("inlinewiki.brew", string),
//     inlinewiki_spirithalf: json |> field("inlinewiki.spirithalf", string),
//     inlinewiki_spirithalf_short:
//       json |> field("inlinewiki.spirithalf.short", string),
//     inlinewiki_spiritortoughness:
//       json |> field("inlinewiki.spiritortoughness", string),
//     inlinewiki_spiritortoughness_short:
//       json |> field("inlinewiki.spiritortoughness.short", string),
//     inlinewiki_note: json |> field("inlinewiki.note", string),

//     liturgicalchants_addbtn: json |> field("liturgicalchants.addbtn", string),
//     liturgicalchants_header_name:
//       json |> field("liturgicalchants.header.name", string),
//     liturgicalchants_header_traditions:
//       json |> field("liturgicalchants.header.traditions", string),
//     liturgicalchants_header_group:
//       json |> field("liturgicalchants.header.group", string),
//     liturgicalchants_header_skillrating:
//       json |> field("liturgicalchants.header.skillrating", string),
//     liturgicalchants_header_skillrating_tooltip:
//       json |> field("liturgicalchants.header.skillrating.tooltip", string),
//     liturgicalchants_header_check:
//       json |> field("liturgicalchants.header.check", string),
//     liturgicalchants_header_checkmodifier:
//       json |> field("liturgicalchants.header.checkmodifier", string),
//     liturgicalchants_header_checkmodifier_tooltip:
//       json |> field("liturgicalchants.header.checkmodifier.tooltip", string),
//     liturgicalchants_header_improvementcost:
//       json |> field("liturgicalchants.header.improvementcost", string),
//     liturgicalchants_header_improvementcost_tooltip:
//       json |> field("liturgicalchants.header.improvementcost.tooltip", string),
//     liturgicalchants_groups_blessing:
//       json |> field("liturgicalchants.groups.blessing", string),
//     liturgicalchants_aspects_general:
//       json |> field("liturgicalchants.aspects.general", string),

//     inlinewiki_liturgicaltime:
//       json |> field("inlinewiki.liturgicaltime", string),
//     inlinewiki_ceremonialtime:
//       json |> field("inlinewiki.ceremonialtime", string),
//     inlinewiki_kpcost: json |> field("inlinewiki.kpcost", string),
//     inlinewiki_youcannotuseamodificationonthischantsliturgicaltime:
//       json
//       |> field(
//            "inlinewiki.youcannotuseamodificationonthischantsliturgicaltime",
//            string,
//          ),
//     inlinewiki_youcannotuseamodificationonthischantsceremonialtime:
//       json
//       |> field(
//            "inlinewiki.youcannotuseamodificationonthischantsceremonialtime",
//            string,
//          ),
//     inlinewiki_youcannotuseamodificationonthischantscost:
//       json
//       |> field("inlinewiki.youcannotuseamodificationonthischantscost", string),
//     inlinewiki_youcannotuseamodificationonthischantsrange:
//       json
//       |> field(
//            "inlinewiki.youcannotuseamodificationonthischantsrange",
//            string,
//          ),
//     inlinewiki_youcannotuseamodificationonthischantsduration:
//       json
//       |> field(
//            "inlinewiki.youcannotuseamodificationonthischantsduration",
//            string,
//          ),
//     inlinewiki_liturgicalchantenhancements:
//       json |> field("inlinewiki.liturgicalchantenhancements", string),
//     inlinewiki_liturgicalchantenhancements_title:
//       json |> field("inlinewiki.liturgicalchantenhancements.title", string),

//     equipment_header_name: json |> field("equipment.header.name", string),
//     equipment_header_group: json |> field("equipment.header.group", string),
//     equipment_addbtn: json |> field("equipment.addbtn", string),
//     equipment_createbtn: json |> field("equipment.createbtn", string),
//     equipment_filters_allcombattechniques:
//       json |> field("equipment.filters.allcombattechniques", string),

//     equipment_purse_title: json |> field("equipment.purse.title", string),
//     equipment_purse_ducats: json |> field("equipment.purse.ducats", string),
//     equipment_purse_silverthalers:
//       json |> field("equipment.purse.silverthalers", string),
//     equipment_purse_halers: json |> field("equipment.purse.halers", string),
//     equipment_purse_kreutzers:
//       json |> field("equipment.purse.kreutzers", string),
//     equipment_purse_carryingcapacity:
//       json |> field("equipment.purse.carryingcapacity", string),
//     equipment_purse_initialstartingwealthandcarryingcapacity:
//       json
//       |> field(
//            "equipment.purse.initialstartingwealthandcarryingcapacity",
//            string,
//          ),

//     equipment_dialogs_addedit_damage:
//       json |> field("equipment.dialogs.addedit.damage", string),
//     equipment_dialogs_addedit_length:
//       json |> field("equipment.dialogs.addedit.length", string),
//     equipment_dialogs_addedit_range:
//       json |> field("equipment.dialogs.addedit.range", string),
//     equipment_dialogs_addedit_edititem:
//       json |> field("equipment.dialogs.addedit.edititem", string),
//     equipment_dialogs_addedit_createitem:
//       json |> field("equipment.dialogs.addedit.createitem", string),
//     equipment_dialogs_addedit_number:
//       json |> field("equipment.dialogs.addedit.number", string),
//     equipment_dialogs_addedit_name:
//       json |> field("equipment.dialogs.addedit.name", string),
//     equipment_dialogs_addedit_price:
//       json |> field("equipment.dialogs.addedit.price", string),
//     equipment_dialogs_addedit_weight:
//       json |> field("equipment.dialogs.addedit.weight", string),
//     equipment_dialogs_addedit_carriedwhere:
//       json |> field("equipment.dialogs.addedit.carriedwhere", string),
//     equipment_dialogs_addedit_itemgroup:
//       json |> field("equipment.dialogs.addedit.itemgroup", string),
//     equipment_dialogs_addedit_itemgrouphint:
//       json |> field("equipment.dialogs.addedit.itemgrouphint", string),
//     equipment_dialogs_addedit_improvisedweapon:
//       json |> field("equipment.dialogs.addedit.improvisedweapon", string),
//     equipment_dialogs_addedit_improvisedweapongroup:
//       json |> field("equipment.dialogs.addedit.improvisedweapongroup", string),
//     equipment_dialogs_addedit_template:
//       json |> field("equipment.dialogs.addedit.template", string),
//     equipment_dialogs_addedit_combattechnique:
//       json |> field("equipment.dialogs.addedit.combattechnique", string),
//     equipment_dialogs_addedit_primaryattributeanddamagethreshold:
//       json
//       |> field(
//            "equipment.dialogs.addedit.primaryattributeanddamagethreshold",
//            string,
//          ),
//     equipment_dialogs_addedit_primaryattribute:
//       json |> field("equipment.dialogs.addedit.primaryattribute", string),
//     equipment_dialogs_addedit_primaryattribute_short:
//       json
//       |> field("equipment.dialogs.addedit.primaryattribute.short", string),
//     equipment_dialogs_addedit_damagethreshold:
//       json |> field("equipment.dialogs.addedit.damagethreshold", string),
//     equipment_dialogs_addedit_separatedamagethresholds:
//       json
//       |> field("equipment.dialogs.addedit.separatedamagethresholds", string),
//     equipment_dialogs_addedit_breakingpointratingmodifier:
//       json
//       |> field(
//            "equipment.dialogs.addedit.breakingpointratingmodifier",
//            string,
//          ),
//     equipment_dialogs_addedit_damaged:
//       json |> field("equipment.dialogs.addedit.damaged", string),
//     equipment_dialogs_addedit_reach:
//       json |> field("equipment.dialogs.addedit.reach", string),
//     equipment_dialogs_addedit_attackparrymodifier:
//       json |> field("equipment.dialogs.addedit.attackparrymodifier", string),
//     equipment_dialogs_addedit_structurepoints:
//       json |> field("equipment.dialogs.addedit.structurepoints", string),
//     equipment_dialogs_addedit_lengthwithunit:
//       json |> field("equipment.dialogs.addedit.lengthwithunit", string),
//     equipment_dialogs_addedit_parryingweapon:
//       json |> field("equipment.dialogs.addedit.parryingweapon", string),
//     equipment_dialogs_addedit_twohandedweapon:
//       json |> field("equipment.dialogs.addedit.twohandedweapon", string),
//     equipment_dialogs_addedit_reloadtime:
//       json |> field("equipment.dialogs.addedit.reloadtime", string),
//     equipment_dialogs_addedit_rangeclose:
//       json |> field("equipment.dialogs.addedit.rangeclose", string),
//     equipment_dialogs_addedit_rangemedium:
//       json |> field("equipment.dialogs.addedit.rangemedium", string),
//     equipment_dialogs_addedit_rangefar:
//       json |> field("equipment.dialogs.addedit.rangefar", string),
//     equipment_dialogs_addedit_ammunition:
//       json |> field("equipment.dialogs.addedit.ammunition", string),
//     equipment_dialogs_addedit_protection:
//       json |> field("equipment.dialogs.addedit.protection", string),
//     equipment_dialogs_addedit_encumbrance:
//       json |> field("equipment.dialogs.addedit.encumbrance", string),
//     equipment_dialogs_addedit_armortype:
//       json |> field("equipment.dialogs.addedit.armortype", string),
//     equipment_dialogs_addedit_sturdinessmodifier:
//       json |> field("equipment.dialogs.addedit.sturdinessmodifier", string),
//     equipment_dialogs_addedit_wear:
//       json |> field("equipment.dialogs.addedit.wear", string),
//     equipment_dialogs_addedit_hitzonearmoronly:
//       json |> field("equipment.dialogs.addedit.hitzonearmoronly", string),
//     equipment_dialogs_addedit_movementmodifier:
//       json |> field("equipment.dialogs.addedit.movementmodifier", string),
//     equipment_dialogs_addedit_initiativemodifier:
//       json |> field("equipment.dialogs.addedit.initiativemodifier", string),
//     equipment_dialogs_addedit_additionalpenalties:
//       json |> field("equipment.dialogs.addedit.additionalpenalties", string),

//     hitzonearmors_header_name:
//       json |> field("hitzonearmors.header.name", string),
//     hitzonearmors_createbtn: json |> field("hitzonearmors.createbtn", string),
//     hitzonearmors_dialogs_addedit_name:
//       json |> field("hitzonearmors.dialogs.addedit.name", string),
//     hitzonearmors_dialogs_addedit_edithitzonearmor:
//       json |> field("hitzonearmors.dialogs.addedit.edithitzonearmor", string),
//     hitzonearmors_dialogs_addedit_createhitzonearmor:
//       json
//       |> field("hitzonearmors.dialogs.addedit.createhitzonearmor", string),
//     hitzonearmors_dialogs_addedit_head:
//       json |> field("hitzonearmors.dialogs.addedit.head", string),
//     hitzonearmors_dialogs_addedit_torso:
//       json |> field("hitzonearmors.dialogs.addedit.torso", string),
//     hitzonearmors_dialogs_addedit_leftarm:
//       json |> field("hitzonearmors.dialogs.addedit.leftarm", string),
//     hitzonearmors_dialogs_addedit_rightarm:
//       json |> field("hitzonearmors.dialogs.addedit.rightarm", string),
//     hitzonearmors_dialogs_addedit_leftleg:
//       json |> field("hitzonearmors.dialogs.addedit.leftleg", string),
//     hitzonearmors_dialogs_addedit_rightleg:
//       json |> field("hitzonearmors.dialogs.addedit.rightleg", string),
//     hitzonearmors_dialogs_addedit_wear:
//       json |> field("hitzonearmors.dialogs.addedit.wear", string),

//     inlinewiki_equipment_weight:
//       json |> field("inlinewiki.equipment.weight", string),
//     inlinewiki_equipment_price:
//       json |> field("inlinewiki.equipment.price", string),
//     inlinewiki_equipment_ammunition:
//       json |> field("inlinewiki.equipment.ammunition", string),
//     inlinewiki_equipment_combattechnique:
//       json |> field("inlinewiki.equipment.combattechnique", string),
//     inlinewiki_equipment_damage:
//       json |> field("inlinewiki.equipment.damage", string),
//     inlinewiki_equipment_primaryattributeanddamagethreshold:
//       json
//       |> field(
//            "inlinewiki.equipment.primaryattributeanddamagethreshold",
//            string,
//          ),
//     inlinewiki_equipment_attackparrymodifier:
//       json |> field("inlinewiki.equipment.attackparrymodifier", string),
//     inlinewiki_equipment_reach:
//       json |> field("inlinewiki.equipment.reach", string),
//     inlinewiki_equipment_length:
//       json |> field("inlinewiki.equipment.length", string),
//     inlinewiki_equipment_reloadtime:
//       json |> field("inlinewiki.equipment.reloadtime", string),
//     inlinewiki_equipment_range:
//       json |> field("inlinewiki.equipment.range", string),

//     inlinewiki_equipment_actionsvalue:
//       json |> field("inlinewiki.equipment.actionsvalue", string),
//     inlinewiki_equipment_protection:
//       json |> field("inlinewiki.equipment.protection", string),
//     inlinewiki_equipment_encumbrance:
//       json |> field("inlinewiki.equipment.encumbrance", string),
//     inlinewiki_equipment_additionalpenalties:
//       json |> field("inlinewiki.equipment.additionalpenalties", string),
//     inlinewiki_equipment_note:
//       json |> field("inlinewiki.equipment.note", string),
//     inlinewiki_equipment_rules:
//       json |> field("inlinewiki.equipment.rules", string),
//     inlinewiki_equipment_weaponadvantage:
//       json |> field("inlinewiki.equipment.weaponadvantage", string),
//     inlinewiki_equipment_weapondisadvantage:
//       json |> field("inlinewiki.equipment.weapondisadvantage", string),
//     inlinewiki_equipment_armoradvantage:
//       json |> field("inlinewiki.equipment.armoradvantage", string),
//     inlinewiki_equipment_armordisadvantage:
//       json |> field("inlinewiki.equipment.armordisadvantage", string),

//     pets_dialogs_addedit_deleteavatarbtn:
//       json |> field("pets.dialogs.addedit.deleteavatarbtn", string),
//     pets_dialogs_addedit_name:
//       json |> field("pets.dialogs.addedit.name", string),
//     pets_dialogs_addedit_sizecategory:
//       json |> field("pets.dialogs.addedit.sizecategory", string),
//     pets_dialogs_addedit_type:
//       json |> field("pets.dialogs.addedit.type", string),
//     pets_dialogs_addedit_apspent:
//       json |> field("pets.dialogs.addedit.apspent", string),
//     pets_dialogs_addedit_totalap:
//       json |> field("pets.dialogs.addedit.totalap", string),
//     pets_dialogs_addedit_protection:
//       json |> field("pets.dialogs.addedit.protection", string),
//     pets_dialogs_addedit_attackname:
//       json |> field("pets.dialogs.addedit.attackname", string),
//     pets_dialogs_addedit_attack:
//       json |> field("pets.dialogs.addedit.attack", string),
//     pets_dialogs_addedit_parry:
//       json |> field("pets.dialogs.addedit.parry", string),
//     pets_dialogs_addedit_damagepoints:
//       json |> field("pets.dialogs.addedit.damagepoints", string),
//     pets_dialogs_addedit_reach:
//       json |> field("pets.dialogs.addedit.reach", string),
//     pets_dialogs_addedit_actions:
//       json |> field("pets.dialogs.addedit.actions", string),
//     pets_dialogs_addedit_skills:
//       json |> field("pets.dialogs.addedit.skills", string),
//     pets_dialogs_addedit_specialabilities:
//       json |> field("pets.dialogs.addedit.specialabilities", string),
//     pets_dialogs_addedit_notes:
//       json |> field("pets.dialogs.addedit.notes", string),
//     pets_dialogs_addedit_addbtn:
//       json |> field("pets.dialogs.addedit.addbtn", string),
//     pets_dialogs_addedit_savebtn:
//       json |> field("pets.dialogs.addedit.savebtn", string),
//   };
// };
