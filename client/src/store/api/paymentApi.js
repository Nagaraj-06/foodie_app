import { baseApi } from './baseApi';

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Called by Kafka consumer flow: retrieves pre-created session URL (or creates one as fallback)
        getCheckoutSession: builder.query({
            query: (orderId) => `/payment/stripe/session/${orderId}`,
        }),
        // Called directly from frontend when Kafka consumer hasn't run yet
        createCheckoutSession: builder.mutation({
            query: (data) => ({
                url: '/payment/stripe/create-checkout-session',
                method: 'POST',
                body: data,
            }),
        }),
        confirmPayment: builder.mutation({
            query: (data) => ({
                url: '/payment/stripe/confirm-payment',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useGetCheckoutSessionQuery,
    useCreateCheckoutSessionMutation,
    useConfirmPaymentMutation,
} = paymentApi;
