import { getAC, getIC } from '../ic.js';

it('returns 45 ap cost for SR 16 IC 5', () => {
	const ap = getIC(16, 5);
	expect(ap).toBe(45);
});

it('returns 4 ap cost for activating IC 4', () => {
	const ap = getAC(4);
	expect(ap).toBe(4);
});
