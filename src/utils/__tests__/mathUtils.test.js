const Math = require ('../mathUtils');

test('add', () => {
  expect (Math.add (1) (2)) .toEqual (3);
});

test('subtract', () => {
  expect (Math.subtract (1) (2)) .toEqual (-1);
});

test('subtractBy', () => {
  expect (Math.subtractBy (1) (2)) .toEqual (1);
});

test('multiply', () => {
  expect (Math.multiply (1) (2)) .toEqual (2);
});

test('divide', () => {
  expect (Math.divide (1) (2)) .toEqual (0.5);
});

test('divideBy', () => {
  expect (Math.divideBy (1) (2)) .toEqual (2);
});

test('even', () => {
  expect (Math.even (1)) .toEqual (false);
  expect (Math.even (2)) .toEqual (true);
});

test('odd', () => {
  expect (Math.odd (1)) .toEqual (true);
  expect (Math.odd (2)) .toEqual (false);
});

test('gt', () => {
  expect (Math.gt (3) (5)) .toEqual (true);
  expect (Math.gt (3) (3)) .toEqual (false);
  expect (Math.gt (3) (1)) .toEqual (false);
});

test('gte', () => {
  expect (Math.gte (3) (5)) .toEqual (true);
  expect (Math.gte (3) (3)) .toEqual (true);
  expect (Math.gte (3) (1)) .toEqual (false);
});

test('lt', () => {
  expect (Math.lt (3) (5)) .toEqual (false);
  expect (Math.lt (3) (3)) .toEqual (false);
  expect (Math.lt (3) (1)) .toEqual (true);
});

test('lte', () => {
  expect (Math.lte (3) (5)) .toEqual (false);
  expect (Math.lte (3) (3)) .toEqual (true);
  expect (Math.lte (3) (1)) .toEqual (true);
});

test('min', () => {
  expect (Math.min (3) (5)) .toEqual (3);
  expect (Math.min (6) (5)) .toEqual (5);
});

test('max', () => {
  expect (Math.max (3) (5)) .toEqual (5);
  expect (Math.max (6) (5)) .toEqual (6);
});
