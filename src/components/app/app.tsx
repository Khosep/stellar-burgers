import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useDispatch } from '../../services/store'; // типизированный
import { useEffect } from 'react';
import { getIngredientsData, getUser } from '@slices';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Текущее местоположение запоминаем (чтобы потом видеть фоном при открытии модалки)
  const backgrondLocation = location.state?.background;
  // Запрашиваем с сервера ингредиенты и пользователя
  useEffect(() => {
    dispatch(getUser());
    dispatch(getIngredientsData());
  }, [dispatch]);

  // обрабытываем закрытие модального окна
  const handleModalClose = () => navigate(-1); // переход на предыдущий маршрут

  // Номер заказа для отображение в модальном окне
  const orderNumber = `#${location.pathname.split('/').pop()}`;

  return (
    <div className={styles.app}>
      <AppHeader />
      {/* если есть backgrondLocation (модальное окно открыто), показываем фоном компонент, с которого пришли*/}
      <Routes location={backgrondLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        {/* Лента заказов */}
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        {/* Ингредиент */}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/* Защищенные публичные маршруты */}
        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        {/* Защищенные маршруты для авторизованных пользователей */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute onlyAuthorized>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute onlyAuthorized>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute onlyAuthorized>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        {/* Страница не найдена */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {/* Чтобы рендерилось только при открытом модальном окне (backgroundLocation)
      Позволяет использовать прямую ссылку (backgroundLocation не будет), если маршрут совпадает с модальным окном */}
      {backgrondLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={orderNumber} onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title={orderNumber} onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
