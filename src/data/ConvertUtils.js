export function splitList(list) {
	if (/\&\&/.test(list)) {
		return list.split('&&');
	}
	return list.split('&');
}
