import axios from '../../services/api';
import {
    fetchUserStart,
    fetchUserSuccess,
    fetchUserFailure,
    fetchUserPostsStart,
    fetchUserPostsSuccess,
    fetchUserPostsFailure, updateUserProfile, updateAvatar, fetchUsersSuccess,
} from '../reducers/userReducer';
import {updateAvatarInAuth, updateUserProfileInAuth} from "../reducers/authReducer";

export const fetchUsers = () => async (dispatch, getState) => {
    try {
        const { token } = getState().auth;
        const response = await axios.get('/api/users', {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        
        dispatch(fetchUsersSuccess(response.data));
    } catch (error) {
        dispatch(fetchUserFailure(error.message));
    }
};

export const fetchUser = (user_id) => async (dispatch) => {
    dispatch(fetchUserStart());
    try {
        const response = await axios.get(`/api/users/${user_id}`);
        dispatch(fetchUserSuccess(response.data));
    } catch (error) {
        dispatch(fetchUserFailure(error.message));
    }
};

export const fetchUserPosts = (user_id, filters) => async (dispatch) => {
    dispatch(fetchUserPostsStart());
    try {
        const response = await axios.get(`/api/users/${user_id}/posts`, {params: filters});
        dispatch(fetchUserPostsSuccess(response.data));
    } catch (error) {
        dispatch(fetchUserPostsFailure(error.message));
    }
};

export const updateAvatarRequest = (formData) => async (dispatch, getState) => {
    try {
        const {token} = getState().auth;
        const response = await axios.patch(`/api/users/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`, 
            },
        });

        dispatch(updateAvatar(response.data.profile_picture))
        dispatch(updateAvatarInAuth(response.data.profile_picture))
    } catch (error) {
        console.error('Error uploading avatar:', error);
    }
};

export const updateProfile = (updatedData) => async (dispatch, getState) => {
    try {
        const {token} = getState().auth;
        const response = await axios.patch(`/api/users/${updatedData.user_id}`, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });

        dispatch(updateUserProfile(response.data));
        dispatch(updateUserProfileInAuth(response.data));
        return {success: true, data: response.data};
    } catch (error) {
        return {success: false, error: error.response.data.error || 'Something went wrong!'};
    }
};
