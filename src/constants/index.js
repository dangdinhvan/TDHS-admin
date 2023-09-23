export const BASE_URL = 'http://103.178.235.240:3000';

export function convertTime(time) {
	const date = new Date(time);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${day}-${month}-${year}`;
}
