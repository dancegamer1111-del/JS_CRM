import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import HeaderBack from '../../components/HeaderBack';

export default function AdminAuthPage() {
  const router = useRouter();
  const { redirect } = router.query;

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    login: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      if (isLogin) {
        // Login request
        response = await fetch(`${API_URL}/api/v2/admin/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            login: formData.login,
            password: formData.password,
          }),
        });
      } else {
        // Register request
        response = await fetch(`${API_URL}/api/v2/admin/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            login: formData.login,
            password: formData.password,
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Произошла ошибка');
      }

      if (isLogin) {
        // Save token to localStorage
        localStorage.setItem('admin_token', data.access_token);
        localStorage.setItem('admin_data', JSON.stringify(data.admin_data));

        // Redirect to admin panel or requested page
        const redirectPath = redirect || '/admin/dashboard';
        router.push(redirectPath);
      } else {
        // Show success message for registration
        setSuccess(true);
        // Switch to login form after successful registration
        setTimeout(() => {
          setIsLogin(true);
          setSuccess(false);
          setFormData({
            name: '',
            login: formData.login, // Keep login for convenience
            password: '',
          });
        }, 3000);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle between login and register forms
  const toggleForm = () => {
    setIsLogin(prev => !prev);
    setError(null);
    setFormData({
      name: '',
      login: '',
      password: '',
    });
  };

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      // Already logged in, redirect to admin panel
      router.push('/admin/dashboard');
    }
  }, [router]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Head>
        <title>
          {isLogin ? 'Вход в админ-панель' : 'Регистрация администратора'} | Админ-панель
        </title>
        <meta
          name="description"
          content={isLogin
            ? 'Войдите в административную панель'
            : 'Зарегистрируйте нового администратора'}
        />
      </Head>

      <HeaderBack
        title={isLogin ? 'Вход в систему' : 'Регистрация администратора'}
        onBack={() => router.push('/')}
      />

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">
                Регистрация прошла успешно!
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Администратор успешно зарегистрирован. Теперь можно войти в систему.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    className={`py-2 px-4 text-sm font-medium rounded-l-lg border ${
                      isLogin
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsLogin(true)}
                  >
                    Вход
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 text-sm font-medium rounded-r-lg border ${
                      !isLogin
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsLogin(false)}
                  >
                    Регистрация
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Имя администратора*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={!isLogin}
                      placeholder="Введите полное имя"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1">
                    Логин*
                  </label>
                  <input
                    type="text"
                    id="login"
                    name="login"
                    value={formData.login}
                    onChange={handleInputChange}
                    required
                    placeholder="Введите логин"
                    minLength="3"
                    maxLength="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Пароль*
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Введите пароль"
                    minLength="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  {!isLogin && (
                    <p className="mt-1 text-xs text-gray-500">
                      Пароль должен содержать минимум 6 символов
                    </p>
                  )}
                </div>

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

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      loading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Обработка...
                      </>
                    ) : isLogin ? (
                      'Войти в систему'
                    ) : (
                      'Зарегистрировать администратора'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm">
                {isLogin ? (
                  <p className="text-gray-600">
                    Нет учетной записи администратора?{' '}
                    <button
                      type="button"
                      onClick={toggleForm}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Зарегистрировать
                    </button>
                  </p>
                ) : (
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={toggleForm}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Войти
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Security notice for admin */}
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex">
            <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                Внимание: Административная панель
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                Данная страница предназначена только для администраторов системы.
                Убедитесь, что используете безопасное соединение.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}