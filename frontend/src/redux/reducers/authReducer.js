import { createSlice } from '@reduxjs/toolkit';

const initialToken = localStorage.getItem('token'); 

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: !!initialToken,
        user: null,
        token: initialToken || null,
        loading: false,
        error: null,
        registrationSuccess: null, 
        emailVerificationSuccess: null, 
        sendPasswordResetSuccess: null, 
        passwordResetSuccess: null, 
        passwordResetError: null, 
    },
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        
        registerStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        registerSuccess: (state, action) => {
            state.loading = false;
            state.registrationSuccess = action.payload; 
        },
        clearRegistrationState: (state) => {
            state.error = null;
            state.registrationSuccess = null;
        },
        registerFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        
        verifyEmailStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        verifyEmailSuccess: (state, action) => {
            state.loading = false;
            state.emailVerificationSuccess = action.payload; 
        },
        verifyEmailFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearEmailVerificationSuccess: (state) => {
            state.emailVerificationSuccess = null;
        },
        
        sendPasswordResetStart: (state) => {
            state.loading = true;
            state.error = null;
            state.sendPasswordResetSuccess = null; 
        },
        sendPasswordResetSuccess: (state, action) => {
            state.loading = false;
            state.sendPasswordResetSuccess = action.payload; 
        },
        sendPasswordResetFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        
        passwordResetStart: (state) => {
            state.loading = true;
            state.passwordResetError = null;
        },
        passwordResetSuccess: (state, action) => {
            state.loading = false;
            state.passwordResetSuccess = action.payload; 
        },
        passwordResetFailure: (state, action) => {
            state.loading = false;
            state.passwordResetError = action.payload; 
        },
        clearPasswordResetSuccess: (state) => {
            state.passwordResetSuccess = null;
        },
        clearPasswordResetError: (state) => {
            state.passwordResetError = null;
        },
        updateAvatarInAuth: (state, action) => {
            if (state.user) {
                state.user.profile_picture = action.payload;
            }
        },
        updateUserProfileInAuth: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    clearError,
    registerStart,
    registerSuccess,
    registerFailure,
    verifyEmailStart,
    verifyEmailSuccess,
    verifyEmailFailure,
    clearEmailVerificationSuccess,
    clearRegistrationState,
    sendPasswordResetStart,
    sendPasswordResetSuccess,
    sendPasswordResetFailure,
    passwordResetStart,
    passwordResetSuccess,
    passwordResetFailure,
    clearPasswordResetSuccess,
    clearPasswordResetError,
    updateAvatarInAuth,
    updateUserProfileInAuth,
} = authSlice.actions;

export default authSlice.reducer;
