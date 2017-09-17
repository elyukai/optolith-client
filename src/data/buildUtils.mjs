export function splitList(list) {
  if (/&&/.test(list)) {
    return list.split('&&');
  }
  return list.split('&');
}

export function convertPrerequisite(string) {
  if (string === 'RCP') {
    return string;
  }
  const obj = JSON.parse(string);
  if (Array.isArray(obj.id)) {
    obj.id = obj.id.map(e => convertAttributeId(e));
  }
  else {
    obj.id = convertAttributeId(obj.id);
  }
  return obj;
}

export function convertRequirements(string) {
  if (string && /&&/.test(string)) {
    return string.split('&&').map(tierString => {
      const [tier, ...prerequisites] = tierString.split('&');
      return [Number.parseInt(tier), prerequisites.map(e => convertPrerequisite(e))];
    });
  }
  return string ? string.split('&').map(e => convertPrerequisite(e)) : [];
}

export function objectToMap(obj) {
  return new Map(Object.entries(obj));
}

export function mapHasKeys(map, keys, mapName) {
  const array = keys.map(e => map.has(e) || e);
  if (array.some(e => typeof e === 'string')) {
    console.error(`${mapName}: Missing keys: ${keys.filter(e => typeof e === 'string').join(', ')}`);
    return false;
  }
  return true;
}

export function validate(list, criteria, listName) {
  const listMap = objectToMap(list);

  let valid = true;

  for (const [keyId, entry] of listMap) {
    const testId = criteria.get('id');
    if (testId && typeof testId.test === 'function') {
      const validKey = testId.test(keyId);
    }
    else {
      console.error(`${listName}: Test function for 'id' missing!`);
      valid = false;
    }
    for (const [key, options] of criteria) {
      const property = entry[key];
      if (property !== undefined || options.optional === true) {
        const validProperty = typeof options.test === 'function' && options.test(property);
        if (!validProperty) {
          console.error(`${listName}: Invalid property ${key} at key ${keyId}: ${typeof property === 'object' ? JSON.stringify(property) : property}.`);
          valid = false;
        }
      }
      else {
        console.error(`${listName}: Required missing property ${key} at key ${keyId}.`);
        valid = false;
      }
    }
  }

  if (valid) {
    console.log(`${listName}: Valid!`);
  }

  return valid;
}

function convertAttributeId(id) {
  switch (id) {
    case 'COU':
      return 'ATTR_1';
    case 'SGC':
      return 'ATTR_2';
    case 'INT':
      return 'ATTR_3';
    case 'CHA':
      return 'ATTR_4';
    case 'DEX':
      return 'ATTR_5';
    case 'AGI':
      return 'ATTR_6';
    case 'CON':
      return 'ATTR_7';
    case 'STR':
      return 'ATTR_8';

    default:
      return id;
  }
}
