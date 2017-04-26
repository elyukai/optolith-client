jest.mock('../../ListStore');

import { Activatable } from '../Activatable';

describe('Activatable', () => {
	var testClass = new Activatable({
		id: 'ID'
	});

	it('initializes with specified option fields', () => {
		testClass.sid = 753;
		expect(testClass.sid).toBe(753);
	});

	it('resets', () => {
		testClass.reset();
		expect(testClass.sid).toBeUndefined();
	});
});
