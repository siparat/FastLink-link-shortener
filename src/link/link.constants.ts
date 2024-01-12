export const LINKS = new Map<string, string>();

export const LinkTypes = {
	MAP: Symbol.for('MAP')
};

export const LinkErrorMessages = {
	NO_URL: 'Не передан url',
	BAD_URL: 'Указан не url',
	NOT_FOUND_BY_PATH: 'Такая ссылка не найдена',
	BAD_CASE_TYPE: 'Указан неверный тип, укажите "lower" или "upper"'
};
