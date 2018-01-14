export function isDialogOpen() {
	const modalQuery = 'body > div:not(#bodywrapper) > .modal';
	const hasOpenModal = document.querySelector(modalQuery) !== null;
	const slideinQuery = 'body > div:not(#bodywrapper) > .slidein-backdrop';
	const hasOpenSlidein = document.querySelector(slideinQuery) !== null;
	return hasOpenModal || hasOpenSlidein;
}
