// config/api.js
// Централизованная конфигурация для API запросов

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',

  // Эндпоинты для администратора
  ADMIN: {
    LOGIN: '/api/v2/admin/login',
    REGISTER: '/api/v2/admin/register',
    PROFILE: '/api/v2/admin/profile',
    CHANGE_PASSWORD: '/api/v2/admin/change-password',
    LIST: '/api/v2/admin/list',
  },

  // Эндпоинты для пользователей
  AUTH: {
    CHECK_PROFILE: '/api/v2/auth/check-profile',
    SEND_OTP: '/api/v2/auth/send-otp',
    VERIFY_OTP: '/api/v2/auth/verify-otp',
    REGISTER_INDIVIDUAL: '/api/v2/auth/register-individual',
    REGISTER_ORGANIZATION: '/api/v2/auth/register-organization',
  },

  // Другие эндпоинты
  PROJECTS: '/api/v2/projects',
  EXPERTS: '/api/v2/experts',
  COURSES: '/api/v2/courses',
  EVENTS: '/api/v2/events',
  VACANCIES: '/api/v2/vacancies',
};

/**
 * Создание полного URL для API запроса
 */
export const createApiUrl = (endpoint) => {
  if (!endpoint || endpoint === 'undefined') {
    console.error('Endpoint is undefined or empty:', endpoint);
    throw new Error('Endpoint не может быть пустым');
  }

  const baseUrl = API_CONFIG.BASE_URL;
  const fullUrl = `${baseUrl}${endpoint}`;

  console.log('Creating API URL:', { endpoint, baseUrl, fullUrl }); // Для отладки

  return fullUrl;
};

/**
 * Универсальная функция для API запросов
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = createApiUrl(endpoint);

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);
    return response;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
};