module.exports = {
	splitList(list) {
		if (/&&/.test(list)) {
			return list.split('&&');
		}
		return list.split('&');
	},
	convertRequirements(string) {
		return string ? string.split('&').map(e => {
			if (e === 'RCP') {
				return e;
			}
			const obj = JSON.parse(e);
			if (Array.isArray(obj.id)) {
				obj.id = obj.id.map(e => convertAttributeId(e));
			}
			else {
				obj.id = convertAttributeId(obj.id);
			}
			return obj;
		}) : [];
	}
};

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
