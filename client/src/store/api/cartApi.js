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
            async onQueryStarted(variantId, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    cartApi.util.updateQueryData('getCart', undefined, (draft) => {
                        const index = draft.data.findIndex((item) => item.variant_id === variantId);
                        if (index !== -1) draft.data.splice(index, 1);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
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
        updateCartQuantity: builder.mutation({
            query: (updateData) => ({
                url: '/order/private/api/order/cart',
                method: 'PUT',
                body: updateData,
            }),
            async onQueryStarted({ variant_id, quantity }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    cartApi.util.updateQueryData('getCart', undefined, (draft) => {
                        const cartItem = draft.data.find((item) => item.variant_id === variant_id);
                        if (cartItem) {
                            cartItem.quantity = quantity;
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const {
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useGetCartQuery,
    usePlaceOrderMutation,
    useUpdateCartQuantityMutation,
} = cartApi;
