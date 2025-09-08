import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '../../../../../components/layouts/AdminLayout';

// Иконки для кнопок и элементов
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const CrossIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 1.586A2 2 0 0114 2.5V8a1 1 0 11-2 0V4.414L6.414 10H8a1 1 0 010 2H5a2 2 0 01-2-2V5.586L8.586 0a2 2 0 012.828 0l2.828 2.828z" clipRule="evenodd" /><path fillRule="evenodd" d="M12.586 1.586A2 2 0 0114 2.5V8a1 1 0 11-2 0V4.414L6.414 10H8a1 1 0 010 2H5a2 2 0 01-2-2V5.586L8.586 0a2 2 0 012.828 0l2.828 2.828z" clipRule="evenodd" transform="rotate(180 10 10)" /></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" /></svg>;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function AdminProjectDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { lang = 'ru' } = router.query;

  const [project, setProject] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [languageTab, setLanguageTab] = useState('kz'); // Новое состояние для языковых вкладок

  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [participantLanguageTab, setParticipantLanguageTab] = useState('kz'); // Языковая вкладка для модального окна

  const [participantForm, setParticipantForm] = useState({
    name: '',
    description: '', // Казахское описание
    description_ru: '', // Русское описание
    video_url: '',
    instagram_url: '',
    facebook_url: '',
    linkedin_url: '',
    twitter_url: ''
  });

  const [selectedParticipantPhoto, setSelectedParticipantPhoto] = useState(null);

  useEffect(() => {
    if (id) {
      loadProjectDetails();
    }
  }, [id]);

  const loadProjectDetails = async () => {
    try {
      setLoading(true);
      const projectResponse = await fetch(`${API_BASE_URL}/api/v2/projects/${id}`);
      const projectData = await projectResponse.json();

      if (projectResponse.ok) {
        setProject(projectData);
        if (projectData.project_type === 'voting' && projectData.participants) {
          setParticipants(projectData.participants);
        }
        if (projectData.project_type === 'application') {
          loadApplications();
        }
      } else {
        setError(projectData.detail || 'Проект не найден');
      }
    } catch (error) {
      console.error('Ошибка загрузки проекта:', error);
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v2/projects/${id}/applications`);
      const data = await response.json();
      if (response.ok) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
    }
  };

  const handleAddParticipant = async (e) => {
    e.preventDefault();

    // Проверяем обязательные поля
    if (!participantForm.name.trim()) {
      alert('Введите имя участника');
      return;
    }

    try {
      // Формируем данные согласно VotingParticipantCreate модели
      const participantData = {
        name: participantForm.name,
        description: participantForm.description || null,
        description_ru: participantForm.description_ru || null,
        video_url: participantForm.video_url || null,
        instagram_url: participantForm.instagram_url || null,
        facebook_url: participantForm.facebook_url || null,
        linkedin_url: participantForm.linkedin_url || null,
        twitter_url: participantForm.twitter_url || null
      };

      const response = await fetch(`${API_BASE_URL}/api/v2/projects/${id}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participantData)
      });

      const data = await response.json();

      if (response.ok) {
        if (selectedParticipantPhoto) {
          const photoFormData = new FormData();
          photoFormData.append('file', selectedParticipantPhoto);
          await fetch(`${API_BASE_URL}/api/v2/projects/${id}/participants/${data.participant_id}/upload-photo`, {
            method: 'POST',
            body: photoFormData
          });
        }
        loadProjectDetails();
        setParticipantForm({
          name: '',
          description: '',
          description_ru: '',
          video_url: '',
          instagram_url: '',
          facebook_url: '',
          linkedin_url: '',
          twitter_url: ''
        });
        setSelectedParticipantPhoto(null);
        setShowParticipantModal(false);
        setParticipantLanguageTab('kz'); // Сброс языковой вкладки
      } else {
        alert('Ошибка добавления участника: ' + (data.detail || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Ошибка добавления участника:', error);
      alert('Ошибка добавления участника');
    }
  };

  const handleDeleteParticipant = async (participantId) => {
    if (!confirm('Удалить участника? Все голоса за него будут удалены.')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/v2/projects/participants/${participantId}`, { method: 'DELETE' });
      if (response.ok) {
        loadProjectDetails();
      } else {
        const data = await response.json();
        alert('Ошибка удаления: ' + (data.detail || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Ошибка удаления участника:', error);
      alert('Ошибка удаления участника');
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status, comment = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v2/projects/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, comment })
      });
      if (response.ok) {
        loadApplications();
      } else {
        const data = await response.json();
        alert('Ошибка обновления статуса: ' + (data.detail || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
      alert('Ошибка обновления статуса заявки');
    }
  };

  const handleActivateProject = async () => {
    if (!confirm('Активировать проект? Пользователи смогут начать взаимодействие с ним.')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/v2/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      });
      if (response.ok) {
        loadProjectDetails();
      } else {
        const data = await response.json();
        alert('Ошибка активации: ' + (data.detail || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Ошибка активации:', error);
      alert('Ошибка активации проекта');
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

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Функция для получения текста в зависимости от выбранного языка
  const getLocalizedText = (kazakh, russian) => {
    return languageTab === 'kz' ? kazakh : russian;
  };

  // Компонент языковых вкладок
  const renderLanguageTabs = () => (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
      <button
        type="button"
        onClick={() => setLanguageTab('kz')}
        className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          languageTab === 'kz'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <GlobeIcon />
        Қазақша
      </button>
      <button
        type="button"
        onClick={() => setLanguageTab('ru')}
        className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          languageTab === 'ru'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <GlobeIcon />
        Русский
      </button>
    </div>
  );

  // Компонент языковых вкладок для модального окна участника
  const renderParticipantLanguageTabs = () => (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
      <button
        type="button"
        onClick={() => setParticipantLanguageTab('kz')}
        className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          participantLanguageTab === 'kz'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <GlobeIcon />
        Қазақша
      </button>
      <button
        type="button"
        onClick={() => setParticipantLanguageTab('ru')}
        className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          participantLanguageTab === 'ru'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <GlobeIcon />
        Русский
      </button>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout title="Загрузка проекта">
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка данных проекта...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !project) {
    return (
      <AdminLayout title="Ошибка">
        <div className="p-6 text-center text-red-600">{error || 'Проект не найден'}</div>
        <div className="text-center mt-4">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Назад
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>{getLocalizedText(project.title, project.title_ru)} | Админ-панель</title>
      </Head>

      {/* Header with breadcrumbs and actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <nav className="text-sm font-medium text-gray-500 mb-1">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Назад
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-semibold">{getLocalizedText(project.title, project.title_ru)}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">{getLocalizedText(project.title, project.title_ru)}</h1>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
              {getStatusDisplay(project.status)}
            </span>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {project.project_type === 'voting' ? 'Голосовалка' : 'Прием заявок'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {project.status === 'draft' && (
            <button
              onClick={handleActivateProject}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-md flex items-center"
            >
              <CheckIcon />
              Активировать
            </button>
          )}
          <Link
            href={`/${lang}/admin/projects/${project.id}/edit`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-md flex items-center"
          >
            <EditIcon />
            Редактировать
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 bg-white rounded-xl shadow-lg p-2">
        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200 ${
              activeTab === 'details'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Детали проекта
          </button>
          {project.project_type === 'voting' && (
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200 ${
                activeTab === 'participants'
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Участники ({participants.length})
            </button>
          )}
          {project.project_type === 'application' && (
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200 ${
                activeTab === 'applications'
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Заявки ({applications.length})
            </button>
          )}
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Описание проекта</h3>
                {renderLanguageTabs()}
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Название ({languageTab === 'kz' ? 'қазақша' : 'русский'})
                  </h4>
                  <p className="text-gray-900 font-medium">
                    {getLocalizedText(project.title, project.title_ru)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Описание ({languageTab === 'kz' ? 'қазақша' : 'русский'})
                  </h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {getLocalizedText(project.description, project.description_ru) || 'Описание не заполнено'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Дополнительная информация</h3>
              <dl className="space-y-4">
                <div className="flex items-center">
                  <dt className="text-sm font-medium text-gray-500 flex items-center"><UserIcon /> Автор</dt>
                  <dd className="ml-auto text-sm text-gray-900">{project.author}</dd>
                </div>
                <div className="flex items-center">
                  <dt className="text-sm font-medium text-gray-500 flex items-center"><CalendarIcon /> Даты</dt>
                  <dd className="ml-auto text-sm text-gray-900">
                    {new Date(project.start_date).toLocaleDateString('ru-RU')} - {new Date(project.end_date).toLocaleDateString('ru-RU')}
                  </dd>
                </div>
                <div className="flex items-center">
                  <dt className="text-sm font-medium text-gray-500">Создан</dt>
                  <dd className="ml-auto text-sm text-gray-900">
                    {new Date(project.created_at).toLocaleDateString('ru-RU')}
                  </dd>
                </div>
                {project.project_type === 'voting' && (
                  <div className="flex items-center">
                    <dt className="text-sm font-medium text-gray-500">Всего голосов</dt>
                    <dd className="ml-auto text-sm text-gray-900">{project.total_votes || 0}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

        </div>
      )}

      {/* Participants tab for voting projects */}
      {activeTab === 'participants' && project.project_type === 'voting' && (
        <div>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Участники голосования ({participants.length})
              </h3>
              <button
                onClick={() => setShowParticipantModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-md flex items-center"
              >
                <PlusIcon />
                Добавить участника
              </button>
            </div>
            {participants.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Участники еще не добавлены.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {participants.map((participant) => (
                  <div key={participant.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                    {participant.photo_url && (
                      <img
                        src={participant.photo_url}
                        alt={participant.name}
                        className="w-full h-48 object-cover rounded-lg mb-3 border border-gray-200"
                      />
                    )}
                    <h4 className="font-medium text-gray-900 mb-2">{participant.name}</h4>
                    {participant.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {participant.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-blue-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 16a2.5 2.5 0 002.5-2.5v-10A2.5 2.5 0 005.5 1h-1a2.5 2.5 0 00-2.5 2.5v10A2.5 2.5 0 004.5 16h1zM14.5 4a2.5 2.5 0 00-2.5 2.5v10A2.5 2.5 0 0014.5 19h1a2.5 2.5 0 002.5-2.5v-10A2.5 2.5 0 0015.5 4h-1z" /></svg>
                        {participant.votes_count} голосов
                      </span>
                      <button
                        onClick={() => handleDeleteParticipant(participant.id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Applications tab for application projects */}
      {activeTab === 'applications' && project.project_type === 'application' && (
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Заявки на участие ({applications.length})
          </h3>
          {applications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Заявки еще не поступали.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имя / Телефон</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Описание</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{app.applicant_name || 'Не указано'}</div>
                        <div className="text-sm text-gray-500">{app.phone_number || app.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getApplicationStatusColor(app.status)}`}>
                          {app.status === 'pending' && 'На рассмотрении'}
                          {app.status === 'approved' && 'Одобрена'}
                          {app.status === 'rejected' && 'Отклонена'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs truncate">{app.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {app.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                const comment = prompt('Комментарий (необязательно):');
                                handleUpdateApplicationStatus(app.id, 'approved', comment || '');
                              }}
                              className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm font-medium"
                            >
                              Одобрить
                            </button>
                            <button
                              onClick={() => {
                                const comment = prompt('Причина отклонения:');
                                if (comment) handleUpdateApplicationStatus(app.id, 'rejected', comment);
                              }}
                              className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-medium"
                            >
                              Отклонить
                            </button>
                          </div>
                        )}
                        {app.document_url && (
                          <a href={app.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-2">Документ</a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal for adding participant */}
      {showParticipantModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-6 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-xl bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Добавить нового участника
              </h3>
              <button
                onClick={() => {
                  setShowParticipantModal(false);
                  setParticipantForm({
                    name: '',
                    description: '',
                    description_ru: '',
                    video_url: '',
                    instagram_url: '',
                    facebook_url: '',
                    linkedin_url: '',
                    twitter_url: ''
                  });
                  setSelectedParticipantPhoto(null);
                  setParticipantLanguageTab('kz');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddParticipant} className="space-y-6">
              {/* Имя участника */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя участника*
                </label>
                <input
                  type="text"
                  value={participantForm.name}
                  onChange={(e) => setParticipantForm({...participantForm, name: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Введите имя участника"
                />
              </div>

              {/* Мультиязычное описание */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание участника (мультиязычное)
                </label>

                {renderParticipantLanguageTabs()}

                {participantLanguageTab === 'kz' ? (
                  <textarea
                    value={participantForm.description}
                    onChange={(e) => setParticipantForm({...participantForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Қатысушы туралы қазақша сипаттама..."
                  />
                ) : (
                  <textarea
                    value={participantForm.description_ru}
                    onChange={(e) => setParticipantForm({...participantForm, description_ru: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Описание участника на русском языке..."
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Описание на {participantLanguageTab === 'kz' ? 'казахском' : 'русском'} языке
                </p>
              </div>

              {/* Фото участника */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Фото участника
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedParticipantPhoto(e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                />
                {selectedParticipantPhoto && (
                  <p className="text-xs text-green-600 mt-1">
                    Выбран файл: {selectedParticipantPhoto.name}
                  </p>
                )}
              </div>

              {/* Дополнительные ссылки */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Дополнительные ссылки</h4>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Ссылка на YouTube видео
                  </label>
                  <input
                    type="url"
                    value={participantForm.video_url}
                    onChange={(e) => setParticipantForm({...participantForm, video_url: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={participantForm.instagram_url}
                      onChange={(e) => setParticipantForm({...participantForm, instagram_url: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="https://instagram.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={participantForm.facebook_url}
                      onChange={(e) => setParticipantForm({...participantForm, facebook_url: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="https://facebook.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={participantForm.linkedin_url}
                      onChange={(e) => setParticipantForm({...participantForm, linkedin_url: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={participantForm.twitter_url}
                      onChange={(e) => setParticipantForm({...participantForm, twitter_url: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowParticipantModal(false);
                    setParticipantForm({
                      name: '',
                      description: '',
                      description_ru: '',
                      video_url: '',
                      instagram_url: '',
                      facebook_url: '',
                      linkedin_url: '',
                      twitter_url: ''
                    });
                    setSelectedParticipantPhoto(null);
                    setParticipantLanguageTab('kz');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Добавить участника
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminProjectDetails;
