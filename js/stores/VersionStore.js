const _major = 1;
const _minor = 0;
const _patch = 0;
const _version = [ _major, _minor, _patch ];

class _VersionStore {
	
	get() {
		return _version.join('.');
	}

	isLower(version) {
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
	
}

const VersionStore = new _VersionStore();

export default VersionStore;
