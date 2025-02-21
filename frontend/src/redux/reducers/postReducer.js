import {createSlice} from '@reduxjs/toolkit';

const postSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],
        currentPost: null,
        loading: false,
        error: null,
        comments: {}, 
        likeLoading: {},
        favorites: [],
    },
    reducers: {
        fetchPostsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchPostsSuccess: (state, action) => {
            state.loading = false;
            state.posts = action.payload;
        },
        fetchPostsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchPostStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchPostSuccess: (state, action) => {
            const { postId, comments, ...postData } = action.payload;
            state.loading = false;
            if (comments) {
                state.comments[postId] = comments;
            } else {
                state.currentPost = postData;
            }
        },
        fetchPostFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        likePostStart: (state, action) => {
            const { postId } = action.payload;
            state.likeLoading[postId] = true;
        },
        likePostSuccess: (state, action) => {
            const { postId, likes, rating } = action.payload;
            state.likeLoading[postId] = false;
            const post = state.posts.find((post) => post.id === postId);
            if (post) {
                post.likesCount = likes;
                post.rating = rating;
            }
            if (state.currentPost && state.currentPost.id === postId) {
                state.currentPost.likesCount = likes;
                state.currentPost.rating = rating;
            }
        },
        likePostFailure: (state, action) => {
            const { postId } = action.payload;
            state.likeLoading[postId] = false; 
            state.error = action.payload.error;
        },
        deleteLikeStart: (state, action) => {
            const { postId } = action.payload;
            state.likeLoading[postId] = true; 
        },
        deleteLikeSuccess: (state, action) => {
            const { postId, likes, rating } = action.payload;
            state.likeLoading[postId] = false;
            const post = state.posts.find((post) => post.id === postId);
            if (post) {
                post.likesCount = likes;
                post.rating = rating;
            }

            if (state.currentPost && state.currentPost.id === postId) {
                state.currentPost.likesCount = likes;
                state.currentPost.rating = rating;
            }
        },
        deleteLikeFailure: (state, action) => {
            const { postId } = action.payload;
            state.likeLoading[postId] = false;
            state.error = action.payload.error;
        },
        createPostStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        createPostSuccess: (state, action) => {
            state.loading = false;
            state.posts.push(action.payload); 
        },
        createPostFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        addFavoriteSuccess: (state, action) => {
            state.loading = false;
            
            state.favorites.push({ post_id: action.payload });
        },
        addFavoriteFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        removeFavoriteSuccess: (state, action) => {
            state.loading = false;
            
            state.favorites = state.favorites.filter(
                (favorite) => favorite.post_id !== action.payload
            );
        },
        removeFavoriteFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updatePostStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updatePostSuccess: (state, action) => {
            state.loading = false;
            const updatedPost = action.payload;
            const index = state.posts.findIndex((post) => post.id === updatedPost.id);
            if (index !== -1) {
                state.posts[index] = updatedPost; 
            }
            if (state.currentPost && state.currentPost.id === updatedPost.id) {
                state.currentPost = updatedPost; 
            }
        },
        updatePostFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deletePostStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deletePostSuccess: (state, action) => {
            state.loading = false;
            
            state.posts = state.posts.filter(post => post.id !== action.payload);
            if (state.currentPost && state.currentPost.id === action.payload) {
                state.currentPost = null;  
            }
        },
        deletePostFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },

});

export const {
    fetchPostsStart,
    fetchPostsSuccess,
    fetchPostsFailure,
    fetchPostStart,
    fetchPostSuccess,
    fetchPostFailure,
    likePostStart,
    likePostSuccess,
    likePostFailure,
    deleteLikeStart,
    deleteLikeSuccess,
    deleteLikeFailure,
    createPostStart,
    createPostSuccess,
    createPostFailure,
    addFavoriteStart,
    addFavoriteSuccess,
    addFavoriteFailure,
    removeFavoriteStart,
    removeFavoriteSuccess,
    removeFavoriteFailure,
    updatePostStart,
    updatePostSuccess,
    updatePostFailure,
    deletePostStart,
    deletePostSuccess,
    deletePostFailure
} = postSlice.actions;

export default postSlice.reducer;
