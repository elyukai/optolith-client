import { elemF } from "../../Data/Foldable";
import { List } from "../../Data/List";

export type TabId = "herolist"
                  | "grouplist"
                  | "wiki"
                  | "faq"
                  | "imprint"
                  | "thirdPartyLicenses"
                  | "lastChanges"
                  | "profile"
                  | "personalData"
                  | "characterSheet"
                  | "pact"
                  | "rules"
                  | "races"
                  | "cultures"
                  | "professions"
                  | "attributes"
                  | "advantages"
                  | "disadvantages"
                  | "skills"
                  | "combatTechniques"
                  | "specialAbilities"
                  | "spells"
                  | "liturgicalChants"
                  | "equipment"
                  | "zoneArmor"
                  | "pets"

export const mainSectionTabs =
  List<TabId> (
    "herolist",
    "grouplist",
    "wiki",
    "faq",
    "imprint",
    "thirdPartyLicenses",
    "lastChanges"
  )

export const heroSectionTabs =
  List<TabId> (
    "profile",
    "personalData",
    "characterSheet",
    "pact",
    "rules",
    "races",
    "cultures",
    "professions",
    "attributes",
    "advantages",
    "disadvantages",
    "skills",
    "combatTechniques",
    "specialAbilities",
    "spells",
    "liturgicalChants",
    "equipment",
    "zoneArmor",
    "pets"
  )

export const isMainSectionTab = elemF (mainSectionTabs)
export const isHeroSectionTab = elemF (heroSectionTabs)
