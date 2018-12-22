const { cnst, id, T, join, on } = require ('../Function');
const { fromJust, Just } = require ('../Maybe');
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

test('join', () => {
  expect (join (add) (2)) .toEqual (4)
  expect (join (add) (4)) .toEqual (8)
});

test('on', () => {
  expect (on (add) (fromJust) (Just (1)) (Just (2))) .toEqual (3)
});
