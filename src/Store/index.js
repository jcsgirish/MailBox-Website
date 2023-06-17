
import { configureStore, createSlice } from '@reduxjs/toolkit';

const inititalAuthState = {
    token: localStorage.getItem("token"),
    user:localStorage.getItem("user")
}
const authSlice = createSlice({
    name: "authentication",
    initialState: inititalAuthState,
    reducers: {
        setToken(state, action) {
            state.token = action.payload;
        },
        setUser(state, action) {
            state.user = action.payload;
        }
    }
})

const store = configureStore({
    reducer: {authentication: authSlice.reducer }
});

export default store;
export const authActions = authSlice.actions;