import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {fetchUser, fetchUserPosts, updateAvatarRequest, updateProfile} from '../../redux/actions/userActions'; 
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import LoadingDots from "../../utils/LoadingDots";
import ErrorScreen from "../../utils/ErrorScreen";
import PostList from "../post/PostList";
import Card from '@mui/material/Card';
import {createTheme, styled, ThemeProvider} from '@mui/material/styles';
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import TextField from "@mui/material/TextField";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Snackbar from "@mui/material/Snackbar";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import UserCard from "./UserCard";
import Container from "@mui/material/Container";

const API_BASE_URL = 'http://localhost:8080';

const theme = createTheme({
    components: {
        MuiTextField: {
            defaultProps: {
                size: 'small', 
            },
            styleOverrides: {
                root: {
                    '& .MuiInputLabel-root': {
                        color: '#000', 
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#000', 
                    },
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '10px', 

                        '&:hover fieldset': {
                            borderColor: '#000', 
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#000', 
                        },
                    },
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: '10px',

                },
            },
        },
    }
});

const buttonStyle = {
    display: { xs: 'none', md: 'flex' },
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '6px 12px',
    borderRadius: '10px',
    color: '#46526a',
    '&:hover': {
        backgroundColor: '#e9ecf2',
        color: '#000',
    },
};

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

const UserPage = () => {
    const {user_id} = useParams(); 
    const dispatch = useDispatch();
    const {user, userPosts, loading, postsLoading, error} = useSelector((state) => state.user);
    const [showPosts, setShowPosts] = useState(false);
    const [file, setFile] = useState(null);
    const currentUserId = useSelector((state) => state.auth.user?.id); 
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        user_id: user ? user.id : '',  
        full_name: user?.full_name || '',
        login: user?.login || '',
        profile_picture: user?.profile_picture || '',
        old_password: '',
        new_password: ''
    });

    const [errors, setErrors] = useState({
        full_name: '',
        login: '',
        old_password: '',
        new_password: '',
    });


    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error'); 

    useEffect(() => {
        const idToFetch = user_id || currentUserId;  
        if (idToFetch) {
            dispatch(fetchUser(idToFetch));
            dispatch(fetchUserPosts(idToFetch));
        }
    }, [dispatch, user_id, currentUserId]);

    useEffect(() => {
        if (user) {
            setFormData({
                user_id: user.id,
                full_name: user.full_name || '',
                login: user.login || '',
                profile_picture: user.profile_picture || ''
            });
        }
    }, [user]); 

    const handleAvatarChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleAvatarUpload = () => {
        const formData = new FormData();
        formData.append('profile_picture', file);
        dispatch(updateAvatarRequest(formData)); 
    };

    const handleProfileUpdate = async () => {
        const updatedData = {
            ...formData,
            user_id: user.id
        };

        try {
            let response = await dispatch(updateProfile(updatedData));
            if (response.success) {
                setSnackbarMessage('Profile successfully updated!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);  
                setOpenModal(false);    
            } else {
                setSnackbarMessage(response.error);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);  
            }
        } catch (error) {
            setSnackbarMessage(error.message || 'Something went wrong!');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);  
        }
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setErrors({  
            full_name: '',
            login: '',
            old_password: '',
            new_password: '',
        });
        setFormData({  
            user_id: user.id,
            full_name: user.full_name || '',
            login: user.login || '',
            profile_picture: user.profile_picture || '',
            old_password: '',
            new_password: '',
        });
    };

    const isFormValid = Object.values(errors).every((error) => error === '');
    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const validateField = (field, value) => {
        let error = '';

        switch (field) {
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

            case 'old_password':
                const oldPasswordPattern = /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
                if (!value.trim()) {
                    error = 'Old Password is required.';
                } else if (value.length < 8) {
                    error = 'Old Password must be at least 8 characters long.';
                } else if (!oldPasswordPattern.test(value)) {
                    error = 'Old Password must include at least one uppercase letter, one special character, and be at least 8 characters long.';
                }
                break;

            case 'new_password':
                const newPasswordPattern = /^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
                if (!value.trim()) {
                    error = 'New Password is required.';
                } else if (value.length < 8) {
                    error = 'New Password must be at least 8 characters long.';
                } else if (!newPasswordPattern.test(value)) {
                    error = 'New Password must include at least one uppercase letter, one special character, and be at least 8 characters long.';
                }
                break;

            default:
                break;
        }

        return error;
    };

    const handleChange = (field, value) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: value,
        }));
        const error = validateField(field, value);
        setErrors(prevErrors => ({
            ...prevErrors,
            [field]: error,
        }));
    };

    if (loading) return <LoadingDots/>;
    if (error) return <ErrorScreen error={error}/>;

    return user ? (
        <Container maxWidth="md" sx={{mt: '130px'}}>
            <UserCard
                user={user}
                onUpdateProfile={handleOpenModal} 
                currentUserId={currentUserId}
                isClickable={false}
            />

            <Button
                variant="outlined"
                sx={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    color: '#46526a',
                    border: '1px solid black',
                    display: 'block',
                    margin: '20px auto',
                    '&:hover': {
                        backgroundColor: '#e9ecf2',
                        color: '#000',
                        border: '1px solid #000',
                    },
                }}
                onClick={() => setShowPosts((prev) => !prev)}
            >
                <Box component="span" sx={{ fontSize: '16px' }}>
                Posts {showPosts ? '🙉' : '🙈'}
                </Box>
            </Button>

            <Collapse in={showPosts}>
                {postsLoading ? (
                    <LoadingDots/>
                ) : (
                    <Box sx={{mt: '-10px'}}>
                        {userPosts.length > 0 ? (
                            <PostList posts={userPosts}/>
                        ) : (
                            <Typography sx={{textAlign: 'center', mt: 4, color: '#868e96'}}>
                                No posts found for this user.
                            </Typography>
                        )}
                    </Box>
                )}
            </Collapse>
            <Dialog open={openModal} onClose={handleModalClose}>
                <DialogTitle variant="h5"
                    sx={{
                        fontWeight: 'bold', 
                        textAlign: 'center', 
                    }}
                >
                    Update Profile
                </DialogTitle>
                <DialogContent>
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px'}}>

                        <Box
                            sx={{
                                position: 'relative',
                                cursor: 'pointer',
                                borderRadius: '50%',
                                display: 'inline-block', 
                                width: 150,
                                height: 150,
                                mb: '20px'
                            }}
                            onClick={() => document.getElementById('avatar-upload-modal').click()}  
                        >
                            <Avatar
                                alt="Profile Picture"
                                src={file ? URL.createObjectURL(file) : `${API_BASE_URL}${user.profile_picture}`}
                                sx={{
                                    width: '100%',  
                                    height: '100%', 
                                    cursor: 'pointer',  

                                }}
                            />

                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',  
                                    display: 'flex',
                                    justifyContent: 'center',
                                    borderRadius: '50%', 
                                    alignItems: 'center',  
                                    opacity: 0,  
                                    transition: 'opacity 0.3s ease-in-out',  
                                    '&:hover': {
                                        opacity: 1,  
                                    },
                                }}
                            >
                                <CameraAltIcon sx={{color: 'white', fontSize: '30px'}}/> {/* Иконка камеры */}
                            </Box>
                        </Box>

                        <input
                            type="file"
                            id="avatar-upload-modal"
                            onChange={handleAvatarChange}  
                            style={{display: 'none'}}  
                        />
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', textAlign: 'left' }}>
                            User info
                        </Typography>
                        <ThemeProvider theme={theme}>
                            <TextField
                                label="Full Name"
                                fullWidth
                                value={formData.full_name}
                                onChange={(e) => handleChange('full_name', e.target.value)}
                                sx={{mb: 2}}
                                error={!!errors.full_name}  
                                helperText={errors.full_name}  
                            />
                            <TextField
                                label="Login"
                                fullWidth
                                value={formData.login}
                                onChange={(e) => handleChange('login', e.target.value)}
                                sx={{mb: 2}}
                                error={!!errors.login}
                                helperText={errors.login}
                            />
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', textAlign: 'left' }}>
                                Change password
                            </Typography>
                            <TextField
                                label="Old Password"
                                fullWidth
                                type="password"
                                value={formData.old_password}
                                onChange={(e) => handleChange('old_password', e.target.value)}
                                sx={{mb: 2}}
                                error={!!errors.old_password}
                                helperText={errors.old_password}
                            />
                            <TextField
                                label="New Password"
                                fullWidth
                                type="password"
                                value={formData.new_password}
                                onChange={(e) => handleChange('new_password', e.target.value)}
                                sx={{mb: 2}}
                                error={!!errors.new_password}
                                helperText={errors.new_password}
                            />
                        </ThemeProvider>
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        paddingRight: '15px',  
                        paddingBottom: '15px',  
                    }}>
                    <Button
                        variant="text"
                        sx={buttonStyle}
                        size="small"
                        onClick={handleModalClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{fontSize: '14px',
                            background: 'linear-gradient(to bottom, #1a1a1a, #000)',
                            fontWeight: 'bold',
                            padding: '6px 12px',
                            borderRadius: '10px',
                            color: '#e3e3e3',
                            opacity: !isFormValid
                                ? 0.6 : 1,
                            '&.Mui-disabled': {
                                color: '#e3e3e3', 
                            },
                            '&:hover': {
                                background: 'linear-gradient(to bottom, #2a2a2a, #333)',
                                color: '#ffffff',
                            },
                        }}
                        size="small"
                        onClick={() => {
                        handleProfileUpdate();  
                        if (file) { 
                            handleAvatarUpload(); 
                        }

                    }}
                        disabled={!isFormValid}
                    >
                        Save Changes
                    </Button>
                </DialogActions>

            </Dialog>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={() => setOpenSnackbar(false)}
                severity={snackbarSeverity}
            >
            <CustomAlert
                sx={{
                    backgroundColor: snackbarSeverity === 'success' ? '#e7f5e6' : '#fbebeb',
            }}>
                <ErrorOutlineIcon sx={{ marginRight: '8px', color: '#000' }} />
                {snackbarMessage}
            </CustomAlert>
        </Snackbar>
        </Container>
    ) : (
        <Typography></Typography>
    );
};

export default UserPage;
