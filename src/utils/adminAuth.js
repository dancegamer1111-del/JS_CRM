// utils/adminAuth.js
// Утилиты для работы с авторизацией администратора

/**
 * Получение токена из localStorage (единый ключ для всех пользователей)
 */
export const getAdminToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token'); // Используем единый ключ 'token'
};

/**
 * Получение данных администратора из localStorage
 */
export const getAdminData = () => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('admin_data');
  return data ? JSON.parse(data) : null;
};

/**
 * Сохранение токена и данных администратора
 */
export const setAdminAuth = (token, adminData) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token); // Используем единый ключ 'token'
  localStorage.setItem('admin_data', JSON.stringify(adminData));
};

/**
 * Удаление данных авторизации администратора
 */
export const clearAdminAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token'); // Используем единый ключ 'token'
  localStorage.removeItem('admin_data');
};

/**
 * Проверка, авторизован ли администратор
 */
export const isAdminAuthenticated = () => {
  const token = getAdminToken();
  return !!token;
};

/**
 * Создание заголовков с токеном авторизации
 */
export const getAdminAuthHeaders = () => {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Выход из системы администратора
 */
export const logoutAdmin = () => {
  clearAdminAuth();
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/auth';
  }
};

/**
 * API запрос с автоматической обработкой авторизации
 */
export const adminApiRequest = async (url, options = {}) => {
  const headers = getAdminAuthHeaders();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Проверяем что url не undefined и не пустая строка
  if (!url || url === 'undefined') {
    throw new Error('URL не может быть пустым или undefined');
  }

  // Добавляем базовый URL если путь относительный
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;

  console.log('Making API request to:', fullUrl); // Для отладки

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    // Если токен недействителен, перенаправляем на авторизацию
    if (response.status === 401) {
      clearAdminAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/auth';
      }
      throw new Error('Необходима повторная авторизация');
    }

    return response;
  } catch (error) {
    console.error('Admin API request error:', error);
    throw error;
  }
};

/**
 * HOC для защиты страниц администратора
 */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const withAdminAuth = (WrappedComponent) => {
  return function AdminProtectedComponent(props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = getAdminToken();

      if (!token) {
        router.push('/admin/auth');
        return;
      }

      // Проверяем действительность токена
      adminApiRequest('/api/v2/admin/profile')
        .then(() => {
          setIsAuthenticated(true);
          setIsLoading(false);
        })
        .catch(() => {
          clearAdminAuth();
          router.push('/admin/auth');
        });
    }, [router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

/**
 * Hook для получения данных администратора
 */

export const useAdminAuth = () => {
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = getAdminData();
    setAdminData(data);
    setIsLoading(false);
  }, []);

  const updateAdminData = (newData) => {
    setAdminData(newData);
    setAdminAuth(getAdminToken(), newData);
  };

  return {
    adminData,
    isLoading,
    updateAdminData,
    isAuthenticated: isAdminAuthenticated(),
    logout: logoutAdmin,
  };
};