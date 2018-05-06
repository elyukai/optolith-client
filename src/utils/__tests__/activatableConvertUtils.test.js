const ActivatableConvertUtils = require('../activatableConvertUtils');

test('returns correct ActiveObject for selection, input and tier', () => {
  expect(ActivatableConvertUtils.convertUIStateToActiveObject({
    id: 'SA_12345',
    sel: 2,
    tier: 3,
    input: 'Test',
  })).toEqual({
    sid: 'Test',
    tier: 3,
  });
});

test('returns correct ActiveObject for selection and tier', () => {
  expect(ActivatableConvertUtils.convertUIStateToActiveObject({
    id: 'SA_12345',
    sel: 2,
    tier: 3,
  })).toEqual({
    sid: 2,
    tier: 3,
  });
});

test('returns correct ActiveObject for tier', () => {
  expect(ActivatableConvertUtils.convertUIStateToActiveObject({
    id: 'SA_12345',
    tier: 3,
  })).toEqual({
    tier: 3,
  });
});

test('returns correct ActiveObject for active', () => {
  expect(ActivatableConvertUtils.convertUIStateToActiveObject({
    id: 'SA_12345',
  })).toEqual({
  });
});

test('returns correct ActiveObject for active and custom cost', () => {
  expect(ActivatableConvertUtils.convertUIStateToActiveObject({
    id: 'SA_12345',
    customCost: 1234
  })).toEqual({
    cost: 1234
  });
});
