jest.mock('../../stores/APStore');

import { APStore } from '../../stores/APStore';
import iccalc, { getIC } from '../iccalc';

describe('iccalc', () => {
	APStore.getAvailable.mockReturnValue(24);

	it('returns 45 ap cost for SR 16 IC 5', () => {
		const ap = getIC(5, 16);
		expect(ap).toBe(45);
	});

	it('returns 4 ap cost for activating IC 4', () => {
		const ap = getIC(4, 0);
		expect(ap).toBe(4);
	});

	it('accepts to get 15 AP back', () => {
		const valid = iccalc(-15);
		expect(valid).toBe(true);
	});

	it('fails to buy IC 4 SR 18', () => {
		const valid = iccalc(4, 18);
		expect(valid).toBe(false);
	});
});
