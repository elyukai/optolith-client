const _major = 1;
const _minor = 0;
const _patch = 0;
const _version = [ _major, _minor, _patch ];

var VersionStore = {
	
	get: function() {
		return _version.join('.');
	},

	isLower: function(version) {
		version = version.split('.').map(e => parseInt(e));
		if (version[0] < _version[0]) {
			return true;
		} else if (version[1] < _version[1]) {
			return true;
		} else if (version[2] < _version[2]) {
			return true;
		} else {
			return false;
		}
	}
	
};

export default VersionStore;
