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
  tagTypes: ["Hotels"], 
    endpoints: (builder) => ({ // endpoints means the calls that we want to make to the backend from frontend
        getHotels: builder.query({
            query: () => "hotels",
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
              invalidatesTags: ["Hotels"],
        }),

        createBooking: builder.mutation({  //Mutation:for post,put and delete
            query: (booking) => ({
                url: "bookings",
                method: "POST",
                body: booking,
              }),
        }),
    }),
});

export const { 
  useGetHotelsQuery,
  useGetHotelsForSearchQueryQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useCreateBookingMutation,
   } = api; //this is a put,this encapsulates the query and the hook like loading state, error state, data, etc.