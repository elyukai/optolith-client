export default function(obj) {
	if (null == obj || 'object' != typeof obj) {return obj;}
	var copy = obj.constructor(), attr;
	for (attr in obj) {
		if (obj.hasOwnProperty(attr)) {copy[attr] = obj[attr];}
	}
	return copy;
}