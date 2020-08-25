import { List } from "../../../../Data/List"
import { Just, Nothing } from "../../../../Data/Maybe"
import * as OrderedMap from "../../../../Data/OrderedMap"
import { AttributeDependent } from "../../../Models/ActiveEntries/AttributeDependent"
import * as AttributeUtils from "../attributeUtils"

describe ("getSkillCheckAttributes", () => {
  it ("returns found attribute instances", () => {
    const attr1 = AttributeDependent ({ id: "ATTR_1", value: 13, mod: 0, dependencies: List () })
    const attr2 = AttributeDependent ({ id: "ATTR_2", value: 14, mod: 0, dependencies: List () })
    const attr3 = AttributeDependent ({ id: "ATTR_3", value: 12, mod: 0, dependencies: List () })

    const attributeInstances =
      OrderedMap.fromArray ([
        ["ATTR_1", attr1],
        ["ATTR_2", attr2],
        ["ATTR_3", attr3]
      ])

    expect (AttributeUtils.getSkillCheckAttributes (attributeInstances) (List ("ATTR_1", "ATTR_4", "ATTR_2")))
      .toEqual (List (attr1, attr2))
  })
})

describe ("getSingleMaximumAttribute", () => {
  it ("returns a single attribute id", () => {
    const attributeInstances =
      OrderedMap.fromArray ([
        ["ATTR_1", AttributeDependent ({ id: "ATTR_1", value: 13, mod: 0, dependencies: List () })],
        ["ATTR_2", AttributeDependent ({ id: "ATTR_2", value: 14, mod: 0, dependencies: List () })],
        ["ATTR_3", AttributeDependent ({ id: "ATTR_3", value: 12, mod: 0, dependencies: List () })]
      ])

    expect (AttributeUtils.getSingleMaximumAttribute (attributeInstances) (List ("ATTR_1", "ATTR_2", "ATTR_3")))
      .toEqual (Just ("ATTR_2"))
  })

  it ("returns a single attribute id if the same attribute occurs multiple times", () => {
    const attributeInstances =
      OrderedMap.fromArray ([
        ["ATTR_1", AttributeDependent ({ id: "ATTR_1", value: 13, mod: 0, dependencies: List () })],
        ["ATTR_2", AttributeDependent ({ id: "ATTR_2", value: 14, mod: 0, dependencies: List () })],
        ["ATTR_3", AttributeDependent ({ id: "ATTR_3", value: 12, mod: 0, dependencies: List () })]
      ])

    expect (AttributeUtils.getSingleMaximumAttribute (attributeInstances) (List ("ATTR_1", "ATTR_2", "ATTR_2")))
      .toEqual (Just ("ATTR_2"))
  })

  it ("returns Nothing if multiple attributes are on the same value", () => {
    const attributeInstances =
      OrderedMap.fromArray ([
        ["ATTR_1", AttributeDependent ({ id: "ATTR_1", value: 13, mod: 0, dependencies: List () })],
        ["ATTR_2", AttributeDependent ({ id: "ATTR_2", value: 14, mod: 0, dependencies: List () })],
        ["ATTR_3", AttributeDependent ({ id: "ATTR_3", value: 14, mod: 0, dependencies: List () })]
      ])

    expect (AttributeUtils.getSingleMaximumAttribute (attributeInstances) (List ("ATTR_1", "ATTR_2", "ATTR_3")))
      .toEqual (Nothing)
  })
})
