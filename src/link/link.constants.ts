export const LINKS = new Map<string, string>();

export const LinkTypes = {
	MAP: Symbol.for('MAP')
};

export const LinkErrorMessages = {
	BAD_URL: 'Не передан url',
	NOT_FOUND_BY_PATH: 'Такая ссылка не найдена'
};
