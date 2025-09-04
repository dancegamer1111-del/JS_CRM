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

  const [showParticipantModal, setShowParticipantModal] = useState(false);

  const [participantForm, setParticipantForm] = useState({
    name: '',
    description: '',
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
    try {
      const response = await fetch(`${API_BASE_URL}/api/v2/projects/${id}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participantForm)
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
        setParticipantForm({ name: '', description: '', video_url: '', instagram_url: '', facebook_url: '', linkedin_url: '', twitter_url: '' });
        setSelectedParticipantPhoto(null);
        setShowParticipantModal(false);
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
        <title>{project.title} | Админ-панель</title>
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
            <span className="text-gray-900 font-semibold">{project.title}</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Описание проекта</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{project.description}</p>
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
              </dl>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Медиа</h3>
              {project.photo_url && (
                <div className="mb-4">
                  <img
                    src={project.photo_url}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-xl border border-gray-200"
                  />
                </div>
              )}
              {project.video_url && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-1">Видео</p>
                  <a href={project.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center">
                    <LinkIcon />
                    Смотреть видео
                  </a>
                </div>
              )}
              {project.gallery && project.gallery.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Галерея ({project.gallery.length})</p>
                  <div className="grid grid-cols-2 gap-2">
                    {project.gallery.slice(0, 4).map((image) => (
                      <img
                        key={image.id}
                        src={image.image_url}
                        alt={image.description || 'Фото галереи'}
                        className="w-full h-20 object-cover rounded-md border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}
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
          <div className="relative p-6 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-xl bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Добавить нового участника
              </h3>
              <button
                onClick={() => setShowParticipantModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddParticipant} className="space-y-4">
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={participantForm.description}
                  onChange={(e) => setParticipantForm({...participantForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ссылка на YouTube видео
                </label>
                <input
                  type="url"
                  value={participantForm.video_url}
                  onChange={(e) => setParticipantForm({...participantForm, video_url: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowParticipantModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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