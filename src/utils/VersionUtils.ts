class VersionStoreStatic {
	private major = 1;
	private minor = 0;
	private patch = 0;
	private version = [ this.major, this.minor, this.patch ];

	get() {
		return this.version.join('.');
	}

	isLower(version: string) {
		const versionArray = version.split('.').map(e => parseInt(e));
		if (versionArray[0] < this.version[0]) {
			return true;
		} else if (versionArray[1] < this.version[1]) {
			return true;
		} else if (versionArray[2] < this.version[2]) {
			return true;
		} else {
			return false;
		}
	}
}

const VersionStore = new VersionStoreStatic();

export default VersionStore;
