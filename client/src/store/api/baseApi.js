import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../config';

const baseUrl = API_BASE_URL;

import { setCredentials, logout } from '../slices/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const token = getState()?.auth?.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
    credentials: 'include',
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // check if it's an expired token error
        const message = result.error.data?.message || "";
        if (message.includes("expired") || message.includes("Invalid token")) {
            // try to get a new token
            const refreshResult = await baseQuery(
                { url: '/auth/public/api/auth/refresh-token', method: 'POST' },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const user = api.getState().auth.user;
                const token = refreshResult.data.accessToken;

                // store the new token
                api.dispatch(setCredentials({ user, token }));

                // retry the initial query
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logout());
            }
        }
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['UserProfile'],
    endpoints: () => ({}),
});
