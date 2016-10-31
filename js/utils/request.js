import jQuery from 'jQuery';

export function get(path, dataType = 'text') {
	return new Promise((resolve, reject) => {
		jQuery.ajax(
			{
				type: 'GET',
				url: path,
				dataType,
				success: result => resolve(result),
				error: error => reject(error)
			}
		);
	});
}

export function post(path, data) {
	return new Promise((resolve, reject) => {
		jQuery.ajax(
			{
				type: 'POST',
				url: path,
				data,
				success: result => resolve(result),
				error: error => reject(error)
			}
		);
	});
}

export default { get, post };
