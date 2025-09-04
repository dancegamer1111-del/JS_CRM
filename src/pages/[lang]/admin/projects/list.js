import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '../../../../components/layouts/AdminLayout';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function AdminProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    type: '',
    status: '',
    search: ''
  });

  const router = useRouter();
  const { lang = 'ru' } = router.query;

  useEffect(() => {
    loadProjects();
  }, [filter]);

  const loadProjects = async () => {
    try {
      setLoading(true);

      let url = `${API_BASE_URL}/api/v2/projects/`;
      const params = new URLSearchParams();

      if (filter.type) params.append('project_type', filter.type);
      if (filter.status) params.append('status', filter.status);
      params.append('limit', '50');


      if (filter.search) {
        url = `${API_BASE_URL}/api/v2/projects/search`;
        params.append('q', filter.search);
      }

      const fullUrl = `${url}?${params.toString()}`;
      const response = await fetch(fullUrl);
      const data = await response.json();

      if (response.ok) {
        setProjects(filter.search ? data.projects : data);
      } else {
        setError(data.detail || 'Ошибка загрузки проектов');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v2/projects/${projectId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId));
      } else {
        const data = await response.json();
        alert('Ошибка удаления: ' + (data.detail || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка удаления проекта');
    }
  };

  const handleCompleteProject = async (projectId) => {
    if (!window.confirm('Завершить проект? Это действие нельзя отменить.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v2/projects/${projectId}/complete`, {
        method: 'POST'
      });

      if (response.ok) {
        loadProjects();
      } else {
        const data = await response.json();
        alert('Ошибка: ' + (data.detail || 'Не удалось завершить проект'));
      }
    } catch (error) {
      console.error('Ошибка завершения:', error);
      alert('Ошибка завершения проекта');
    }
  };

  const getProjectTypeDisplay = (type) => {
    switch (type) {
      case 'voting': return 'Голосовалка';
      case 'application': return 'Прием заявок';
      default: return type;
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'draft': return 'Черновик';
      case 'active': return 'Активный';
      case 'completed': return 'Завершенный';
      case 'cancelled': return 'Отмененный';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-200 text-gray-800';
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Управление проектами">
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка проектов...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Управление проектами">
        <div className="p-6 text-center text-red-600">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Управление проектами">
      <Head>
        <title>Управление проектами | Админ-панель</title>
      </Head>

      {/* Header and actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Список проектов</h2>
        <Link
          href={`/${lang}/admin/projects/create`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-colors duration-200 ease-in-out"
        >
          <span className="mr-2">+</span> Создать проект
        </Link>
      </div>

      {/* Filters Panel */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="col-span-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Поиск
            </label>
            <input
              id="search"
              type="text"
              value={filter.search}
              onChange={(e) => setFilter({...filter, search: e.target.value})}
              placeholder="Поиск по названию..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="col-span-1">
            <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
              Тип проекта
            </label>
            <select
              id="projectType"
              value={filter.type}
              onChange={(e) => setFilter({...filter, type: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="">Все типы</option>
              <option value="voting">Голосовалка</option>
              <option value="application">Прием заявок</option>
            </select>
          </div>

          <div className="col-span-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Статус
            </label>
            <select
              id="status"
              value={filter.status}
              onChange={(e) => setFilter({...filter, status: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="">Все статусы</option>
              <option value="draft">Черновик</option>
              <option value="active">Активный</option>
              <option value="completed">Завершенный</option>
              <option value="cancelled">Отмененный</option>
            </select>
          </div>

          <div className="col-span-1">
            <button
              onClick={loadProjects}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-colors duration-200"
            >
              Применить
            </button>
          </div>
        </div>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-10 text-center text-gray-600">
          <p>Проекты не найдены. Попробуйте изменить фильтры или создайте новый проект.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 ease-in-out">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                    {getStatusDisplay(project.status)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 space-x-2">
                  <span className="inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {project.author}
                  </span>
                  <span className="inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {new Date(project.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <span className="mt-2 inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {getProjectTypeDisplay(project.project_type)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-3">
                <Link
                  href={`/${lang}/admin/projects/${project.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex-1 text-center"
                >
                  Детали
                </Link>
                <Link
                  href={`/${lang}/admin/projects/${project.id}/edit`}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors duration-200 flex-1 text-center"
                >
                  Редактировать
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminProjectsList;