import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../../../components/Layout';
import HeaderBack from '../../../../components/HeaderBack';

// Иконки для кнопок и элементов
const TypeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3M9 20h6M12 4v16" /></svg>;
const AlignLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5V2l7 5z"></path><path d="M16 16H4a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2z"></path></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

export default function CreateProjectPage() {
  const router = useRouter();
  const { lang } = router.query;
  const [currentLang, setCurrentLang] = useState('ru');
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    project_type: 'voting',
    start_date: '',
    end_date: '',
    video_url: ''
  });

  const [mainPhoto, setMainPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (lang && ['kz', 'ru', 'en'].includes(lang)) {
      setCurrentLang(lang);
    }
  }, [lang]);

  const getTranslation = (key) => {
    const translations = {
      'ru': {
        'createProject.title': 'Создать проект',
        'createProject.projectTitle': 'Название проекта',
        'createProject.projectTitlePlaceholder': 'Введите название проекта',
        'createProject.description': 'Описание проекта',
        'createProject.descriptionPlaceholder': 'Подробно опишите ваш проект...',
        'createProject.author': 'Автор проекта',
        'createProject.authorPlaceholder': 'Ваше имя или организация',
        'createProject.projectType': 'Тип проекта',
        'createProject.voting': 'Голосование',
        'createProject.application': 'Прием заявок',
        'createProject.startDate': 'Дата начала',
        'createProject.endDate': 'Дата завершения',
        'createProject.videoUrl': 'Ссылка на видео (YouTube)',
        'createProject.videoUrlPlaceholder': 'https://youtube.com/watch?v=...',
        'createProject.mainPhoto': 'Основное фото',
        'createProject.choosePhoto': 'Выбрать фото',
        'createProject.cancel': 'Отмена',
        'createProject.createDraft': 'Сохранить как черновик',
        'createProject.createActive': 'Создать и активировать',
        'createProject.creating': 'Создание...',
        'createProject.fillRequired': 'Заполните все обязательные поля',
        'createProject.invalidDate': 'Дата завершения должна быть позже даты начала',
        'createProject.success': 'Проект успешно создан!',
        'createProject.error': 'Ошибка при создании проекта',
        'createProject.required': 'Обязательное поле'
      },
      'kz': {
        'createProject.title': 'Жоба құру',
        'createProject.projectTitle': 'Жоба атауы',
        'createProject.projectTitlePlaceholder': 'Жоба атауын енгізіңіз',
        'createProject.description': 'Жоба сипаттамасы',
        'createProject.descriptionPlaceholder': 'Жобаңызды толық сипаттаңыз...',
        'createProject.author': 'Жоба авторы',
        'createProject.authorPlaceholder': 'Сіздің атыңыз немесе ұйымыңыз',
        'createProject.projectType': 'Жоба түрі',
        'createProject.voting': 'Дауыс беру',
        'createProject.application': 'Өтінімдерді қабылдау',
        'createProject.startDate': 'Басталу күні',
        'createProject.endDate': 'Аяқталу күні',
        'createProject.videoUrl': 'Видео сілтемесі (YouTube)',
        'createProject.videoUrlPlaceholder': 'https://youtube.com/watch?v=...',
        'createProject.mainPhoto': 'Негізгі фото',
        'createProject.choosePhoto': 'Фото таңдау',
        'createProject.cancel': 'Болдырмау',
        'createProject.createDraft': 'Жоба ретінде сақтау',
        'createProject.createActive': 'Құру және белсендіру',
        'createProject.creating': 'Құрылуда...',
        'createProject.fillRequired': 'Барлық міндетті өрістерді толтырыңыз',
        'createProject.invalidDate': 'Аяқталу күні басталу күнінен кейінірек болуы керек',
        'createProject.success': 'Жоба сәтті құрылды!',
        'createProject.error': 'Жоба құру кезінде қате',
        'createProject.required': 'Міндетті өріс'
      }
    };

    return translations[currentLang]?.[key] || translations['ru']?.[key] || key;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainPhoto(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = getTranslation('createProject.required');
    }

    if (!formData.description.trim()) {
      newErrors.description = getTranslation('createProject.required');
    }

    if (!formData.author.trim()) {
      newErrors.author = getTranslation('createProject.required');
    }

    if (!formData.start_date) {
      newErrors.start_date = getTranslation('createProject.required');
    }

    if (!formData.end_date) {
      newErrors.end_date = getTranslation('createProject.required');
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);

      if (endDate <= startDate) {
        newErrors.end_date = getTranslation('createProject.invalidDate');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status = 'draft') => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const projectData = {
        ...formData,
        status
      };

      const response = await fetch(`${API_URL}/api/v2/projects/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Ошибка при создании проекта');
      }

      const result = await response.json();
      const projectId = result.project_id;

      if (mainPhoto) {
        const photoFormData = new FormData();
        photoFormData.append('file', mainPhoto);

        await fetch(`${API_URL}/api/v2/projects/${projectId}/upload-photo`, {
          method: 'POST',
          body: photoFormData
        });
      }

      router.push(`/${currentLang}/projects/manage`);

    } catch (error) {
      console.error('Error creating project:', error);
      setErrors({ general: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>{getTranslation('createProject.title')} | Экспертная платформа</title>
        <meta name="description" content="Создание нового проекта" />
      </Head>

      <HeaderBack
        title={getTranslation('createProject.title')}
        onBack={() => router.back()}
      />

      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {errors.general && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              <p>{errors.general}</p>
            </div>
          )}

          <form className="space-y-8">
            {/* Section: Main Project Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Основные данные проекта
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Title */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <TypeIcon />
                    {getTranslation('createProject.projectTitle')} *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder={getTranslation('createProject.projectTitlePlaceholder')}
                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                {/* Author */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <UserIcon />
                    {getTranslation('createProject.author')} *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder={getTranslation('createProject.authorPlaceholder')}
                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.author ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <AlignLeftIcon />
                  {getTranslation('createProject.description')} *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder={getTranslation('createProject.descriptionPlaceholder')}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Project Type */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FileTextIcon />
                  {getTranslation('createProject.projectType')} *
                </label>
                <select
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="voting">{getTranslation('createProject.voting')}</option>
                  <option value="application">{getTranslation('createProject.application')}</option>
                </select>
              </div>
            </div>

            {/* Section: Dates and Media */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Даты и медиа
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dates */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <CalendarIcon />
                    {getTranslation('createProject.startDate')} *
                  </label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.start_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <CalendarIcon />
                    {getTranslation('createProject.endDate')} *
                  </label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.end_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
                </div>
              </div>

              {/* Video */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  <VideoIcon />
                  {getTranslation('createProject.videoUrl')}
                </label>
                <input
                  type="url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  placeholder={getTranslation('createProject.videoUrlPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Main Photo */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  <UploadIcon />
                  {getTranslation('createProject.mainPhoto')}
                </label>
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="mainPhoto"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-blue-500 rounded-lg shadow-sm bg-white text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <UploadIcon />
                    {getTranslation('createProject.choosePhoto')}
                  </label>
                  {mainPhoto && (
                    <span className="text-sm text-gray-500 truncate">{mainPhoto.name}</span>
                  )}
                </div>

                {mainPhoto && (
                  <div className="mt-4">
                    <img
                      src={URL.createObjectURL(mainPhoto)}
                      alt="Предпросмотр фото"
                      className="w-full max-w-sm h-48 object-cover rounded-xl border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {getTranslation('createProject.cancel')}
              </button>

              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    {getTranslation('createProject.creating')}
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    {getTranslation('createProject.createDraft')}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSubmit('active')}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    {getTranslation('createProject.creating')}
                  </>
                ) : (
                  <>
                    <EyeIcon />
                    {getTranslation('createProject.createActive')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}