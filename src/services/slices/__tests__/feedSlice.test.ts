import {
  initialStateFeed,
  feedSlice,
  getFeed,
  getOrderFeedSelector,
  getTotalOrdersSelector,
  getTotalTodayOrdersSelector
} from '@slices';
import { mockApiGetFeedResponse } from './fixtures';
import { RootState } from '../../store';

describe('Тесты feedSlice', () => {
  describe('начальное состояние', () => {
    it('возвратить начальное состояние хранилища в случае вызова с undefined состоянием и неизвестным экшеном', () => {
      expect(feedSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
        initialStateFeed
      );
    });
  });
  describe('feedSlice extrareducers', () => {
    it('feedSlice.pending: обнулить ошибку', () => {
      const initialState = {
        ...initialStateFeed,
        error: 'Previous error'
      };
      const action = { type: getFeed.pending.type };
      const result = feedSlice.reducer(initialState, action);
      expect(result.error).toBeNull();
    });

    it('feedSlice.fulfilled: установить все свойства и ошибка = null', () => {
      const action = {
        type: getFeed.fulfilled.type,
        payload: mockApiGetFeedResponse
      };
      const result = feedSlice.reducer(initialStateFeed, action);

      expect(result.orders).toEqual(mockApiGetFeedResponse.orders);
      expect(result.total).toBe(mockApiGetFeedResponse.total);
      expect(result.totalToday).toBe(mockApiGetFeedResponse.totalToday);
      expect(result.error).toBeNull();
    });

    it('feedSlice.rejected: установить ошибку', () => {
      const errorMessage = 'Error message';
      const action = {
        type: getFeed.rejected.type,
        payload: errorMessage
      };
      const result = feedSlice.reducer(initialStateFeed, action);

      expect(result.error).toBe(errorMessage);
    });
  });
});

describe('Селекторы из feedSlice', () => {
  describe('Данные есть', () => {
    const mockState: Partial<RootState> = {
      feed: {
        ...mockApiGetFeedResponse,
        error: null
      }
    };
    it('getOrderFeedSelector: вернуть orders', () => {
      const result = getOrderFeedSelector(mockState as RootState);
      expect(result).toEqual(mockApiGetFeedResponse.orders);
    });

    it('getTotalOrdersSelector: вернуть total', () => {
      const result = getTotalOrdersSelector(mockState as RootState);
      expect(result).toBe(mockApiGetFeedResponse.total);
    });

    it('getTotalTodayOrdersSelector: вернуть totalToday', () => {
      const result = getTotalTodayOrdersSelector(mockState as RootState);
      expect(result).toBe(mockApiGetFeedResponse.totalToday);
    });
  });
  describe('Пустое хранилище', () => {
    const mockState: Partial<RootState> = {
      feed: initialStateFeed
    };
    it('getOrderFeedSelector: вернуть пустой orders', () => {
      const result = getOrderFeedSelector(mockState as RootState);
      expect(result).toEqual(initialStateFeed.orders);
    });

    it('getTotalOrdersSelector: вернуть нулевой total', () => {
      const result = getTotalOrdersSelector(mockState as RootState);
      expect(result).toBe(initialStateFeed.total);
    });

    it('getTotalTodayOrdersSelector: вернуть нулевой totalToday', () => {
      const result = getTotalTodayOrdersSelector(mockState as RootState);
      expect(result).toBe(initialStateFeed.totalToday);
    });
  });
});
