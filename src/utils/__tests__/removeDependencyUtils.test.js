const RemoveDependencyUtils = require('../removeDependencyUtils');

test('remove attribute dependency of 10 and delete key', () => {
  const state = {
    attributes: new Map([['ATTR_6', {
      id: 'ATTR_6',
      value: 8,
      mod: 0,
      dependencies: [10]
    }]])
  };

  const actual = [
    ...RemoveDependencyUtils.removeAttributeDependency(state, 'ATTR_6', 10).attributes
  ];

  const expected = [];

  expect(actual).toEqual(expected);
});

test('remove attribute dependency of 10', () => {
  const state = {
    attributes: new Map([['ATTR_6', {
      id: 'ATTR_6',
      value: 12,
      mod: 1,
      dependencies: [8, 10]
    }]])
  };

  const actual = [
    ...RemoveDependencyUtils.removeAttributeDependency(state, 'ATTR_6', 10).attributes
  ];

  const expected = [['ATTR_6', {
    id: 'ATTR_6',
    value: 12,
    mod: 1,
    dependencies: [8]
  }]];

  expect(actual).toEqual(expected);
});

test('remove activatable dependency and delete key', () => {
  const state = {
    specialAbilities: new Map([['SA_8', {
      id: 'SA_8',
      active: [],
      dependencies: [{
        sid: 2,
        sid2: 4,
        tier: 2,
      }]
    }]])
  };

  const actual = [
    ...RemoveDependencyUtils.removeActivatableDependency(state, 'SA_8', {
      sid: 2,
      sid2: 4,
      tier: 2,
    }).specialAbilities
  ];

  const expected = [];

  expect(actual).toEqual(expected);
});

test('remove activatable dependency', () => {
  const state = {
    specialAbilities: new Map([['SA_8', {
      id: 'SA_8',
      active: [{
        sid: 3
      }],
      dependencies: [{
        sid: 3,
      },
      {
        sid: 2,
        sid2: 4,
        tier: 2,
      }]
    }]])
  };

  const actual = [
    ...RemoveDependencyUtils.removeActivatableDependency(state, 'SA_8', {
      sid: 2,
      sid2: 4,
      tier: 2,
    }).specialAbilities
  ];

  const expected = [['SA_8', {
    id: 'SA_8',
    active: [{
      sid: 3
    }],
    dependencies: [{
      sid: 3,
    }]
  }]];

  expect(actual).toEqual(expected);
});

test('remove increasable dependency and delete key', () => {
  const state = {
    spells: new Map([['SPELL_6', {
      id: 'SPELL_6',
      value: 0,
      active: false,
      dependencies: [10]
    }]])
  };

  const actual = [
    ...RemoveDependencyUtils.removeIncreasableDependency(state, 'SPELL_6', 10).spells
  ];

  const expected = [];

  expect(actual).toEqual(expected);
});

test('remove increasable dependency', () => {
  const state = {
    spells: new Map([['SPELL_6', {
      id: 'SPELL_6',
      value: 8,
      active: true,
      dependencies: [8, 10]
    }]])
  };

  const actual = [
    ...RemoveDependencyUtils.removeIncreasableDependency(state, 'SPELL_6', 10).spells
  ];

  const expected = [['SPELL_6', {
    id: 'SPELL_6',
    value: 8,
    active: true,
    dependencies: [8]
  }]];

  expect(actual).toEqual(expected);
});
