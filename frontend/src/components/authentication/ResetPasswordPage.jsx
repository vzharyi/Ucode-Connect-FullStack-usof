import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { confirmNewPassword } from '../../redux/actions/authActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { clearError } from '../../redux/reducers/authReducer';

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

const ResetPasswordPage = () => {
    const { confirm_token } = useParams(); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false); 
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'newPassword':
                
                const passwordPattern = /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
                if (!value.trim()) {
                    error = 'Password is required.';
                } else if (value.length < 8) {
                    error = 'Password must be at least 8 characters.';
                } else if (!passwordPattern.test(value)) {
                    error = 'Password must include at least one uppercase letter, one special character, and be at least 8 characters long.';
                }
                break;
            case 'confirmPassword':
                if (value !== newPassword) {
                    error = 'Passwords do not match.';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'newPassword') setNewPassword(value);
        if (name === 'confirmPassword') setConfirmPassword(value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage('');

        const newErrors = {
            newPassword: validateField('newPassword', newPassword),
            confirmPassword: validateField('confirmPassword', confirmPassword),
        };
        setErrors(newErrors);
        if (Object.values(newErrors).some((error) => error)) {
            setLoading(false);
            return;
        }
        try {
            await dispatch(confirmNewPassword(confirm_token, newPassword, confirmPassword));
            setSuccessMessage('Password has been updated successfully!');
            setOpenSuccessSnackbar(true); 
            setNewPassword(''); 
            setConfirmPassword('');
            setTimeout(() => {
                navigate('/login'); 
            }, 4000);
        } catch (error) {
            const serverError = error.response?.data?.error || 'Failed to reset password.';
            setError(serverError);
            setOpenErrorSnackbar(true); 
        } finally {
            setLoading(false);
        }
    };

    const handleCloseErrorSnackbar = (event, reason) => {
            setOpenErrorSnackbar(false);
            dispatch(clearError());
    };

    const handleCloseSuccessSnackbar = (event, reason) => {
            setOpenSuccessSnackbar(false);
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
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
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
                        Reset Password
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            placeholder="New Password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            name="newPassword"
                            value={newPassword}
                            onChange={handleChange}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword}
                            sx={{ mb: 2 }}
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
                        />
                        <TextField
                            fullWidth
                            placeholder="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            variant="outlined"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ marginLeft: '10px' }}>
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowConfirmPassword}>
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading || !newPassword || !confirmPassword}
                            sx={{
                                fontSize: '14px',
                                background: 'linear-gradient(to bottom, #1a1a1a, #000)',
                                fontWeight: 'bold',
                                padding: '6px 12px',
                                borderRadius: '10px',
                                color: '#e3e3e3',
                                opacity: loading || !newPassword || !confirmPassword ? 0.6 : 1,
                                '&.Mui-disabled': {
                                    color: '#e3e3e3',
                                },
                                '&:hover': {
                                    background: 'linear-gradient(to bottom, #2a2a2a, #333)',
                                    color: '#ffffff',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
                        </Button>
                    </form>
                </Box>
            </Box>

            <Snackbar
                open={openErrorSnackbar}
                onClose={handleCloseErrorSnackbar}
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

export default ResetPasswordPage;
