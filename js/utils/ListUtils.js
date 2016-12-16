export const filter = (list, filterText) => {
	if (filterText !== '') {
		filterText = filterText.toLowerCase();
		return list.filter(obj => obj.name.toLowerCase().match(filterText));
	}
	return list;
};

export const sortByName = list => {
	return list.sort((a,b) => {
		if (a.name < b.name) {
			return -1;
		} else if (a.name > b.name) {
			return 1;
		} else {
			return 0;
		}
	});
};

export const sortByGroup = list => {
	return list.sort((a, b) => {
		if (a.gr < b.gr) {
			return -1;
		} else if (a.gr > b.gr) {
			return 1;
		} else {
			if (a.name < b.name) {
				return -1;
			} else if (a.name > b.name) {
				return 1;
			} else {
				return 0;
			}
		}
	});
};

export const sortByAP = list => {
	return list.sort((a, b) => {
		if (a.ap < b.ap) {
			return -1;
		} else if (a.ap > b.ap) {
			return 1;
		} else {
			if (a.name < b.name) {
				return -1;
			} else if (a.name > b.name) {
				return 1;
			} else {
				return 0;
			}
		}
	});
};

export const sort = (list, sortOrder) => {
	switch (sortOrder) {
		case 'name':
			return sortByName(list);
		case 'group':
			return sortByGroup(list);
		
		default:
			return list;
	}
};

export const filterAndSort = (list, filterText, sortOrder) => {
	return sort(filter(list, filterText), sortOrder);
};
