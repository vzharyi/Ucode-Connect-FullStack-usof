import axios from '../../services/api';
import {
    fetchCommentsSuccess,
    fetchCommentsFailure,
    updateCommentSuccess,
    deleteCommentSuccess,
    likeCommentSuccess,
    likeCommentFailure, deleteLikeCommentSuccess, deleteLikeCommentStart, createReplySuccess,
} from '../reducers/commentReducer';
import {fetchCommentsForPost} from "./postActions";

export const fetchComments = () => async (dispatch) => {
    try {
        const response = await axios.get('/api/comments'); 
        dispatch(fetchCommentsSuccess(response.data));
    } catch (error) {
        dispatch(fetchCommentsFailure(error.message));
    }
};

export const updateComment = (postId, commentId, content) => async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
        const response = await axios.patch(`/api/comments/${commentId}`,
            { content },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        dispatch(fetchCommentsForPost(postId));
        dispatch(updateCommentSuccess({
            postId,
            commentId,
            updatedComment: response.data.comment,
        }));
    } catch (error) {
        dispatch(fetchCommentsFailure(error.message)); 
    }
};

export const deleteComment = (commentId, postId) => async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
        await axios.delete(`/api/comments/${commentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch(fetchCommentsForPost(postId));
        dispatch(deleteCommentSuccess({ postId, commentId }));
    } catch (error) {
        dispatch(fetchCommentsFailure(error.message)); 
    }
};

export const likeComment = (postId, commentId, type) => async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
        const response = await axios.post(
            `/api/comments/${commentId}/like`,
            { type },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        dispatch(fetchCommentsForPost(postId));
        dispatch(likeCommentSuccess({
            postId,
            commentId,
            likes: response.data.comment.likesCount, 
            rating: response.data.comment.rating,      
        }));
    } catch (error) {
        dispatch(likeCommentFailure({
            commentId,
            error: error.message,
        }));
    }
};

export const deleteLikeForComment = (postId, commentId) => async (dispatch, getState) => {
    const { token } = getState().auth;
    dispatch(deleteLikeCommentStart({ commentId }));
    try {
        const response = await axios.delete(`/api/comments/${commentId}/like`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(fetchCommentsForPost(postId));
        dispatch(deleteLikeCommentSuccess({
            postId,
            commentId,
            likes: response.data.likesCount,  
            rating: response.data.rating,
        }));
    } catch (error) {
        console.error('Error removing like:', error);
    }
};

export const createReply = (postId, commentId, content) => async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
        const response = await axios.post(
            `/api/comments/${commentId}/reply`,
            { content },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        dispatch(fetchCommentsForPost(postId));
        dispatch(createReplySuccess({
            postId,
            commentId,
            reply: response.data.reply, 
        }));
    } catch (error) {
        console.error('Error creating reply:', error);
    }
};
