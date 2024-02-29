import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { RegistrationMethod, addOrRemoveDependencyInSlice } from "./registrationHelpers.ts"

describe("addOrRemoveDependency", () => {
  const createDefault = () => ({ dependencies: [] })

  it("should add a dependency", () => {
    const slice: Record<string, { dependencies: { name: string }[] }> = {}
    const id = "testId"
    const dep = { name: "dependency" }
    addOrRemoveDependencyInSlice(RegistrationMethod.Add, slice, id, createDefault, dep)
    assert.deepEqual(slice[id]?.dependencies, [dep])
  })

  it("should remove a dependency", () => {
    const dep1 = { name: "dependency1" }
    const dep2 = { name: "dependency2" }
    const slice = {
      testId: {
        dependencies: [dep1, dep2],
      },
    }
    addOrRemoveDependencyInSlice(RegistrationMethod.Remove, slice, "testId", createDefault, dep1)
    assert.deepEqual(slice["testId"]?.dependencies, [dep2])
  })

  it("should not remove any dependency if not found", () => {
    const dep1 = { name: "dependency1" }
    const dep2 = { name: "dependency2" }
    const slice = {
      testId: {
        dependencies: [dep1],
      },
    }
    addOrRemoveDependencyInSlice(RegistrationMethod.Remove, slice, "testId", createDefault, dep2)
    assert.deepEqual(slice["testId"].dependencies, [dep1])
  })
})
