const { cnst, id, T } = require ('../combinators');
const { add } = require ('../../mathUtils');

test('id', () => {
  expect (id (5)) .toEqual (5)
});

test('cnst', () => {
  expect (cnst (5) ('test')) .toEqual (5)
});

test('T', () => {
  expect (T (5) (add (3))) .toEqual (8)
});
