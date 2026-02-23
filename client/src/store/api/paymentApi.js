import { baseApi } from './baseApi';

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get or create checkout session URL for an order
        getCheckoutSession: builder.query({
            query: (orderId) => `/payment/stripe/session/${orderId}`,
        }),
        // Verify payment after Stripe redirects to success page
        verifyCheckoutPayment: builder.mutation({
            query: (orderId) => ({
                url: `/payment/stripe/verify-checkout/${orderId}`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useLazyGetCheckoutSessionQuery,
    useVerifyCheckoutPaymentMutation,
} = paymentApi;
