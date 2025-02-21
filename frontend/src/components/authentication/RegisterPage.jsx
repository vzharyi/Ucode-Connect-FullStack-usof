import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/actions/authActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import {createTheme, styled, ThemeProvider} from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {clearError, clearRegistrationState} from "../../redux/reducers/authReducer";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Snackbar from "@mui/material/Snackbar";

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

const RegisterPage = () => {
    const dispatch = useDispatch();
    const { loading, error, registrationSuccess } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false); 
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        full_name: '',
        login: '',
        password: '',
        password_confirmation: '',
        email: '',
    });
    useEffect(() => {
        if (error) {
            setOpenErrorSnackbar(true); 
        }
        if (registrationSuccess) {
            setOpenSuccessSnackbar(true); 
            setFormData({
                full_name: '',
                login: '',
                password: '',
                password_confirmation: '',
                email: '',
            }); 
            setErrors({}); 
        }
    }, [error, registrationSuccess]);

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'full_name':
                
                const fullNamePattern = /^([A-ZА-ЯІЇЄҐ][a-zа-яёієїґ]+)(\s[A-ZА-ЯІЇЄҐ][a-zа-яёієїґ]+)*$/u;
                if (!value.trim()) {
                    error = 'Full name is required.';
                } else if (!fullNamePattern.test(value)) {
                    error = 'Full name must contain only letters and spaces, with each word starting with a capital letter.';
                }
                break;

            case 'login':
                
                const loginPattern = /^[A-Za-z]+$/;
                if (!value.trim()) {
                    error = 'Login is required.';
                } else if (value.length < 3) {
                    error = 'Login must be at least 3 characters.';
                } else if (!loginPattern.test(value)) {
                    error = 'Login must only contain English letters.';
                }
                break;

            case 'email':
                
                const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                if (!value.trim()) {
                    error = 'Email is required.';
                } else if (!emailPattern.test(value)) {
                    error = 'Email is not valid. Ensure it follows the format example@domain.com';
                }
                break;

            case 'password':
                
                const passwordPattern = /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
                if (!value.trim()) {
                    error = 'Password is required.';
                } else if (value.length < 8) {
                    error = 'Password must be at least 8 characters.';
                } else if (!passwordPattern.test(value)) {
                    error = 'Password must include at least one uppercase letter, one special character, and be at least 8 characters long.';
                }
                break;

            case 'password_confirmation':
                if (value !== formData.password) {
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
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, value),
        }));
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
            }
        });
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            dispatch(register(formData));
        }
    };

    const handleCloseErrorSnackbar = (event, reason) => {
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
                dispatch(clearRegistrationState()); 
            }, 400); 
        }
        setOpenSuccessSnackbar(false); 
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
                        width: '400px',
                        padding: 3,
                        boxShadow: 2,
                        borderRadius: 2,
                        backgroundColor: '#fff',
                    }}
                >
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
                        Sign Up
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            placeholder="Full Name"
                            name="full_name"
                            autoComplete="off"
                            value={formData.full_name}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ marginLeft: '10px' }}>
                                        <PersonIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                            error={!!errors.full_name}
                            helperText={errors.full_name}
                        />
                        <TextField
                            fullWidth
                            placeholder="Login"
                            name="login"
                            autoComplete="off"
                            value={formData.login}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ marginLeft: '10px' }}>
                                        <PersonIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                            error={!!errors.login}
                            helperText={errors.login}
                        />
                        <TextField
                            fullWidth
                            placeholder="Email"
                            name="email"
                            autoComplete="off"
                            value={formData.email}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ marginLeft: '10px' }}>
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            fullWidth
                            placeholder="Password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            autoComplete="off"
                            value={formData.password}
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
                            error={!!errors.password}
                            helperText={errors.password}
                        />
                        <TextField
                            fullWidth
                            placeholder="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            autoComplete="off"
                            value={formData.password_confirmation}
                            onChange={handleChange}
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
                            sx={{ mb: 2 }}
                            error={!!errors.password_confirmation}
                            helperText={errors.password_confirmation}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={
                                loading ||
                                Object.values(errors).some((error) => error) ||
                                Object.values(formData).some((value) => !value.trim())
                            }
                            fullWidth
                            sx={{
                                fontSize: '14px',
                                background: 'linear-gradient(to bottom, #1a1a1a, #000)',
                                fontWeight: 'bold',
                                padding: '6px 12px',
                                borderRadius: '10px',
                                color: '#e3e3e3',
                                opacity: loading ||
                                Object.values(errors).some((error) => error) ||
                                Object.values(formData).some((value) => !value.trim())
                                    ? 0.6 : 1,
                                '&.Mui-disabled': {
                                    color: '#e3e3e3', 
                                },
                                '&:hover': {
                                    background: 'linear-gradient(to bottom, #2a2a2a, #333)',
                                    color: '#ffffff',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Register'}
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
                    {registrationSuccess}
                </CustomAlert>
            </Snackbar>
        </ThemeProvider>
    );
};

export default RegisterPage;
