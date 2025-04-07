import { Preloader } from '@ui';

import { Navigate, useLocation } from 'react-router';
import { useSelector } from '../../services/store';
import { isLoadingSelector, isAuthorizedSelector } from '@slices';

type ProtectedRouteProps = {
  onlyAuthorized?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyAuthorized,
  children
}: ProtectedRouteProps) => {
  const isLoading = useSelector(isLoadingSelector);
  const location = useLocation();
  const isAuthorized = useSelector(isAuthorizedSelector);

  if (isLoading.user) {
    return <Preloader />;
  }

  if (onlyAuthorized && !isAuthorized) {
    /* Если пользователь на onlyAuthorized странице и не авторизован, то делаем редирект.
    В поле from объекта location.state записываем информацию, откуда пришли */
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (!onlyAuthorized && isAuthorized) {
    /* Если пользователь не на onlyAuthorized (login, register ...) и авторизован (стал только что или был)
      При обратном редиректе получаем данные о месте назначения редиректа из объекта location.state
      в случае если объекта location.state?.from нет — а такое может быть, если мы зашли на страницу логина по прямому URL
      мы сами создаём объект c указанием адреса и делаем переадресацию на главную страницу */
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
