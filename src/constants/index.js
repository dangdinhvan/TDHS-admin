export const BASE_URL = 'http://14.225.253.193';

export function convertTime(time) {
	const date = new Date(time);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${day}-${month}-${year}`;
}
