import { baseApi } from './baseApi';

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyOrders: builder.query({
            query: () => '/order/private/api/order/my-orders',
            providesTags: ['Orders'],
        }),
        getRestaurantOrderHistory: builder.query({
            query: (period) => ({
                url: '/order/private/api/order/restaurant/history',
                params: { period: period?.toLowerCase().replace('this ', '') || 'month' }
            }),
            providesTags: ['RestaurantOrders'],
        }),
    }),
});

export const {
    useGetMyOrdersQuery,
    useGetRestaurantOrderHistoryQuery,
} = orderApi;
