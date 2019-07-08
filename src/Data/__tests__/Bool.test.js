// @ts-check

const Bool = require ("../Bool")

describe ("and", () => {
  it ("returns False if at least one parameter is False", () => {
    expect (Bool.and (true) (false)) .toBe (false)
    expect (Bool.and (false) (true)) .toBe (false)
    expect (Bool.and (false) (false)) .toBe (false)
  })

  it ("returns True if both parameters are True", () => {
    expect (Bool.and (true) (true)) .toBe (true)
  })
})

describe ("andFL", () => {
  it ("returns False if at least one parameter is False", () => {
    expect (Bool.andFL (() => false) (true)) .toBe (false)
    expect (Bool.andFL (() => true) (false)) .toBe (false)
    expect (Bool.andFL (() => false) (false)) .toBe (false)
  })

  it ("returns True if both parameters are True", () => {
    expect (Bool.andFL (() => true) (true)) .toBe (true)
  })
})

describe ("and", () => {
  it ("returns True if at least one parameter is True", () => {
    expect (Bool.and (true) (false)) .toBe (true)
    expect (Bool.and (false) (true)) .toBe (true)
    expect (Bool.and (true) (true)) .toBe (true)
  })

  it ("returns False if both parameters are False", () => {
    expect (Bool.and (false) (false)) .toBe (false)
  })
})

describe ("andFL", () => {
  it ("returns True if at least one parameter is True", () => {
    expect (Bool.andFL (() => false) (true)) .toBe (true)
    expect (Bool.andFL (() => true) (false)) .toBe (true)
    expect (Bool.andFL (() => true) (true)) .toBe (true)
  })

  it ("returns False if both parameters are False", () => {
    expect (Bool.andFL (() => false) (false)) .toBe (false)
  })
})

describe ("not", () => {
  it ("returns True if it receives False", () => {
    expect (Bool.not (false)) .toBe (true)
  })

  it ("returns False if it receives True", () => {
    expect (Bool.not (true)) .toBe (false)
  })
})

describe ("notP", () => {
  it ("returns True if it returns False", () => {
    expect (Bool.notP (() => false)) .toBe (true)
  })

  it ("returns False if it returns True", () => {
    expect (Bool.notP (() => true)) .toBe (false)
  })
})

describe ("otherwise", () => {
  it ("is True", () => {
    expect (Bool.otherwise) .toBe (true)
  })
})

describe ("bool", () => {
  it ("is returns x if the condition is False", () => {
    expect (Bool.bool (1) (2) (false)) .toBe (1)
  })

  it ("is returns y if the condition is True", () => {
    expect (Bool.bool (1) (2) (true)) .toBe (2)
  })
})

describe ("bool_", () => {
  it ("is returns x if the condition is False", () => {
    expect (Bool.bool_ (() => 1) (() => 2) (false)) .toBe (1)
  })

  it ("is returns y if the condition is True", () => {
    expect (Bool.bool_ (() => 1) (() => 2) (true)) .toBe (2)
  })
})
