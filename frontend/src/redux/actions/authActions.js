import axios from '../../services/api';
import {
    loginStart,
    loginSuccess,
    loginFailure,
    registerStart,
    registerSuccess,
    registerFailure,
    verifyEmailStart,
    verifyEmailSuccess,
    verifyEmailFailure,
    sendPasswordResetStart,
    sendPasswordResetSuccess, sendPasswordResetFailure, passwordResetStart, passwordResetSuccess, passwordResetFailure
} from '../reducers/authReducer';

export const register = (registerData) => async (dispatch) => {
    dispatch(registerStart());
    try {
        const response = await axios.post('/api/auth/register', registerData); 
        dispatch(registerSuccess(response.data.message)); 
    } catch (error) {
        dispatch(registerFailure(error.response?.data?.error || 'Registration failed'));
    }
};

export const verifyEmail = (token) => async (dispatch) => {
    dispatch(verifyEmailStart());
    try {
        const response = await axios.post(`/api/auth/verify-email/${token}`);
        const { token: userToken, user } = response.data;
        localStorage.setItem('token', userToken);
        dispatch(verifyEmailSuccess(response.data.message));
        dispatch(loginSuccess({ user, token: userToken }));
    } catch (error) {
        dispatch(verifyEmailFailure(error.response?.data?.error || 'An error occurred during email verification'));
    }
};

export const login = (loginData) => async (dispatch) => {
    dispatch(loginStart());
    try {
        const response = await axios.post('/api/auth/login', loginData); 
        const { token } = response.data;
        localStorage.setItem('token', token);
        dispatch(loginSuccess({ user: response.data.user, token }));
    } catch (error) {
        dispatch(loginFailure(error.response?.data?.error || 'Login failed'));
    }
};

export const sendPasswordResetRequest = (email) => async (dispatch) => {
    dispatch(sendPasswordResetStart());
    try {
        const response = await axios.post('/api/auth/password-reset', { email });
        dispatch(sendPasswordResetSuccess(response.data.message)); 
    } catch (error) {
        dispatch(sendPasswordResetFailure(error.response?.data?.error || 'Failed to send password reset link'));
    }
};

export const confirmNewPassword = (confirm_token, newPassword, confirmPassword) => async (dispatch) => {
    dispatch(passwordResetStart());
    try {
        const response = await axios.post(`/api/auth/password-reset/${confirm_token}`, { newPassword, confirmPassword });
        dispatch(passwordResetSuccess(response.data.message)); 
    } catch (error) {
        dispatch(passwordResetFailure(error.response?.data?.error || 'Failed to reset password'));
    }
};

export const fetchUserData = () => async (dispatch) => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await axios.get('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            dispatch(loginSuccess({ token, user: response.data }));
        } catch (error) {
            
            console.error('Token invalid or expired:', error.message);
            dispatch(logout());
        }
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: 'auth/logout' });
};
