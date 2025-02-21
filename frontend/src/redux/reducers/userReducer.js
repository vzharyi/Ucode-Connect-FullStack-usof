import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        users: [],
        userPosts: [],
        loading: false,
        postsLoading: false,
        error: null,
    },
    reducers: {
        fetchUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchUserSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
        },
        fetchUsersSuccess: (state, action) => {
            state.loading = false;
            state.users = action.payload; 
        },
        fetchUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchUserPostsStart: (state) => {
            state.postsLoading = true;
            state.error = null;
        },
        fetchUserPostsSuccess: (state, action) => {
            state.postsLoading = false;
            state.userPosts = action.payload;
        },
        fetchUserPostsFailure: (state, action) => {
            state.postsLoading = false;
            state.error = action.payload;
        },
        updateAvatar: (state, action) => {
            if (state.user) {
                state.user.profile_picture = action.payload;
            }
        },
        updateUserProfile: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
    },
});

export const {
    fetchUserStart,
    fetchUserSuccess,
    fetchUsersSuccess,
    fetchUserFailure,
    fetchUserPostsStart,
    fetchUserPostsSuccess,
    fetchUserPostsFailure,
    updateUserProfile,
    updateAvatar
} = userSlice.actions;

export default userSlice.reducer;
