// AC = Activation Cost
// IC = Improvement Cost

export function getAC(ic) {
	return ic === 5 ? 15 : ic;
}

export function getIC(ic, sr) {
	const f = ic === 5 ? 15 : ic;
	if (sr < 12 || (ic === 5 && sr < 14)) {
		return f;
	} else {
		return (sr - (ic === 5 ? 13 : 11)) * f;
	}
}

export default { getAC, getIC };
