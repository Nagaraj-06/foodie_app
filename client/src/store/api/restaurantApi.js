import { baseApi } from './baseApi';

export const restaurantApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => '/auth/private/api/restaurant/categories',
            providesTags: ['Categories'],
        }),
        addMenuItem: builder.mutation({
            query: (formData) => ({
                url: '/auth/private/api/restaurant/menu-item',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['MenuItems'],
        }),
        getRestaurants: builder.query({
            query: () => '/auth/public/api/restaurant',
            providesTags: ['Restaurants'],
        }),
        getRestaurantMenu: builder.query({
            query: (restaurantId) => `/auth/public/api/restaurant/${restaurantId}/menu`,
            providesTags: (result, error, arg) => [{ type: 'Menu', id: arg }],
        }),
        getMenuItem: builder.query({
            query: (itemId) => `/auth/public/api/restaurant/item/${itemId}`,
            providesTags: (result, error, arg) => [{ type: 'MenuItem', id: arg }],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useAddMenuItemMutation,
    useGetRestaurantsQuery,
    useGetRestaurantMenuQuery,
    useGetMenuItemQuery,
} = restaurantApi;
