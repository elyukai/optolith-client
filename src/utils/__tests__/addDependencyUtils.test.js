const AddDependencyUtils = require('../addDependencyUtils');

test('adds attribute dependency of 10', () => {
  const state = {
    attributes: new Map()
  };

  const actual = [
    ...AddDependencyUtils.addAttributeDependency(state, 'ATTR_6', 10).attributes
  ];

  const expected = [['ATTR_6', {
    id: 'ATTR_6',
    value: 8,
    mod: 0,
    dependencies: [10]
  }]];

  expect(actual).toEqual(expected);
});

test('adds attribute dependency of 10 to existing object', () => {
  const state = {
    attributes: new Map([['ATTR_6', {
      id: 'ATTR_6',
      value: 12,
      mod: 1,
      dependencies: [8]
    }]])
  };

  const actual = [
    ...AddDependencyUtils.addAttributeDependency(state, 'ATTR_6', 10).attributes
  ];

  const expected = [['ATTR_6', {
    id: 'ATTR_6',
    value: 12,
    mod: 1,
    dependencies: [8, 10]
  }]];

  expect(actual).toEqual(expected);
});

test('adds activatable dependency', () => {
  const state = {
    specialAbilities: new Map()
  };

  const actual = [
    ...AddDependencyUtils.addActivatableDependency(state, 'SA_8', {
      sid: 2,
      sid2: 4,
      tier: 2,
    }).specialAbilities
  ];

  const expected = [['SA_8', {
    id: 'SA_8',
    active: [],
    dependencies: [{
      sid: 2,
      sid2: 4,
      tier: 2,
    }]
  }]];

  expect(actual).toEqual(expected);
});

test('adds activatable dependency to existing object', () => {
  const state = {
    specialAbilities: new Map([['SA_8', {
      id: 'SA_8',
      active: [{
        sid: 3
      }],
      dependencies: [{
        sid: 3,
      }]
    }]])
  };

  const actual = [
    ...AddDependencyUtils.addActivatableDependency(state, 'SA_8', {
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
    },
    {
      sid: 2,
      sid2: 4,
      tier: 2,
    }]
  }]];

  expect(actual).toEqual(expected);
});

test('adds increasable dependency', () => {
  const state = {
    spells: new Map()
  };

  const actual = [
    ...AddDependencyUtils.addIncreasableDependency(state, 'SPELL_6', 10).spells
  ];

  const expected = [['SPELL_6', {
    id: 'SPELL_6',
    value: 0,
    active: false,
    dependencies: [10]
  }]];

  expect(actual).toEqual(expected);
});

test('adds increasable dependency to existing object', () => {
  const state = {
    spells: new Map([['SPELL_6', {
      id: 'SPELL_6',
      value: 8,
      active: true,
      dependencies: [8]
    }]])
  };

  const actual = [
    ...AddDependencyUtils.addIncreasableDependency(state, 'SPELL_6', 10).spells
  ];

  const expected = [['SPELL_6', {
    id: 'SPELL_6',
    value: 8,
    active: true,
    dependencies: [8, 10]
  }]];

  expect(actual).toEqual(expected);
});
