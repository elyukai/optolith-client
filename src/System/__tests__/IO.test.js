// @ts-check
const IO = require ("../IO")
const { Internals } = require ("../../Data/Internals")

describe ("Internals.IO", () => {
  it ("creates a pending IO", () => {
    expect.assertions (2)

    let a

    const io = Internals.IO (() => new Promise (res => (a = 1, res ())))

    expect (a) .toBeUndefined ()

    io .f () .then (() => expect (a) .toEqual (1))
  })
})

describe ("pure", () => {
  it ("creates an immediately resolved IO", () => {
    expect.assertions (1)
    IO.pure ("test") .f () .then (x => expect (x) .toEqual ("test"))
  })
})

describe (">>=", () => {
  it ("executes the first IO and returns the pending second IO", () => {
    expect.assertions (2)

    let a

    expect (IO.bind (Internals.IO (() => new Promise (res => (a = 1, res (2)))))
                    (b => {
                      expect (b) .toEqual (2)
                      expect (a) .toEqual (1)

                      return IO.pure (3)
                    })
                    .f ()) .resolves .toEqual (3)
  })
})

describe ("=<<", () => {
  it ("executes the first IO and returns the pending second IO", () => {
    expect.assertions (3)

    let a

    expect (IO.bindF (b => {
                       expect (b) .toEqual (2)
                       expect (a) .toEqual (1)

                       return IO.pure (3)
                     })
                     (Internals.IO (() => new Promise (res => (a = 1, res (2)))))
                     .f ()) .resolves .toEqual (3)
  })
})
