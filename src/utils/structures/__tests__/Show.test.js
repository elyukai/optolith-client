const { show } = require('../Show');
const { Left, Right } = require('../Either');
const { fromElements } = require('../List.new');
const { fromBoth } = require('../Pair');
const { fromUniqueElements } = require('../OrderedSet.new');
const { Just, Nothing } = require('../Maybe.new');
const { fromDefault } = require('../Record.new');

test('Maybe', () => {
  expect (show (Just (2))) .toEqual ('Just (2)');
  expect (show (Nothing)) .toEqual ('Nothing');
  expect (show (Just (Nothing))) .toEqual ('Just (Nothing)');
});

test('Either', () => {
  expect (show (Left (2))) .toEqual ('Left (2)');
  expect (show (Right ('text'))) .toEqual ('Right ("text")');
  expect (show (Left (Right ('text')))) .toEqual ('Left (Right ("text"))');
});

test('List', () => {
  expect (show (fromElements (2))) .toEqual ('[2]');
  expect (show (fromElements (1, 2, 3))) .toEqual ('[1, 2, 3]');
  expect (show (fromElements ())) .toEqual ('[]');
});

test('Pair', () => {
  expect (show (fromBoth (2) ('text'))) .toEqual ('(2, "text")');
  expect (show (fromBoth (Just (2)) (fromElements (2)))) .toEqual ('(Just (2), [2])');
});

test('OrderedSet', () => {
  expect (show (fromUniqueElements (2, 3, 2))) .toEqual ('Set (2, 3)');
});

test('Record', () => {
  const creator = fromDefault ({ x: 0, y: 0 });

  expect (show (creator ({ y: 2 }))) .toEqual ('{ x = 0, y = 2 }');
});
