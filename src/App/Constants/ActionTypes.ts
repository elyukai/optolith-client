export enum ActionTypes {
  SET_LOCALE = "SET_LOCALE",

  RECEIVE_DATA_TABLES = "RECEIVE_DATA_TABLES",

  SET_SECTION = "SET_SECTION",
  SET_TAB = "SET_TAB",

  RECEIVE_IMPORTED_HERO = "RECEIVE_IMPORTED_HERO",
  RECEIVE_INITIAL_DATA = "RECEIVE_INITIAL_DATA",

  SET_UPDATE_DOWNLOAD_PROGRESS = "SET_UPDATE_DOWNLOAD_PROGRESS",

  REQUEST_LOGIN = "REQUEST_LOGIN",
  RECEIVE_LOGIN = "RECEIVE_LOGIN",
  REQUEST_LOGOUT = "REQUEST_LOGOUT",
  RECEIVE_LOGOUT = "RECEIVE_LOGOUT",
  REQUEST_REGISTRATION = "REQUEST_REGISTRATION",
  RECEIVE_REGISTRATION = "RECEIVE_REGISTRATION",
  REQUEST_NEW_USERNAME = "REQUEST_NEW_USERNAME",
  RECEIVE_NEW_USERNAME = "RECEIVE_NEW_USERNAME",
  REQUEST_USER_DELETION = "REQUEST_USER_DELETION",
  RECEIVE_USER_DELETION = "RECEIVE_USER_DELETION",
  REQUEST_PASSWORD_RESET = "REQUEST_PASSWORD_RESET",
  RECEIVE_PASSWORD_RESET = "RECEIVE_PASSWORD_RESET",
  REQUEST_USERNAME = "REQUEST_USERNAME",
  RECEIVE_USERNAME = "RECEIVE_USERNAME",
  REQUEST_ACCOUNT_ACTIVATION_EMAIL = "REQUEST_ACCOUNT_ACTIVATION_EMAIL",
  RECEIVE_ACCOUNT_ACTIVATION_EMAIL = "RECEIVE_ACCOUNT_ACTIVATION_EMAIL",
  REQUEST_NEW_DISPLAY_NAME = "REQUEST_NEW_DISPLAY_NAME",
  RECEIVE_NEW_DISPLAY_NAME = "RECEIVE_NEW_DISPLAY_NAME",
  REQUEST_NEW_PASSWORD = "REQUEST_NEW_PASSWORD",
  RECEIVE_NEW_PASSWORD = "RECEIVE_NEW_PASSWORD",
  REQUEST_HERO_SAVE = "REQUEST_HERO_SAVE",
  RECEIVE_HERO_SAVE = "RECEIVE_HERO_SAVE",
  REQUEST_FAILED = "REQUEST_FAILED",

  SET_HEROLIST_VISIBILITY_FILTER = "SET_HEROLIST_VISIBILITY_FILTER",
  SET_HEROLIST_SORT_ORDER = "SET_HEROLIST_SORT_ORDER",
  SET_HEROLIST_FILTER_TEXT = "SET_HEROLIST_FILTER_TEXT",
  REQUEST_HEROLIST = "REQUEST_HEROLIST",
  RECEIVE_HEROLIST = "RECEIVE_HEROLIST",
  CREATE_HERO = "CREATE_HERO",
  SAVE_HERO = "SAVE_HERO",
  DELETE_HERO = "DELETE_HERO",
  IMPORT_HERO = "IMPORT_HERO",
  LOAD_HERO = "LOAD_HERO",
  DUPLICATE_HERO = "DUPLICATE_HERO",

  SET_WIKI_FILTER = "SET_WIKI_FILTER",
  SET_WIKI_FILTER_ALL = "SET_WIKI_FILTER_ALL",
  SET_WIKI_CATEGORY_1 = "SET_WIKI_CATEGORY_1",
  SET_WIKI_CATEGORY_2 = "SET_WIKI_CATEGORY_2",
  SET_WIKI_PROFESSIONS_GROUP = "SET_WIKI_PROFESSIONS_GROUP",
  SET_WIKI_SKILLS_GROUP = "SET_WIKI_SKILLS_GROUP",
  SET_WIKI_COMBAT_TECHNIQUES_GROUP = "SET_WIKI_COMBAT_TECHNIQUES_GROUP",
  SET_WIKI_SPECIAL_ABILITIES_GROUP = "SET_WIKI_SPECIAL_ABILITIES_GROUP",
  SET_WIKI_SPELLS_GROUP = "SET_WIKI_SPELLS_GROUP",
  SET_WIKI_LITURGICAL_CHANTS_GROUP = "SET_WIKI_LITURGICAL_CHANTS_GROUP",
  SET_WIKI_ITEM_TEMPLATES_GROUP = "SET_WIKI_ITEM_TEMPLATES_GROUP",

  UNDO = "UNDO",
  REDO = "REDO",

  REQUEST_HERO_DATA = "REQUEST_HERO_DATA",
  RECEIVE_HERO_DATA = "RECEIVE_HERO_DATA",
  REQUEST_HERO_AVATAR = "REQUEST_HERO_AVATAR",
  RECEIVE_HERO_AVATAR = "RECEIVE_HERO_AVATAR",
  SET_HERO_AVATAR = "SET_HERO_AVATAR",

  OPEN_EDIT_PERMANENT_ENERGY = "OPEN_EDIT_PERMANENT_ENERGY",
  CLOSE_EDIT_PERMANENT_ENERGY = "CLOSE_EDIT_PERMANENT_ENERGY",
  OPEN_ADD_PERMANENT_ENERGY_LOSS = "OPEN_ADD_PERMANENT_ENERGY_LOSS",
  CLOSE_ADD_PERMANENT_ENERGY_LOSS = "CLOSE_ADD_PERMANENT_ENERGY_LOSS",
  OPEN_CHARACTER_CREATOR = "OPEN_CHARACTER_CREATOR",
  CLOSE_CHARACTER_CREATOR = "CLOSE_CHARACTER_CREATOR",
  OPEN_SETTINGS = "OPEN_SETTINGS",
  CLOSE_SETTINGS = "CLOSE_SETTINGS",
  OPEN_ADD_ADVENTURE_POINTS = "OPEN_ADD_ADVENTURE_POINTS",
  CLOSE_ADD_ADVENTURE_POINTS = "CLOSE_ADD_ADVENTURE_POINTS",
  OPEN_EDIT_CHARACTER_AVATAR = "OPEN_EDIT_CHARACTER_AVATAR",
  CLOSE_EDIT_CHARACTER_AVATAR = "CLOSE_EDIT_CHARACTER_AVATAR",
  OPEN_EDIT_PET_AVATAR = "OPEN_EDIT_PET_AVATAR",
  CLOSE_EDIT_PET_AVATAR = "CLOSE_EDIT_PET_AVATAR",

  SET_HIGHER_PARADE_VALUES = "SET_HIGHER_PARADE_VALUES",
  SWITCH_ATTRIBUTE_VALUE_LIMIT = "SWITCH_ATTRIBUTE_VALUE_LIMIT",
  SWITCH_ENABLE_ALL_RULE_BOOKS = "SWITCH_ENABLE_ALL_RULE_BOOKS",
  SWITCH_ENABLE_RULE_BOOK = "SWITCH_ENABLE_RULE_BOOK",
  SWITCH_ENABLE_LANGUAGE_SPECIALIZATIONS = "SWITCH_ENABLE_LANGUAGE_SPECIALIZATIONS",

  SELECT_RACE = "SELECT_RACE",
  SET_RACES_SORT_ORDER = "SET_RACES_SORT_ORDER",
  SWITCH_RACE_VALUE_VISIBILITY = "SWITCH_RACE_VALUE_VISIBILITY",
  SET_RACE_VARIANT = "SET_RACE_VARIANT",

  SELECT_CULTURE = "SELECT_CULTURE",
  SET_CULTURES_SORT_ORDER = "SET_CULTURES_SORT_ORDER",
  SET_CULTURES_VISIBILITY_FILTER = "SET_CULTURES_VISIBILITY_FILTER",
  SWITCH_CULTURE_VALUE_VISIBILITY = "SWITCH_CULTURE_VALUE_VISIBILITY",

  SELECT_PROFESSION = "SELECT_PROFESSION",
  SET_PROFESSIONS_SORT_ORDER = "SET_PROFESSIONS_SORT_ORDER",
  SET_PROFESSIONS_VISIBILITY_FILTER = "SET_PROFESSIONS_VISIBILITY_FILTER",
  SET_PROFESSIONS_GROUP_VISIBILITY_FILTER = "SET_PROFESSIONS_GROUP_VISIBILITY_FILTER",
  SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER = "SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER",
  ASSIGN_RCP_OPTIONS = "ASSIGN_RCP_OPTIONS",
  SELECT_PROFESSION_VARIANT = "SELECT_PROFESSION_VARIANT",

  SET_HERO_NAME = "SET_HERO_NAME",
  SET_CUSTOM_PROFESSION_NAME = "SET_CUSTOM_PROFESSION_NAME",
  SET_FAMILY = "SET_FAMILY",
  SET_PLACEOFBIRTH = "SET_PLACEOFBIRTH",
  SET_DATEOFBIRTH = "SET_DATEOFBIRTH",
  SET_AGE = "SET_AGE",
  SET_HAIRCOLOR = "SET_HAIRCOLOR",
  SET_EYECOLOR = "SET_EYECOLOR",
  SET_SIZE = "SET_SIZE",
  SET_WEIGHT = "SET_WEIGHT",
  SET_TITLE = "SET_TITLE",
  SET_SOCIALSTATUS = "SET_SOCIALSTATUS",
  SET_CHARACTERISTICS = "SET_CHARACTERISTICS",
  SET_OTHERINFO = "SET_OTHERINFO",
  SET_CULTURE_AREA_KNOWLEDGE = "SET_CULTURE_AREA_KNOWLEDGE",
  ADD_ADVENTURE_POINTS = "ADD_ADVENTURE_POINTS",
  END_HERO_CREATION = "END_HERO_CREATION",

  SET_PACT_CATEGORY = "SET_PACT_CATEGORY",
  SET_PACT_LEVEL = "SET_PACT_LEVEL",
  SET_TARGET_TYPE = "SET_TARGET_TYPE",
  SET_TARGET_DOMAIN = "SET_TARGET_DOMAIN",
  SET_TARGET_NAME = "SET_TARGET_NAME",

  ADD_ATTRIBUTE_POINT = "ADD_ATTRIBUTE_POINT",
  REMOVE_ATTRIBUTE_POINT = "REMOVE_ATTRIBUTE_POINT",
  ADD_LIFE_POINT = "ADD_LIFE_POINT",
  ADD_ARCANE_ENERGY_POINT = "ADD_ARCANE_ENERGY_POINT",
  ADD_KARMA_POINT = "ADD_KARMA_POINT",
  REMOVE_LIFE_POINT = "REMOVE_LIFE_POINT",
  REMOVE_ARCANE_ENERGY_POINT = "REMOVE_ARCANE_ENERGY_POINT",
  REMOVE_KARMA_POINT = "REMOVE_KARMA_POINT",
  ADD_LOST_LP_POINT = "ADD_LOST_LP_POINT",
  REMOVE_LOST_LP_POINT = "REMOVE_LOST_LP_POINT",
  ADD_LOST_LP_POINTS = "ADD_LOST_LP_POINTS",
  ADD_BOUGHT_BACK_AE_POINT = "ADD_BOUGHT_BACK_AE_POINT",
  REMOVE_BOUGHT_BACK_AE_POINT = "REMOVE_BOUGHT_BACK_AE_POINT",
  ADD_LOST_AE_POINT = "ADD_LOST_AE_POINT",
  REMOVE_LOST_AE_POINT = "REMOVE_LOST_AE_POINT",
  ADD_LOST_AE_POINTS = "ADD_LOST_AE_POINTS",
  ADD_BOUGHT_BACK_KP_POINT = "ADD_BOUGHT_BACK_KP_POINT",
  REMOVE_BOUGHT_BACK_KP_POINT = "REMOVE_BOUGHT_BACK_KP_POINT",
  ADD_LOST_KP_POINT = "ADD_LOST_KP_POINT",
  REMOVE_LOST_KP_POINT = "REMOVE_LOST_KP_POINT",
  ADD_LOST_KP_POINTS = "ADD_LOST_KP_POINTS",
  SET_ATTRIBUTE_ADJUSTMENT_SELECTION_ID = "SET_ATTRIBUTE_ADJUSTMENT_SELECTION_ID",

  ACTIVATE_DISADV = "ACTIVATE_DISADV",
  DEACTIVATE_DISADV = "DEACTIVATE_DISADV",
  SET_DISADV_TIER = "SET_DISADV_TIER",
  SWITCH_DISADV_RATING_VISIBILITY = "SWITCH_DISADV_RATING_VISIBILITY",

  ADD_TALENT_POINT = "ADD_TALENT_POINT",
  REMOVE_TALENT_POINT = "REMOVE_TALENT_POINT",
  SET_TALENTS_SORT_ORDER = "SET_TALENTS_SORT_ORDER",
  SWITCH_TALENT_RATING_VISIBILITY = "SWITCH_TALENT_RATING_VISIBILITY",

  ADD_COMBATTECHNIQUE_POINT = "ADD_COMBATTECHNIQUE_POINT",
  REMOVE_COMBATTECHNIQUE_POINT = "REMOVE_COMBATTECHNIQUE_POINT",
  SET_COMBATTECHNIQUES_SORT_ORDER = "SET_COMBATTECHNIQUES_SORT_ORDER",

  ACTIVATE_SPELL = "ACTIVATE_SPELL",
  DEACTIVATE_SPELL = "DEACTIVATE_SPELL",
  ACTIVATE_CANTRIP = "ACTIVATE_CANTRIP",
  DEACTIVATE_CANTRIP = "DEACTIVATE_CANTRIP",
  ADD_SPELL_POINT = "ADD_SPELL_POINT",
  REMOVE_SPELL_POINT = "REMOVE_SPELL_POINT",
  SET_SPELLS_SORT_ORDER = "SET_SPELLS_SORT_ORDER",

  ACTIVATE_LITURGY = "ACTIVATE_LITURGY",
  DEACTIVATE_LITURGY = "DEACTIVATE_LITURGY",
  ACTIVATE_BLESSING = "ACTIVATE_BLESSING",
  DEACTIVATE_BLESSING = "DEACTIVATE_BLESSING",
  ADD_LITURGY_POINT = "ADD_LITURGY_POINT",
  REMOVE_LITURGY_POINT = "REMOVE_LITURGY_POINT",
  SET_LITURGIES_SORT_ORDER = "SET_LITURGIES_SORT_ORDER",

  ACTIVATE_SPECIALABILITY = "ACTIVATE_SPECIALABILITY",
  DEACTIVATE_SPECIALABILITY = "DEACTIVATE_SPECIALABILITY",
  SET_SPECIALABILITY_TIER = "SET_SPECIALABILITY_TIER",
  SET_SPECIALABILITIES_SORT_ORDER = "SET_SPECIALABILITIES_SORT_ORDER",

  ADD_ITEM = "ADD_ITEM",
  ADD_ITEM_TEMPLATE = "ADD_ITEM_TEMPLATE",
  CREATE_ITEM = "CREATE_ITEM",
  CLOSE_ITEM_EDITOR = "CLOSE_ITEM_EDITOR",
  SAVE_ITEM = "SAVE_ITEM",
  EDIT_ITEM = "EDIT_ITEM",
  REMOVE_ITEM = "REMOVE_ITEM",
  SET_ITEM = "SET_ITEM",
  SET_ITEMS_SORT_ORDER = "SET_ITEMS_SORT_ORDER",
  SET_DUCATES = "SET_DUCATES",
  SET_SILVERTHALERS = "SET_SILVERTHALERS",
  SET_HELLERS = "SET_HELLERS",
  SET_KREUTZERS = "SET_KREUTZERS",

  SET_ITEM_NAME = "SET_ITEM_NAME",
  SET_ITEM_PRICE = "SET_ITEM_PRICE",
  SET_ITEM_WEIGHT = "SET_ITEM_WEIGHT",
  SET_ITEM_AMOUNT = "SET_ITEM_AMOUNT",
  SET_ITEM_WHERE = "SET_ITEM_WHERE",
  SET_ITEM_GROUP = "SET_ITEM_GROUP",
  SET_ITEM_TEMPLATE = "SET_ITEM_TEMPLATE",
  SET_ITEM_COMBAT_TECHNIQUE = "SET_ITEM_COMBAT_TECHNIQUE",
  SET_ITEM_DAMAGE_DICE_NUMBER = "SET_ITEM_DAMAGE_DICE_NUMBER",
  SET_ITEM_DAMAGE_DICE_SIDES = "SET_ITEM_DAMAGE_DICE_SIDES",
  SET_ITEM_DAMAGE_FLAT = "SET_ITEM_DAMAGE_FLAT",
  SET_ITEM_PRIMARY_ATTRIBUTE = "SET_ITEM_PRIMARY_ATTRIBUTE",
  SET_ITEM_DAMAGE_THRESHOLD = "SET_ITEM_DAMAGE_THRESHOLD",
  SET_ITEM_FIRST_DAMAGE_THRESHOLD = "SET_ITEM_FIRST_DAMAGE_THRESHOLD",
  SET_ITEM_SECOND_DAMAGE_THRESHOLD = "SET_ITEM_SECOND_DAMAGE_THRESHOLD",
  SWITCH_IS_ITEM_DAMAGE_THRESHOLD_SEPARATED = "SWITCH_IS_ITEM_DAMAGE_THRESHOLD_SEPARATED",
  SET_ITEM_ATTACK = "SET_ITEM_ATTACK",
  SET_ITEM_PARRY = "SET_ITEM_PARRY",
  SET_ITEM_REACH = "SET_ITEM_REACH",
  SET_ITEM_LENGTH = "SET_ITEM_LENGTH",
  SET_ITEM_STRUCTURE_POINTS = "SET_ITEM_STRUCTURE_POINTS",
  SET_ITEM_RANGE = "SET_ITEM_RANGE",
  SET_ITEM_RELOAD_TIME = "SET_ITEM_RELOAD_TIME",
  SET_ITEM_AMMUNITION = "SET_ITEM_AMMUNITION",
  SET_ITEM_PROTECTION = "SET_ITEM_PROTECTION",
  SET_ITEM_ENCUMBRANCE = "SET_ITEM_ENCUMBRANCE",
  SET_ITEM_MOVEMENT_MODIFIER = "SET_ITEM_MOVEMENT_MODIFIER",
  SET_ITEM_INITIATIVE_MODIFIER = "SET_ITEM_INITIATIVE_MODIFIER",
  SET_ITEM_STABILITY_MODIFIER = "SET_ITEM_STABILITY_MODIFIER",
  SWITCH_IS_ITEM_PARRYING_WEAPON = "SWITCH_IS_ITEM_PARRYING_WEAPON",
  SWITCH_IS_ITEM_TWO_HANDED_WEAPON = "SWITCH_IS_ITEM_TWO_HANDED_WEAPON",
  SWITCH_IS_ITEM_IMPROVISED_WEAPON = "SWITCH_IS_ITEM_IMPROVISED_WEAPON",
  SET_ITEM_IMPROVISED_WEAPON_GROUP = "SET_ITEM_IMPROVISED_WEAPON_GROUP",
  SET_ITEM_LOSS = "SET_ITEM_LOSS",
  SWITCH_IS_ITEM_FOR_ARMOR_ZONES_ONLY = "SWITCH_IS_ITEM_FOR_ARMOR_ZONES_ONLY",
  SWITCH_ITEM_HAS_ADDITIONAL_PENALTIES = "SWITCH_ITEM_HAS_ADDITIONAL_PENALTIES",
  SET_ITEM_ARMOR_TYPE = "SET_ITEM_ARMOR_TYPE",
  APPLY_ITEM_TEMPLATE = "APPLY_ITEM_TEMPLATE",
  LOCK_ITEM_TEMPLATE = "LOCK_ITEM_TEMPLATE",
  UNLOCK_ITEM_TEMPLATE = "UNLOCK_ITEM_TEMPLATE",
  SET_MELEE_ITEM_TEMPLATES_COMBAT_TECHNIQUE_FILTER =
    "SET_MELEE_ITEM_TEMPLATES_COMBAT_TECHNIQUE_FILTER",
  SET_RANGED_ITEM_TEMPLATES_COMBAT_TECHNIQUE_FILTER =
    "SET_RANGED_ITEM_TEMPLATES_COMBAT_TECHNIQUE_FILTER",
  SWITCH_ENABLE_ANIMATIONS = "SWITCH_ENABLE_ANIMATIONS",

  ADD_ARMOR_ZONES = "ADD_ARMOR_ZONES",
  REMOVE_ARMOR_ZONES = "REMOVE_ARMOR_ZONES",
  CREATE_ARMOR_ZONES = "CREATE_ARMOR_ZONES",
  CLOSE_ARMOR_ZONES_EDITOR = "CLOSE_ARMOR_ZONES_EDITOR",
  SAVE_ARMOR_ZONES = "SAVE_ARMOR_ZONES",
  EDIT_ARMOR_ZONES = "EDIT_ARMOR_ZONES",

  SET_ARMOR_ZONES_NAME = "SET_ARMOR_ZONES_NAME",
  SET_ARMOR_ZONES_HEAD = "SET_ARMOR_ZONES_HEAD",
  SET_ARMOR_ZONES_HEAD_LOSS = "SET_ARMOR_ZONES_HEAD_LOSS",
  SET_ARMOR_ZONES_LEFT_ARM = "SET_ARMOR_ZONES_LEFT_ARM",
  SET_ARMOR_ZONES_LEFT_ARM_LOSS = "SET_ARMOR_ZONES_LEFT_ARM_LOSS",
  SET_ARMOR_ZONES_LEFT_LEG = "SET_ARMOR_ZONES_LEFT_LEG",
  SET_ARMOR_ZONES_LEFT_LEG_LOSS = "SET_ARMOR_ZONES_LEFT_LEG_LOSS",
  SET_ARMOR_ZONES_TORSO = "SET_ARMOR_ZONES_TORSO",
  SET_ARMOR_ZONES_TORSO_LOSS = "SET_ARMOR_ZONES_TORSO_LOSS",
  SET_ARMOR_ZONES_RIGHT_ARM = "SET_ARMOR_ZONES_RIGHT_ARM",
  SET_ARMOR_ZONES_RIGHT_ARM_LOSS = "SET_ARMOR_ZONES_RIGHT_ARM_LOSS",
  SET_ARMOR_ZONES_RIGHT_LEG = "SET_ARMOR_ZONES_RIGHT_LEG",
  SET_ARMOR_ZONES_RIGHT_LEG_LOSS = "SET_ARMOR_ZONES_RIGHT_LEG_LOSS",

  ADD_PET = "ADD_PET",
  CREATE_PET = "CREATE_PET",
  EDIT_PET = "EDIT_PET",
  SAVE_PET = "SAVE_PET",
  CLOSE_PET_EDITOR = "CLOSE_PET_EDITOR",
  REMOVE_PET = "REMOVE_PET",
  SET_PETS_SORT_ORDER = "SET_PETS_SORT_ORDER",
  SET_PET_AVATAR = "SET_PET_AVATAR",
  SET_PET_NAME = "SET_PET_NAME",
  SET_PET_SIZE = "SET_PET_SIZE",
  SET_PET_TYPE = "SET_PET_TYPE",
  SET_PET_SPENT_AP = "SET_PET_SPENT_AP",
  SET_PET_TOTAL_AP = "SET_PET_TOTAL_AP",
  SET_PET_COURAGE = "SET_PET_COURAGE",
  SET_PET_SAGACITY = "SET_PET_SAGACITY",
  SET_PET_INTUITION = "SET_PET_INTUITION",
  SET_PET_CHARISMA = "SET_PET_CHARISMA",
  SET_PET_DEXTERITY = "SET_PET_DEXTERITY",
  SET_PET_AGILITY = "SET_PET_AGILITY",
  SET_PET_CONSTITUTION = "SET_PET_CONSTITUTION",
  SET_PET_STRENGTH = "SET_PET_STRENGTH",
  SET_PET_LP = "SET_PET_LP",
  SET_PET_AE = "SET_PET_AE",
  SET_PET_SPI = "SET_PET_SPI",
  SET_PET_TOU = "SET_PET_TOU",
  SET_PET_PRO = "SET_PET_PRO",
  SET_PET_INI = "SET_PET_INI",
  SET_PET_MOV = "SET_PET_MOV",
  SET_PET_ATTACK = "SET_PET_ATTACK",
  SET_PET_AT = "SET_PET_AT",
  SET_PET_PA = "SET_PET_PA",
  SET_PET_DP = "SET_PET_DP",
  SET_PET_REACH = "SET_PET_REACH",
  SET_PET_ACTIONS = "SET_PET_ACTIONS",
  SET_PET_SKILLS = "SET_PET_SKILLS",
  SET_PET_ABILITIES = "SET_PET_ABILITIES",
  SET_PET_NOTES = "SET_PET_NOTES",

  SWITCH_SHEET_ATTRIBUTE_VALUE_VISIBILITY = "SWITCH_SHEET_ATTRIBUTE_VALUE_VISIBILITY",

  SWITCH_ENABLE_ACTIVE_ITEM_HINTS = "SWITCH_ENABLE_ACTIVE_ITEM_HINTS",
  SET_THEME = "SET_THEME",
  SWITCH_ENABLE_EDITING_HERO_AFTER_CREATION_PHASE =
    "SWITCH_ENABLE_EDITING_HERO_AFTER_CREATION_PHASE",

  SET_RACES_FILTER_TEXT = "SET_RACES_FILTER_TEXT",
  SET_CULTURES_FILTER_TEXT = "SET_CULTURES_FILTER_TEXT",
  SET_PROFESSIONS_FILTER_TEXT = "SET_PROFESSIONS_FILTER_TEXT",
  SET_ADVANTAGES_FILTER_TEXT = "SET_ADVANTAGES_FILTER_TEXT",
  SET_INACTIVE_ADVANTAGES_FILTER_TEXT = "SET_INACTIVE_ADVANTAGES_FILTER_TEXT",
  SET_DISADVANTAGES_FILTER_TEXT = "SET_DISADVANTAGES_FILTER_TEXT",
  SET_INACTIVE_DISADVANTAGES_FILTER_TEXT = "SET_INACTIVE_DISADVANTAGES_FILTER_TEXT",
  SET_SKILLS_FILTER_TEXT = "SET_SKILLS_FILTER_TEXT",
  SET_COMBAT_TECHNIQUES_FILTER_TEXT = "SET_COMBAT_TECHNIQUES_FILTER_TEXT",
  SET_SPECIAL_ABILITIES_FILTER_TEXT = "SET_SPECIAL_ABILITIES_FILTER_TEXT",
  SET_INACTIVE_SPECIAL_ABILITIES_FILTER_TEXT = "SET_INACTIVE_SPECIAL_ABILITIES_FILTER_TEXT",
  SET_SPELLS_FILTER_TEXT = "SET_SPELLS_FILTER_TEXT",
  SET_INACTIVE_SPELLS_FILTER_TEXT = "SET_INACTIVE_SPELLS_FILTER_TEXT",
  SET_LITURGICAL_CHANTS_FILTER_TEXT = "SET_LITURGICAL_CHANTS_FILTER_TEXT",
  SET_INACTIVE_LITURGICAL_CHANTS_FILTER_TEXT = "SET_INACTIVE_LITURGICAL_CHANTS_FILTER_TEXT",
  SET_EQUIPMENT_FILTER_TEXT = "SET_EQUIPMENT_FILTER_TEXT",
  SET_ITEM_TEMPLATES_FILTER_TEXT = "SET_ITEM_TEMPLATES_FILTER_TEXT",
  SET_ZONE_ARMOR_FILTER_TEXT = "SET_ZONE_ARMOR_FILTER_TEXT",

  LOAD_RAW_INGAME_DATA = "LOAD_RAW_INGAME_DATA",
  INGAME_PREVIOUS_PHASE = "INGAME_PREVIOUS_PHASE",
  INGAME_NEXT_PHASE = "INGAME_NEXT_PHASE",
  UPDATE_INGAME_CAST = "UPDATE_INGAME_CAST",
  CANCEL_INGAME_CAST = "CANCEL_INGAME_CAST",
  INGAME_USE_ENDURANCE = "INGAME_USE_ENDURANCE",
  INGAME_USE_ACTION = "INGAME_USE_ACTION",
  INGAME_USE_FREE_ACTION = "INGAME_USE_FREE_ACTION",
  INGAME_ACTIVATE_FIGHTER = "INGAME_ACTIVATE_FIGHTER",
  INGAME_DEACTIVATE_FIGHTER = "INGAME_DEACTIVATE_FIGHTER",
  INGAME_EDIT_START = "INGAME_EDIT_START",
  INGAME_EDIT_UPDATE_VALUE = "INGAME_EDIT_UPDATE_VALUE",
  INGAME_EDIT_UPDATE_CAST_VALUE = "INGAME_EDIT_UPDATE_CAST_VALUE",
  INGAME_EDIT_UPDATE_DUPLICATE_VALUE = "INGAME_EDIT_UPDATE_DUPLICATE_VALUE",
  INGAME_EDIT_END = "INGAME_EDIT_END",
  INGAME_ADD_FIGHTER = "INGAME_ADD_FIGHTER",
  INGAME_DUPLICATE_FIGHTER = "INGAME_DUPLICATE_FIGHTER",
  INGAME_REMOVE_FIGHTER = "INGAME_REMOVE_FIGHTER",
  INGAME_RESET_PHASES = "INGAME_RESET_PHASES",
  INGAME_RESET_HEALTH = "INGAME_RESET_HEALTH",
  INGAME_RESET_ALL = "INGAME_RESET_ALL",
  INGAME_UPDATE_ONLINE_LINK = "INGAME_UPDATE_ONLINE_LINK",
  INGAME_SAVE = "INGAME_SAVE",
  INGAME_SWITCH_OPTION = "INGAME_SWITCH_OPTION",

  ADD_ALERT = "ADD_ALERT",
  REMOVE_ALERT = "REMOVE_ALERT",
}