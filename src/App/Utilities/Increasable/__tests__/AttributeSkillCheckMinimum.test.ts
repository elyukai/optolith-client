import { List } from "../../../../Data/List"
import { Just, Nothing } from "../../../../Data/Maybe"
import * as OrderedMap from "../../../../Data/OrderedMap"
import { ActivatableSkillDependent } from "../../../Models/ActiveEntries/ActivatableSkillDependent"
import { AttributeDependent } from "../../../Models/ActiveEntries/AttributeDependent"
import { SkillDependent } from "../../../Models/ActiveEntries/SkillDependent"
import { LiturgicalChant } from "../../../Models/Wiki/LiturgicalChant"
import { Skill } from "../../../Models/Wiki/Skill"
import { Spell } from "../../../Models/Wiki/Spell"
import * as AttributeUtils from "../AttributeSkillCheckMinimum"
import { CacheSkillId } from "../AttributeSkillCheckMinimum"

const skillFakeBase = {
  check: Nothing,
  applications: Nothing,
  botch: Nothing,
  category: Nothing,
  critical: Nothing,
  encumbrance: Nothing,
  errata: Nothing,
  failed: Nothing,
  gr: Nothing,
  ic: Nothing,
  name: Nothing,
  quality: Nothing,
  src: Nothing,
  uses: Nothing,
}

const spellFakeBase = {
  check: Nothing,
  category: Nothing,
  errata: Nothing,
  gr: Nothing,
  ic: Nothing,
  name: Nothing,
  src: Nothing,
  property: Nothing,
  tradition: Nothing,
  subtradition: Nothing,
  prerequisites: Nothing,
  effect: Nothing,
  castingTime: Nothing,
  castingTimeShort: Nothing,
  castingTimeNoMod: Nothing,
  cost: Nothing,
  costShort: Nothing,
  costNoMod: Nothing,
  range: Nothing,
  rangeShort: Nothing,
  rangeNoMod: Nothing,
  duration: Nothing,
  durationShort: Nothing,
  durationNoMod: Nothing,
  target: Nothing,
}

const chantFakeBase = {
  check: Nothing,
  category: Nothing,
  errata: Nothing,
  gr: Nothing,
  ic: Nothing,
  name: Nothing,
  src: Nothing,
  tradition: Nothing,
  subtradition: Nothing,
  prerequisites: Nothing,
  effect: Nothing,
  castingTime: Nothing,
  castingTimeShort: Nothing,
  castingTimeNoMod: Nothing,
  cost: Nothing,
  costShort: Nothing,
  costNoMod: Nothing,
  range: Nothing,
  rangeShort: Nothing,
  rangeNoMod: Nothing,
  duration: Nothing,
  durationShort: Nothing,
  durationNoMod: Nothing,
  target: Nothing,
  nameShort: Nothing,
  aspects: Nothing,
}

describe ("addEntryToCache", () => {
  it ("adds the skill id to every attribute's list", () => {
    expect (AttributeUtils.addEntryToCache (
      Skill.A.id,
      Skill.A.check,
      "Skill",
      Skill ({ ...skillFakeBase, id: "TAL_3", check: List ("ATTR_2", "ATTR_3", "ATTR_4") }),
      OrderedMap.fromArray ([
        [ "ATTR_8", List<CacheSkillId> (
          { tag: "Spell", value: "SPELL_2" },
          { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_3", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_1" },
          { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_4", List<CacheSkillId> (
          { tag: "Spell", value: "SPELL_2" },
          { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_1", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" },
          { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_7", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" }
        ) ],
        [ "ATTR_2", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" }
        ) ],
      ])
    ))
      .toEqual (OrderedMap.fromArray ([
        [ "ATTR_8", List<CacheSkillId> (
          { tag: "Spell", value: "SPELL_2" },
          { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_3", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_3" },
          { tag: "Skill", value: "TAL_1" },
          { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_4", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_3" },
          { tag: "Spell", value: "SPELL_2" },
          { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_1", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" },
          { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_7", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" }
        ) ],
        [ "ATTR_2", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_3" },
          { tag: "LiturgicalChant", value: "LITURGY_1" }
        ) ],
      ]))
  })

  it ("adds the skill id to every attribute's list and creates a new list if the key is not yet present", () => {
    expect (AttributeUtils.addEntryToCache (
      Skill.A.id,
      Skill.A.check,
      "Skill",
      Skill ({ ...skillFakeBase, id: "TAL_3", check: List ("ATTR_2", "ATTR_3", "ATTR_6") }),
      OrderedMap.fromArray ([
        [ "ATTR_8", List<CacheSkillId> (
          { tag: "Spell", value: "SPELL_2" }, { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_3", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_1" }, { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_4", List<CacheSkillId> (
          { tag: "Spell", value: "SPELL_2" }, { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_1", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" }, { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_7", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" }
        ) ],
        [ "ATTR_2", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" }
        ) ],
      ])
    ))
      .toEqual (OrderedMap.fromArray ([
        [ "ATTR_8", List<CacheSkillId> (
          { tag: "Spell", value: "SPELL_2" },
          { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_3", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_3" },
          { tag: "Skill", value: "TAL_1" },
          { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_4", List<CacheSkillId> (
          { tag: "Spell", value: "SPELL_2" },
          { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_1", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" },
          { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_7", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" }
        ) ],
        [ "ATTR_2", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_3" },
          { tag: "LiturgicalChant", value: "LITURGY_1" }
        ) ],
        [ "ATTR_6", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_3" }
        ) ],
      ]))
  })
})

describe ("removeEntryFromCache", () => {
  it ("removes the skill id from every attribute's list", () => {
    expect (AttributeUtils.removeEntryFromCache (
      LiturgicalChant.A.id,
      LiturgicalChant.A.check,
      "LiturgicalChant",
      LiturgicalChant ({
        ...chantFakeBase, id: "LITURGY_1", check: List ("ATTR_1", "ATTR_2", "ATTR_7"),
      }),
      OrderedMap.fromArray ([
        [ "ATTR_8", List<CacheSkillId> (
          { tag: "Spell", value: "SPELL_2" },
          { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_3", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_1" },
          { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_4", List<CacheSkillId> (
          { tag: "Spell", value: "SPELL_2" },
          { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_1", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" },
          { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_7", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" }
        ) ],
        [ "ATTR_2", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" }
        ) ],
      ])
    ))
      .toEqual (OrderedMap.fromArray ([
        [ "ATTR_8", List<CacheSkillId> (
          { tag: "Spell", value: "SPELL_2" },
          { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_3", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_1" },
          { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_4", List<CacheSkillId> (
          { tag: "Spell", value: "SPELL_2" },
          { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_1", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_7", List<CacheSkillId> () ],
        [ "ATTR_2", List<CacheSkillId> () ],
      ]))
  })
})

describe ("initializeCache", () => {
  it ("returns combined cache", () => {
    expect (AttributeUtils.initializeCache (
      OrderedMap.fromArray ([
        [ "TAL_1", Skill ({
          ...skillFakeBase, id: "TAL_1", check: List ("ATTR_1", "ATTR_3", "ATTR_4"),
        }) ],
        [ "TAL_2", Skill ({
          ...skillFakeBase, id: "TAL_2", check: List ("ATTR_3", "ATTR_3", "ATTR_8"),
        }) ],
      ]),
      OrderedMap.fromArray ([
        [ "SPELL_1", Spell ({
          ...spellFakeBase, id: "SPELL_1", check: List ("ATTR_5", "ATTR_6", "ATTR_8"),
        }) ],
        [ "SPELL_2", Spell ({
          ...spellFakeBase, id: "SPELL_2", check: List ("ATTR_4", "ATTR_8", "ATTR_8"),
        }) ],
      ]),
      OrderedMap.fromArray ([
        [ "LITURGY_1", LiturgicalChant ({
          ...chantFakeBase, id: "LITURGY_1", check: List ("ATTR_1", "ATTR_2", "ATTR_7"),
        }) ],
        [ "LITURGY_2", LiturgicalChant ({
          ...chantFakeBase, id: "LITURGY_2", check: List ("ATTR_2", "ATTR_6", "ATTR_7"),
        }) ],
      ]),
      OrderedMap.fromArray ([
        [ "SPELL_1", ActivatableSkillDependent ({
          id: "SPELL_1", active: false, value: 0, dependencies: List (),
        }) ],
        [ "SPELL_2", ActivatableSkillDependent ({
          id: "SPELL_2", active: true, value: 9, dependencies: List (),
        }) ],
      ]),
      OrderedMap.fromArray ([
        [ "LITURGY_1", ActivatableSkillDependent ({
          id: "LITURGY_1", active: true, value: 4, dependencies: List (),
        }) ],
        [ "LITURGY_2", ActivatableSkillDependent ({
          id: "LITURGY_2", active: false, value: 0, dependencies: List (),
        }) ],
      ]),
    ))
      .toEqual (OrderedMap.fromArray ([
        [ "ATTR_8", List (
          { tag: "Spell", value: "SPELL_2" },
          { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_3", List (
          { tag: "Skill", value: "TAL_1" },
          { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_4", List (
          { tag: "Spell", value: "SPELL_2" },
          { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_1", List (
          { tag: "LiturgicalChant", value: "LITURGY_1" },
          { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_7", List (
          { tag: "LiturgicalChant", value: "LITURGY_1" }
        ) ],
        [ "ATTR_2", List (
          { tag: "LiturgicalChant", value: "LITURGY_1" }
        ) ],
      ]))
  })
})

describe ("getSkillCheckAttributes", () => {
  it ("returns found attribute instances", () => {
    const attr1 = AttributeDependent ({ id: "ATTR_1", value: 13, mod: 0, dependencies: List () })
    const attr2 = AttributeDependent ({ id: "ATTR_2", value: 14, mod: 0, dependencies: List () })
    const attr3 = AttributeDependent ({ id: "ATTR_3", value: 12, mod: 0, dependencies: List () })

    const attributeInstances =
      OrderedMap.fromArray ([
        [ "ATTR_1", attr1 ],
        [ "ATTR_2", attr2 ],
        [ "ATTR_3", attr3 ],
      ])

    expect (AttributeUtils.getSkillCheckAttributes (attributeInstances)
                                                   (List ("ATTR_1", "ATTR_4", "ATTR_2")))
      .toEqual (List (attr1, attr2))
  })
})

describe ("getSingleMaximumAttribute", () => {
  it ("returns a single attribute id", () => {
    const attributeInstances =
      OrderedMap.fromArray ([
        [ "ATTR_1", AttributeDependent ({
          id: "ATTR_1", value: 13, mod: 0, dependencies: List (),
        }) ],
        [ "ATTR_2", AttributeDependent ({
          id: "ATTR_2", value: 14, mod: 0, dependencies: List (),
        }) ],
        [ "ATTR_3", AttributeDependent ({
          id: "ATTR_3", value: 12, mod: 0, dependencies: List (),
        }) ],
      ])

    expect (AttributeUtils.getSingleMaximumAttribute (attributeInstances)
                                                     (List ("ATTR_1", "ATTR_2", "ATTR_3")))
      .toEqual (Just ("ATTR_2"))
  })

  it ("returns a single attribute id if the same attribute occurs multiple times", () => {
    const attributeInstances =
      OrderedMap.fromArray ([
        [ "ATTR_1", AttributeDependent ({
          id: "ATTR_1", value: 13, mod: 0, dependencies: List (),
        }) ],
        [ "ATTR_2", AttributeDependent ({
          id: "ATTR_2", value: 14, mod: 0, dependencies: List (),
        }) ],
        [ "ATTR_3", AttributeDependent ({
          id: "ATTR_3", value: 12, mod: 0, dependencies: List (),
        }) ],
      ])

    expect (AttributeUtils.getSingleMaximumAttribute (attributeInstances)
                                                     (List ("ATTR_1", "ATTR_2", "ATTR_2")))
      .toEqual (Just ("ATTR_2"))
  })

  it ("returns Nothing if multiple attributes are on the same value", () => {
    const attributeInstances =
      OrderedMap.fromArray ([
        [ "ATTR_1", AttributeDependent ({
          id: "ATTR_1", value: 13, mod: 0, dependencies: List (),
        }) ],
        [ "ATTR_2", AttributeDependent ({
          id: "ATTR_2", value: 14, mod: 0, dependencies: List (),
        }) ],
        [ "ATTR_3", AttributeDependent ({
          id: "ATTR_3", value: 14, mod: 0, dependencies: List (),
        }) ],
      ])

    expect (AttributeUtils.getSingleMaximumAttribute (attributeInstances)
                                                     (List ("ATTR_1", "ATTR_2", "ATTR_3")))
      .toEqual (Nothing)
  })
})

describe ("getSkillCheckAttributes", () => {
  it ("returns found attribute instances", () => {
    const attr1 = AttributeDependent ({ id: "ATTR_1", value: 13, mod: 0, dependencies: List () })
    const attr2 = AttributeDependent ({ id: "ATTR_2", value: 14, mod: 0, dependencies: List () })
    const attr3 = AttributeDependent ({ id: "ATTR_3", value: 12, mod: 0, dependencies: List () })

    const attributeInstances =
      OrderedMap.fromArray ([
        [ "ATTR_1", attr1 ],
        [ "ATTR_2", attr2 ],
        [ "ATTR_3", attr3 ],
      ])

    expect (AttributeUtils.getSkillCheckAttributes (attributeInstances)
                                                   (List ("ATTR_1", "ATTR_4", "ATTR_2")))
      .toEqual (List (attr1, attr2))
  })
})

describe ("getSkillCheckAttributeMinimum", () => {
  it ("returns a minimum above the default", () => {
    const staticSkills =
      OrderedMap.fromArray ([
        [ "TAL_1", Skill ({
          ...skillFakeBase, id: "TAL_1", check: List ("ATTR_1", "ATTR_3", "ATTR_4"),
        }) ],
        [ "TAL_2", Skill ({
          ...skillFakeBase, id: "TAL_2", check: List ("ATTR_3", "ATTR_3", "ATTR_8"),
        }) ],
      ])

    const staticSpells =
      OrderedMap.fromArray ([
        [ "SPELL_1", Spell ({
          ...spellFakeBase, id: "SPELL_1", check: List ("ATTR_5", "ATTR_6", "ATTR_8"),
        }) ],
        [ "SPELL_2", Spell ({
          ...spellFakeBase, id: "SPELL_2", check: List ("ATTR_4", "ATTR_8", "ATTR_8"),
        }) ],
      ])

    const staticLiturgicalChants =
      OrderedMap.fromArray ([
        [ "LITURGY_1", LiturgicalChant ({
          ...chantFakeBase, id: "LITURGY_1", check: List ("ATTR_1", "ATTR_2", "ATTR_7"),
        }) ],
        [ "LITURGY_2", LiturgicalChant ({
          ...chantFakeBase, id: "LITURGY_2", check: List ("ATTR_2", "ATTR_6", "ATTR_7"),
        }) ],
      ])

    const heroAttributes =
      OrderedMap.fromArray ([
        [ "ATTR_1", AttributeDependent ({
          id: "ATTR_1", value: 13, mod: 0, dependencies: List (),
        }) ],
        [ "ATTR_2", AttributeDependent ({
          id: "ATTR_2", value: 14, mod: 0, dependencies: List (),
        }) ],
        [ "ATTR_3", AttributeDependent ({
          id: "ATTR_3", value: 12, mod: 0, dependencies: List (),
        }) ],
      ])

      const heroSkills =
        OrderedMap.fromArray ([
          [ "TAL_1", SkillDependent ({
            id: "TAL_1", value: 12, dependencies: List (),
          }) ],
          [ "TAL_2", SkillDependent ({
            id: "TAL_2", value: 13, dependencies: List (),
          }) ],
        ])

    const heroSpells =
      OrderedMap.fromArray ([
        [ "SPELL_1", ActivatableSkillDependent ({
          id: "SPELL_1", active: false, value: 0, dependencies: List (),
        }) ],
        [ "SPELL_2", ActivatableSkillDependent ({
          id: "SPELL_2", active: true, value: 9, dependencies: List (),
        }) ],
      ])

    const heroLiturgicalChants =
      OrderedMap.fromArray ([
        [ "LITURGY_1", ActivatableSkillDependent ({
          id: "LITURGY_1", active: true, value: 14, dependencies: List (),
        }) ],
        [ "LITURGY_2", ActivatableSkillDependent ({
          id: "LITURGY_2", active: false, value: 10, dependencies: List (),
        }) ],
      ])

    const cache =
      OrderedMap.fromArray ([
        [ "ATTR_8", List<CacheSkillId> (
          { tag: "Spell", value: "SPELL_2" },
          { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_3", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_3" },
          { tag: "Skill", value: "TAL_1" },
          { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_4", List<CacheSkillId> (
          { tag: "Spell", value: "SPELL_2" },
          { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_1", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" },
          { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_7", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" }
        ) ],
        [ "ATTR_2", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_3" },
          { tag: "LiturgicalChant", value: "LITURGY_1" }
        ) ],
        [ "ATTR_6", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_3" }
        ) ],
      ])

    expect (
      AttributeUtils.getSkillCheckAttributeMinimum (
        staticSkills,
        staticSpells,
        staticLiturgicalChants,
        heroAttributes,
        heroSkills,
        heroSpells,
        heroLiturgicalChants,
        cache,
        "ATTR_2",
      )
    )
      .toEqual (Just (12))
  })

  it ("returns no minimum since all relevant minima were below the default", () => {
    const staticSkills =
      OrderedMap.fromArray ([
        [ "TAL_1", Skill ({
          ...skillFakeBase, id: "TAL_1", check: List ("ATTR_1", "ATTR_3", "ATTR_4"),
        }) ],
        [ "TAL_2", Skill ({
          ...skillFakeBase, id: "TAL_2", check: List ("ATTR_3", "ATTR_3", "ATTR_8"),
        }) ],
      ])

    const staticSpells =
      OrderedMap.fromArray ([
        [ "SPELL_1", Spell ({
          ...spellFakeBase, id: "SPELL_1", check: List ("ATTR_5", "ATTR_6", "ATTR_8"),
        }) ],
        [ "SPELL_2", Spell ({
          ...spellFakeBase, id: "SPELL_2", check: List ("ATTR_4", "ATTR_8", "ATTR_8"),
        }) ],
      ])

    const staticLiturgicalChants =
      OrderedMap.fromArray ([
        [ "LITURGY_1", LiturgicalChant ({
          ...chantFakeBase, id: "LITURGY_1", check: List ("ATTR_1", "ATTR_2", "ATTR_7"),
        }) ],
        [ "LITURGY_2", LiturgicalChant ({
          ...chantFakeBase, id: "LITURGY_2", check: List ("ATTR_2", "ATTR_6", "ATTR_7"),
        }) ],
      ])

    const heroAttributes =
      OrderedMap.fromArray ([
        [ "ATTR_1", AttributeDependent ({
          id: "ATTR_1", value: 13, mod: 0, dependencies: List (),
        }) ],
        [ "ATTR_2", AttributeDependent ({
          id: "ATTR_2", value: 14, mod: 0, dependencies: List (),
        }) ],
        [ "ATTR_3", AttributeDependent ({
          id: "ATTR_3", value: 12, mod: 0, dependencies: List (),
        }) ],
      ])

      const heroSkills =
        OrderedMap.fromArray ([
          [ "TAL_1", SkillDependent ({
            id: "TAL_1", value: 8, dependencies: List (),
          }) ],
          [ "TAL_2", SkillDependent ({
            id: "TAL_2", value: 7, dependencies: List (),
          }) ],
        ])

    const heroSpells =
      OrderedMap.fromArray ([
        [ "SPELL_1", ActivatableSkillDependent ({
          id: "SPELL_1", active: false, value: 0, dependencies: List (),
        }) ],
        [ "SPELL_2", ActivatableSkillDependent ({
          id: "SPELL_2", active: true, value: 6, dependencies: List (),
        }) ],
      ])

    const heroLiturgicalChants =
      OrderedMap.fromArray ([
        [ "LITURGY_1", ActivatableSkillDependent ({
          id: "LITURGY_1", active: true, value: 5, dependencies: List (),
        }) ],
        [ "LITURGY_2", ActivatableSkillDependent ({
          id: "LITURGY_2", active: false, value: 4, dependencies: List (),
        }) ],
      ])

    const cache =
      OrderedMap.fromArray ([
        [ "ATTR_8", List<CacheSkillId> (
          { tag: "Spell", value: "SPELL_2" },
          { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_3", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_3" },
          { tag: "Skill", value: "TAL_1" },
          { tag: "Skill", value: "TAL_2" }
        ) ],
        [ "ATTR_4", List<CacheSkillId> (
          { tag: "Spell", value: "SPELL_2" },
          { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_1", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" },
          { tag: "Skill", value: "TAL_1" }
        ) ],
        [ "ATTR_7", List<CacheSkillId> (
          { tag: "LiturgicalChant", value: "LITURGY_1" }
        ) ],
        [ "ATTR_2", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_3" },
          { tag: "LiturgicalChant", value: "LITURGY_1" }
        ) ],
        [ "ATTR_6", List<CacheSkillId> (
          { tag: "Skill", value: "TAL_3" }
        ) ],
      ])

    expect (
      AttributeUtils.getSkillCheckAttributeMinimum (
        staticSkills,
        staticSpells,
        staticLiturgicalChants,
        heroAttributes,
        heroSkills,
        heroSpells,
        heroLiturgicalChants,
        cache,
        "ATTR_2",
      )
    )
      .toBe (Nothing)
  })
})
