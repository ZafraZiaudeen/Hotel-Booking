import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {name:"Zafra"},
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: { //this reducer is state updating function
        setUser: (state, action) => {
            console.log(action);
            state.user = action.payload;
        },
    }
});

export const { setUser } = userSlice.actions;//this action is dispatched to update state

export default userSlice.reducer;//this reducer brings all state together to 1 state