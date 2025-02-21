import { createSlice } from '@reduxjs/toolkit';

const commentSlice = createSlice({
    name: 'comments',
    initialState: {
        likeLoading: {},
        comments: {}, 
        loading: false,
        error: null,
    },
    reducers: {
        fetchCommentsStart: (state) => {
            state.loading = true;
            state.error = null;
        }, 
        fetchCommentsSuccess: (state, action) => {
            const { postId, comments } = action.payload;
            state.loading = false;
            state.comments[postId] = comments; 
        },
        fetchCommentsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateCommentSuccess: (state, action) => {
            const { postId, commentId, updatedComment } = action.payload;
            const postComments = state.comments[postId] || [];
            const index = postComments.findIndex((comment) => comment.id === commentId);
            if (index !== -1) {
                postComments[index] = updatedComment; 
            } else {
                
                state.comments[postId] = [...postComments, updatedComment];
            }
        },
        deleteCommentSuccess: (state, action) => {
            const { postId, commentId } = action.payload;
            const postComments = state.comments[postId] || [];
            const updatedComments = postComments.filter((comment) => comment.id !== commentId); 
            state.comments[postId] = updatedComments; 
        },
        likeCommentSuccess: (state, action) => {
            const { postId, commentId, comment } = action.payload;

            const postComments = state.comments[postId] || [];
            const commentIndex = postComments.findIndex((c) => c.id === commentId);

            if (commentIndex !== -1) {
                
                postComments[commentIndex] = comment;
            } else {
                
                state.comments[postId] = [...postComments, comment];
            }
        },



        likeCommentFailure: (state, action) => {
            const { commentId } = action.payload;
            state.likeLoading[commentId] = false; 
            state.error = action.payload.error;
        },

        deleteLikeCommentStart: (state, action) => {
            const { commentId } = action.payload;
            state.likeLoading[commentId] = true; 
        },

        
        deleteLikeCommentSuccess: (state, action) => {
            const { postId, commentId, likes, rating } = action.payload;

            
            const comment = state.comments[postId]?.find(c => c.id === commentId);
            if (comment) {
                comment.likesCount = likes;
                comment.rating = rating;
            }
        },
        
        createReplySuccess: (state, action) => {
            const { postId, commentId, reply } = action.payload;
            const postComments = state.comments[postId] || [];
            const parentComment = postComments.find((comment) => comment.id === commentId);
            if (parentComment) {
                parentComment.replies = parentComment.replies || [];
                parentComment.replies.push(reply); 
            }
        },
    },
});

export const {
    fetchCommentsStart,
    fetchCommentsSuccess,
    fetchCommentsFailure,
    updateCommentSuccess,
    deleteCommentSuccess,
    likeCommentSuccess,
    likeCommentFailure,
    deleteLikeCommentStart,
    deleteLikeCommentSuccess,
    createReplySuccess
} = commentSlice.actions;

export default commentSlice.reducer;
