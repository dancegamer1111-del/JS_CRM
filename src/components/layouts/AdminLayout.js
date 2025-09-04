import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

// Компонент-заглушка для разделов в разработке
const UnderDevelopment = () => (
  <div className="flex-1 p-6 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Раздел находится в разработке 🚧</h2>
      <p className="text-gray-600">
        Извините за неудобства. Скоро здесь появится новый функционал.
      </p>
    </div>
  </div>
);

const AdminLayout = ({ children, title = 'Админ-панель курсов' }) => {
  const router = useRouter();
  const { lang = 'ru' } = router.query;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isProjectsSection = router.pathname.includes('/admin/projects');

  // Определяем, какой раздел должен быть открыт
  const getInitialOpenSections = () => {
    const path = router.pathname;
    return {
      courses: path.includes('/admin/courses') ||
               path.includes('/admin/moderation') ||
               path.includes('/admin/statistics') ||
               path.includes('/admin/categories'),
      vacancies: path.includes('/admin/vacancies'),
      events: path.includes('/events'),
      projects: path.includes('/admin/projects')
    };
  };

  const [openSections, setOpenSections] = useState({
    courses: false,
    vacancies: false,
    events: false,
    projects: false
  });

  useEffect(() => {
    const activeSections = getInitialOpenSections();
    setOpenSections(prev => ({
      ...prev,
      ...activeSections
    }));
  }, [router.pathname]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');

      if (!token) {
        const returnUrl = encodeURIComponent(router.asPath);
        router.replace(`/${lang}/auth?returnUrl=${returnUrl}`);
      } else {
        setIsAuthorized(true);
        // Перенаправляем на страницу проектов, если текущий путь не связан с проектами
        if (router.pathname === `/${lang}/admin/dashboard` || router.pathname === `/${lang}/admin`) {
          router.replace(`/${lang}/admin/projects/list`);
        }
      }
      setIsLoading(false);
    }
  }, [router, lang]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('phoneNumber');
    router.push(`/${lang}/auth`);
  };

  const isActive = (path) => {
    return router.pathname.startsWith(path) ? 'bg-blue-700' : '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
          <p className="mt-3 text-blue-900">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Административная панель для управления курсами" />
      </Head>

      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Управление курсами</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Администратор</span>
            <button
              className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded-md text-sm transition-colors"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-blue-900 text-white overflow-y-auto">
          <nav className="py-6 sticky top-0">
            <ul className="space-y-1">
              <li>
                <Link href={`/${lang}/admin/dashboard`}
                  className={`block px-4 py-2 hover:bg-blue-700 transition-colors ${isActive(`/${lang}/admin/dashboard`)}`}>
                  Панель управления
                </Link>
              </li>

              {/* Раздел КУРСЫ */}
              <li>
                <button
                  onClick={() => toggleSection('courses')}
                  className="w-full flex justify-between items-center px-4 py-2 text-blue-300 hover:bg-blue-800 text-sm font-semibold mt-4"
                >
                  <span>КУРСЫ</span>
                  <span className="text-xs">{openSections.courses ? '▼' : '►'}</span>
                </button>
                {openSections.courses && (
                  <ul className="pl-2">
                    <li>
                      <Link href={`/${lang}/admin/courses`}
                        className={`block px-4 py-2 hover:bg-blue-700 transition-colors ${isActive(`/${lang}/admin/courses`)}`}>
                        Все курсы
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${lang}/admin/courses/create`}
                        className={`block px-4 py-2 hover:bg-blue-700 transition-colors ${isActive(`/${lang}/admin/courses/create`)}`}>
                        Создать курс
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${lang}/admin/moderation`}
                        className={`block px-4 py-2 hover:bg-blue-700 transition-colors ${isActive(`/${lang}/admin/moderation`)}`}>
                        Модерация курсов
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${lang}/admin/statistics`}
                        className={`block px-4 py-2 hover:bg-blue-700 transition-colors ${isActive(`/${lang}/admin/statistics`)}`}>
                        Статистика по курсам
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${lang}/admin/categories`}
                        className={`block px-4 py-2 hover:bg-blue-700 transition-colors ${isActive(`/${lang}/admin/categories`)}`}>
                        Категории курсов
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Раздел ВАКАНСИИ */}
              <li>
                <button
                  onClick={() => toggleSection('vacancies')}
                  className="w-full flex justify-between items-center px-4 py-2 text-blue-300 hover:bg-blue-800 text-sm font-semibold mt-2"
                >
                  <span>ВАКАНСИИ</span>
                  <span className="text-xs">{openSections.vacancies ? '▼' : '►'}</span>
                </button>
                {openSections.vacancies && (
                  <ul className="pl-2">
                    <li>
                      <Link href={`/${lang}/admin/vacancies`}
                        className={`block px-4 py-2 hover:bg-blue-700 transition-colors ${isActive(`/${lang}/admin/vacancies`)}`}>
                        Управление вакансиями
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Раздел МЕРОПРИЯТИЯ */}
              <li>
                <button
                  onClick={() => toggleSection('events')}
                  className="w-full flex justify-between items-center px-4 py-2 text-blue-300 hover:bg-blue-800 text-sm font-semibold mt-2"
                >
                  <span>МЕРОПРИЯТИЯ</span>
                  <span className="text-xs">{openSections.events ? '▼' : '►'}</span>
                </button>
                {openSections.events && (
                  <ul className="pl-2">
                    <li>
                      <Link href={`/${lang}/events`}
                        className={`block px-4 py-2 hover:bg-blue-700 transition-colors ${isActive(`/${lang}/events`)}`}>
                        Управление мероприятиями
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${lang}/events/create`}
                        className={`block px-4 py-2 hover:bg-blue-700 transition-colors ${isActive(`/${lang}/events/create`)}`}>
                        Создать новое мероприятие
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

               {/* Раздел ПРОЕКТЫ */}
              <li>
                <button
                  onClick={() => toggleSection('projects')}
                  className="w-full flex justify-between items-center px-4 py-2 text-blue-300 hover:bg-blue-800 text-sm font-semibold mt-2"
                >
                  <span>ПРОЕКТЫ</span>
                  <span className="text-xs">{openSections.projects ? '▼' : '►'}</span>
                </button>
                {openSections.projects && (
                  <ul className="pl-2">
                    <li>
                      <Link href={`/${lang}/admin/projects/list`}
                        className={`block px-4 py-2 hover:bg-blue-700 transition-colors ${isActive(`/${lang}/admin/projects/list`)}`}>
                        Управление проектами
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${lang}/admin/projects/create`}
                        className={`block px-4 py-2 hover:bg-blue-700 transition-colors ${isActive(`/${lang}/admin/projects/create`)}`}>
                        Создать новый проект
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </aside>

        {/* Основное содержимое */}
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          {isProjectsSection ? (
            children
          ) : (
            <UnderDevelopment />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;