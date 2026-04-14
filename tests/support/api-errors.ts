export const API_ERROR_PATTERNS = {
  BAD_REQUEST: /Описание ошибки/i,
  NOT_FOUND: /Персонаж не найден/i,
  FORBIDDEN:
    /Запрещено! Базовые персонажи \(ID 1-31\) доступны только для чтения/i,
  METHOD_NOT_ALLOWED:
    /Метод POST не поддерживается. Используйте GET, PUT, PATCH или DELETE/i,
};