import { baseApi } from './baseApi';

export const cartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addToCart: builder.mutation({
            query: (cartData) => ({
                url: '/order/private/api/order/cart/add',
                method: 'POST',
                body: cartData,
            }),
            invalidatesTags: ['Cart'],
        }),
        removeFromCart: builder.mutation({
            query: (variantId) => ({
                url: `/order/private/api/order/cart/${variantId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),
        getCart: builder.query({
            query: () => '/order/private/api/order/cart',
            providesTags: ['Cart'],
        }),
        placeOrder: builder.mutation({
            query: (orderData) => ({
                url: '/order/private/api/order/place',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: ['Cart', 'Orders'],
        }),
    }),
});

export const {
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useGetCartQuery,
    usePlaceOrderMutation,
} = cartApi;
