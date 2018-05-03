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

test('does not flatten plain array', () => {
  expect(ActivatableConvertUtils.flattenPrerequisites(['RCP'])).toEqual(['RCP']);
});

test('flattens Map on activation/deactivation', () => {
  const prerequisites = new Map([[1, ['RCP']], [2, { id: 'SA_12345', active: true }]]);
  expect(ActivatableConvertUtils.flattenPrerequisites(prerequisites, 1)).toEqual(['RCP']);
});

test('flattens Map on activation/deactivation with higher level', () => {
  const prerequisites = new Map([[1, ['RCP']], [2, { id: 'SA_12345', active: true }]]);
  expect(ActivatableConvertUtils.flattenPrerequisites(prerequisites, 2))
    .toEqual(['RCP', { id: 'SA_12345', active: true }]);
});

test('flattens Map on level change', () => {
  const prerequisites = new Map([
    [1, ['RCP']],
    [2, { id: 'SA_12345', active: true }],
    [3, { id: 'SA_123', sid: 2 }],
    [4, { id: 'SA_1', tier: 3 }],
  ]);

  expect(ActivatableConvertUtils.flattenPrerequisites(prerequisites, 2, 4))
    .toEqual([{ id: 'SA_123', sid: 2 }, { id: 'SA_1', tier: 3 }]);
});
