import {
  createOrder,
  getOrderByNumber,
  getOrderModalDataSelector,
  getOrderRequestSelector,
  getOrderSelector,
  getUserOrders,
  getUserOrdersSelector,
  initialStateOrder,
  orderSlice
} from '@slices';
import { dataOrders } from './fixtures';
import { RootState } from '../../store';

describe('Тесты orderSlice', () => {
  const mockOrder1 = dataOrders.mockOrder1;
  const mockOrder2 = dataOrders.mockOrder2;
  const mockOrders = Object.values(dataOrders);

  describe('начальное состояние', () => {
    it('возвратить начальное состояние хранилища в случае вызова с undefined состоянием и неизвестным экшеном', () => {
      expect(orderSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
        initialStateOrder
      );
    });
  });

  describe('reducers: resetOrder', () => {
    it('восстановить начальное (пустое) состояние', () => {
      const initialState = {
        orderRequest: true,
        orderModalData: mockOrder1,
        orders: mockOrders,
        order: mockOrder2,
        error: 'Error'
      };

      const result = orderSlice.reducer(
        initialState,
        orderSlice.actions.resetOrder()
      );

      expect(result).toEqual(initialStateOrder);
    });
  });

  describe('extrareducers', () => {
    describe('обработка createOrder', () => {
      it('createOrder.pending: установить orderRequest=true, обнулить ошибку', () => {
        const action = { type: createOrder.pending.type };
        const result = orderSlice.reducer(initialStateOrder, action);
        expect(result.orderRequest).toBe(true);
        expect(result.error).toBeNull();
      });

      it('createOrder.fulfilled: установить orderModalData, orderRequest=false и ошибка = null', () => {
        const action = {
          type: createOrder.fulfilled.type,
          payload: { order: mockOrder1 }
        };
        const result = orderSlice.reducer(initialStateOrder, action);

        expect(result.orderModalData).toEqual(mockOrder1);
        expect(result.orderRequest).toBe(false);
        expect(result.error).toBeNull();
      });

      it('createOrder.rejected установить ошибку и orderRequest=false', () => {
        const errorMessage = 'Error message';
        const action = {
          type: createOrder.rejected.type,
          payload: errorMessage
        };
        const result = orderSlice.reducer(initialStateOrder, action);

        expect(result.error).toBe(errorMessage);
        expect(result.orderRequest).toBe(false);
      });
    });

    describe('обработка getUserOrders', () => {
      it('getUserOrders.pending: обнулить ошибку', () => {
        const initialState = { ...initialStateOrder, error: 'Previous error' };
        const action = { type: getUserOrders.pending.type };
        const result = orderSlice.reducer(initialState, action);
        expect(result.error).toBeNull();
      });

      it('getUserOrders.fulfilled: установить orders и ошибка = null', () => {
        const action = {
          type: getUserOrders.fulfilled.type,
          payload: mockOrders
        };
        const result = orderSlice.reducer(initialStateOrder, action);

        expect(result.orders).toEqual(mockOrders);
        expect(result.error).toBeNull();
      });

      it('getUserOrders.rejected: установить ошибку', () => {
        const errorMessage = 'Error message';
        const action = {
          type: getUserOrders.rejected.type,
          payload: errorMessage
        };
        const result = orderSlice.reducer(initialStateOrder, action);

        expect(result.error).toBe(errorMessage);
      });
    });

    describe('обработка getOrderByNumber', () => {
      it('getOrderByNumber.pending: обнулить ошибку', () => {
        const state = { ...initialStateOrder, error: 'Previous error' };
        const action = { type: getOrderByNumber.pending.type };
        const result = orderSlice.reducer(state, action);
        expect(result.error).toBeNull();
      });

      it('getOrderByNumber.fulfilled: установить order и ошибка = null', () => {
        const action = {
          type: getOrderByNumber.fulfilled.type,
          payload: { orders: [mockOrder2] }
        };
        const result = orderSlice.reducer(initialStateOrder, action);

        expect(result.order).toEqual(mockOrder2);
        expect(result.error).toBeNull();
      });

      it('getOrderByNumber.rejected: установить ошибку', () => {
        const errorMessage = 'Error message';
        const action = {
          type: getOrderByNumber.rejected.type,
          payload: errorMessage
        };
        const result = orderSlice.reducer(initialStateOrder, action);

        expect(result.error).toBe(errorMessage);
      });
    });
  });
  describe('Селекторы из orderSlice', () => {
    describe('Данные есть', () => {
      const mockState: Partial<RootState> = {
        order: {
          orderRequest: true,
          orderModalData: mockOrder1,
          orders: mockOrders,
          order: mockOrder2,
          error: null
        }
      };

      it('getOrderRequestSelector: вернуть статус запроса', () => {
        const result = getOrderRequestSelector(mockState as RootState);
        expect(result).toBe(true);
      });

      it('getOrderModalDataSelector: вернуть данные для мод.окна', () => {
        const result = getOrderModalDataSelector(mockState as RootState);
        expect(result).toEqual(mockOrder1);
      });

      it('getUserOrdersSelector: вернуть массив заказов', () => {
        const result = getUserOrdersSelector(mockState as RootState);
        expect(result).toEqual(mockOrders);
      });

      it('getOrderSelector: вернуть заказ', () => {
        const result = getOrderSelector(mockState as RootState);
        expect(result).toEqual(mockOrder2);
      });
    });

    describe('Пустое хранилище', () => {
      const mockState: Partial<RootState> = {
        order: initialStateOrder
      };
      it('getOrderRequestSelector: вернуть false для orderRequest', () => {
        const result = getOrderRequestSelector(mockState as RootState);
        expect(result).toEqual(initialStateOrder.orderRequest);
      });

      it('getOrderModalDataSelector: вернуть нулевой orderModalData', () => {
        const result = getOrderModalDataSelector(mockState as RootState);
        expect(result).toBe(initialStateOrder.orderModalData);
      });

      it('getUserOrdersSelector: вернуть пустой orders', () => {
        const result = getUserOrdersSelector(mockState as RootState);
        expect(result).toBe(initialStateOrder.orders);
      });

      it('getOrderSelector: вернуть нулевой order', () => {
        const result = getOrderSelector(mockState as RootState);
        expect(result).toBe(initialStateOrder.order);
      });
    });
  });
});
