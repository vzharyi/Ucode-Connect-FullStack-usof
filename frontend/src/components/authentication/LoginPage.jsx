import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, sendPasswordResetRequest } from '../../redux/actions/authActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Snackbar from '@mui/material/Snackbar';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { clearError, clearPasswordResetSuccess } from "../../redux/reducers/authReducer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        height: '40px',
                        padding: '0',
                        '&:hover fieldset': {
                            borderColor: '#000',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#000',
                        },
                        '& input::placeholder': {
                            color: '#333',
                            opacity: 0.7,
                        },
                    },
                },
            },
        },
    },
});

const CustomAlert = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fbebeb',
    color: '#000',
    borderRadius: '8px',
    padding: '8px 16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    fontWeight: 'bold',
    fontSize: '14px',
    fontFamily: theme.typography.fontFamily,
}));

const LoginPage = () => {
    const [loginData, setLoginData] = useState({ login: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [emailForReset, setEmailForReset] = useState('');
    const [emailError, setEmailError] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated, sendPasswordResetSuccess } = useSelector((state) => ({
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.isAuthenticated,
        sendPasswordResetSuccess: state.auth.sendPasswordResetSuccess,
    }));

    useEffect(() => {
        if (isAuthenticated) {
            window.location.replace('/posts');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (error) {
            setOpenErrorSnackbar(true);
        }
        if (sendPasswordResetSuccess) {
            setSuccessMessage(sendPasswordResetSuccess);
            setOpenSuccessSnackbar(true);
        }
    }, [error, sendPasswordResetSuccess]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(loginData));
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'timeout') {
            setTimeout(() => {
                dispatch(clearError());
            }, 400);
        }
        setOpenErrorSnackbar(false);
    };

    const handleCloseSuccessSnackbar = (event, reason) => {
        if (reason === 'timeout') {
            setTimeout(() => {
                dispatch(clearPasswordResetSuccess());
            }, 400);
        }
        setOpenSuccessSnackbar(false);
    };

    const handleResetPasswordClick = () => {
        setIsResetPassword(true);
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        if (validateEmail(emailForReset)) {
            setResetLoading(true);
            try {
                await dispatch(sendPasswordResetRequest(emailForReset));
                setEmailForReset('');
                setTimeout(() => {
                    setIsResetPassword(false);
                }, 4000);
            } catch (error) {
                console.error('Password reset failed', error);
            } finally {
                setResetLoading(false);
            }
        }
    };

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (emailPattern.test(email)) {
            setEmailError('');
            return true;
        } else {
            setEmailError('Please enter a valid email address. Ensure it follows the format example@domain.com');
            return false;
        }
    };

    const handleBackToLogin = () => {
        setIsResetPassword(false);
        setEmailForReset('');
        setEmailError('');
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmailForReset(value);
        validateEmail(value);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}
            >
                <Box
                    sx={{
                        width: '350px',
                        padding: 3,
                        boxShadow: 2,
                        borderRadius: 2,
                        backgroundColor: '#fff',
                    }}
                >
                    {!isResetPassword ? (
                        <>
                            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
                                Sign In
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    placeholder="Login"
                                    name="login"
                                    autoComplete="off"
                                    value={loginData.login}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{ marginLeft: '10px' }}>
                                                <PersonIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    name="password"
                                    autoComplete="off"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{ marginLeft: '10px' }}>
                                                <LockIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleClickShowPassword}>
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading || !loginData.login || !loginData.password}
                                    onClick={handleSubmit}
                                    fullWidth
                                    sx={{
                                        fontSize: '14px',
                                        background: 'linear-gradient(to bottom, #1a1a1a, #000)',
                                        fontWeight: 'bold',
                                        padding: '6px 12px',
                                        borderRadius: '10px',
                                        color: '#e3e3e3',
                                        opacity: loading || !loginData.login || !loginData.password ? 0.6 : 1,
                                        '&.Mui-disabled': {
                                            color: '#e3e3e3',
                                        },
                                        '&:hover': {
                                            background: 'linear-gradient(to bottom, #2a2a2a, #333)',
                                            color: '#ffffff',
                                        },
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Login'}
                                </Button>

                                <Button
                                    variant="text"
                                    onClick={handleResetPasswordClick}
                                    sx={{
                                        fontSize: '12px',
                                        color: '#1a1a1a',
                                        display: 'block',
                                        marginTop: '10px',
                                        textAlign: 'center',
                                        width: '100%',
                                    }}
                                >
                                    Forgot password?
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                <IconButton
                                    onClick={handleBackToLogin}
                                    sx={{
                                        color: '#1a1a1a',
                                        marginRight: '-37px',
                                        left: '-11px',
                                    }}
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 'bold',
                                        flex: 1,
                                        textAlign: 'center',
                                    }}
                                >
                                    Reset Password
                                </Typography>
                            </Box>

                            <form onSubmit={handleResetPasswordSubmit}>
                                <TextField
                                    fullWidth
                                    placeholder="Enter your email"
                                    variant="outlined"
                                    autoComplete="off"
                                    value={emailForReset}
                                    onChange={handleEmailChange}
                                    sx={{ mb: 2 }}
                                    error={!!emailError}
                                    helperText={emailError}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={resetLoading || !emailForReset || emailError}
                                    sx={{
                                        fontSize: '14px',
                                        background: 'linear-gradient(to bottom, #1a1a1a, #000)',
                                        fontWeight: 'bold',
                                        padding: '6px 12px',
                                        borderRadius: '10px',
                                        color: '#e3e3e3',
                                        opacity: resetLoading || !emailForReset || emailError ? 0.6 : 1,
                                        '&.Mui-disabled': {
                                            color: '#e3e3e3',
                                        },
                                        '&:hover': {
                                            background: 'linear-gradient(to bottom, #2a2a2a, #333)',
                                            color: '#ffffff',
                                        },
                                    }}
                                >
                                    {resetLoading ? <CircularProgress size={24}/> : 'Send Reset Link'}
                                </Button>
                            </form>
                        </>
                    )}
                </Box>
            </Box>
            <Snackbar
                open={openErrorSnackbar}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={4000}
            >
                <CustomAlert sx={{ backgroundColor: '#fbebeb' }}>
                    <ErrorOutlineIcon sx={{ marginRight: '8px', color: '#000' }} />
                    {error}
                </CustomAlert>
            </Snackbar>

            <Snackbar
                open={openSuccessSnackbar}
                onClose={handleCloseSuccessSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={4000}
            >
                <CustomAlert sx={{ backgroundColor: '#e7f5e6' }}>
                    <CheckCircleIcon sx={{ marginRight: '8px', color: '#000' }} />
                    {successMessage}
                </CustomAlert>
            </Snackbar>
        </ThemeProvider>
    );
};

export default LoginPage;
