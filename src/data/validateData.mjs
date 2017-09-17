import { validate } from './buildUtils.mjs';

const requiredIntegerOptions = {
  test(value) {
    return typeof value === 'number' && Number.isInteger(value);
  }
};

const requiredNumberArrayOptions = {
  test(value) {
    return Array.isArray(value) && value.every(e => typeof e === 'number');
  }
};

const requiredStringNumberArrayOptions = {
  test(value) {
    return Array.isArray(value) && value.every(e => /\d+/.test(e));
  }
};

export function validateRaces(listObject) {
  return validate(listObject, new Map([
    ['id', {
      test(value) {
        return typeof value === 'string' && /\R_\d+/.test(value);
      }
    }],
    ['ap', requiredIntegerOptions],
    ['le', requiredIntegerOptions],
    ['sk', requiredIntegerOptions],
    ['zk', requiredIntegerOptions],
    ['gs', requiredIntegerOptions],
    ['attr', {
      test(value) {
        return Array.isArray(value) && value.every(e => Array.isArray(e) && e.length === 2 && e.every(e => typeof e === 'number'));
      }
    }],
    ['attr_sel', {
      test(value) {
        return Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && Array.isArray(value[1]) && value[1].every(e => typeof e === 'number');
      }
    }],
    ['typ_cultures', requiredStringNumberArrayOptions],
    ['auto_adv', requiredStringNumberArrayOptions],
    ['autoAdvCost', {
      test(value) {
        return Array.isArray(value) && value.every(e => typeof e === 'number') && value.length === 3;
      }
    }],
    ['imp_adv', requiredStringNumberArrayOptions],
    ['imp_dadv', requiredStringNumberArrayOptions],
    ['typ_adv', requiredStringNumberArrayOptions],
    ['typ_dadv', requiredStringNumberArrayOptions],
    ['untyp_adv', requiredStringNumberArrayOptions],
    ['untyp_dadv', requiredStringNumberArrayOptions],
    ['hair', {
      test(value) {
        return Array.isArray(value) && value.every(e => typeof e === 'number') && value.length === 20;
      }
    }],
    ['eyes', {
      test(value) {
        return Array.isArray(value) && value.every(e => typeof e === 'number') && value.length === 20;
      }
    }],
    ['size', {
      test(value) {
        return Array.isArray(value) && value.every((e, index) => index === 0 ? typeof e === 'number' : Array.isArray(e) && e.length === 2 && e.every(e => typeof e === 'number')) && value.length >= 2;
      }
    }],
    ['weight', {
      test(value) {
        return Array.isArray(value) && value.every((e, index) => index === 0 ? typeof e === 'number' : Array.isArray(e) && e.length === 2 && e.every(e => typeof e === 'number')) && value.length >= 2;
      }
    }],
  ]), 'Races');
}
