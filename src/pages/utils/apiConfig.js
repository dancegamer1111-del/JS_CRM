// Базовый URL API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Пути API для экспертов
export const EXPERTS_API = {
  LIST: `${API_BASE_URL}/api/v2/experts`,
  SEARCH: `${API_BASE_URL}/api/v2/experts/search`,
  DETAIL: (id) => `${API_BASE_URL}/api/v2/experts/${id}`,
  COLLABORATE: (id) => `${API_BASE_URL}/api/v2/experts/${id}/collaborate`,
  CREATE: `${API_BASE_URL}/api/v2/experts/`
};

// Пути API для вакансий
export const VACANCIES_API = {
  LIST: `${API_BASE_URL}/api/v2/vacancies`,
  SEARCH: `${API_BASE_URL}/api/v2/vacancies/search`,
  DETAILS: (id) => `${API_BASE_URL}/api/v2/vacancies/${id}`,
  APPLY: (id) => `${API_BASE_URL}/api/v2/vacancies/${id}/apply`
};

// Конфигурация для проектов
export const PROJECTS_API = {
  BASE: `${API_BASE_URL}/api/v2/projects`,
  LIST: `${API_BASE_URL}/api/v2/projects/`,
  DETAILS: (id) => `${API_BASE_URL}/api/v2/projects/${id}`,
  CREATE: `${API_BASE_URL}/api/v2/projects/`,
  UPDATE: (id) => `${API_BASE_URL}/api/v2/projects/${id}`,
  DELETE: (id) => `${API_BASE_URL}/api/v2/projects/${id}`,
  VOTE: (id) => `${API_BASE_URL}/api/v2/projects/${id}/vote`,
  APPLY: (id) => `${API_BASE_URL}/api/v2/projects/${id}/applications`,
  STATS: (id) => `${API_BASE_URL}/api/v2/projects/${id}/stats`,
  ACTIVE_VOTING: `${API_BASE_URL}/api/v2/projects/active/voting`,
  ACTIVE_APPLICATIONS: `${API_BASE_URL}/api/v2/projects/active/applications`,
  MY_VOTES: `${API_BASE_URL}/api/v2/projects/my-votes`,
  MY_APPLICATIONS: `${API_BASE_URL}/api/v2/projects/my-applications`,
  UPLOAD_PHOTO: (id) => `${API_BASE_URL}/api/v2/projects/${id}/upload-photo`,
  UPLOAD_GALLERY: (id) => `${API_BASE_URL}/api/v2/projects/${id}/upload-gallery`,
  ADD_PARTICIPANT: (id) => `${API_BASE_URL}/api/v2/projects/${id}/participants`,
  UPLOAD_PARTICIPANT_PHOTO: (projectId, participantId) => `${API_BASE_URL}/api/v2/projects/${projectId}/participants/${participantId}/upload-photo`
};

// Функция для добавления параметров запроса
export const appendQueryParams = (url, params) => {
  if (!params) return url;

  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `${url}?${queryString}` : url;
};