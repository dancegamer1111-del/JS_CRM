import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import HeaderBack from '../../../../../components/HeaderBack';

// SVG-иконки для полей и кнопок
const TitleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg>;
const DescriptionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M16 16h.01" /></svg>;
const AuthorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 19h10a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-5v12" /></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4a2 2 0 11-4 0 2 2 0 014 0zm10 2a2 2 0 11-4 0 2 2 0 014 0zm-7 2h.01M17 12h.01M17 16h.01M17 20h.01M7 12h.01M7 16h.01M7 20h.01M12 12h.01M12 16h.01M12 20h.01" /></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function AdminProjectEdit() {
  const router = useRouter();
  const { id, lang = 'ru' } = router.query;

  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('kz'); // Языковая вкладка
  const [formData, setFormData] = useState({
    title: '', // Казахский
    title_ru: '', // Русский
    description: '', // Казахский
    description_ru: '', // Русский
    author: '',
    start_date: '',
    end_date: '',
    video_url: '',
    status: 'draft'
  });

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [currentPhoto, setCurrentPhoto] = useState('');

  const getTranslation = (key) => {
    const translations = {
      'ru': {
        'edit.title': 'Редактировать проект',
        'edit.titleKz': 'Название проекта (Казахский)',
        'edit.titleRu': 'Название проекта (Русский)',
        'edit.descriptionKz': 'Описание проекта (Казахский)',
        'edit.descriptionRu': 'Описание проекта (Русский)',
        'edit.author': 'Автор проекта',
        'edit.status': 'Статус проекта',
        'edit.startDate': 'Дата начала',
        'edit.endDate': 'Дата завершения',
        'edit.mainPhoto': 'Основное фото проекта',
        'edit.videoUrl': 'Ссылка на YouTube видео',
        'edit.chooseNewPhoto': 'Выбрать новое фото',
        'edit.cancel': 'Отмена',
        'edit.save': 'Сохранить изменения',
        'edit.saving': 'Сохранение...',
        'edit.multilingualFields': 'Мультиязычный контент',
        'edit.mainData': 'Основные данные',
        'edit.datesAndMedia': 'Даты и медиа',
        'edit.warning': 'Внимание',
        'edit.activeProjectWarning': 'Проект находится в активном состоянии. Изменения основной информации могут повлиять на пользователей.',
        'edit.required': 'Обязательное поле',
        'edit.kazakh': 'Қазақша',
        'edit.russian': 'Русский',
        'status.draft': 'Черновик',
        'status.active': 'Активный',
        'status.completed': 'Завершенный',
        'status.cancelled': 'Отмененный'
      },
      'kz': {
        'edit.title': 'Жобаны өңдеу',
        'edit.titleKz': 'Жоба атауы (Қазақша)',
        'edit.titleRu': 'Жоба атауы (Орысша)',
        'edit.descriptionKz': 'Жоба сипаттамасы (Қазақша)',
        'edit.descriptionRu': 'Жоба сипаттамасы (Орысша)',
        'edit.author': 'Жоба авторы',
        'edit.status': 'Жоба күйі',
        'edit.startDate': 'Басталу күні',
        'edit.endDate': 'Аяқталу күні',
        'edit.mainPhoto': 'Жобаның негізгі фотосы',
        'edit.videoUrl': 'YouTube видео сілтемесі',
        'edit.chooseNewPhoto': 'Жаңа фото таңдау',
        'edit.cancel': 'Болдырмау',
        'edit.save': 'Өзгерістерді сақтау',
        'edit.saving': 'Сақталуда...',
        'edit.multilingualFields': 'Көптілді мазмұн',
        'edit.mainData': 'Негізгі деректер',
        'edit.datesAndMedia': 'Күндер мен медиа',
        'edit.warning': 'Назар аударыңыз',
        'edit.activeProjectWarning': 'Жоба белсенді күйде. Негізгі ақпаратты өзгерту пайдаланушыларға әсер етуі мүмкін.',
        'edit.required': 'Міндетті өріс',
        'edit.kazakh': 'Қазақша',
        'edit.russian': 'Орысша',
        'status.draft': 'Жоба',
        'status.active': 'Белсенді',
        'status.completed': 'Аяқталған',
        'status.cancelled': 'Болдырылған'
      }
    };

    return translations[lang]?.[key] || translations['ru']?.[key] || key;
  };

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      setLoadingPage(true);
      const response = await fetch(`${API_BASE_URL}/api/v2/projects/${id}`);
      const data = await response.json();

      if (response.ok) {
        setFormData({
          title: data.title || '', // Казахский
          title_ru: data.title_ru || '', // Русский
          description: data.description || '', // Казахский
          description_ru: data.description_ru || '', // Русский
          author: data.author || '',
          start_date: new Date(data.start_date).toISOString().slice(0, 16),
          end_date: new Date(data.end_date).toISOString().slice(0, 16),
          video_url: data.video_url || '',
          status: data.status
        });
        setCurrentPhoto(data.photo_url || '');
      } else {
        setError(data.detail || 'Проект не найден');
      }
    } catch (error) {
      console.error('Ошибка загрузки проекта:', error);
      setError('Ошибка загрузки данных');
    } finally {
      setLoadingPage(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      return 'Введите название проекта на казахском языке';
    }
    if (!formData.title_ru.trim()) {
      return 'Введите название проекта на русском языке';
    }
    if (!formData.description.trim()) {
      return 'Введите описание проекта на казахском языке';
    }
    if (!formData.description_ru.trim()) {
      return 'Введите описание проекта на русском языке';
    }
    if (!formData.author.trim()) {
      return 'Введите автора проекта';
    }
    if (!formData.start_date) {
      return 'Выберите дату начала';
    }
    if (!formData.end_date) {
      return 'Выберите дату завершения';
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (endDate <= startDate) {
      return 'Дата завершения должна быть позже даты начала';
    }

    if (formData.video_url && !isValidYouTubeUrl(formData.video_url)) {
      return 'Введите корректную ссылку на YouTube видео';
    }

    return null;
  };

  const isValidYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Формируем данные для отправки в соответствии с новой структурой API
      const updateData = {
        title: formData.title,
        title_ru: formData.title_ru,
        description: formData.description,
        description_ru: formData.description_ru,
        author: formData.author,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        status: formData.status,
        video_url: formData.video_url || null
      };

      const updateResponse = await fetch(`${API_BASE_URL}/api/v2/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!updateResponse.ok) {
        const updateDataResponse = await updateResponse.json();
        throw new Error(updateDataResponse.detail || 'Ошибка обновления проекта');
      }

      // Загружаем фото, если выбрано новое
      if (selectedPhoto) {
        const photoFormData = new FormData();
        photoFormData.append('file', selectedPhoto);

        const photoResponse = await fetch(`${API_BASE_URL}/api/v2/projects/${id}/upload-photo`, {
          method: 'POST',
          body: photoFormData
        });

        if (!photoResponse.ok) {
          console.warn('Ошибка загрузки фото, но проект обновлен');
        }
      }

      router.push(`/${lang}/admin/projects/${id}`);

    } catch (error) {
      console.error('Ошибка обновления проекта:', error);
      setError(error.message || 'Произошла ошибка при обновлении проекта');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!confirm('Удалить текущее фото проекта?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v2/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photo_url: null })
      });

      if (response.ok) {
        setCurrentPhoto('');
        setPhotoPreview('');
        setSelectedPhoto(null);
      } else {
        const data = await response.json();
        alert('Ошибка удаления фото: ' + (data.detail || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Ошибка удаления фото:', error);
      alert('Ошибка удаления фото');
    }
  };

  // Компонент языковых вкладок
  const renderLanguageTabs = () => (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
      <button
        type="button"
        onClick={() => setActiveTab('kz')}
        className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          activeTab === 'kz'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <GlobeIcon />
        {getTranslation('edit.kazakh')}
      </button>
      <button
        type="button"
        onClick={() => setActiveTab('ru')}
        className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          activeTab === 'ru'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <GlobeIcon />
        {getTranslation('edit.russian')}
      </button>
    </div>
  );

  // Компонент полей контента
  const renderContentFields = () => {
    const isKazakh = activeTab === 'kz';
    const titleField = isKazakh ? 'title' : 'title_ru';
    const descriptionField = isKazakh ? 'description' : 'description_ru';
    const titlePlaceholder = isKazakh ? 'Жоба атауын енгізіңіз' : 'Введите название проекта';
    const descriptionPlaceholder = isKazakh ? 'Жобаңызды толық сипаттаңыз...' : 'Подробно опишите ваш проект...';

    return (
      <>
        {/* Project Title */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <TitleIcon />
            {getTranslation(isKazakh ? 'edit.titleKz' : 'edit.titleRu')}*
          </label>
          <input
            type="text"
            name={titleField}
            value={formData[titleField]}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder={titlePlaceholder}
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <DescriptionIcon />
            {getTranslation(isKazakh ? 'edit.descriptionKz' : 'edit.descriptionRu')}*
          </label>
          <textarea
            name={descriptionField}
            value={formData[descriptionField]}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder={descriptionPlaceholder}
          />
        </div>
      </>
    );
  };

  // Компонент загрузки
  if (loadingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Основной рендеринг
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{getTranslation('edit.title')} | Админ-панель</title>
      </Head>

      <HeaderBack
        title={getTranslation('edit.title')}
        onBack={() => router.back()}
      />

      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white shadow rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Мультиязычные поля */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <GlobeIcon />
                {getTranslation('edit.multilingualFields')}
              </h2>

              {renderLanguageTabs()}

              <div className="space-y-6">
                {renderContentFields()}
              </div>
            </div>

            {/* Основная информация */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {getTranslation('edit.mainData')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <AuthorIcon />
                    {getTranslation('edit.author')}*
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Имя автора или организации"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getTranslation('edit.status')}
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="draft">{getTranslation('status.draft')}</option>
                    <option value="active">{getTranslation('status.active')}</option>
                    <option value="completed">{getTranslation('status.completed')}</option>
                    <option value="cancelled">{getTranslation('status.cancelled')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Даты и медиа */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {getTranslation('edit.datesAndMedia')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <CalendarIcon />
                    {getTranslation('edit.startDate')}*
                  </label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <CalendarIcon />
                    {getTranslation('edit.endDate')}*
                  </label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Фото */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <UploadIcon />
                  {getTranslation('edit.mainPhoto')}
                </label>

                {(currentPhoto || photoPreview) && (
                  <div className="relative inline-block mb-4">
                    <img
                      src={photoPreview || currentPhoto}
                      alt="Предпросмотр фото"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                    {currentPhoto && (
                      <button
                        type="button"
                        onClick={handleDeletePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-blue-500 rounded-lg shadow-sm bg-white text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <UploadIcon />
                    {getTranslation('edit.chooseNewPhoto')}
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Видео */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <VideoIcon />
                  {getTranslation('edit.videoUrl')}
                </label>
                <input
                  type="url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Необязательно. Ссылка на презентационное видео проекта
                </p>
              </div>
            </div>

            {/* Предупреждение для активных проектов */}
            {formData.status === 'active' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      {getTranslation('edit.warning')}
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      {getTranslation('edit.activeProjectWarning')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Ошибка */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Кнопки */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href={`/${lang}/admin/projects/${id}`}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                {getTranslation('edit.cancel')}
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 border border-transparent rounded-lg shadow-sm text-white font-medium flex items-center justify-center ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {getTranslation('edit.saving')}
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    {getTranslation('edit.save')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AdminProjectEdit;