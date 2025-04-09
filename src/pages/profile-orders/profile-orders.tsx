import {
  getUserOrders,
  getUserOrdersSelector,
  isLoadingSelector
} from '@slices';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getUserOrdersSelector);
  const isLoading = useSelector(isLoadingSelector);

  // Получаем заказы пользователя
  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  if (isLoading.order) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
