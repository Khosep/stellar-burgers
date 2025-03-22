import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  createOrder,
  getConstructorItemsSelector,
  getOrderModalDataSelector,
  getOrderRequestSelector,
  isAuthorizedSelector,
  resetConstructor,
  resetOrder
} from '@slices';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // navigate - функция для навигации

  const constructorItems = useSelector(getConstructorItemsSelector);
  const orderRequest = useSelector(getOrderRequestSelector);
  const orderModalData = useSelector(getOrderModalDataSelector);
  const isAuthorized = useSelector(isAuthorizedSelector);

  // Обработчик нажатия на кнопку "Оформить заказ"
  const onOrderClick = () => {
    // Если не авторизован, отправляем логиниться
    if (!isAuthorized) {
      return navigate('/login');
    }
    if (!constructorItems.bun || orderRequest) return;

    // Формируем данные для заказа в виде упорядоченных _id (как в конструкторе (сверху вниз))
    const orderedIngredientsIDs = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ing) => ing._id),
      constructorItems.bun._id
    ];
    // Отправляем заказ на сервер
    dispatch(createOrder(orderedIngredientsIDs));
  };
  // Очищаем данные по заказу и конструктор при закрытии модального окна заказа
  const closeOrderModal = () => {
    dispatch(resetOrder());
    dispatch(resetConstructor());
  };

  // Подсчет стоимости заказа
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
