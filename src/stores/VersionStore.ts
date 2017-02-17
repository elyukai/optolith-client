const _major = 1;
const _minor = 0;
const _patch = 0;
const _version = [ _major, _minor, _patch ];

class VersionStoreStatic {

	get() {
		return _version.join('.');
	}

	isLower(version: string) {
		const versionArray = version.split('.').map(e => parseInt(e));
		if (versionArray[0] < _version[0]) {
			return true;
		} else if (versionArray[1] < _version[1]) {
			return true;
		} else if (versionArray[2] < _version[2]) {
			return true;
		} else {
			return false;
		}
	}

}

const VersionStore = new VersionStoreStatic();

export default VersionStore;
