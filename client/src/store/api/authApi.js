import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        signin: builder.mutation({
            query: (credentials) => ({
                url: '/auth/public/api/auth/login', // Adjusted to match the gateway + service path
                method: 'POST',
                body: credentials,
            }),
        }),
        signup: builder.mutation({
            query: (userData) => ({
                url: '/auth/public/api/auth/register-restaurant', // Placeholder for actual signup if different
                method: 'POST',
                body: userData,
            }),
        }),
        sendOtp: builder.mutation({
            query: (data) => ({
                url: '/auth/public/api/auth/send-otp',
                method: 'POST',
                body: data,
            }),
        }),
        verifyOtp: builder.mutation({
            query: (data) => ({
                url: '/auth/public/api/auth/verify-otp',
                method: 'POST',
                body: data,
            }),
        }),
        getRoles: builder.query({
            query: () => '/auth/public/api/auth/roles',
        }),
        getProfile: builder.query({
            query: () => '/auth/private/api/users/profile',
            providesTags: ['UserProfile'],
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/auth/private/api/users/profile',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['UserProfile'],
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/public/api/auth/logout',
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useSigninMutation,
    useSignupMutation,
    useSendOtpMutation,
    useVerifyOtpMutation,
    useGetRolesQuery,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useLogoutMutation,
} = authApi;
