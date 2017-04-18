import semver from 'semver';

class VersionStoreStatic {
	private version = '0.44.4';

	get() {
		return this.version;
	}
}

const VersionStore = new VersionStoreStatic();

export default VersionStore;
