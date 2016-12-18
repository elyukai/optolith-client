export const filter = (list, filterText) => {
	if (filterText !== '') {
		filterText = filterText.toLowerCase();
		return list.filter(obj => obj.name.toLowerCase().match(filterText));
	}
	return list;
};

export const sortByName = (list, sex) => {
	if (sex) {
		return list.sort((a,b) => {
			let an = a.name[sex] || a.name;
			let bn = b.name[sex] || b.name;
			if (an < bn) {
				return -1;
			} else if (an > bn) {
				return 1;
			} else {
				return 0;
			}
		});
	}
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

export const sortByCost = (list, sex) => {
	if (sex) {
		return list.sort((a, b) => {
			let an = a.name[sex] || a.name;
			let bn = b.name[sex] || b.name;
			if (a.ap < b.ap) {
				return -1;
			} else if (a.ap > b.ap) {
				return 1;
			} else {
				if (an < bn) {
					return -1;
				} else if (an > bn) {
					return 1;
				} else {
					return 0;
				}
			}
		});
	}
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

export const sort = (list, sortOrder, sex) => {
	switch (sortOrder) {
		case 'name':
			return sortByName(list, sex);
		case 'group':
			return sortByGroup(list, sex);
		case 'cost':
			return sortByCost(list, sex);
		
		default:
			return list;
	}
};

export const filterAndSort = (list, filterText, sortOrder, sex) => {
	return sort(filter(list, filterText), sortOrder, sex);
};
