
import { configureStore, createSlice } from '@reduxjs/toolkit';

const inititalAuthState = {
    token: localStorage.getItem("token"),
    user:localStorage.getItem("user")
}
const inititalMessageState = {
    messages: [],
    sentMessages:[],
    unreadMessages:0
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
const messageSlice = createSlice({
    name: "message",
    initialState: inititalMessageState,
    reducers: {
        setMessages(state, action) {
            state.messages = action.payload;
        },
        setSentMessages(state, action) {
            state.sentMessages = action.payload;
        },
        setUnreadMessages(state, action) {
            state.unreadMessages = action.payload;
        },
    }
})

const store = configureStore({
    reducer: {authentication: authSlice.reducer,messages:messageSlice.reducer }
});

export default store;
export const authActions = authSlice.actions;
export const messageActions = messageSlice.actions;