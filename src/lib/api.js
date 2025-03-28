import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const Backend_URL="http://localhost:8000";

export const api = createApi({
    reducerPath: "api",
   baseQuery: fetchBaseQuery({
    baseUrl: `${Backend_URL}/api/`,
    prepareHeaders: async (headers, { getState }) => {
      const token = await window?.Clerk?.session?.getToken();
      console.log(token);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
  }),
  
    endpoints: (builder) => ({ // endpoints means the calls that we want to make to the backend from frontend
       getHotels: builder.query({
      query: ({ location = "", sortByPrice = "" }) => {
        const queryParams = new URLSearchParams();
        if (location) queryParams.append("location", location);
        if (sortByPrice) queryParams.append("sortByPrice", sortByPrice);
        return `hotels${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      },
      providesTags: ["Hotels"],
    }),
          getHotelById: builder.query({
            query: (id) => `hotels/${id}`,
          }),

         getHotelsForSearchQuery: builder.query({
      query: ({ query }) => `hotels/search/retrieve?query=${query}`,
    }),
        createHotel: builder.mutation({  //Mutation:for post,put and delete
            query: (hotel) => ({
                url: "hotels",
                method: "POST",
                body: hotel,
              }),
              
        }),

        createBooking: builder.mutation({  //Mutation:for post,put and delete
            query: (booking) => ({
                url: "bookings",
                method: "POST",
                body: booking,
              }),
            }),
   getRoomAvailability: builder.query({
      query: ({ hotelId, checkIn, checkOut }) =>
        `hotels/${hotelId}/availability?checkIn=${checkIn}&checkOut=${checkOut}`,
      transformResponse: (response) => response.availableRooms,
    }),
    
    getBookingsForUser: builder.query({
      query: () => "bookings/user", 
      transformResponse: (response) => response, 
      providesTags: ["Bookings"], 
    }),
    cancelBooking: builder.mutation({
      query: (bookingId) => ({
        url: `bookings/${bookingId}/cancel`, 
        method: "PUT",
      }),
      invalidatesTags: ["Bookings"], 
    }),
  getTopTrendingHotels: builder.query({
      query: () => "hotels/top-trending",
    }),

    addToFavorites: builder.mutation({
  query: (hotelId) => ({
    url: "favorites",
    method: "POST",
    body: { hotelId },
  }),
}),
    getUserFavorites: builder.query({
      query: () => "favorites",
      transformResponse: (response) => response, 
      providesTags: ["Favorites"], 
    }),
    removeFromFavorites: builder.mutation({
      query: (hotelId) => ({
        url: `favorites/${hotelId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favorites"], 
    }),
    getHotelLocations: builder.query({
      query: () => "hotels/locations",
    }),
  }),
});

export const { 
  useGetHotelsQuery,
  useGetHotelsForSearchQueryQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useCreateBookingMutation,
  useGetRoomAvailabilityQuery,
  useGetBookingsForUserQuery,
  useCancelBookingMutation,
  useGetTopTrendingHotelsQuery,
  useAddToFavoritesMutation,
  useGetUserFavoritesQuery,
  useRemoveFromFavoritesMutation,
  useGetHotelLocationsQuery,
   } = api; //this is a put,this encapsulates the query and the hook like loading state, error state, data, etc.