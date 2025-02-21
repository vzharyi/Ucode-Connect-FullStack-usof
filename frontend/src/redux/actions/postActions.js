import axios from '../../services/api';
import {
    fetchPostsStart,
    fetchPostsSuccess,
    fetchPostsFailure,
    likePostFailure,
    likePostSuccess,
    fetchPostStart,
    fetchPostSuccess,
    fetchPostFailure,
    likePostStart,
    deleteLikeStart,
    deleteLikeSuccess,
    deleteLikeFailure,
    createPostStart,
    createPostSuccess,
    createPostFailure,
    addFavoriteSuccess,
    addFavoriteFailure,
    removeFavoriteSuccess,
    removeFavoriteFailure,
    deletePostStart,
    deletePostSuccess,
    deletePostFailure
} from '../reducers/postReducer';

export const fetchPosts = (page = 1, sort = 'likes', startDate, endDate, categories, locked) => async (dispatch) => {
    dispatch(fetchPostsStart());
    try {
        const response = await axios.get(`/api/posts`, {
            params: { page, sort, startDate, endDate, categories, locked },
        });
        dispatch(fetchPostsSuccess(response.data));
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        dispatch(fetchPostsFailure(error.message));
    }
};

export const fetchPost = (post_id) => async (dispatch) => {
    dispatch(fetchPostStart());
    try {
        const response = await axios.get(`/api/posts/${post_id}`);
        dispatch(fetchPostSuccess(response.data));
    } catch (error) {
        console.error('Error fetching post:', error.message);
        dispatch(fetchPostFailure(error.message));
    }
};

export const fetchCommentsForPost = (post_id) => async (dispatch, getState) => {
    if (!post_id) {
        console.error('post_id is undefined');
        return;
    }
    try {
        const response = await axios.get(`/api/posts/${post_id}/comments`);
        dispatch(fetchPostSuccess({ postId: post_id, comments: response.data }));
    } catch (error) {
        dispatch(fetchPostFailure(error.message));
    }
};

export const likePost = (postId, type) => async (dispatch, getState) => {
    const { token } = getState().auth;
    dispatch(likePostStart({ postId }));
    try {
        await axios.post(
            `/api/posts/${postId}/like`,
            { type },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const postResponse = await axios.get(`/api/posts/${postId}`);
        const updatedPost = postResponse.data;
        dispatch(likePostSuccess({
            postId: updatedPost.id,
            likes: updatedPost.likesCount,
            rating: updatedPost.rating,
        }));
    } catch (error) {
        dispatch(likePostFailure({
            postId,
            error: error.message,
        }));
    }
};

export const deleteLike = (postId) => async (dispatch, getState) => {
    const { token } = getState().auth;
    dispatch(deleteLikeStart({ postId }));
    try {
        await axios.delete(`/api/posts/${postId}/like`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const postResponse = await axios.get(`/api/posts/${postId}`);
        const updatedPost = postResponse.data;
        dispatch(deleteLikeSuccess({
            postId: updatedPost.id,
            likes: updatedPost.likesCount,
            rating: updatedPost.rating,
        }));
    } catch (error) {
        console.error('Error deleting like:', error.message);
        dispatch(deleteLikeFailure({
            postId,
            error: error.message,
        }));
    }
};

export const createComment = (post_id, content) => async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
        const response = await axios.post(
            `/api/posts/${post_id}/comments`,
            { content },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const newComment = response.data;
        dispatch(fetchCommentsForPost(post_id));
        return newComment;
    } catch (error) {
        console.error('Error creating comment:', error.message);
        throw error;
    }
};

export const createPost = (postData) => async (dispatch, getState) => {
    const { token } = getState().auth;
    dispatch(createPostStart());
    try {
        const response = await axios.post('/api/posts', postData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(createPostSuccess(response.data.post));
    } catch (error) {
        dispatch(createPostFailure(error.message));
    }
};

export const addFavorite = (postId) => async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
        await axios.post(`/api/favorites/${postId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(addFavoriteSuccess(postId));
    } catch (error) {
        dispatch(addFavoriteFailure(error.message));
    }
};

export const removeFavorite = (postId) => async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
        await axios.delete(`/api/favorites/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(removeFavoriteSuccess(postId));
    } catch (error) {
        dispatch(removeFavoriteFailure(error.message));
    }
};

export const fetchFavorites = () => async (dispatch, getState) => {
    const { token } = getState().auth;
    if (!token) {
        return dispatch({
            type: 'favorites/fetchFavoritesFailure',
            payload: 'No token provided'
        });
    }
    dispatch({ type: 'favorites/fetchFavoritesRequest' });
    try {
        console.log('Sending request with token:', token); 
        const response = await axios.get('/api/favorites', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch({
            type: 'favorites/fetchFavoritesSuccess',
            payload: response.data
        });
    } catch (error) {
        console.error('Error fetching favorites:', error); 
        dispatch({
            type: 'favorites/fetchFavoritesFailure',
            payload: error.message || 'Error fetching favorites'
        });
    }
};

export const updatePost = (postId, postData) => async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
        const response = await axios.patch(`/api/posts/${postId}`, postData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (postData.categories && postData.categories.length > 0) {
            dispatch({
                type: 'categories/updateCategories',
                payload: postData.categories, 
            });
        }
        dispatch({
            type: 'posts/updatePostSuccess',
            payload: response.data, 
        });
    } catch (error) {
        console.error('Error updating post:', error.message);
        dispatch({
            type: 'posts/updatePostFailure',
            payload: error.message,
        });
    }
};

export const deletePost = (postId) => async (dispatch, getState) => {
    const { token } = getState().auth;
    dispatch(deletePostStart());
    try {
        await axios.delete(`/api/posts/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch(deletePostSuccess(postId));
    } catch (error) {
        console.error('Error deleting post:', error.message);
        dispatch(deletePostFailure(error.message));
    }
};
