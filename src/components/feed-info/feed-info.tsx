import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeed,
  getOrderFeedSelector,
  getTotalOrdersSelector,
  getTotalTodayOrdersSelector,
  isLoadingSelector
} from '@slices';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

// В ленте заказов отражает инфо: Готовы, в Работе и кол-во заказов
export const FeedInfo: FC = () => {
  const orders: TOrder[] = useSelector(getOrderFeedSelector);
  const total = useSelector(getTotalOrdersSelector);
  const totalToday = useSelector(getTotalTodayOrdersSelector);
  const feed = { total, totalToday };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
