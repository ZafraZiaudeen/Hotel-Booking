import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const Backend_URL="http://localhost:8000";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: `${Backend_URL}/api/` }),
    endpoints: (builder) => ({ // endpoints means the calls that we want to make to the backend from frontend
        getHotels: builder.query({
            query: () => "hotels",
        }),
    }),
});

export const { useGetHotelsQuery } = api; //this is a put,this encapsulates the query and the hook like loading state, error state, data, etc.